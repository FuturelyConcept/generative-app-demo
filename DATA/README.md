# DATA Directory

This directory contains all the data for the AI Runtime Engine. The AI operates on this data according to the policies defined in the POLICIES directory.

## 📊 Data Files

### 👥 `users.json`
- **Purpose**: User definitions and role assignments
- **Structure**: User profiles with roles (admin, manager, viewer)
- **AI Uses This For**: User authentication, role-based decision making

### 📦 `products.json`
- **Purpose**: Product inventory data
- **Structure**: Product catalog with details (name, price, stock, category)
- **AI Uses This For**: Dynamic product management, business operations

## 🔄 How It Works

1. **AI Reads Data** from these JSON files
2. **Policies Control** how data is accessed and modified
3. **Dynamic Operations** performed based on user roles
4. **Real-time Updates** reflected immediately in application
5. **No Database Required** - simple JSON storage

## 📝 Data Management

### Automatic Updates
The AI Engine automatically:
- ✅ Generates unique IDs for new products
- ✅ Validates data against business rules
- ✅ Maintains data integrity
- ✅ Tracks changes and modifications

### Manual Updates
You can manually edit these files:
- 📝 Add/remove users
- 📝 Modify product information
- 📝 Update inventory levels
- 📝 Change user roles

## 🎯 Key Benefits

- **Simple Structure**: Easy to understand JSON format
- **Version Control Friendly**: Text-based files
- **No Database Setup**: Zero infrastructure requirements
- **AI-Driven Operations**: All changes through AI engine
- **Instant Updates**: Changes reflected immediately

## 🔍 Data Validation

The AI automatically validates:
- ✅ Required fields presence
- ✅ Data type correctness
- ✅ Business rule compliance
- ✅ Reference integrity
- ✅ Value constraints

## 📊 Current Data

### Users (3 roles)
- **admin**: Full system access
- **manager**: Business operations access  
- **viewer**: Read-only access

### Products (~15 items)
- **Electronics**: Laptops, phones, accessories
- **Furniture**: Chairs, desks, lamps
- **Stationery**: Notebooks, supplies

---

**Remember**: This data IS your application state. The AI engine makes it come alive through policy-driven operations!