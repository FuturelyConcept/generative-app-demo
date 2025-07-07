#!/bin/bash
echo "🧠 Starting AI Runtime Engine Backend..."

# Check Python version
if ! python3 --version >/dev/null 2>&1; then
    echo "❌ Python 3 required. Please install Python 3.7 or later."
    exit 1
fi

# Copy environment file if needed
if [ -f ".env.local" ]; then
    echo "🔧 Copying .env.local to backend/.env..."
    cp .env.local backend/.env
fi

# Navigate to backend and start Python server
cd backend

# Create and activate virtual environment (only if it doesn't exist)
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
fi

echo "🔧 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install Python dependencies (only if requirements changed)
if [ ! -f "venv/.requirements_installed" ] || [ requirements-minimal.txt -nt venv/.requirements_installed ]; then
    echo "🐍 Installing Python dependencies..."
    pip install -r requirements-minimal.txt
    touch venv/.requirements_installed
else
    echo "✅ Dependencies already installed"
fi

# Start backend
echo "🤖 Starting Python AI Runtime Engine..."
python3 main.py
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for AI Runtime Engine to start..."
sleep 8

# Check if backend is running
if ! curl -s http://localhost:8000/ > /dev/null; then
    echo "❌ Backend failed to start. Check the logs above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend is running on http://localhost:8000"
echo "Press Ctrl+C to stop the backend server..."

# Wait for interrupt with cleanup
cleanup() {
    echo "🛑 Stopping AI Runtime Engine Backend..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT
wait $BACKEND_PID
