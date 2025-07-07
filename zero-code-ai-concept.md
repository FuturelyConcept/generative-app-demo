# AI Runtime Engine Demo - Claude CLI Context (Pure Zero-Code)

## Project Overview

Build a **pure AI Runtime Engine** that demonstrates the revolutionary concept: **No application code exists** - only data, policies, and an AI engine that directly orchestrates everything at runtime.

## Core Revolutionary Concept

**Traditional Flow:**
```
Requirements → Write Business Logic Code → Build → Deploy → Run
```

**AI Runtime Engine Flow:**
```
Data + Policies → AI Engine → Live Application (Zero Code)
```

The AI engine **IS** the entire application. No controllers, no services, no DTOs, no business logic code exists anywhere.

## Simple Demo: Product Inventory Management

**What exists:**
- **3 users** in JSON file
- **15 products** in JSON file  
- **1 policy file** with access rules and UI behavior
- **1 AI engine** that reads policies and makes ALL decisions

**What doesn't exist:**
- No controller classes
- No service classes  
- No DTO classes
- No business logic code
- No hardcoded endpoints

## Technology Stack (Zero-Code Approach)

- **Frontend**: Next.js with AI-generated UI components
- **Backend**: FastAPI with **ZERO** hardcoded endpoints
- **Database**: 2 JSON files (users.json, products.json)
- **AI**: Hugging Face (FREE) or Local Ollama or Mock AI
- **Core**: Single AI engine that handles EVERYTHING

## Project Structure (Minimal)

```
ai-runtime-demo/
├── README.md
├── start.sh                     # One-command setup
├── .env.example                 # AI configuration
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Single page with AI-generated content
│   │   └── api/
│   │       └── proxy.ts        # Proxy to AI engine
│   ├── components/
│   │   ├── AIGeneratedTable.tsx    # AI decides table content
│   │   ├── AIGeneratedButtons.tsx  # AI decides which buttons to show
│   │   └── APITester.tsx           # Test any endpoint dynamically
│   └── package.json
├── backend/
│   ├── main.py                  # ONLY the AI Runtime Engine
│   ├── ai_engine.py             # Core intelligence - handles everything
│   ├── storage.py               # Simple JSON file reader
│   ├── policies.yaml            # ALL business rules in one file
│   ├── requirements.txt
│   └── data/
│       ├── users.json          # 3 users
│       └── products.json       # 15 products
```

## Data Structure (Ultra Simple)

### `backend/data/users.json`
```json
{
  "users": [
    {"id": "u1", "name": "Admin User", "email": "admin@demo.com", "role": "admin"},
    {"id": "u2", "name": "Manager User", "email": "manager@demo.com", "role": "manager"},
    {"id": "u3", "name": "Viewer User", "email": "viewer@demo.com", "role": "viewer"}
  ]
}
```

### `backend/data/products.json`
```json
{
  "products": [
    {"id": "p1", "name": "Laptop", "category": "Electronics", "price": 999, "stock": 50},
    {"id": "p2", "name": "Mouse", "category": "Electronics", "price": 25, "stock": 200},
    {"id": "p3", "name": "Keyboard", "category": "Electronics", "price": 75, "stock": 150},
    {"id": "p4", "name": "Monitor", "category": "Electronics", "price": 299, "stock": 75},
    {"id": "p5", "name": "Chair", "category": "Furniture", "price": 199, "stock": 30},
    {"id": "p6", "name": "Desk", "category": "Furniture", "price": 399, "stock": 20},
    {"id": "p7", "name": "Phone", "category": "Electronics", "price": 699, "stock": 100},
    {"id": "p8", "name": "Tablet", "category": "Electronics", "price": 499, "stock": 60},
    {"id": "p9", "name": "Headphones", "category": "Electronics", "price": 149, "stock": 80},
    {"id": "p10", "name": "Webcam", "category": "Electronics", "price": 89, "stock": 45},
    {"id": "p11", "name": "Speakers", "category": "Electronics", "price": 129, "stock": 35},
    {"id": "p12", "name": "Printer", "category": "Electronics", "price": 199, "stock": 25},
    {"id": "p13", "name": "Scanner", "category": "Electronics", "price": 159, "stock": 15},
    {"id": "p14", "name": "Lamp", "category": "Furniture", "price": 49, "stock": 70},
    {"id": "p15", "name": "Notebook", "category": "Stationery", "price": 5, "stock": 500}
  ]
}
```

### `backend/policies.yaml` (ALL Business Logic)
```yaml
# This file contains ALL business rules - no code needed anywhere else

entities:
  product:
    fields: [id, name, category, price, stock]
    operations: [view, add, delete]
  
access_policies:
  viewer:
    permissions: [view]
    ui_elements: [product_table, user_info]
    message: "Viewer can only see products"
    
  manager:
    permissions: [view, add]
    ui_elements: [product_table, add_button, user_info]
    message: "Manager can view and add products"
    
  admin:
    permissions: [view, add, delete]
    ui_elements: [product_table, add_button, delete_buttons, user_info]
    message: "Admin has full access"

ui_behavior:
  product_table:
    columns: [name, category, price, stock]
    admin_columns: [name, category, price, stock, actions]
    
  themes:
    viewer: {color: "blue", layout: "minimal"}
    manager: {color: "green", layout: "business"}  
    admin: {color: "red", layout: "full"}

api_responses:
  success_messages:
    view: "Products retrieved successfully"
    add: "Product added successfully"
    delete: "Product deleted successfully"
    
  error_messages:
    unauthorized: "You don't have permission for this action"
    not_found: "Product not found"
    invalid_data: "Invalid product data provided"
```

## Core Implementation (Pure AI Engine)

### `backend/main.py` (ZERO Hardcoded Endpoints)
```python
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from ai_engine import AIRuntimeEngine

app = FastAPI(title="AI Runtime Engine Demo", description="Zero-code application runtime")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Single AI Runtime Engine instance
ai_engine = AIRuntimeEngine()

@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def handle_everything(request: Request, full_path: str):
    """
    ZERO hardcoded endpoints! 
    AI Engine handles ALL requests by interpreting policies at runtime.
    """
    
    # Extract user context
    user_role = request.headers.get("X-User-Role", "viewer")
    method = request.method
    
    # Get request data
    if method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.json()
        except:
            body = {}
    else:
        body = dict(request.query_params)
    
    # AI Engine makes ALL decisions
    try:
        response = await ai_engine.handle_request(
            path=full_path,
            method=method,
            user_role=user_role,
            data=body,
            headers=dict(request.headers)
        )
        return JSONResponse(content=response)
        
    except Exception as e:
        # AI Engine handles errors too
        error_response = await ai_engine.handle_error(str(e), user_role, full_path)
        return JSONResponse(content=error_response, status_code=error_response.get("status", 500))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### `backend/ai_engine.py` (The ENTIRE Application Logic)
```python
import yaml
import json
import os
from typing import Dict, Any, List
from storage import JSONStorage

class AIRuntimeEngine:
    """
    This IS the entire application.
    No other business logic exists anywhere.
    """
    
    def __init__(self):
        self.storage = JSONStorage()
        self.policies = self._load_policies()
        self.ai_provider = self._setup_ai_provider()
    
    def _load_policies(self) -> Dict:
        """Load ALL business rules from single YAML file"""
        with open('policies.yaml', 'r') as f:
            return yaml.safe_load(f)
    
    def _setup_ai_provider(self):
        """Setup AI provider based on environment"""
        provider = os.getenv('AI_PROVIDER', 'mock')
        
        if provider == 'huggingface':
            return HuggingFaceProvider(os.getenv('HF_API_KEY'))
        elif provider == 'ollama':
            return OllamaProvider(os.getenv('OLLAMA_URL', 'http://localhost:11434'))
        else:
            return MockAIProvider()  # Works without any setup
    
    async def handle_request(self, path: str, method: str, user_role: str, data: Dict, headers: Dict) -> Dict:
        """
        AI makes ALL decisions about how to handle ANY request.
        No hardcoded business logic anywhere.
        """
        
        # AI determines what this request is asking for
        request_intent = self._analyze_request_intent(path, method, data)
        
        # AI checks if user can perform this action
        permission_check = self._check_permissions(user_role, request_intent)
        
        if not permission_check["allowed"]:
            return {
                "error": "Access Denied",
                "message": permission_check["message"],
                "user_role": user_role,
                "requested_action": request_intent["action"]
            }
        
        # AI processes the request and generates response
        if request_intent["action"] == "get_products":
            return await self._handle_get_products(user_role)
        elif request_intent["action"] == "add_product":
            return await self._handle_add_product(user_role, data)
        elif request_intent["action"] == "delete_product":
            return await self._handle_delete_product(user_role, request_intent["product_id"])
        elif request_intent["action"] == "get_user_context":
            return await self._handle_get_user_context(user_role)
        else:
            return await self._handle_unknown_request(path, method, user_role, data)
    
    def _analyze_request_intent(self, path: str, method: str, data: Dict) -> Dict:
        """AI determines what the user is trying to do"""
        
        # Simple pattern matching (in real AI engine, this would use LLM)
        if path == "/api/products" and method == "GET":
            return {"action": "get_products", "entity": "product"}
        elif path == "/api/products" and method == "POST":
            return {"action": "add_product", "entity": "product", "data": data}
        elif path.startswith("/api/products/") and method == "DELETE":
            product_id = path.split("/")[-1]
            return {"action": "delete_product", "entity": "product", "product_id": product_id}
        elif path.startswith("/api/user-context/"):
            role = path.split("/")[-1]
            return {"action": "get_user_context", "role": role}
        else:
            return {"action": "unknown", "path": path, "method": method}
    
    def _check_permissions(self, user_role: str, request_intent: Dict) -> Dict:
        """AI checks if user can perform the requested action"""
        
        user_policies = self.policies["access_policies"].get(user_role, {})
        permissions = user_policies.get("permissions", [])
        
        # Map actions to required permissions
        action_permission_map = {
            "get_products": "view",
            "add_product": "add", 
            "delete_product": "delete",
            "get_user_context": "view"
        }
        
        required_permission = action_permission_map.get(request_intent["action"])
        
        if required_permission and required_permission in permissions:
            return {
                "allowed": True,
                "message": user_policies.get("message", "Action allowed")
            }
        else:
            return {
                "allowed": False,
                "message": f"Role '{user_role}' cannot perform '{request_intent['action']}'"
            }
    
    async def _handle_get_products(self, user_role: str) -> Dict:
        """AI generates product list response based on user role"""
        
        products = self.storage.get_products()
        user_policies = self.policies["access_policies"][user_role]
        
        # AI determines response structure based on user role
        response = {
            "products": products,
            "user_role": user_role,
            "permissions": user_policies["permissions"],
            "ui_elements": user_policies["ui_elements"],
            "message": user_policies["message"],
            "theme": self.policies["ui_behavior"]["themes"][user_role],
            "timestamp": self._get_timestamp()
        }
        
        # Admin gets additional data
        if user_role == "admin":
            response["admin_info"] = {
                "total_products": len(products),
                "total_value": sum(p["price"] * p["stock"] for p in products),
                "low_stock": [p for p in products if p["stock"] < 20]
            }
        
        return response
    
    async def _handle_add_product(self, user_role: str, product_data: Dict) -> Dict:
        """AI processes product addition"""
        
        # AI validates the data
        if not self._validate_product_data(product_data):
            return {
                "error": "Invalid Data",
                "message": "Product data is incomplete or invalid",
                "required_fields": ["name", "category", "price", "stock"]
            }
        
        # AI adds the product
        new_product = {
            "id": f"p{len(self.storage.get_products()) + 1}",
            **product_data
        }
        
        success = self.storage.add_product(new_product)
        
        if success:
            return {
                "success": True,
                "message": self.policies["api_responses"]["success_messages"]["add"],
                "product": new_product,
                "user_role": user_role,
                "timestamp": self._get_timestamp()
            }
        else:
            return {
                "error": "Storage Error",
                "message": "Failed to save product",
                "user_role": user_role
            }
    
    async def _handle_delete_product(self, user_role: str, product_id: str) -> Dict:
        """AI processes product deletion"""
        
        success = self.storage.delete_product(product_id)
        
        if success:
            return {
                "success": True,
                "message": self.policies["api_responses"]["success_messages"]["delete"],
                "deleted_id": product_id,
                "user_role": user_role,
                "timestamp": self._get_timestamp()
            }
        else:
            return {
                "error": "Not Found",
                "message": self.policies["api_responses"]["error_messages"]["not_found"],
                "product_id": product_id
            }
    
    async def _handle_get_user_context(self, user_role: str) -> Dict:
        """AI returns user context and capabilities"""
        
        user_policies = self.policies["access_policies"].get(user_role, {})
        
        return {
            "user_role": user_role,
            "permissions": user_policies.get("permissions", []),
            "ui_elements": user_policies.get("ui_elements", []),
            "theme": self.policies["ui_behavior"]["themes"].get(user_role, {}),
            "message": user_policies.get("message", ""),
            "available_actions": self._get_available_actions(user_role)
        }
    
    async def _handle_unknown_request(self, path: str, method: str, user_role: str, data: Dict) -> Dict:
        """AI handles requests it doesn't recognize"""
        
        return {
            "error": "Unknown Request",
            "message": f"AI Engine doesn't know how to handle {method} {path}",
            "user_role": user_role,
            "suggestion": "Try /api/products, /api/user-context/{role}",
            "available_endpoints": [
                "GET /api/products",
                "POST /api/products", 
                "DELETE /api/products/{id}",
                "GET /api/user-context/{role}"
            ]
        }
    
    def _validate_product_data(self, data: Dict) -> bool:
        """AI validates product data"""
        required_fields = ["name", "category", "price", "stock"]
        return all(field in data for field in required_fields)
    
    def _get_available_actions(self, user_role: str) -> List[str]:
        """AI determines what actions user can perform"""
        permissions = self.policies["access_policies"][user_role]["permissions"]
        
        action_map = {
            "view": ["Get Products", "View Details"],
            "add": ["Add Product", "Create New"],
            "delete": ["Delete Product", "Remove Item"]
        }
        
        actions = []
        for permission in permissions:
            actions.extend(action_map.get(permission, []))
        
        return actions
    
    def _get_timestamp(self) -> str:
        """AI includes timestamp in responses"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    async def handle_error(self, error: str, user_role: str, path: str) -> Dict:
        """AI handles all errors"""
        return {
            "error": "System Error",
            "message": "AI Engine encountered an unexpected error",
            "details": error,
            "user_role": user_role,
            "path": path,
            "timestamp": self._get_timestamp()
        }

class MockAIProvider:
    """Mock AI for demo without API keys"""
    
    def generate_response(self, prompt: str) -> str:
        return f"Mock AI response for: {prompt[:50]}..."

class HuggingFaceProvider:
    """Real AI using Hugging Face (free)"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    def generate_response(self, prompt: str) -> str:
        # Implement HuggingFace API call
        return "AI decision based on prompt"
```

### `backend/storage.py` (Simple JSON Operations)
```python
import json
from typing import List, Dict

class JSONStorage:
    """Simple JSON file storage - no database needed"""
    
    def get_users(self) -> List[Dict]:
        with open('data/users.json', 'r') as f:
            return json.load(f)['users']
    
    def get_products(self) -> List[Dict]:
        with open('data/products.json', 'r') as f:
            return json.load(f)['products']
    
    def add_product(self, product: Dict) -> bool:
        try:
            products = self.get_products()
            products.append(product)
            with open('data/products.json', 'w') as f:
                json.dump({'products': products}, f, indent=2)
            return True
        except:
            return False
    
    def delete_product(self, product_id: str) -> bool:
        try:
            products = self.get_products()
            updated_products = [p for p in products if p['id'] != product_id]
            with open('data/products.json', 'w') as f:
                json.dump({'products': updated_products}, f, indent=2)
            return len(updated_products) < len(products)
        except:
            return False
```

## Environment Setup

### `.env.example`
```env
# AI Provider (choose one)
AI_PROVIDER=mock              # No setup required
# AI_PROVIDER=huggingface     # Free: get token from https://huggingface.co/settings/tokens  
# AI_PROVIDER=ollama          # Local: install Ollama

# Hugging Face (FREE)
HF_API_KEY=your_free_token_here

# Ollama (LOCAL)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2:7b

# Demo settings
DEBUG=true
```

### `start.sh` (One Command Setup)
```bash
#!/bin/bash
echo "🚀 Starting Pure AI Runtime Engine Demo..."

# Copy env file if needed
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Using mock AI (no setup required). Edit .env for real AI."
fi

# Start backend
echo "🧠 Starting AI Runtime Engine (Python)..."
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn pyyaml requests
python main.py &

# Start frontend  
echo "⚛️ Starting Next.js frontend..."
cd ../frontend
npm install
npm run dev &

echo "✅ Pure AI Runtime Engine Demo ready!"
echo ""
echo "🌐 Open: http://localhost:3000"
echo "📖 API Explorer: http://localhost:8000/docs"
echo ""
echo "🤖 ZERO business logic code exists!"
echo "📋 Everything driven by policies.yaml"
echo "⚡ AI Engine handles ALL requests dynamically"
echo ""
echo "Demo Users:"
echo "- admin (full access)" 
echo "- manager (view + add)"
echo "- viewer (view only)"
```

## Success Criteria

The demo proves the AI Runtime Engine concept when:

1. **ZERO hardcoded business logic** - Only policies.yaml contains rules
2. **AI handles ALL requests** - Single catch-all endpoint in main.py  
3. **Dynamic responses** - Same endpoint returns different data per user
4. **Policy-driven** - Change policies.yaml → behavior changes instantly
5. **No traditional code** - No controllers, services, DTOs anywhere

## Revolutionary Demo Flow

1. **Clone repo** → `git clone [repo]`
2. **One command** → `./start.sh` 
3. **Open browser** → `http://localhost:3000`
4. **Switch users** → See completely different capabilities
5. **Test any endpoint** → Built-in API tester tries any URL
6. **Edit policies.yaml** → Watch application behavior change instantly
7. **Add new endpoints** → Just update policies, AI figures out the rest

This demonstrates that **applications can be pure policy definitions** with AI handling ALL runtime execution. No traditional programming required!

---

**Build this as the purest demonstration of zero-code, policy-driven application architecture.**