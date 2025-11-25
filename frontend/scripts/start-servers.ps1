# Quick Start Script for Backend and Frontend

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Backend & Frontend Launcher    " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if we should start backend
$startBackend = Read-Host "Do you want to start the Flask backend? (y/n)"

if ($startBackend -eq "y" -or $startBackend -eq "Y") {
    Write-Host ""
    Write-Host "Starting Flask Backend..." -ForegroundColor Green
    
    $backendPath = "c:\Users\Dell\OneDrive\Documents\NextPathBasiccc\NextPathBasic\backend\backend"
    
    # Open new PowerShell window for backend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
        cd '$backendPath';
        Write-Host 'Activating virtual environment...' -ForegroundColor Yellow;
        if (Test-Path '.\venv\Scripts\Activate.ps1') {
            .\venv\Scripts\Activate.ps1;
            Write-Host 'Starting Flask server...' -ForegroundColor Green;
            python api.py
        } else {
            Write-Host 'Virtual environment not found. Creating one...' -ForegroundColor Yellow;
            python -m venv venv;
            .\venv\Scripts\Activate.ps1;
            Write-Host 'Installing requirements...' -ForegroundColor Yellow;
            pip install -r requirements.txt;
            Write-Host 'Starting Flask server...' -ForegroundColor Green;
            python api.py
        }
"@
    
    Write-Host "Backend terminal opened!" -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Check if we should start frontend
$startFrontend = Read-Host "`nDo you want to start the React frontend? (y/n)"

if ($startFrontend -eq "y" -or $startFrontend -eq "Y") {
    Write-Host ""
    Write-Host "Starting React Frontend..." -ForegroundColor Green
    
    $frontendPath = "c:\Users\Dell\Downloads\PurplePinkWebsite\PurplePinkWebsite"
    
    # Open new PowerShell window for frontend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
        cd '$frontendPath';
        Write-Host 'Starting Vite development server...' -ForegroundColor Green;
        npm run dev
"@
    
    Write-Host "Frontend terminal opened!" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!                " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend: http://localhost:5001" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
