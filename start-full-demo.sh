#!/bin/bash
echo "🚀 Starting Complete AI Runtime Engine Demo (Backend + Frontend)..."

# Check Python version
if ! python3 --version >/dev/null 2>&1; then
    echo "❌ Python 3 required. Please install Python 3.7 or later."
    exit 1
fi

# Check Node.js version
if ! node --version >/dev/null 2>&1; then
    echo "❌ Node.js required. Please install Node.js 16 or later."
    exit 1
fi

# Copy environment file if needed
# Removed automatic .env creation to allow .env.local to be used

echo "🧠 Starting AI Runtime Engine Backend..."

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
python3 main.py &
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

# Navigate to frontend and start React server
cd ../frontend

echo "⚛️ Starting Next.js Frontend..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

echo ""
echo "🎉 Complete AI Runtime Engine Demo is ready!"
echo ""
echo "🌐 Frontend UI: http://localhost:3000"
echo "🤖 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "🚀 Revolutionary Features:"
echo "  • ZERO hardcoded business logic"
echo "  • AI handles ANY request dynamically"
echo "  • Same app, different behavior per user role"
echo "  • Real HuggingFace AI enhancements"
echo ""
echo "👥 Demo Users:"
echo "  • admin (full access + analytics)"
echo "  • manager (limited access + insights)"
echo "  • viewer (read-only access)"
echo ""
echo "🎯 Try This:"
echo "  1. Open http://localhost:3000"
echo "  2. Switch between user roles"
echo "  3. Watch the entire app adapt instantly!"
echo "  4. Test the API tester with any endpoint"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Wait for interrupt
trap 'echo "🛑 Stopping AI Runtime Engine Demo..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
wait $BACKEND_PID