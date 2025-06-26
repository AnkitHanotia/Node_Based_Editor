#!/usr/bin/env python3
"""
Startup script for the Node-Based Image Processing Interface
Runs both backend and frontend servers
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def run_backend():
    """Run the Flask backend server"""
    print("Starting Flask backend server...")
    os.chdir("backend")
    subprocess.run([sys.executable, "run.py"])

def run_frontend():
    """Run the React frontend server"""
    print("Starting React frontend server...")
    os.chdir("frontend")
    subprocess.run(["npm", "start"])

def main():
    print("🚀 Starting Node-Based Image Processing Interface")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("backend").exists() or not Path("frontend").exists():
        print("❌ Error: Please run this script from the project root directory")
        print("   Make sure 'backend' and 'frontend' folders exist")
        sys.exit(1)
    
    # Check if frontend dependencies are installed
    if not Path("frontend/node_modules").exists():
        print("📦 Installing frontend dependencies...")
        os.chdir("frontend")
        subprocess.run(["npm", "install"])
        os.chdir("..")
    
    # Check if backend dependencies are installed
    if not Path("backend/venv").exists():
        print("📦 Creating Python virtual environment...")
        os.chdir("backend")
        subprocess.run([sys.executable, "-m", "venv", "venv"])
        os.chdir("..")
    
    print("✅ Dependencies check complete")
    print("\n🌐 Starting servers...")
    print("   Backend:  http://localhost:5000")
    print("   Frontend: http://localhost:3000")
    print("\n⏳ Please wait for both servers to start...")
    print("=" * 50)
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Give backend time to start
    time.sleep(3)
    
    # Start frontend
    run_frontend()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down servers...")
        print("Thank you for using Node-Based Image Processing Interface!")
        sys.exit(0) 