@echo off
echo 🚀 Starting Node-Based Image Processing Interface
echo ================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm is not installed or not in PATH
    echo Please install npm with Node.js
    pause
    exit /b 1
)

echo ✅ Python and Node.js found
echo.

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

REM Create backend virtual environment if needed
if not exist "backend\venv" (
    echo 📦 Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

echo ✅ Dependencies check complete
echo.
echo 🌐 Starting servers...
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
echo ⏳ Please wait for both servers to start...
echo ================================================

REM Start backend in background
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && python run.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
cd frontend
npm start

pause 