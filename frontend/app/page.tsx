'use client';

import { useState, useEffect } from 'react';
import { AIUIRenderer } from '../components/AIUIRenderer';
import { aiUIClient, AIUIResponse } from '../lib/ai-ui-client';
import { aiClient } from '../lib/ai-client';
import { ChevronDown, RefreshCw } from 'lucide-react';

export default function Home() {
  const [currentRole, setCurrentRole] = useState('viewer');
  const [activeView, setActiveView] = useState('products');
  const [uiResponse, setUIResponse] = useState<AIUIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [editableEndpoints, setEditableEndpoints] = useState([
    { method: 'GET', path: '/api/products', desc: 'Get products (all roles)' },
    { method: 'POST', path: '/api/products', desc: 'Add product (admin/manager only)' },
    { method: 'DELETE', path: '/api/products/p1', desc: 'Delete product (admin only)' },
    { method: 'GET', path: '/api/categories', desc: 'Get category analytics (manager/admin only)' },
    { method: 'GET', path: '/api/health', desc: 'Health check endpoint' },
    { method: 'GET', path: '/api/demo-info', desc: 'Demo information' },
    { method: 'GET', path: '/api/unknown-endpoint', desc: 'Test unknown endpoint (AI handles anything)' }
  ]);
  const [editableRequestBody, setEditableRequestBody] = useState(JSON.stringify({
    name: 'API Test Product',
    category: 'Electronics',
    price: 99.99,
    stock: 25
  }, null, 2));
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);

  useEffect(() => {
    loadAIUI();
    loadMenuItems();
  }, [currentRole, activeView]);

  const loadMenuItems = async () => {
    setMenuLoading(true);
    try {
      const response = await aiClient.getMenuItems(currentRole);
      setMenuItems(response.menu_items || []);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      // Fallback to basic menu items
      setMenuItems([
        { key: 'products', label: '📦 Products', visible_to: ['viewer', 'manager', 'admin'] },
        { key: 'api', label: '🧪 API Tester', visible_to: ['viewer', 'manager', 'admin'] }
      ]);
    } finally {
      setMenuLoading(false);
    }
  };

  const loadAIUI = async () => {
    setIsLoading(true);
    setError(null);
    console.log(`loadAIUI: Fetching UI for role: ${currentRole}, view: ${activeView}`);
    
    try {
      let response: AIUIResponse;
      
      switch (activeView) {
        case 'products':
          response = await aiUIClient.getProductsUI(currentRole);
          break;
        case 'categories':
          console.log("loadAIUI: Calling getCategoriesUI...");
          response = await aiUIClient.getCategoriesUI(currentRole);
          console.log("loadAIUI: getCategoriesUI returned:", response);
          break;
        case 'context':
          response = await aiUIClient.getUserContextUI(currentRole);
          break;
        default:
          response = await aiUIClient.getProductsUI(currentRole);
      }
      
      setUIResponse(response);
      console.log("loadAIUI: UI Response set:", response);
    } catch (error) {
      console.error('Failed to load AI UI:', error);
      setError(`Failed to load AI UI: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
  };

  const handleUIAction = (action: string, data?: any) => {
    console.log('UI Action:', action, data);
    
    switch (action) {
      case 'delete_success':
      case 'form_success':
        // Refresh UI after successful operations
        loadAIUI();
        break;
      case 'form_error':
        setError(data?.error || 'An error occurred');
        break;
      case 'show_add_form':
        // Handle showing add form
        break;
      case 'go_home':
        // Reset to home state - clear UI response
        setUIResponse(null);
        setActiveView('products');
        setError(null);
        break;
      default:
        console.log('Unhandled action:', action);
    }
  };

  const handleViewChange = (newView: string) => {
    console.log(`handleViewChange: Switching to view: ${newView}`);
    setActiveView(newView);
    // Clear UI response when switching to non-AI views like API tester
    if (newView === 'api') {
      setUIResponse(null);
      setError(null);
      setApiResponse(null);
    }
  };

  const handleRefresh = () => {
    loadAIUI();
    loadMenuItems();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Runtime Engine</h1>
                <p className="text-sm text-gray-600">Dynamic UI Generated by AI + Policies</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                🤖 AI-Driven UI
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Role: {currentRole}
              </div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                OpenAI Powered
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1">
            {/* Role Switcher */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Switch User Role</h3>
              <div className="space-y-2">
                {['admin', 'manager', 'viewer'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentRole === role
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* View Selector */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-900 mb-3">AI Views</h3>
              <div className="space-y-2">
                {menuLoading ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading menu...</p>
                  </div>
                ) : (
                  menuItems.map((view) => (
                    <button
                      key={view.key}
                      onClick={() => handleViewChange(view.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeView === view.key
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {view.label}
                    </button>
                  ))
                )}
              </div>
              
              <button
                onClick={handleRefresh}
                className="w-full mt-4 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh AI UI</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">

            {/* Loading State */}
            {isLoading && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI is generating your UI...</h3>
                <p className="text-gray-600">Creating dynamic interface for {currentRole} role</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">AI UI Generation Error</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* AI-Driven UI Content */}
            {!isLoading && !error && uiResponse && activeView !== 'api' && (
              <AIUIRenderer
                components={uiResponse.ui_config.components}
                navigation={uiResponse.ui_config.navigation}
                theme={uiResponse.ui_config.theme}
                layout={uiResponse.ui_config.layout}
                userRole={currentRole}
                onAction={handleUIAction}
                embedded={true}
              />
            )}

            {/* API Tester View */}
            {activeView === 'api' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold mb-4">🧪 Dynamic API Tester</h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                      <p className="text-sm text-yellow-700">
                        This shows how the AI handles ANY request dynamically. Try different endpoints and see how the AI responds based on your role ({currentRole}).
                      </p>
                    </div>
                  
                    <div className="space-y-4">
                      {editableEndpoints.map((api, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <select
                                  value={api.method}
                                  onChange={(e) => {
                                    const newEndpoints = [...editableEndpoints];
                                    newEndpoints[idx].method = e.target.value;
                                    setEditableEndpoints(newEndpoints);
                                  }}
                                  className="border rounded px-2 py-1 text-sm font-medium"
                                >
                                  <option value="GET">GET</option>
                                  <option value="POST">POST</option>
                                  <option value="PUT">PUT</option>
                                  <option value="DELETE">DELETE</option>
                                  <option value="PATCH">PATCH</option>
                                </select>
                                <input
                                  type="text"
                                  value={api.path}
                                  onChange={(e) => {
                                    const newEndpoints = [...editableEndpoints];
                                    newEndpoints[idx].path = e.target.value;
                                    setEditableEndpoints(newEndpoints);
                                  }}
                                  className="flex-1 border rounded px-2 py-1 text-sm font-mono"
                                />
                              </div>
                              <div className="text-sm text-gray-600">{api.desc}</div>
                            </div>
                            <button
                              onClick={async () => {
                                setApiLoading(true);
                                setApiResponse(null);
                                
                                try {
                                  let requestBody = undefined;
                                  if (api.method === 'POST' || api.method === 'PUT' || api.method === 'PATCH') {
                                    try {
                                      requestBody = JSON.parse(editableRequestBody);
                                    } catch (e) {
                                      throw new Error('Invalid JSON in request body');
                                    }
                                  }

                                  const response = await fetch(`http://localhost:8000${api.path}`, {
                                    method: api.method,
                                    headers: {
                                      'X-User-Role': currentRole,
                                      'Content-Type': 'application/json'
                                    },
                                    ...(requestBody && { body: JSON.stringify(requestBody) })
                                  });
                                  
                                  const data = await response.json();
                                  
                                  setApiResponse({
                                    request: {
                                      method: api.method,
                                      path: api.path,
                                      role: currentRole,
                                      body: requestBody
                                    },
                                    response: {
                                      status: response.status,
                                      data: data
                                    }
                                  });
                                } catch (error) {
                                  setApiResponse({
                                    request: {
                                      method: api.method,
                                      path: api.path,
                                      role: currentRole
                                    },
                                    response: {
                                      status: 'Error',
                                      data: { error: String(error) }
                                    }
                                  });
                                } finally {
                                  setApiLoading(false);
                                }
                              }}
                              disabled={apiLoading}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm font-medium transition-colors"
                            >
                              {apiLoading ? '⏳ Testing...' : '🧪 Test API'}
                            </button>
                          </div>
                          
                          {(api.method === 'POST' || api.method === 'PUT' || api.method === 'PATCH') && (
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Request Body (JSON):</label>
                              <textarea
                                value={editableRequestBody}
                                onChange={(e) => setEditableRequestBody(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm font-mono h-32 resize-none"
                                placeholder="Enter JSON request body"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* API Response Display */}
                {apiResponse && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="font-semibold mb-4">🔍 API Response</h4>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded">
                        <h5 className="font-medium text-blue-800 mb-2">Request</h5>
                        <div className="text-sm text-blue-700">
                          <div><strong>Method:</strong> {apiResponse.request.method}</div>
                          <div><strong>Path:</strong> {apiResponse.request.path}</div>
                          <div><strong>Role:</strong> {apiResponse.request.role}</div>
                          {apiResponse.request.body && (
                            <div><strong>Body:</strong> <pre className="mt-1 bg-white p-2 rounded text-xs overflow-x-auto">{JSON.stringify(apiResponse.request.body, null, 2)}</pre></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded">
                        <h5 className="font-medium text-gray-800 mb-2">Response</h5>
                        <div className="text-sm">
                          <div className="mb-2"><strong>Status:</strong> <span className={apiResponse.response.status === 200 ? 'text-green-600' : 'text-red-600'}>{apiResponse.response.status}</span></div>
                          <div><strong>Data:</strong></div>
                          <pre className="mt-1 bg-white p-3 rounded text-xs overflow-x-auto border">{JSON.stringify(apiResponse.response.data, null, 2)}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Welcome State */}
            {!isLoading && !error && !uiResponse && activeView !== 'api' && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI UI Engine Ready</h3>
                <p className="text-gray-600 mb-4">
                  Select a view from the sidebar to generate your AI-driven interface for <strong>{currentRole}</strong> role.
                </p>
                <div className="text-sm text-gray-500">
                  Current view: {activeView} • Click "Refresh AI UI" to generate components
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>🤖 AI-Driven UI Generation | 🚀 Dynamic Components | 🎯 Policy-Based Interface</p>
          </div>
        </div>
      </footer>
    </div>
  );
}