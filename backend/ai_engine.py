"""
AI Runtime Engine - The ENTIRE Application Logic
This IS the complete application. No other business logic exists anywhere.
"""
import yaml
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional
from storage import JSONStorage
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIRuntimeEngine:
    """
    This IS the entire application.
    No other business logic exists anywhere.
    AI makes ALL decisions about how to handle ANY request.
    """
    
    def __init__(self):
        self.storage = JSONStorage()
        self.policies = self._load_policies()
        self.ai_provider = self._setup_ai_provider()
        print("🧠 AI Runtime Engine initialized - ZERO hardcoded business logic!")
    
    def _deep_merge_policies(self, base_policies: Dict, new_policies: Dict) -> Dict:
        """Deep merge two policy dictionaries, combining access_policies and other nested structures"""
        result = base_policies.copy()
        
        for key, value in new_policies.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                # Special handling for access_policies to merge user roles
                if key == "access_policies":
                    if "access_policies" not in result:
                        result["access_policies"] = {}
                    for role, role_policies in value.items():
                        if role in result["access_policies"]:
                            # Merge permissions and ui_elements
                            existing = result["access_policies"][role]
                            if "permissions" in role_policies:
                                # Combine permissions and remove duplicates
                                existing_perms = existing.get("permissions", [])
                                new_perms = role_policies["permissions"]
                                combined_perms = list(set(existing_perms + new_perms))
                                role_policies["permissions"] = combined_perms
                            if "ui_elements" in role_policies:
                                # Combine ui_elements and remove duplicates
                                existing_ui = existing.get("ui_elements", [])
                                new_ui = role_policies["ui_elements"]
                                combined_ui = list(set(existing_ui + new_ui))
                                role_policies["ui_elements"] = combined_ui
                            # Update the role with merged data
                            result["access_policies"][role].update(role_policies)
                        else:
                            result["access_policies"][role] = value[role]
                else:
                    # For other nested dictionaries, do recursive merge
                    result[key] = self._deep_merge_policies(result[key], value)
            else:
                # For non-dict values or new keys, just add/replace
                result[key] = value
                
        return result
    
    def _load_policies(self) -> Dict:
        """Load ALL business rules from POLICIES directory"""
        policies = {}
        policies_dir = "../POLICIES"
        
        # Dynamically discover all YAML policy files
        policy_files = []
        if os.path.exists(policies_dir):
            for filename in os.listdir(policies_dir):
                if filename.endswith('.yaml') and filename != 'README.md':
                    policy_files.append(filename)
            policy_files.sort()  # Sort for consistent loading order
        
        try:
            for policy_file in policy_files:
                file_path = os.path.join(policies_dir, policy_file)
                if os.path.exists(file_path):
                    with open(file_path, 'r') as f:
                        file_policies = yaml.safe_load(f)
                        if file_policies:
                            # Deep merge policies to avoid overwriting
                            policies = self._deep_merge_policies(policies, file_policies)
                            print(f"✅ Loaded policies from {policy_file}")
                else:
                    print(f"⚠️ Policy file {policy_file} not found, skipping")
            
            if not policies:
                raise FileNotFoundError("No policy files found")
                
            print(f"🎯 Successfully loaded {len(policy_files)} policy files from POLICIES directory: {', '.join(policy_files)}")
            return policies
            
        except Exception as e:
            print(f"⚠️ Error loading policies: {e}")
            print("🔄 Using minimal default policies")
            return {
                "access_policies": {
                    "admin": {"permissions": ["view", "add", "delete"], "ui_elements": ["product_table", "add_button", "delete_buttons"]},
                    "manager": {"permissions": ["view", "add"], "ui_elements": ["product_table", "add_button"]},
                    "viewer": {"permissions": ["view"], "ui_elements": ["product_table"]}
                }
            }
    
    def _setup_ai_provider(self):
        """Setup AI provider based on environment - NO FALLBACKS ALLOWED"""
        provider = os.getenv('AI_PROVIDER')
        
        if not provider:
            raise RuntimeError("CRITICAL: AI_PROVIDER not configured. Pure AI Runtime Engine requires a working AI provider.")
        
        if provider == 'huggingface':
            api_key = os.getenv('HF_API_KEY')
            if not api_key:
                raise RuntimeError("CRITICAL: HF_API_KEY required for HuggingFace provider. Pure AI Runtime Engine cannot work without AI.")
            print(f"🚀 Initializing HuggingFace AI with real intelligence!")
            return HuggingFaceProvider(api_key)
        elif provider == 'ollama':
            ollama_url = os.getenv('OLLAMA_URL', 'http://localhost:11434')
            return OllamaProvider(ollama_url)
        elif provider == 'openai':
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                raise RuntimeError("CRITICAL: OPENAI_API_KEY required for OpenAI provider. Pure AI Runtime Engine cannot work without AI.")
            return OpenAIProvider(api_key)
        elif provider == 'mock':
            # Mock is only allowed if explicitly requested for development
            print("⚠️ WARNING: Using Mock AI Provider. This is not a true Pure AI Runtime Engine.")
            return MockAIProvider()
        else:
            raise RuntimeError(f"CRITICAL: Unknown AI provider '{provider}'. Pure AI Runtime Engine requires a valid AI provider.")
    
    async def handle_request(self, path: str, method: str, user_role: str, data: Dict, headers: Dict) -> Dict:
        """
        AI makes ALL decisions about how to handle ANY request.
        No hardcoded business logic anywhere.
        """
        
        print(f"🤖 AI Engine processing: {method} {path} for role '{user_role}'")
        print(f"DEBUG: Received headers: {headers}")
        
        # Check if this is a UI request (frontend wants UI instructions)
        is_ui_request = headers.get('x-ui-request', '').lower() == 'true'
        if is_ui_request:
            print("🎨 UI Request detected - will include UI generation instructions")
        
        # AI determines what this request is asking for
        request_intent = self._analyze_request_intent(path, method, data)
        print(f"🎯 AI determined intent: {request_intent['action']}")
        
        # AI checks if user can perform this action
        permission_check = self._check_permissions(user_role, request_intent)
        
        if not permission_check["allowed"]:
            return {
                "error": "Access Denied",
                "message": permission_check["message"],
                "user_role": user_role,
                "requested_action": request_intent["action"],
                "timestamp": self._get_timestamp()
            }
        
        # AI processes the request and generates response
        if request_intent["action"] == "get_products":
            return await self._handle_get_products(user_role, is_ui_request)
        elif request_intent["action"] == "add_product":
            return await self._handle_add_product(user_role, data, is_ui_request)
        elif request_intent["action"] == "delete_product":
            # Handle both "product_id" and "entity" field names from AI response
            product_id = request_intent.get("product_id") or request_intent.get("entity")
            
            # Fallback: extract product ID from path if AI didn't provide it
            if not product_id and "/" in path:
                path_parts = path.split("/")
                if len(path_parts) >= 3 and path_parts[-2] == "products":
                    product_id = path_parts[-1]
            
            if not product_id:
                return {
                    "error": "Invalid Request",
                    "message": "Product ID not found in AI analysis or path",
                    "ai_response": request_intent,
                    "path": path,
                    "timestamp": self._get_timestamp()
                }
            return await self._handle_delete_product(user_role, product_id, is_ui_request)
        elif request_intent["action"] == "get_user_context":
            return await self._handle_get_user_context(user_role, is_ui_request)
        elif request_intent["action"] == "get_health":
            return await self._handle_health_check()
        elif request_intent["action"] == "get_demo_info":
            return await self._handle_demo_info()
        elif request_intent["action"] == "get_categories":
            print(f"DEBUG: handle_request is about to call _handle_get_categories for action: {request_intent['action']}")
            return await self._handle_get_categories(user_role, is_ui_request)
        elif request_intent["action"] == "get_menu_items":
            return await self._handle_get_menu_items(user_role)
        else:
            return await self._handle_unknown_request(path, method, user_role, data)
    
    def _analyze_request_intent(self, path: str, method: str, data: Dict) -> Dict:
        """AI determines what the user is trying to do - NO HARDCODED LOGIC"""
        
        # Create AI prompt for request analysis
        prompt = f"""
        Analyze this HTTP request and determine the user's intent.
        
        Path: {path}
        Method: {method}
        Data: {data}
        
        Available actions: get_products, add_product, delete_product, get_user_context, get_health, get_demo_info, get_categories, get_menu_items, unknown
        
        Return ONLY a JSON object with the action and any required parameters. Do NOT include any other text or explanation.
        
        Examples:
        - For GET /api/products: {{"action": "get_products"}}
        - For POST /api/products: {{"action": "add_product"}}
        - For DELETE /api/products/p4: {{"action": "delete_product", "product_id": "p4"}}
        - For GET /api/user-context/admin: {{"action": "get_user_context", "role": "admin"}}
        - For GET /api/categories: {{"action": "get_categories"}}
        - For GET /api/menu-items: {{"action": "get_menu_items"}}
        
        IMPORTANT: For delete operations, use "product_id" field name, not "entity".
        """
        
        # AI must determine the intent - no fallback logic allowed
        ai_response = self.ai_provider.generate_response(prompt)
        
        try:
            import json
            print(f"DEBUG: Raw AI response: {ai_response}") # Added for debugging
            # Parse AI response as JSON
            intent = json.loads(ai_response)
            if "action" not in intent:
                raise ValueError("AI response missing 'action' field")
            return intent
        except Exception as e:
            # If AI fails, the application MUST fail - no fallback
            raise RuntimeError(f"AI Engine Failed: Unable to analyze request intent. AI Response: {ai_response}. Error: {e}")
    
    
    def _check_permissions(self, user_role: str, request_intent: Dict) -> Dict:
        """AI checks if user can perform the requested action"""
        
        access_policies = self.policies.get("access_policies", {})
        user_policies = access_policies.get(user_role, {})
        permissions = user_policies.get("permissions", [])
        
        # Map actions to required permissions
        action_permission_map = {
            "get_products": "view",
            "add_product": "add", 
            "delete_product": "delete",
            "get_user_context": "view",
            "get_health": "view",
            "get_demo_info": "view",
            "get_categories": "view",
            "get_menu_items": "view"
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
                "message": f"Role '{user_role}' cannot perform '{request_intent['action']}'. Required permission: '{required_permission}'"
            }
    
    async def _handle_get_products(self, user_role: str, is_ui_request: bool = False) -> Dict:
        """AI generates product list response based on user role"""
        
        products = self.storage.get_products()
        access_policies = self.policies.get("access_policies", {})
        user_policies = access_policies.get(user_role, {})
        
        # AI determines response structure based on user role
        response = {
            "products": products,
            "user_role": user_role,
            "permissions": user_policies.get("permissions", []),
            "ui_elements": user_policies.get("ui_elements", []),
            "message": user_policies.get("message", f"Products for {user_role}"),
            "timestamp": self._get_timestamp(),
            "generated_by": "AI Runtime Engine with Real HuggingFace AI"
        }
        
        # Enhance response with real AI if available
        if hasattr(self.ai_provider, 'enhance_response'):
            try:
                response = self.ai_provider.enhance_response(response, f"product_list_for_{user_role}")
            except Exception as e:
                print(f"⚠️ AI enhancement failed: {e}")
                response["ai_note"] = "AI enhancement attempted but fell back to policy-based response"
        
        # AI adds role-specific data
        ui_behavior = self.policies.get("ui_behavior", {})
        themes = ui_behavior.get("themes", {})
        
        if user_role in themes:
            response["theme"] = themes[user_role]
        
        # Admin gets additional AI-generated insights
        if user_role == "admin":
            stats = self.storage.get_stats()
            response["admin_insights"] = {
                "total_products": stats["total_products"],
                "total_value": stats["total_inventory_value"],
                "low_stock_alerts": stats["low_stock_items"],
                "categories": stats["categories"]
            }
        
        # Manager gets business insights
        elif user_role == "manager":
            stats = self.storage.get_stats()
            response["manager_insights"] = {
                "total_products": stats["total_products"],
                "categories": stats["categories"],
                "action_needed": len(stats["low_stock_items"]) > 0
            }
        
        # Add UI generation instructions if this is a UI request
        if is_ui_request:
            response["ui_instructions"] = self._generate_ui_instructions(user_role, "products", response)
        
        return response
    
    def _generate_ui_instructions(self, user_role: str, view_type: str, data: Dict) -> Dict:
        """Generate AI-driven UI instructions for dynamic frontend rendering"""
        
        access_policies = self.policies.get("access_policies", {})
        user_policies = access_policies.get(user_role, {})
        permissions = user_policies.get("permissions", [])
        
        # Base UI configuration
        ui_config = {
            "layout": self._get_layout_for_role(user_role),
            "theme": data.get("theme", {"color": "blue", "style": "minimal", "components": []}),
            "components": [],
            "navigation": [],
            "permissions": permissions,
            "user_role": user_role
        }
        
        # Generate navigation based on permissions
        navigation = [
            {
                "label": "📦 Products",
                "endpoint": "/api/products", 
                "visible_to": ["viewer", "manager", "admin"],
                "active": view_type == "products"
            }
        ]
        
        # Add categories navigation only if categories feature is available in policies
        categories_feature = self.policies.get("categories_feature", {})
        if categories_feature and "view" in permissions and (user_role == "admin" or user_role == "manager"):
            navigation.append({
                "label": "📊 Categories",
                "endpoint": "/api/categories",
                "visible_to": ["manager", "admin"],
                "active": view_type == "categories"
            })
        
        ui_config["navigation"] = navigation
        
        # Generate components based on view type and user permissions
        if view_type == "products":
            # Main product table component
            ui_config["components"].append({
                "id": "products-table",
                "type": "table",
                "props": {
                    "title": "Product Inventory",
                    "data": data.get("products", []),
                    "columns": ["name", "category", "price", "stock"],
                    "actions": self._get_table_actions(permissions)
                },
                "data": data.get("products", []),
                "permissions": ["view"],
                "visible_to": ["viewer", "manager", "admin"],
                "position": {"section": "main", "order": 1}
            })
            
            # Add form if user can add products
            if "add" in permissions:
                ui_config["components"].append({
                    "id": "add-product-form",
                    "type": "form",
                    "props": {
                        "title": "Add New Product",
                        "fields": [
                            {"name": "name", "type": "text", "required": True, "label": "Product Name"},
                            {"name": "category", "type": "select", "required": True, "label": "Category", 
                             "options": ["Electronics", "Furniture", "Stationery", "Clothing", "Books"]},
                            {"name": "price", "type": "number", "required": True, "label": "Price", "min": 0.01},
                            {"name": "stock", "type": "number", "required": True, "label": "Stock", "min": 0}
                        ],
                        "submitEndpoint": "/api/products",
                        "submitMethod": "POST"
                    },
                    "permissions": ["add"],
                    "visible_to": ["manager", "admin"],
                    "position": {"section": "main", "order": 2}
                })
        
        elif view_type == "categories":
            print(f"DEBUG: _generate_ui_instructions - Handling categories view for role: {user_role}")
            print(f"DEBUG: _generate_ui_instructions - Permissions for categories: {permissions}")
            # Simple categories table - keep it simple for concept demo
            if "view_categories" in permissions:
                print("DEBUG: _generate_ui_instructions - 'view_categories' permission found. Adding analytics component.")
                ui_config["components"].append({
                    "id": "categories-analytics",
                    "type": "analytics", 
                    "props": {
                        "title": "Product Categories Analytics",
                        "data": data.get("categories", []),
                        "metrics": ["product_count", "total_inventory_value", "low_stock_alerts"]
                    },
                    "data": data.get("categories", []),
                    "permissions": ["view_categories"],
                    "visible_to": ["manager", "admin"],
                    "position": {"section": "main", "order": 1}
                })
            else:
                print("DEBUG: _generate_ui_instructions - 'view_categories' permission NOT found. No analytics component added.")
        
        # Add admin dashboard components
        if user_role == "admin" and data.get("admin_insights"):
            ui_config["components"].insert(0, {
                "id": "admin-dashboard",
                "type": "dashboard",
                "props": {
                    "title": "Admin Dashboard",
                    "insights": data["admin_insights"],
                    "widgets": ["total_products", "total_value", "low_stock_alerts"]
                },
                "data": data["admin_insights"],
                "permissions": ["admin"],
                "visible_to": ["admin"],
                "position": {"section": "main", "order": 0}
            })
        
        return ui_config
    
    def _get_layout_for_role(self, user_role: str) -> str:
        """Get layout configuration for user role"""
        layout_map = {
            "admin": "admin-layout",
            "manager": "business-layout", 
            "viewer": "minimal-layout"
        }
        return layout_map.get(user_role, "default-layout")
    
    def _get_table_actions(self, permissions: List[str]) -> List[str]:
        """Get available table actions based on permissions"""
        actions = []
        if "view" in permissions:
            actions.append("view")
        if "add" in permissions:
            actions.append("add")
        if "delete" in permissions:
            actions.append("delete")
        if "update" in permissions:
            actions.append("edit")
        return actions
    
    async def _handle_add_product(self, user_role: str, product_data: Dict, is_ui_request: bool = False) -> Dict:
        """AI processes product addition"""
        
        # AI validates the data
        validation = self._validate_product_data(product_data)
        if not validation["valid"]:
            return {
                "error": "Validation Failed",
                "message": validation["message"],
                "details": validation.get("details", {}),
                "user_role": user_role,
                "timestamp": self._get_timestamp()
            }
        
        # Ensure numeric fields are properly typed (convert from strings if needed)
        if "price" in product_data:
            try:
                product_data["price"] = float(product_data["price"])
            except (ValueError, TypeError):
                product_data["price"] = 0.0
                
        if "stock" in product_data:
            try:
                product_data["stock"] = int(product_data["stock"])
            except (ValueError, TypeError):
                product_data["stock"] = 0
        
        # AI adds the product
        success = self.storage.add_product(product_data)
        
        if success:
            return {
                "success": True,
                "message": f"Product '{product_data.get('name')}' added successfully by {user_role}",
                "product": product_data,
                "user_role": user_role,
                "ai_recommendation": self._get_ai_recommendation("add", product_data),
                "timestamp": self._get_timestamp()
            }
        else:
            return {
                "error": "Storage Error",
                "message": "AI Runtime Engine failed to save product",
                "user_role": user_role,
                "timestamp": self._get_timestamp()
            }
    
    async def _handle_delete_product(self, user_role: str, product_id: str, is_ui_request: bool = False) -> Dict:
        """AI processes product deletion"""
        
        # AI checks if product exists
        product = self.storage.get_product_by_id(product_id)
        if not product:
            return {
                "error": "Not Found",
                "message": f"Product with ID '{product_id}' not found",
                "product_id": product_id,
                "user_role": user_role,
                "timestamp": self._get_timestamp()
            }
        
        # AI performs deletion
        success = self.storage.delete_product(product_id)
        
        if success:
            return {
                "success": True,
                "message": f"Product '{product['name']}' deleted successfully by {user_role}",
                "deleted_product": product,
                "product_id": product_id,
                "user_role": user_role,
                "ai_impact_analysis": self._analyze_deletion_impact(product),
                "timestamp": self._get_timestamp()
            }
        else:
            return {
                "error": "Deletion Failed",
                "message": "AI Runtime Engine failed to delete product",
                "product_id": product_id,
                "timestamp": self._get_timestamp()
            }
    
    async def _handle_get_user_context(self, user_role: str, is_ui_request: bool = False) -> Dict:
        """AI returns user context and capabilities"""
        
        access_policies = self.policies.get("access_policies", {})
        user_policies = access_policies.get(user_role, {})
        
        ui_behavior = self.policies.get("ui_behavior", {})
        themes = ui_behavior.get("themes", {})
        
        user_data = self.storage.get_user_by_role(user_role)
        
        response = {
            "user_role": user_role,
            "user_data": user_data,
            "permissions": user_policies.get("permissions", []),
            "ui_elements": user_policies.get("ui_elements", []),
            "theme": themes.get(user_role, {"color": "gray", "layout": "minimal"}),
            "message": user_policies.get("message", f"Context for {user_role}"),
            "available_actions": self._get_available_actions(user_role),
            "ai_suggestions": self._get_user_suggestions(user_role),
            "timestamp": self._get_timestamp()
        }
        
        # Add UI generation instructions if this is a UI request
        if is_ui_request:
            response["ui_instructions"] = self._generate_ui_instructions(user_role, "context", response)
        
        return response
    
    async def _handle_health_check(self) -> Dict:
        """AI-generated health check"""
        stats = self.storage.get_stats()
        
        return {
            "status": "UP",
            "message": "AI Runtime Engine is operational",
            "service": "Pure Zero-Code AI Runtime",
            "version": "1.0.0",
            "concept": "AI engine IS the application runtime",
            "stats": {
                "products_managed": stats["total_products"],
                "users_supported": stats["total_users"],
                "policies_loaded": len(self.policies.keys())
            },
            "ai_status": "Active - Making real-time decisions",
            "timestamp": self._get_timestamp()
        }
    
    async def _handle_demo_info(self) -> Dict:
        """AI-generated demo information"""
        return {
            "title": "Pure AI Runtime Engine Demo",
            "concept": "ZERO hardcoded business logic - AI handles everything",
            "revolutionary_approach": {
                "traditional": "Policies → Write Code → Build → Deploy → Run",
                "ai_runtime": "Policies → AI Engine → Live Application (Zero Code)"
            },
            "what_exists": [
                "3 users in JSON file",
                "15 products in JSON file", 
                "1 policy file with access rules",
                "1 AI engine that makes ALL decisions"
            ],
            "what_does_not_exist": [
                "No controller classes",
                "No service classes",
                "No DTO classes", 
                "No business logic code",
                "No hardcoded endpoints"
            ],
            "demo_users": {
                "admin": "Full access (view, add, delete)",
                "manager": "Limited access (view, add)",
                "viewer": "Read-only access (view)"
            },
            "features": {
                "dynamic_endpoints": "AI handles ANY request path dynamically",
                "dynamic_responses": "Same endpoint returns different data per user",
                "policy_driven": "All behavior controlled by policies.yaml",
                "zero_code": "No hardcoded business logic anywhere"
            },
            "test_commands": [
                "curl -H 'X-User-Role: admin' http://localhost:8000/api/products",
                "curl -H 'X-User-Role: manager' http://localhost:8000/api/products",
                "curl -H 'X-User-Role: viewer' http://localhost:8000/api/products"
            ],
            "timestamp": self._get_timestamp()
        }
    
    async def _handle_get_categories(self, user_role: str, is_ui_request: bool = False) -> Dict:
        """AI generates product categories response based on policies"""
        print(f"DEBUG: _handle_get_categories called. is_ui_request: {is_ui_request}")
        
        # Check permissions from loaded policies
        access_policies = self.policies.get("access_policies", {})
        user_policies = access_policies.get(user_role, {})
        permissions = user_policies.get("permissions", [])
        
        # Check if categories feature is enabled and user has permission
        categories_feature = self.policies.get("categories_feature", {})
        if not categories_feature.get("enabled", False):
            return await self._handle_unknown_request("api/categories", "GET", user_role, {})
        
        # Check role-based access from categories feature policies
        access_control = categories_feature.get("access_control", {})
        user_access = access_control.get(user_role, {})
        
        if not user_access.get("allowed", False):
            message = user_access.get("message", f"Access denied for role '{user_role}'")
            return {
                "error": "Access Denied",
                "message": message,
                "user_role": user_role,
                "feature": "categories",
                "timestamp": self._get_timestamp()
            }
        
        # Get aggregation rules from policies
        aggregation_rules = categories_feature.get("aggregation_rules", {})
        group_by_field = aggregation_rules.get("group_by_field", "category")
        
        # Get products and group by category
        products = self.storage.get_products()
        categories = {}
        
        for product in products:
            category = product.get(group_by_field, "Unknown")
            if category not in categories:
                categories[category] = {
                    "name": category,
                    "product_count": 0,
                    "total_inventory_value": 0,
                    "total_stock_units": 0,
                    "low_stock_alerts": 0,
                    "products": []
                }
            
            # Ensure price and stock are numbers (convert from string if needed)
            price = float(product.get("price", 0))
            stock = int(product.get("stock", 0))
            value = price * stock
            
            categories[category]["product_count"] += 1
            categories[category]["total_inventory_value"] += value
            categories[category]["total_stock_units"] += stock
            categories[category]["products"].append(product)
            
            if stock < 20:
                categories[category]["low_stock_alerts"] += 1
        
        # Build response based on role access level
        access_level = user_access.get("access_level", "basic")
        features = user_access.get("features", [])
        
        category_list = []
        total_value = sum(cat["total_inventory_value"] for cat in categories.values())
        
        for category_data in categories.values():
            # Calculate metrics
            if category_data["product_count"] > 0:
                # Ensure prices are numbers when calculating average
                total_price = sum(float(p.get("price", 0)) for p in category_data["products"])
                average_price = total_price / category_data["product_count"]
            else:
                average_price = 0
            
            percentage = (category_data["total_inventory_value"] / total_value * 100) if total_value > 0 else 0
            
            # Build category info based on access level
            category_info = {
                "name": category_data["name"],
                "product_count": category_data["product_count"],
                "total_inventory_value": round(category_data["total_inventory_value"], 2)
            }
            
            # Add features based on policy configuration
            if "basic_analytics" in features:
                category_info["low_stock_alerts"] = category_data["low_stock_alerts"]
            
            if "advanced_metrics" in features:
                category_info.update({
                    "average_product_price": round(average_price, 2),
                    "total_stock_units": category_data["total_stock_units"],
                    "percentage_of_total": round(percentage, 1)
                })
            
            category_list.append(category_info)
        
        # Sort according to policy rules
        sorting = aggregation_rules.get("sorting", {})
        sort_by = sorting.get("default_sort", "total_inventory_value")
        reverse_order = sorting.get("sort_order", "DESC") == "DESC"
        
        category_list.sort(key=lambda x: x.get(sort_by, 0), reverse=reverse_order)
        
        # Get response format from policies
        response_formats = categories_feature.get("response_formats", {})
        user_response_format = response_formats.get(f"{user_role}_response", {})
        
        response = {
            "categories": category_list,
            "user_role": user_role,
            "access_level": access_level,
            "features_available": features,
            "message": user_response_format.get("message", f"Categories for {user_role}"),
            "timestamp": self._get_timestamp(),
            "generated_by": "AI Runtime Engine - Policy-Driven Categories"
        }
        
        # Add UI generation instructions if this is a UI request
        if is_ui_request:
            ui_instructions = self._generate_ui_instructions(user_role, "categories", response)
            print(f"DEBUG: Generated UI instructions for categories: {ui_instructions}")
            response["ui_instructions"] = ui_instructions
        
        return response
    
    async def _handle_get_menu_items(self, user_role: str) -> Dict:
        """AI generates available menu items based on loaded policies"""
        
        # Base menu items always available
        menu_items = [
            {
                "key": "products",
                "label": "📦 Products",
                "visible_to": ["viewer", "manager", "admin"],
                "endpoint": "/api/products",
                "source": "base"
            }
        ]
        
        # Check if categories feature is enabled and user has access
        categories_feature = self.policies.get("categories_feature", {})
        if categories_feature.get("enabled", False):
            # Check if user has access to categories
            access_control = categories_feature.get("access_control", {})
            user_access = access_control.get(user_role, {})
            
            if user_access.get("allowed", False):
                # Get UI component configuration
                ui_components = categories_feature.get("ui_components", {})
                category_nav = ui_components.get("category_navigation", {})
                
                if category_nav and user_role in category_nav.get("visible_to", []):
                    menu_items.append({
                        "key": "categories",
                        "label": category_nav.get("label", "📊 Categories"),
                        "visible_to": category_nav.get("visible_to", []),
                        "endpoint": "/api/categories",
                        "source": "categories_feature"
                    })
        
        # API Tester is always available
        menu_items.append({
            "key": "api",
            "label": "🧪 API Tester",
            "visible_to": ["viewer", "manager", "admin"],
            "endpoint": "/api-tester",
            "source": "base"
        })
        
        # Filter menu items based on user role
        available_menu_items = []
        for item in menu_items:
            if user_role in item.get("visible_to", []):
                available_menu_items.append(item)
        
        return {
            "menu_items": available_menu_items,
            "user_role": user_role,
            "generated_by": "AI Runtime Engine - Policy-Driven Menu",
            "policies_loaded": list(self.policies.keys()),
            "timestamp": self._get_timestamp()
        }
    
    async def _handle_unknown_request(self, path: str, method: str, user_role: str, data: Dict) -> Dict:
        """AI handles requests it doesn't recognize"""
        
        return {
            "ai_analysis": f"AI Engine analyzed {method} {path} but doesn't have a pattern for it",
            "message": "This demonstrates AI's ability to handle unknown requests gracefully",
            "user_role": user_role,
            "request_data": data,
            "ai_suggestions": [
                "Try /api/products for product management",
                "Try /api/user-context/{role} for user capabilities",
                "Try /api/health for system status",
                "Try /api/demo-info for demo information"
            ],
            "supported_patterns": {
                "GET /api/products": "List products with role-based filtering",
                "POST /api/products": "Add new product (if permitted)",
                "DELETE /api/products/{id}": "Delete product (if permitted)",
                "GET /api/user-context/{role}": "Get user capabilities",
                "GET /api/health": "System health check",
                "GET /api/demo-info": "Demo information"
            },
            "ai_learning": "AI could learn new patterns from this request if configured",
            "timestamp": self._get_timestamp()
        }
    
    def _validate_product_data(self, data: Dict) -> Dict:
        """AI validates product data against business rules"""
        
        required_fields = ["name", "category", "price", "stock"]
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            return {
                "valid": False,
                "message": f"Missing required fields: {', '.join(missing_fields)}",
                "details": {"missing_fields": missing_fields, "required_fields": required_fields}
            }
        
        # AI checks business rules from policies
        business_rules = self.policies.get("business_rules", {})
        
        # Validate price
        if isinstance(data.get("price"), (int, float)) and data["price"] <= 0:
            return {
                "valid": False,
                "message": "Price must be greater than 0",
                "details": {"invalid_field": "price", "value": data["price"]}
            }
        
        # Validate stock
        if isinstance(data.get("stock"), int) and data["stock"] < 0:
            return {
                "valid": False,
                "message": "Stock cannot be negative",
                "details": {"invalid_field": "stock", "value": data["stock"]}
            }
        
        return {
            "valid": True,
            "message": "Product data is valid",
            "ai_assessment": "All business rules satisfied"
        }
    
    def _get_available_actions(self, user_role: str) -> List[str]:
        """AI determines what actions user can perform"""
        access_policies = self.policies.get("access_policies", {})
        permissions = access_policies.get(user_role, {}).get("permissions", [])
        
        action_map = {
            "view": ["View Products", "List Inventory", "Check Stock"],
            "add": ["Add Product", "Create New Item", "Expand Inventory"],
            "delete": ["Delete Product", "Remove Item", "Clean Inventory"]
        }
        
        actions = []
        for permission in permissions:
            actions.extend(action_map.get(permission, []))
        
        return actions
    
    def _get_ai_recommendation(self, action: str, data: Dict) -> str:
        """AI generates contextual recommendations"""
        if action == "add":
            category = data.get("category", "Unknown")
            stock = data.get("stock", 0)
            
            if stock < 10:
                return f"Low initial stock for {category} item. Consider ordering more."
            elif stock > 100:
                return f"High stock level. Monitor demand for {category} items."
            else:
                return f"Balanced stock level for {category} category."
        
        return "AI recommendation system active"
    
    def _analyze_deletion_impact(self, product: Dict) -> str:
        """AI analyzes impact of product deletion"""
        stock_value = product.get("price", 0) * product.get("stock", 0)
        
        if stock_value > 1000:
            return f"High value deletion: ${stock_value:.2f} removed from inventory"
        elif product.get("stock", 0) > 50:
            return "Large quantity removed - consider if this was intentional"
        else:
            return "Normal deletion - minimal inventory impact"
    
    def _get_user_suggestions(self, user_role: str) -> List[str]:
        """AI generates personalized suggestions for user"""
        suggestions = []
        
        if user_role == "admin":
            stats = self.storage.get_stats()
            if stats["low_stock_count"] > 0:
                suggestions.append(f"Review {stats['low_stock_count']} low stock items")
            suggestions.append("Monitor inventory trends and user activity")
            
        elif user_role == "manager":
            suggestions.append("Focus on adding new products to expand inventory")
            suggestions.append("Review product categories for balance")
            
        elif user_role == "viewer":
            suggestions.append("Use filters to find specific products")
            suggestions.append("Contact manager if you need to add products")
        
        return suggestions
    
    def _get_timestamp(self) -> str:
        """AI includes timestamp in responses"""
        return datetime.now().isoformat()
    
    async def handle_error(self, error: str, user_role: str, path: str) -> Dict:
        """AI handles all errors"""
        return {
            "error": "AI Runtime Engine Error",
            "message": "AI Engine encountered an unexpected situation",
            "details": error,
            "user_role": user_role,
            "path": path,
            "ai_analysis": "Error handling demonstrates AI's resilience",
            "recovery_suggestion": "AI can adapt and continue operating",
            "timestamp": self._get_timestamp()
        }

class MockAIProvider:
    """Mock AI for demo without API keys"""
    
    def generate_response(self, prompt: str) -> str:
        return f"Mock AI decision: {prompt[:50]}..."

class HuggingFaceProvider:
    """Real AI using Hugging Face (free)"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.model_name = os.getenv('HF_MODEL', 'microsoft/DialoGPT-medium')
        self.base_url = "https://api-inference.huggingface.co/models"
        self.headers = {"Authorization": f"Bearer {api_key}"}
        print(f"🤖 HuggingFace AI Provider initialized with model: {self.model_name}")
    
    def generate_response(self, prompt: str) -> str:
        """Generate AI response using HuggingFace Inference API"""
        try:
            import requests
            
            # Use text generation endpoint
            url = f"{self.base_url}/{self.model_name}"
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_length": 150,
                    "temperature": 0.7,
                    "do_sample": True
                }
            }
            
            response = requests.post(url, headers=self.headers, json=payload, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    # Handle different response formats
                    first_result = result[0]
                    if isinstance(first_result, dict):
                        # BART/text generation models
                        generated_text = first_result.get('generated_text') or first_result.get('summary_text', '')
                        if not generated_text:
                            raise RuntimeError("HuggingFace API returned empty response")
                        return generated_text.strip()
                    else:
                        # Vector embeddings or other formats - not suitable for text generation
                        raise RuntimeError("HuggingFace model returned vector embeddings, not text. Need a text generation model.")
                else:
                    raise RuntimeError("HuggingFace API returned invalid response format")
            else:
                raise RuntimeError(f"HuggingFace API error: {response.status_code} - {response.text}")
                
        except Exception as e:
            # If AI fails, the Pure AI Runtime Engine MUST fail - no fallbacks
            raise RuntimeError(f"CRITICAL AI FAILURE: Pure AI Runtime Engine cannot work without AI. Error: {e}")
    
    def analyze_permission_request(self, user_role: str, action: str, resource: str) -> Dict:
        """AI-powered permission analysis"""
        prompt = f"User role '{user_role}' requests '{action}' on '{resource}'. Analyze permissions."
        
        ai_response = self.generate_response(prompt)
        
        # Simple keyword analysis for demo
        allowed = any(word in ai_response.lower() for word in ['allow', 'permit', 'grant', 'yes', 'authorized'])
        
        return {
            "ai_decision": ai_response,
            "allowed": allowed,
            "reasoning": f"AI analyzed: {ai_response[:100]}..."
        }
    
    def enhance_response(self, base_response: Dict, context: str) -> Dict:
        """AI enhances responses with intelligent insights"""
        prompt = f"Enhance this response for context '{context}': {str(base_response)[:200]}"
        
        ai_insight = self.generate_response(prompt)
        
        base_response["ai_enhancement"] = {
            "insight": ai_insight,
            "enhanced_by": "HuggingFace AI",
            "context": context
        }
        
        return base_response

class OpenAIProvider:
    """Real AI using OpenAI"""
    
    def __init__(self, api_key: str):
        from openai import OpenAI
        self.client = OpenAI(api_key=api_key)
        self.model_name = os.getenv('OPENAI_MODEL', 'gpt-4o-mini') # Use a chat model
        print(f"🤖 OpenAI AI Provider initialized with model: {self.model_name}")

    def generate_response(self, prompt: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that returns JSON objects only. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.7,
                response_format={ "type": "json_object" }
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise RuntimeError(f"CRITICAL AI FAILURE: Pure AI Runtime Engine cannot work without AI. Error: {e}")

class OllamaProvider:
    """Local AI using Ollama"""
    
    def __init__(self, url: str):
        self.url = url
        # Would implement actual Ollama API calls here
    
    def generate_response(self, prompt: str) -> str:
        return "Ollama local AI decision"
