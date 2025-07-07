#!/bin/bash
echo "🚀 Starting Complete AI Runtime Engine Demo (Backend + Frontend)..."

# Check if extended policies argument is provided
EXTENDED_POLICY_DIR=""
if [ "$1" != "" ]; then
    EXTENDED_POLICY_DIR="$1"
    echo "🎯 Extended Policy Mode: Loading policies from $EXTENDED_POLICY_DIR/"
    
    if [ ! -d "$EXTENDED_POLICY_DIR" ]; then
        echo "❌ Extended policy directory '$EXTENDED_POLICY_DIR' not found."
        echo "💡 Usage: ./start-full-demo.sh [EXTENDED_POLICY_DIR]"
        echo "💡 Example: ./start-full-demo.sh EXTENDED_POLICY"
        exit 1
    fi
fi

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
if [ -f ".env.local" ]; then
    echo "🔧 Copying .env.local to backend/.env..."
    cp .env.local backend/.env
fi

# Handle extended policies if provided
if [ "$EXTENDED_POLICY_DIR" != "" ]; then
    echo "📋 Loading extended policies from $EXTENDED_POLICY_DIR/..."
    
    # Backup existing policies
    if [ -d "POLICIES_BACKUP" ]; then
        rm -rf POLICIES_BACKUP
    fi
    cp -r POLICIES POLICIES_BACKUP
    
    # Copy extended policies to POLICIES directory
    for policy_file in "$EXTENDED_POLICY_DIR"/*.yaml; do
        if [ -f "$policy_file" ]; then
            filename=$(basename "$policy_file")
            echo "  ✅ Loading $filename"
            cp "$policy_file" "POLICIES/$filename"
        fi
    done
    
    echo "📋 Extended policies loaded! Demo will include enhanced features."
    echo ""
fi

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

# Install frontend dependencies (only if node_modules doesn't exist or package.json is newer)
if [ ! -d "node_modules" ] || [ package.json -nt node_modules ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

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
if [ "$EXTENDED_POLICY_DIR" != "" ]; then
    echo "🚀 Extended Features Active:"
    echo "  • Additional policy files loaded from $EXTENDED_POLICY_DIR/"
    echo "  • Enhanced AI capabilities and UI components"
    echo "  • Try new features based on loaded policies"
    echo ""
fi
echo "💡 Pro Tip:"
echo "  • Run with: ./start-full-demo.sh EXTENDED_POLICY"
echo "  • This loads enhanced features from EXTENDED_POLICY/ folder"
echo "  • Demonstrates policy-driven feature addition"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Wait for interrupt with cleanup
cleanup() {
    echo "🛑 Stopping AI Runtime Engine Demo..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    
    # Restore original policies if extended policies were used
    if [ "$EXTENDED_POLICY_DIR" != "" ] && [ -d "POLICIES_BACKUP" ]; then
        echo "🔄 Restoring original policies..."
        rm -rf POLICIES
        mv POLICIES_BACKUP POLICIES
        echo "✅ Original policies restored"
    fi
    
    exit 0
}

trap cleanup INT
wait $BACKEND_PID
