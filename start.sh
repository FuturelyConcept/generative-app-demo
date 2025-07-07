#!/bin/bash
echo "🚀 Starting Pure AI Runtime Engine Demo (Python + FastAPI)..."

# Check Python version
if ! python3 --version >/dev/null 2>&1; then
    echo "❌ Python 3 required. Please install Python 3.7 or later."
    exit 1
fi

# Copy environment file if needed
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file with mock AI (no setup required)"
    echo "💡 Edit .env to enable real AI providers (HuggingFace, Ollama, OpenAI)"
fi

# Navigate to backend directory
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows/WSL
    source venv/Scripts/activate
else
    # Linux/Mac
    source venv/bin/activate
fi

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Check the error messages above."
    exit 1
fi

# Start the AI Runtime Engine
echo "🧠 Starting Pure AI Runtime Engine..."
echo "🤖 ZERO hardcoded endpoints - AI handles ALL requests!"
echo "🚀 REAL HuggingFace AI integration enabled!"
echo "📋 All business logic in policies.yaml"
echo ""

# Start the FastAPI application
python main.py &
AI_ENGINE_PID=$!

# Wait for AI Runtime Engine to start
echo "⏳ Waiting for AI Runtime Engine to start..."
sleep 5

# Check if AI Runtime Engine is running
if ! curl -s http://localhost:8000/ > /dev/null; then
    echo "❌ AI Runtime Engine failed to start. Check the logs above."
    kill $AI_ENGINE_PID 2>/dev/null
    exit 1
fi

echo "✅ Pure AI Runtime Engine Demo is ready!"
echo ""
echo "🌐 API Base URL: http://localhost:8000"
echo "📖 Interactive API Docs: http://localhost:8000/docs"
echo "🏥 Health Check: http://localhost:8000/"
echo "📊 Demo Info: http://localhost:8000/api/demo-info"
echo ""
echo "🤖 Revolutionary Concept: AI IS the entire application!"
echo "   • ZERO hardcoded business logic"
echo "   • ZERO hardcoded endpoints"
echo "   • AI handles ANY request path dynamically"
echo "   • All behavior driven by policies.yaml"
echo ""
echo "👥 Demo Users (use X-User-Role header):"
echo "  • admin (full access: view, add, delete)"
echo "  • manager (limited: view, add)"
echo "  • viewer (read-only: view)"
echo ""
echo "🧪 Test the AI Engine (copy/paste these):"
echo "  curl -H \"X-User-Role: admin\" http://localhost:8000/api/products"
echo "  curl -H \"X-User-Role: manager\" http://localhost:8000/api/products"
echo "  curl -H \"X-User-Role: viewer\" http://localhost:8000/api/products"
echo ""
echo "  curl -H \"X-User-Role: admin\" http://localhost:8000/api/user-context/admin"
echo ""
echo "  curl -X POST -H \"X-User-Role: admin\" -H \"Content-Type: application/json\" \\"
echo "    -d '{\"name\":\"Test Product\",\"category\":\"Electronics\",\"price\":99,\"stock\":10}' \\"
echo "    http://localhost:8000/api/products"
echo ""
echo "🔮 Magic: Try ANY endpoint path - AI will handle it!"
echo "  curl http://localhost:8000/anything/you/want"
echo ""
echo "📝 Edit backend/policies.yaml to change behavior instantly!"
echo ""
echo "Press Ctrl+C to stop the demo..."

# Wait for interrupt
trap 'echo "🛑 Stopping Pure AI Runtime Engine Demo..."; kill $AI_ENGINE_PID 2>/dev/null; exit 0' INT
wait $AI_ENGINE_PID