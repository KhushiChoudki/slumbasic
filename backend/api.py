import os
from flask import Flask, request, jsonify
from PIL import Image
import requests
from transformers import CLIPProcessor, CLIPModel
import torch
import traceback
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ---------------------------------------------------------
# Load CLIP model and processor once
# ---------------------------------------------------------
print("=" * 60)
print("Loading CLIP model and processor...")
print("This may take a few minutes on first run (~605MB download)")
print("=" * 60)
try:
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    print("✓ CLIP model loaded successfully!")
except Exception as e:
    print(f"✗ Error loading CLIP model: {e}")
    print("The server will start but image verification will fail.")
    model = None
    processor = None

device = "cuda" if torch.cuda.is_available() else "cpu"
if model is not None:
    model.to(device)

# ---------------------------------------------------------
# Zero-shot prompts for damaged-road vs spam
# ---------------------------------------------------------
VALID_PROMPTS = [
    "a photo of a damaged road with potholes",
    "a photo of a broken or cracked road surface",
    "a photo of a road with a big pothole full of water",
]

INVALID_PROMPTS = [
    "a photo of a dog",
    "a photo of an animal on the road",
    "a selfie of a person",
    "a random indoor scene",
    "a park or trees",
]

ALL_PROMPTS = VALID_PROMPTS + INVALID_PROMPTS

if model is not None and processor is not None:
    # Pre-encode text prompts once
    text_inputs = processor(text=ALL_PROMPTS, return_tensors="pt", padding=True)
    with torch.no_grad():
        text_embeds = model.get_text_features(**{k: v.to(device) for k, v in text_inputs.items()})
        text_embeds = text_embeds / text_embeds.norm(dim=-1, keepdim=True)
else:
    text_embeds = None

# ---------------------------------------------------------
# Pinata config
# ---------------------------------------------------------
PINATA_API_KEY = "ad3bf23d5d93e34563de"
PINATA_SECRET_API_KEY = "955dd619fe3b9ef554af4b1aaa775d2a30e5702ee9f9188b3e50948ef5787da2"


def upload_image_to_pinata(file):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
    }
    files = {"file": file}
    try:
        response = requests.post(url, files=files, headers=headers)
        return response.json()
    except Exception as e:
        return {"error": "Exception during Pinata upload", "details": str(e)}


def pin_json_metadata(metadata):
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
        "Content-Type": "application/json",
    }
    try:
        response = requests.post(url, json=metadata, headers=headers)
        return response.json()
    except Exception as e:
        return {"error": "Exception during Pinata metadata upload", "details": str(e)}


# ---------------------------------------------------------
# Helper: CLIP road-damage validation
# ---------------------------------------------------------
def validate_damage_image(image_obj):
    """
    Returns (is_valid, scores_dict) where:
      - is_valid: bool
      - scores_dict: debug info with best prompts and scores
    """
    if model is None or processor is None or text_embeds is None:
        return False, {"error": "CLIP model not loaded"}

    img_inputs = processor(images=image_obj, return_tensors="pt")
    img_inputs = {k: v.to(device) for k, v in img_inputs.items()}

    with torch.no_grad():
        img_embeds = model.get_image_features(**img_inputs)
        img_embeds = img_embeds / img_embeds.norm(dim=-1, keepdim=True)

        sims = torch.matmul(img_embeds, text_embeds.T).squeeze(0)  # [num_prompts]

    valid_sims = sims[:len(VALID_PROMPTS)]
    invalid_sims = sims[len(VALID_PROMPTS):]

    best_valid_score, best_valid_idx = torch.max(valid_sims, dim=0)
    best_invalid_score, best_invalid_idx = torch.max(invalid_sims, dim=0)

    best_valid_score = best_valid_score.item()
    best_invalid_score = best_invalid_score.item()

    best_valid_prompt = VALID_PROMPTS[best_valid_idx.item()]
    best_invalid_prompt = INVALID_PROMPTS[best_invalid_idx.item()]

    # Thresholds – tune on your real data
    MIN_VALID = 0.30   # must look like damaged road
    MAX_INVALID = 0.25 # must not look too much like spam (dog/selfie/etc.)

    is_valid = (
        best_valid_score >= MIN_VALID
        and best_valid_score > best_invalid_score
        and best_invalid_score <= MAX_INVALID
    )

    info = {
        "best_valid_prompt": best_valid_prompt,
        "best_valid_score": best_valid_score,
        "best_invalid_prompt": best_invalid_prompt,
        "best_invalid_score": best_invalid_score,
    }
    return is_valid, info


# ---------------------------------------------------------
# Routes
# ---------------------------------------------------------
@app.route("/upload_and_verify", methods=["POST"])
def upload_and_verify():
    try:
        # Check if CLIP model is loaded
        if model is None or processor is None or text_embeds is None:
            return jsonify({"error": "CLIP model not loaded. Please restart the server."}), 503

        # Require image, description, and location form data
        if (
            "image" not in request.files
            or "description" not in request.form
            or "location" not in request.form
        ):
            return jsonify({"error": "Missing image or description or location"}), 400

        image_file = request.files["image"]
        description = request.form.get("description")
        location = request.form.get("location")

        # Upload image to Pinata
        pinata_response = upload_image_to_pinata(image_file)
        if "IpfsHash" not in pinata_response:
            return jsonify(
                {"error": "Failed to upload image to Pinata", "response": pinata_response}
            ), 500

        image_cid = pinata_response["IpfsHash"]
        image_url = f"https://gateway.pinata.cloud/ipfs/{image_cid}"

        # Load image from IPFS
        image_obj = Image.open(requests.get(image_url, stream=True).raw).convert("RGB")

        # CLIP road‑damage validation (blocks dogs, selfies, etc.)
        is_valid, clip_info = validate_damage_image(image_obj)
        if not is_valid:
            return jsonify(
                {
                    "message": "Image does not look like a damaged road",
                    "cid": image_cid,
                    "clip_info": clip_info,
                }
            ), 400

        # Optional: still keep description↔image similarity check
        inputs = processor(text=[description], images=image_obj, return_tensors="pt", padding=True)
        inputs = {k: v.to(device) for k, v in inputs.items()}
        with torch.no_grad():
            outputs = model(**inputs)
            similarity = torch.nn.functional.cosine_similarity(
                outputs.image_embeds, outputs.text_embeds, dim=1
            )[0].item()

        if similarity < 0.28:
            return jsonify(
                {
                    "similarity": similarity,
                    "message": "Description does not match image",
                    "cid": image_cid,
                    "clip_info": clip_info,
                }
            ), 400

        # Pin metadata including location
        metadata = {
            "image_cid": image_cid,
            "description": description,
            "location": location,
            "similarity_score": similarity,
            "clip_valid_prompt": clip_info["best_valid_prompt"],
            "clip_valid_score": clip_info["best_valid_score"],
            "timestamp": str(time.time()),
        }
        metadata_res = pin_json_metadata(metadata)
        if "IpfsHash" not in metadata_res:
            return jsonify(
                {"error": "Failed to pin metadata", "response": metadata_res}
            ), 500

        return jsonify(
            {
                "similarity": similarity,
                "cid": image_cid,
                "metadataCID": metadata_res["IpfsHash"],
                "location": location,
                "clip_info": clip_info,
            }
        )

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model is not None and processor is not None,
        }
    )


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Flask Backend Server Starting")
    print("=" * 60)
    print("📍 Server URL: http://localhost:5001")
    print("🔗 Health Check: http://localhost:5001/health")
    print("📤 Upload Endpoint: http://localhost:5001/upload_and_verify")
    print(f"🤖 CLIP Model: {'✓ Loaded' if model else '✗ Not Loaded'}")
    print("=" * 60 + "\n")
    app.run(port=5001, debug=True)
