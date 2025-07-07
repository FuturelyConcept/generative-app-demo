"""
Simple JSON file storage - no database needed for AI Runtime Engine Demo
"""
import json
import os
from typing import List, Dict, Optional

class JSONStorage:
    """Simple JSON file storage - no database needed"""
    
    def __init__(self, data_dir: str = "../DATA"):
        self.data_dir = data_dir
        self.users_file = os.path.join(data_dir, "users.json")
        self.products_file = os.path.join(data_dir, "products.json")
    
    def get_users(self) -> List[Dict]:
        """Get all users from JSON file"""
        try:
            with open(self.users_file, 'r') as f:
                data = json.load(f)
                return data.get('users', [])
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def get_user_by_role(self, role: str) -> Optional[Dict]:
        """Get user by role"""
        users = self.get_users()
        for user in users:
            if user.get('role') == role:
                return user
        return None
    
    def get_products(self) -> List[Dict]:
        """Get all products from JSON file"""
        try:
            with open(self.products_file, 'r') as f:
                data = json.load(f)
                return data.get('products', [])
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict]:
        """Get product by ID"""
        products = self.get_products()
        for product in products:
            if product.get('id') == product_id:
                return product
        return None
    
    def add_product(self, product: Dict) -> bool:
        """Add new product to JSON file"""
        try:
            products = self.get_products()
            
            # Generate ID if not provided
            if 'id' not in product:
                max_id = 0
                for p in products:
                    if p['id'].startswith('p'):
                        try:
                            num = int(p['id'][1:])
                            max_id = max(max_id, num)
                        except:
                            pass
                product['id'] = f"p{max_id + 1}"
            
            products.append(product)
            
            with open(self.products_file, 'w') as f:
                json.dump({'products': products}, f, indent=2)
            return True
        except Exception as e:
            print(f"Error adding product: {e}")
            return False
    
    def update_product(self, product_id: str, updates: Dict) -> bool:
        """Update existing product"""
        try:
            products = self.get_products()
            
            for i, product in enumerate(products):
                if product.get('id') == product_id:
                    products[i].update(updates)
                    
                    with open(self.products_file, 'w') as f:
                        json.dump({'products': products}, f, indent=2)
                    return True
            
            return False  # Product not found
        except Exception as e:
            print(f"Error updating product: {e}")
            return False
    
    def delete_product(self, product_id: str) -> bool:
        """Delete product from JSON file"""
        try:
            products = self.get_products()
            original_count = len(products)
            
            # Filter out the product to delete
            updated_products = [p for p in products if p.get('id') != product_id]
            
            if len(updated_products) < original_count:
                with open(self.products_file, 'w') as f:
                    json.dump({'products': updated_products}, f, indent=2)
                return True
            
            return False  # Product not found
        except Exception as e:
            print(f"Error deleting product: {e}")
            return False
    
    def get_stats(self) -> Dict:
        """Get storage statistics"""
        products = self.get_products()
        users = self.get_users()
        
        # Ensure price and stock are numbers (convert from string if needed)
        total_value = sum(float(p.get('price', 0)) * int(p.get('stock', 0)) for p in products)
        low_stock_items = [p for p in products if int(p.get('stock', 0)) < 20]
        
        return {
            "total_products": len(products),
            "total_users": len(users),
            "total_inventory_value": total_value,
            "low_stock_count": len(low_stock_items),
            "low_stock_items": low_stock_items,
            "categories": list(set(p.get('category', 'Unknown') for p in products))
        }