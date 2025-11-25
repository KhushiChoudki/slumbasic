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

# Load CLIP model and processor once
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

PINATA_API_KEY = "ad3bf23d5d93e34563de"
PINATA_SECRET_API_KEY ="955dd619fe3b9ef554af4b1aaa775d2a30e5702ee9f9188b3e50948ef5787da2" 

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

@app.route("/upload_and_verify", methods=["POST"])
def upload_and_verify():
    try:
        # Check if CLIP model is loaded
        if model is None or processor is None:
            return jsonify({"error": "CLIP model not loaded. Please restart the server."}), 503
        
        # Require image, description, and location form data
        if 'image' not in request.files or 'description' not in request.form or 'location' not in request.form:
            return jsonify({"error": "Missing image or description or location"}), 400

        image_file = request.files['image']
        description = request.form.get('description')
        location = request.form.get('location')

        # Upload image to Pinata
        pinata_response = upload_image_to_pinata(image_file)
        if "IpfsHash" not in pinata_response:
            return jsonify({"error": "Failed to upload image to Pinata", "response": pinata_response}), 500

        image_cid = pinata_response["IpfsHash"]
        image_url = f"https://gateway.pinata.cloud/ipfs/{image_cid}"

        # Load image from IPFS
        image_obj = Image.open(requests.get(image_url, stream=True).raw)

        # CLIP similarity check
        inputs = processor(text=[description], images=image_obj, return_tensors="pt", padding=True)
        outputs = model(**inputs)
        similarity = torch.nn.functional.cosine_similarity(outputs.image_embeds, outputs.text_embeds, dim=1)[0].item()

        if similarity < 0.28:
            return jsonify({"similarity": similarity, "message": "Description does not match image", "cid": image_cid})

        # Pin metadata including location
        metadata = {
            "image_cid": image_cid,
            "description": description,
            "location": location,
            "similarity_score": similarity,
            "timestamp": str(time.time())
        }
        metadata_res = pin_json_metadata(metadata)
        if "IpfsHash" not in metadata_res:
            return jsonify({"error": "Failed to pin metadata", "response": metadata_res}), 500

        return jsonify({
            "similarity": similarity,
            "cid": image_cid,
            "metadataCID": metadata_res["IpfsHash"],
            "location": location
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None and processor is not None
    })

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Flask Backend Server Starting")
    print("=" * 60)
    print(f"📍 Server URL: http://localhost:5001")
    print(f"🔗 Health Check: http://localhost:5001/health")
    print(f"📤 Upload Endpoint: http://localhost:5001/upload_and_verify")
    print(f"🤖 CLIP Model: {'✓ Loaded' if model else '✗ Not Loaded'}")
    print("=" * 60 + "\n")
    app.run(port=5001, debug=True)
