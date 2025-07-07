#!/bin/bash
echo "⚛️ Starting Next.js Frontend..."

# Check Node.js version
if ! node --version >/dev/null 2>&1; then
    echo "❌ Node.js required. Please install Node.js 16 or later."
    exit 1
fi

# Navigate to frontend and start React server
cd frontend

# Install frontend dependencies (only if node_modules doesn't exist or package.json is newer)
if [ ! -d "node_modules" ] || [ package.json -nt node_modules ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

echo "✅ Frontend is running on http://localhost:3000"
echo "Press Ctrl+C to stop the frontend server..."

# Wait for interrupt with cleanup
cleanup() {
    echo "🛑 Stopping Next.js Frontend..."
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT
wait $FRONTEND_PID
