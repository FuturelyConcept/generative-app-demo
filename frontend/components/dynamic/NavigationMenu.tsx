'use client';

import React, { useState } from 'react';
import { NavigationItem } from '../../lib/ai-ui-client';
import { 
  Package, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronRight,
  Home,
  Activity
} from 'lucide-react';

interface NavigationMenuProps {
  items: NavigationItem[];
  userRole: string;
  onNavigate?: (item: NavigationItem) => void;
}

export function NavigationMenu({ items, userRole, onNavigate }: NavigationMenuProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const getIcon = (endpoint: string) => {
    if (endpoint.includes('products')) {
      return <Package className="w-4 h-4" />;
    } else if (endpoint.includes('categories')) {
      return <BarChart3 className="w-4 h-4" />;
    } else if (endpoint.includes('users')) {
      return <Users className="w-4 h-4" />;
    } else if (endpoint.includes('settings')) {
      return <Settings className="w-4 h-4" />;
    } else if (endpoint.includes('dashboard')) {
      return <Activity className="w-4 h-4" />;
    }
    return <Home className="w-4 h-4" />;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'manager':
        return 'bg-blue-100 text-blue-700';
      case 'viewer':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleItemClick = (item: NavigationItem) => {
    setActiveItem(item.endpoint);
    onNavigate?.(item);
  };

  const handleHomeClick = () => {
    setActiveItem(null);
    onNavigate?.({ label: 'Home', endpoint: '/home', visible_to: [], active: false });
  };

  const filteredItems = items.filter(item => 
    item.visible_to.includes(userRole)
  );

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button
            onClick={handleHomeClick}
            className={`
              flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${!activeItem
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <Home className="w-4 h-4" />
            <span>🏠 Home</span>
          </button>
          
          {filteredItems.map((item) => (
            <button
              key={item.endpoint}
              onClick={() => handleItemClick(item)}
              className={`
                flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${item.active || activeItem === item.endpoint
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {getIcon(item.endpoint)}
              <span>{item.label}</span>
              {item.active && <ChevronRight className="w-4 h-4 ml-1" />}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole)}`}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </div>
          
          <div className="text-xs text-gray-500">
            🤖 AI Navigation
          </div>
        </div>
      </div>
      
      {/* Breadcrumb or Context */}
      {activeItem && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium">
              {filteredItems.find(item => item.endpoint === activeItem)?.label}
            </span>
            <span className="text-gray-400">•</span>
            <span>Generated for {userRole}</span>
          </div>
        </div>
      )}
    </nav>
  );
}