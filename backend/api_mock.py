import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

print("=" * 60)
print("🧪 MOCK Backend Server (Testing Mode)")
print("=" * 60)

@app.route("/upload_and_verify", methods=["POST"])
def upload_and_verify():
    """Mock endpoint for testing without CLIP model"""
    try:
        # Require image, description, and location form data
        if 'image' not in request.files or 'description' not in request.form or 'location' not in request.form:
            return jsonify({"error": "Missing image or description or location"}), 400

        image_file = request.files['image']
        description = request.form.get('description')
        location = request.form.get('location')

        # Simulate processing time
        time.sleep(1)

        # Mock response with high similarity
        mock_cid = "QmTest123abc456def789ghi"
        mock_metadata_cid = "QmMetadata987xyz"
        mock_similarity = 0.85  # 85% similarity

        print(f"✓ Mock upload: {image_file.filename}")
        print(f"  Description: {description}")
        print(f"  Location: {location}")
        print(f"  Similarity: {mock_similarity}")

        return jsonify({
            "similarity": mock_similarity,
            "cid": mock_cid,
            "metadataCID": mock_metadata_cid,
            "location": location
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "mode": "mock",
        "model_loaded": False
    })

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Mock Flask Backend Server Starting")
    print("=" * 60)
    print(f"📍 Server URL: http://localhost:5001")
    print(f"🔗 Health Check: http://localhost:5001/health")
    print(f"📤 Upload Endpoint: http://localhost:5001/upload_and_verify")
    print(f"⚠️  Running in MOCK mode (no CLIP model required)")
    print("=" * 60 + "\n")
    app.run(port=5001, debug=True)
