'use client';

import { useState, useEffect } from 'react';
import { Product, ProductsResponse, aiClient, getButtonClasses } from '../lib/ai-client';

interface ProductTableProps {
  userRole: string;
  onProductChange?: () => void;
}

export default function ProductTable({ userRole, onProductChange }: ProductTableProps) {
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    price: 0,
    stock: 0,
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await aiClient.getProducts(userRole);
      setProductsData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [userRole]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await aiClient.addProduct(userRole, newProduct);
      setNewProduct({ name: '', category: 'Electronics', price: 0, stock: 0 });
      setShowAddForm(false);
      await loadProducts();
      onProductChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await aiClient.deleteProduct(userRole, productId);
      await loadProducts();
      onProductChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadProducts}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!productsData) return null;

  const { products, permissions, ui_elements, theme, message } = productsData;
  const canAdd = permissions.includes('add');
  const canDelete = permissions.includes('delete');
  const showAddButton = ui_elements.includes('add_button');
  const showDeleteButtons = ui_elements.includes('delete_buttons');

  return (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className={`p-4 rounded-lg border ${theme ? `bg-${theme.color}-50 border-${theme.color}-200` : 'bg-gray-50 border-gray-200'}`}>
        <h2 className="text-xl font-bold mb-2">Product Inventory</h2>
        <p className="text-sm opacity-75">{message}</p>
        {productsData.generated_by && (
          <p className="text-xs mt-1 font-mono">{productsData.generated_by}</p>
        )}
      </div>

      {/* AI Enhancement Display */}
      {productsData.ai_enhancement && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-2">🤖 AI Enhancement</h3>
          <p className="text-purple-700 text-sm">{productsData.ai_enhancement.insight}</p>
          <p className="text-xs text-purple-600 mt-1">Enhanced by: {productsData.ai_enhancement.enhanced_by}</p>
        </div>
      )}

      {/* Role-Specific Insights */}
      {productsData.admin_insights && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">📊 Admin Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Products:</span>
              <p className="text-red-700">{productsData.admin_insights.total_products}</p>
            </div>
            <div>
              <span className="font-medium">Total Value:</span>
              <p className="text-red-700">${productsData.admin_insights.total_value.toFixed(2)}</p>
            </div>
            <div>
              <span className="font-medium">Low Stock:</span>
              <p className="text-red-700">{productsData.admin_insights.low_stock_alerts.length} items</p>
            </div>
            <div>
              <span className="font-medium">Categories:</span>
              <p className="text-red-700">{productsData.admin_insights.categories.join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      {productsData.manager_insights && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">📈 Manager Insights</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Products:</span>
              <p className="text-green-700">{productsData.manager_insights.total_products}</p>
            </div>
            <div>
              <span className="font-medium">Action Needed:</span>
              <p className="text-green-700">{productsData.manager_insights.action_needed ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Button */}
      {showAddButton && canAdd && (
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-4 py-2 rounded font-medium ${getButtonClasses(theme)}`}
        >
          {showAddForm ? 'Cancel' : '+ Add Product'}
        </button>
      )}

      {/* Add Product Form */}
      {showAddForm && canAdd && (
        <form onSubmit={handleAddProduct} className="bg-white border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Add New Product</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Stationery">Stationery</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price || ''}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
              className="border rounded px-3 py-2"
              min="0"
              step="0.01"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock || ''}
              onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
              className="border rounded px-3 py-2"
              min="0"
              required
            />
          </div>
          <button
            type="submit"
            className={`px-4 py-2 rounded font-medium ${getButtonClasses(theme)}`}
          >
            Add Product
          </button>
        </form>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
              {showDeleteButtons && canDelete && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600">${product.price.toFixed(2)}</td>
                <td className={`px-4 py-3 text-sm ${product.stock < 20 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  {product.stock}
                  {product.stock < 20 && <span className="ml-1 text-xs">(Low)</span>}
                </td>
                {showDeleteButtons && canDelete && (
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permissions Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Role:</strong> {userRole}</p>
        <p><strong>Permissions:</strong> {permissions.join(', ')}</p>
        <p><strong>UI Elements:</strong> {ui_elements.join(', ')}</p>
      </div>
    </div>
  );
}