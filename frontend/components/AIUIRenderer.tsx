'use client';

import React from 'react';
import { UIComponent, NavigationItem } from '../lib/ai-ui-client';
import { ProductTable } from './dynamic/ProductTable';
import { ProductForm } from './dynamic/ProductForm';
import { CategoryAnalytics } from './dynamic/CategoryAnalytics';
import { AdminDashboard } from './dynamic/AdminDashboard';
import { NavigationMenu } from './dynamic/NavigationMenu';

interface AIUIRendererProps {
  components: UIComponent[];
  navigation: NavigationItem[];
  theme: {
    color: string;
    style: string;
    components: string[];
  };
  layout: string;
  userRole: string;
  onAction?: (action: string, data?: any) => void;
  embedded?: boolean; // When true, only render components without header/footer
}

export function AIUIRenderer({ 
  components, 
  navigation, 
  theme, 
  layout, 
  userRole,
  onAction,
  embedded = false
}: AIUIRendererProps) {
  
  const renderComponent = (component: UIComponent) => {
    const key = component.id;
    const componentProps = {
      ...component.props,
      userRole,
      theme,
      onAction: (action: string, data?: any) => {
        onAction?.(action, { componentId: component.id, data });
      }
    };

    switch (component.type) {
      case 'table':
        if (component.id === 'products-table') {
          return <ProductTable key={key} {...componentProps} />;
        }
        return <div key={key}>Generic Table Component</div>;
        
      case 'form':
        if (component.id === 'add-product-form') {
          return <ProductForm key={key} {...componentProps} />;
        }
        return <div key={key}>Generic Form Component</div>;
        
      case 'analytics':
        if (component.id === 'categories-analytics') {
          return <CategoryAnalytics key={key} {...componentProps} />;
        }
        return <div key={key}>Generic Analytics Component</div>;
        
      case 'dashboard':
        if (component.id === 'admin-dashboard') {
          return <AdminDashboard key={key} {...componentProps} />;
        }
        return <div key={key}>Generic Dashboard Component</div>;
        
      case 'navigation':
        return <NavigationMenu items={navigation} userRole={userRole} key={key} />;
        
      default:
        return (
          <div key={key} className="p-4 border border-dashed border-gray-300 rounded">
            <p className="text-gray-500">Unknown component type: {component.type}</p>
            <pre className="text-xs">{JSON.stringify(component, null, 2)}</pre>
          </div>
        );
    }
  };

  const getLayoutClasses = () => {
    const baseClasses = "min-h-screen bg-gray-50";
    
    switch (layout) {
      case 'admin-layout':
        return `${baseClasses} admin-layout`;
      case 'business-layout':
        return `${baseClasses} business-layout`;
      case 'minimal-layout':
        return `${baseClasses} minimal-layout`;
      default:
        return baseClasses;
    }
  };

  const getThemeClasses = () => {
    const colorMap = {
      red: 'theme-red',
      green: 'theme-green', 
      blue: 'theme-blue',
      gray: 'theme-gray'
    };
    
    return colorMap[theme.color as keyof typeof colorMap] || 'theme-blue';
  };

  // Group components by section
  const componentsBySection = components.reduce((acc, component) => {
    const section = component.position.section;
    if (!acc[section]) acc[section] = [];
    acc[section].push(component);
    return acc;
  }, {} as Record<string, UIComponent[]>);

  // Sort components within each section by order
  Object.keys(componentsBySection).forEach(section => {
    componentsBySection[section].sort((a, b) => a.position.order - b.position.order);
  });

  // If embedded mode, only render the main components
  if (embedded) {
    return (
      <div className="space-y-6">
        {componentsBySection.main?.map(renderComponent)}
        
        {/* Show message if no main components */}
        {!componentsBySection.main?.length && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Components Generated</h3>
            <p className="text-gray-600">
              The AI generated {components.length} components for {userRole} role.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${getLayoutClasses()} ${getThemeClasses()}`}>
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => onAction?.('go_home')}
              className="flex items-center space-x-4 hover:bg-gray-50 rounded-lg p-2 transition-colors group"
            >
              <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">AI Runtime Engine</h1>
                <p className="text-sm text-gray-600">Dynamic UI Generated by AI + Policies</p>
              </div>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onAction?.('go_home')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors"
              >
                🏠 Home
              </button>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                🤖 AI-Driven UI
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Role: {userRole}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        {navigation.length > 0 && (
          <div className="border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <NavigationMenu 
                items={navigation} 
                userRole={userRole} 
                onNavigate={(item) => {
                  if (item.endpoint === '/home') {
                    onAction?.('go_home');
                  } else {
                    onAction?.('navigate', { endpoint: item.endpoint });
                  }
                }}
              />
            </div>
          </div>
        )}
        
        {/* Header Components */}
        {componentsBySection.header?.map(renderComponent)}
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {componentsBySection.sidebar?.map(renderComponent)}
            
            {/* AI Metadata */}
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h3 className="font-semibold text-sm mb-2">🤖 AI UI Generation</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Layout:</strong> {layout}</p>
                <p><strong>Theme:</strong> {theme.color} / {theme.style}</p>
                <p><strong>Components:</strong> {components.length}</p>
                <p><strong>Role:</strong> {userRole}</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {componentsBySection.main?.map(renderComponent)}
              
              {/* Show message if no main components */}
              {!componentsBySection.main?.length && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI UI Engine Ready</h3>
                  <p className="text-gray-600">
                    The AI will generate components based on your role ({userRole}) and the data you request.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {componentsBySection.footer?.map(renderComponent)}
          
          <div className="text-center text-sm text-gray-500">
            <p>🤖 UI Generated Dynamically by AI Runtime Engine | 🎯 Layout: {layout} | 🎨 Theme: {theme.color}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}