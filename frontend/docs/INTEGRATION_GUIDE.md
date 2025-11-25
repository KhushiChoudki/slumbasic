# Backend & Frontend Integration Guide

This project consists of a React frontend (Vite + TypeScript) and a Flask backend with AI image verification using CLIP model.

## Project Structure

```
PurplePinkWebsite/
├── client/              # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Uploads.tsx      # Image upload with AI verification
│       │   └── Complaints.tsx   # Complaints management
│       ├── services/
│       │   └── api.ts          # API service layer
│       └── config/
│           └── api.ts          # API configuration
└── ...

backend/backend/
├── api.py              # Flask API server
└── requirements.txt    # Python dependencies
```

## Features

### Backend (Flask + AI)
- **AI Image Verification**: Uses OpenAI's CLIP model to verify image descriptions
- **IPFS Storage**: Uploads images to IPFS via Pinata
- **Metadata Storage**: Stores metadata (description, location, similarity score) on IPFS
- **CORS Enabled**: Ready for frontend integration

### Frontend (React)
- **Image Upload**: Upload images with description and location
- **Real-time Verification**: AI verifies description matches image
- **IPFS Integration**: View uploaded images on IPFS
- **Complaints System**: Submit and view complaints
- **Modern UI**: Built with shadcn/ui components

## Setup Instructions

### 1. Backend Setup (Flask API)

Navigate to the backend directory:
```powershell
cd "c:\Users\Dell\OneDrive\Documents\NextPathBasiccc\NextPathBasic\backend\backend"
```

Create a virtual environment:
```powershell
python -m venv venv
```

Activate the virtual environment:
```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:
```powershell
pip install -r requirements.txt
```

Run the Flask server:
```powershell
python api.py
```

The backend will start on `http://localhost:5001`

**Note**: First run may take a few minutes as it downloads the CLIP model (~350MB).

### 2. Frontend Setup (React + Vite)

Open a **new terminal** and navigate to the frontend directory:
```powershell
cd "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
```

Install dependencies (if not already installed):
```powershell
npm install
```

Ensure the `.env` file is configured:
```
VITE_FLASK_API_URL=http://localhost:5001
```

Run the development server:
```powershell
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy).

## How to Use

### Image Upload with AI Verification

1. Navigate to the **Uploads** page
2. Select an image file (jpg, png, etc.)
3. Enter a description of what's in the image
4. Enter a location
5. Click "Upload & Verify"

The backend will:
- Verify your description matches the image using CLIP AI
- Upload the image to IPFS via Pinata
- Store metadata on IPFS
- Return the IPFS CID and similarity score

**Verification Threshold**: Images need at least 28% similarity to pass verification.

### Complaints System

1. Navigate to the **Complaints** page
2. Fill in your name, email, and complaint
3. Submit the form
4. View all submitted complaints below

## API Endpoints

### POST /upload_and_verify

Upload and verify an image with AI.

**Request**:
- `image` (file): Image file
- `description` (text): Image description
- `location` (text): Location information

**Response**:
```json
{
  "similarity": 0.85,
  "cid": "QmXxx...",
  "metadataCID": "QmYyy...",
  "location": "New York, USA"
}
```

## Configuration

### Backend Configuration

Edit `api.py` to change:
- Pinata API keys (lines 17-18)
- Similarity threshold (line 76, currently 0.28)
- Server port (line 102, currently 5001)

### Frontend Configuration

Edit `.env` to change:
- Backend API URL: `VITE_FLASK_API_URL`

## Troubleshooting

### Backend Issues

**CORS Errors**: Make sure flask-cors is installed:
```powershell
pip install flask-cors
```

**Model Download**: First run downloads CLIP model. Ensure stable internet connection.

**Port Already in Use**: Change port in `api.py`:
```python
app.run(port=5002, debug=True)  # Change to 5002
```

### Frontend Issues

**Backend Connection Failed**: 
- Ensure Flask server is running on port 5001
- Check `.env` file has correct backend URL
- Verify CORS is enabled in Flask

**TypeScript Errors**:
```powershell
npm run check  # Check for TypeScript errors
```

**Missing Dependencies**:
```powershell
npm install
```

## Development Workflow

1. Start the backend first (Flask on port 5001)
2. Start the frontend second (Vite on port 5173)
3. Navigate to `http://localhost:5173` in your browser
4. Test the Uploads page with image verification
5. Check the Complaints page for the form

## Production Deployment

### Backend
- Use production WSGI server (gunicorn, waitress)
- Secure API keys with environment variables
- Use production IPFS gateway

### Frontend
- Build for production: `npm run build`
- Deploy `dist/` folder to hosting service
- Update `VITE_FLASK_API_URL` to production backend URL

## Technologies Used

### Backend
- Flask (Python web framework)
- CLIP (OpenAI's image-text model)
- Transformers (Hugging Face)
- PyTorch
- Pillow (image processing)
- Pinata (IPFS storage)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Wouter (routing)
- React Query

## Notes

- The backend API keys in `api.py` are currently hardcoded. Consider moving them to environment variables for production.
- Image verification uses a threshold of 0.28 (28% similarity). Adjust based on your needs.
- The Complaints page currently stores data in frontend state only. Add backend storage if needed.

## Support

If you encounter any issues, check:
1. Both servers are running
2. Ports are not blocked by firewall
3. Dependencies are properly installed
4. Console for error messages
