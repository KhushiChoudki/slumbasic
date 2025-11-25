# Quick Reference - Common Commands

## Starting the Application

### Quick Start (Recommended)
```powershell
cd "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
.\start-servers.ps1
```

### Manual Start

**Backend:**
```powershell
cd "c:\Users\Dell\OneDrive\Documents\NextPathBasiccc\NextPathBasic\backend\backend"
.\venv\Scripts\Activate.ps1
python api.py
```

**Frontend:**
```powershell
cd "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
npm run dev
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001
- **API Endpoint**: http://localhost:5001/upload_and_verify

## Common Tasks

### Install Backend Dependencies
```powershell
cd "c:\Users\Dell\OneDrive\Documents\NextPathBasiccc\NextPathBasic\backend\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Install Frontend Dependencies
```powershell
cd "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
npm install
```

### Build Frontend for Production
```powershell
cd "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
npm run build
```

### Type Check Frontend
```powershell
cd "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
npm run check
```

## Troubleshooting

### Backend won't start
```powershell
# Reinstall dependencies
cd "c:\Users\Dell\OneDrive\Documents\NextPathBasiccc\NextPathBasic\backend\backend"
.\venv\Scripts\Activate.ps1
pip install --upgrade -r requirements.txt
```

### Frontend won't connect to backend
```powershell
# Check .env file exists
cd "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
cat .env

# Should show:
# VITE_FLASK_API_URL=http://localhost:5001
```

### Clear frontend cache
```powershell
cd "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
rm -r node_modules
npm install
```

### Port already in use

**Change Backend Port** (in api.py):
```python
app.run(port=5002, debug=True)  # Change 5001 to 5002
```

Then update `.env`:
```
VITE_FLASK_API_URL=http://localhost:5002
```

## Testing Upload

1. Go to http://localhost:5173
2. Click "Uploads" in navigation
3. Select an image (jpg, png, etc.)
4. Enter description (e.g., "a person walking in a park")
5. Enter location (e.g., "Central Park, NYC")
6. Click "Upload & Verify"
7. Wait for AI verification (5-10 seconds)
8. View result with IPFS link

## File Locations

- **Backend Code**: `c:\Users\Dell\OneDrive\Documents\NextPathBasiccc\NextPathBasic\backend\backend\api.py`
- **Frontend Code**: `c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite\client\src\`
- **Uploads Page**: `client\src\pages\Uploads.tsx`
- **API Service**: `client\src\services\api.ts`
- **API Config**: `client\src\config\api.ts`
- **Environment**: `.env`

## API Keys (in api.py)

```python
PINATA_API_KEY = "ad3bf23d5d93e34563de"
PINATA_SECRET_API_KEY = "955dd619fe3b9ef554af4b1aaa775d2a30e5702ee9f9188b3e50948ef5787da2"
```

**Note**: These are exposed in the code. Consider moving to environment variables.

## Useful Logs

### Check Backend Logs
Look at the terminal where Flask is running for:
- Upload requests
- CLIP verification scores
- IPFS upload status
- Errors

### Check Frontend Logs
Open browser DevTools (F12) > Console for:
- API requests
- Response data
- JavaScript errors
- Network requests

## Quick Fixes

**CORS Error**:
```powershell
cd "c:\Users\Dell\OneDrive\Documents\NextPathBasiccc\NextPathBasic\backend\backend"
.\venv\Scripts\Activate.ps1
pip install flask-cors
```

**TypeScript Error**:
```powershell
cd "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
npm run check
```

**Missing Module**:
```powershell
npm install <module-name>
# or
pip install <module-name>
```

## Stopping Servers

- Press `Ctrl + C` in each terminal window
- Or close the terminal windows

## Documentation Files

- `INTEGRATION_GUIDE.md` - Complete setup guide
- `INTEGRATION_SUMMARY.md` - What was changed
- `QUICK_REFERENCE.md` - This file
