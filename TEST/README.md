# TEST Directory - Policy-Driven Feature Demo

This directory contains **NEW POLICY FILES** that demonstrate how to add complete new functionality to the AI Runtime Engine using **only policy changes** - no code modifications required!

## 🎯 **What This Demonstrates**

Adding a **Product Categories** feature that:
- ✅ Creates new API endpoint: `/api/categories`
- ✅ Implements role-based access (manager/admin only)
- ✅ Provides category analytics and breakdowns
- ✅ Adds new UI elements and navigation
- ✅ **Requires ZERO code changes!**

## 📁 **New Policy Files**

### 🎛️ `categories_feature.yaml`
**Complete feature definition:**
- Endpoint configuration (`/api/categories`)
- Role-based permissions
- UI component definitions
- Business aggregation rules
- Response formatting

### 🤖 `extended_ai_prompts.yaml` 
**AI capability extension:**
- Teaches AI about `get_categories` action
- Adds new permission definitions
- Updates request analysis prompts
- Defines response templates

## 🚀 **Demo Instructions**

### **Step 1: Test Current Functionality**
With the app running, verify current state:
```bash
# This works (existing functionality)
curl -H "X-User-Role: admin" http://localhost:8000/api/products

# This should return "unknown" (doesn't exist yet)
curl -H "X-User-Role: admin" http://localhost:8000/api/categories
```

### **Step 2: Add New Feature via Policies**
Copy the new policy files while explaining the concept:
```bash
# Navigate to project root
cd /path/to/generative-app-demo

# Copy new policy files
cp TEST/categories_feature.yaml POLICIES/
cp TEST/extended_ai_prompts.yaml POLICIES/

# Show what you just added
ls -la POLICIES/
```

### **Step 3: Restart to Apply New Policies**
```bash
# Kill existing processes
pkill -f "next\|uvicorn\|python.*main.py"

# Restart with new policies
./start-full-demo.sh
```

### **Step 4: Test New Functionality**
```bash
# Test new categories endpoint (should work now!)
curl -H "X-User-Role: admin" http://localhost:8000/api/categories

# Test role-based access
curl -H "X-User-Role: manager" http://localhost:8000/api/categories  # Should work
curl -H "X-User-Role: viewer" http://localhost:8000/api/categories   # Should be denied

# Test method restrictions
curl -X POST -H "X-User-Role: admin" http://localhost:8000/api/categories  # Should be denied (GET only)
```

## 🎭 **Expected Results**

### **Admin Response:**
```json
{
  "categories": [
    {
      "name": "Electronics",
      "product_count": 12,
      "total_inventory_value": 25000.50,
      "average_product_price": 245.83,
      "total_stock_units": 850,
      "low_stock_alerts": 2,
      "percentage_of_total": 75.5
    },
    {
      "name": "Furniture", 
      "product_count": 3,
      "total_inventory_value": 6500.00,
      "average_product_price": 316.67,
      "total_stock_units": 125,
      "low_stock_alerts": 1,
      "percentage_of_total": 19.6
    }
  ],
  "user_role": "admin",
  "message": "Complete category analytics and management data",
  "permissions": ["view", "add", "delete", "update", "view_categories"],
  "timestamp": "2025-01-07T15:30:00.000Z"
}
```

### **Manager Response:**
```json
{
  "categories": [
    {
      "name": "Electronics",
      "product_count": 12,
      "total_inventory_value": 25000.50,
      "low_stock_alerts": 2
    }
  ],
  "user_role": "manager", 
  "message": "Category insights for business planning",
  "permissions": ["view", "add", "view_categories"]
}
```

### **Viewer Response:**
```json
{
  "error": "Access Denied",
  "message": "Category analytics require manager or admin privileges",
  "user_role": "viewer",
  "timestamp": "2025-01-07T15:30:00.000Z"
}
```

## 🌟 **What This Proves**

### **Revolutionary Development Model:**
1. **Traditional**: Write Code → Test → Deploy → New Feature
2. **AI Runtime**: Write Policies → Restart → New Feature ✨

### **Zero Code Changes:**
- ❌ No new controller classes
- ❌ No new service methods  
- ❌ No database schema changes
- ❌ No API route definitions
- ✅ **Just policy files = Complete new feature!**

### **Instant Business Logic:**
- 📊 Complex aggregations defined in YAML
- 🔐 Role-based security configured in policies
- 🎨 UI components specified declaratively
- 🤖 AI automatically understands and implements

## 🎯 **Demo Script**

> "I'm going to add a complete new feature - Product Categories with analytics - to this running application. Watch as I add **ZERO lines of code** and only modify policy files."

> "Here's what I'm adding: [show the YAML files] - endpoint definitions, permissions, business rules, UI components - all in simple YAML."

> "Now I copy these files to the POLICIES directory and restart... [copy files, restart]"

> "And voilà! The AI Runtime Engine now has a complete new feature with role-based access, analytics, and business logic - all from policy files!"

**This is the future of software development - where business logic lives in policies, not code!** 🚀

## 🔄 **Cleanup (Optional)**

To remove the new feature:
```bash
# Remove the policy files
rm POLICIES/categories_feature.yaml
rm POLICIES/extended_ai_prompts.yaml

# Restart to apply changes
./start-full-demo.sh
```

The categories feature will disappear, proving it was entirely policy-driven!