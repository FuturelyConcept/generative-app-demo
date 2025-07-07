"""
Pure AI Runtime Engine Demo - ZERO Hardcoded Endpoints
This is the revolutionary approach: AI handles ALL requests dynamically
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import traceback
from ai_engine import AIRuntimeEngine

# FastAPI app with ZERO hardcoded endpoints
app = FastAPI(
    title="Pure AI Runtime Engine Demo",
    description="Revolutionary zero-code application where AI IS the runtime",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "X-User-Role", "Authorization"],
)

# Single AI Runtime Engine instance - this IS the entire application
print("🚀 Initializing Pure AI Runtime Engine...")
ai_engine = AIRuntimeEngine()
print("✅ AI Runtime Engine ready - ZERO business logic code exists!")

@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def handle_everything(request: Request, full_path: str):
    """
    🤖 ZERO hardcoded endpoints! 
    
    This single function handles ALL requests by letting the AI Engine 
    make decisions about what to do based on:
    - Request path
    - HTTP method  
    - User role
    - Request data
    - Current policies
    
    The AI Engine IS the application. No other business logic exists.
    """
    
    # CORS preflight requests are handled by middleware
    
    try:
        # Extract user context from headers
        user_role = request.headers.get("X-User-Role", "viewer")
        method = request.method
        
        print(f"🎯 AI Runtime Engine: {method} /{full_path} (role: {user_role})")
        
        # Get request data
        request_data = {}
        if method in ["POST", "PUT", "PATCH"]:
            try:
                request_data = await request.json()
            except:
                request_data = {}
        else:
            request_data = dict(request.query_params)
        
        # AI Engine makes ALL decisions about how to handle this request
        ai_response = await ai_engine.handle_request(
            path=full_path,
            method=method,
            user_role=user_role,
            data=request_data,
            headers=dict(request.headers)
        )
        
        # AI determines the HTTP status code
        status_code = 200
        if "error" in ai_response:
            if "Access Denied" in ai_response.get("error", ""):
                status_code = 403
            elif "Not Found" in ai_response.get("error", ""):
                status_code = 404
            elif "Validation" in ai_response.get("error", ""):
                status_code = 400
            else:
                status_code = 500
        
        return JSONResponse(content=ai_response, status_code=status_code)
        
    except Exception as e:
        print(f"❌ Error in AI Runtime Engine: {e}")
        print(traceback.format_exc())
        
        # AI Engine handles errors too
        try:
            error_response = await ai_engine.handle_error(str(e), user_role, full_path)
            return JSONResponse(content=error_response, status_code=500)
        except:
            # Fallback error response
            return JSONResponse(
                content={
                    "error": "Critical AI Runtime Engine Error",
                    "message": "AI Engine encountered an unexpected error",
                    "details": str(e),
                    "concept": "Even errors are handled by AI, not hardcoded logic",
                    "fallback": "This is the only hardcoded response in the entire system"
                },
                status_code=500
            )

@app.on_event("startup")
async def startup_event():
    """AI Runtime Engine startup"""
    print("🧠 Pure AI Runtime Engine Demo Starting...")
    print("🚀 Revolutionary Concept: AI IS the application runtime")
    print("📋 ZERO hardcoded business logic exists")
    print("⚡ All requests handled dynamically by AI")
    print("🎯 Demo ready at http://localhost:8000")
    print("")
    print("🧪 Test the AI Engine:")
    print("  curl -H 'X-User-Role: admin' http://localhost:8000/api/products")
    print("  curl -H 'X-User-Role: manager' http://localhost:8000/api/products")
    print("  curl -H 'X-User-Role: viewer' http://localhost:8000/api/products")
    print("")

@app.on_event("shutdown")
async def shutdown_event():
    """AI Runtime Engine shutdown"""
    print("🛑 AI Runtime Engine shutting down...")

# Health check endpoint (the only "hardcoded" endpoint, but it just calls AI)
@app.get("/")
async def root():
    """Root endpoint - even this calls the AI Engine!"""
    try:
        return await ai_engine.handle_request(
            path="api/demo-info",
            method="GET", 
            user_role="viewer",
            data={},
            headers={}
        )
    except:
        return {
            "message": "Pure AI Runtime Engine Demo",
            "concept": "AI engine IS the application runtime",
            "status": "Running",
            "docs": "/docs",
            "test_endpoint": "/api/products",
            "revolutionary": "ZERO hardcoded business logic exists"
        }

if __name__ == "__main__":
    print("🚀 Starting Pure AI Runtime Engine on port 8000...")
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        log_level="info"
    )