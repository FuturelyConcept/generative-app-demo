'use client';

import React, { useState } from 'react';
import { Trash2, Plus, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface ProductTableProps {
  title: string;
  data: Product[];
  columns: string[];
  actions: string[];
  userRole: string;
  theme: { color: string; style: string };
  onAction?: (action: string, data?: any) => void;
}

export function ProductTable({ 
  title, 
  data, 
  columns, 
  actions, 
  userRole, 
  theme,
  onAction 
}: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>(data || []);

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'X-User-Role': userRole,
          },
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p.id !== productId));
          onAction?.('delete_success', { productId });
        } else {
          const error = await response.json();
          alert(`Delete failed: ${error.message}`);
        }
      } catch (error) {
        alert(`Delete failed: ${error}`);
      }
    }
  };

  const getThemeClasses = () => {
    const colorMap = {
      red: 'border-red-200 bg-red-50',
      green: 'border-green-200 bg-green-50',
      blue: 'border-blue-200 bg-blue-50',
      gray: 'border-gray-200 bg-gray-50'
    };
    return colorMap[theme.color as keyof typeof colorMap] || colorMap.blue;
  };

  const getButtonClasses = (actionType: string) => {
    const baseClasses = "px-3 py-1 rounded text-sm font-medium transition-colors";
    
    if (actionType === 'delete') {
      return `${baseClasses} bg-red-100 text-red-700 hover:bg-red-200`;
    }
    
    const colorMap = {
      red: `${baseClasses} bg-red-100 text-red-700 hover:bg-red-200`,
      green: `${baseClasses} bg-green-100 text-green-700 hover:bg-green-200`,
      blue: `${baseClasses} bg-blue-100 text-blue-700 hover:bg-blue-200`,
      gray: `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`
    };
    
    return colorMap[theme.color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className={`bg-white rounded-lg shadow ${getThemeClasses()} border`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              AI-Generated for {userRole}
            </span>
            {actions.includes('add') && (
              <button
                onClick={() => onAction?.('show_add_form')}
                className={getButtonClasses('add')}
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add Product
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.replace('_', ' ')}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column === 'price' ? `$${product[column as keyof Product]}` : product[column as keyof Product]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      {actions.includes('view') && (
                        <button className={getButtonClasses('view')}>
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {actions.includes('delete') && (
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={getButtonClasses('delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found. AI will update this dynamically based on your role.</p>
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          🤖 Dynamic table generated by AI • Showing {products.length} products • Role: {userRole}
        </p>
      </div>
    </div>
  );
}