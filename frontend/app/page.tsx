'use client';

import { useState, useEffect } from 'react';
import ProductTable from '../components/ProductTable';
import UserSwitcher from '../components/UserSwitcher';
import APITester from '../components/APITester';
import { aiClient } from '../lib/ai-client';

export default function Home() {
  const [currentRole, setCurrentRole] = useState('viewer');
  const [activeTab, setActiveTab] = useState<'products' | 'api' | 'info'>('products');
  const [demoInfo, setDemoInfo] = useState<any>(null);

  useEffect(() => {
    loadDemoInfo();
  }, []);

  const loadDemoInfo = async () => {
    try {
      const info = await aiClient.getDemoInfo();
      setDemoInfo(info);
    } catch (error) {
      console.error('Failed to load demo info:', error);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
  };

  const handleProductChange = () => {
    // Refresh data when products change
    loadDemoInfo();
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
                <h1 className="text-xl font-bold text-gray-900">AI Runtime Engine Demo</h1>
                <p className="text-sm text-gray-600">Pure zero-code application powered by AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                🚀 Live AI Engine
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                HuggingFace Powered
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - User Switcher */}
          <div className="lg:col-span-1">
            <UserSwitcher 
              currentRole={currentRole} 
              onRoleChange={handleRoleChange}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${ 
                      activeTab === 'products'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📦 Product Management
                  </button>
                  <button
                    onClick={() => setActiveTab('api')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'api'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🧪 API Tester
                  </button>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'info'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ℹ️ Demo Info
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'products' && (
                <ProductTable 
                  userRole={currentRole}
                  onProductChange={handleProductChange}
                />
              )}

              {activeTab === 'api' && (
                <APITester currentRole={currentRole} />
              )}

              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Revolutionary Concept */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-purple-800 mb-4">🚀 Revolutionary Concept</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-purple-700 mb-2">Traditional Development:</h3>
                        <div className="bg-white bg-opacity-50 p-3 rounded text-sm space-y-1">
                          <div>Requirements → Write Code</div>
                          <div>↓</div>
                          <div>Build → Deploy → Run</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-purple-700 mb-2">AI Runtime Engine:</h3>
                        <div className="bg-white bg-opacity-50 p-3 rounded text-sm space-y-1">
                          <div>Data + Policies → AI Engine</div>
                          <div>↓</div>
                          <div>Live Application (ZERO Code)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What Exists vs What Doesn't */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-3">✅ What Exists</h3>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 3 users in JSON file</li>
                        <li>• 15 products in JSON file</li>
                        <li>• 1 policy file with ALL rules</li>
                        <li>• 1 AI engine (the entire app)</li>
                        <li>• React UI that adapts to AI</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-red-800 mb-3">❌ What Doesn't Exist</h3>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• No controller classes</li>
                        <li>• No service classes</li>
                        <li>• No DTO classes</li>
                        <li>• No business logic code</li>
                        <li>• No hardcoded endpoints</li>
                      </ul>
                    </div>
                  </div>

                  {/* Demo Info from AI */}
                  {demoInfo && (
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="font-semibold mb-4">🤖 Live Demo Information (AI Generated)</h3>
                      <pre className="text-sm bg-gray-50 p-4 rounded overflow-x-auto custom-scrollbar">
                        {JSON.stringify(demoInfo, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Key Features */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold mb-4">🌟 Key Features Demonstrated</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">Zero-Code Backend</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Single catch-all endpoint</li>
                          <li>• AI handles ANY request path</li>
                          <li>• Dynamic response generation</li>
                          <li>• Policy-driven behavior</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Dynamic Frontend</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Role-based UI adaptation</li>
                          <li>• Real-time permission checks</li>
                          <li>• AI-enhanced responses</li>
                          <li>• Built-in API testing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Try It Yourself */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-800 mb-4">🎯 Try It Yourself</h3>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="font-medium mb-2">1. Switch User Roles</h4>
                        <p className="text-sm text-blue-700">
                          Use the left sidebar to switch between admin, manager, and viewer. 
                          Watch how the entire application adapts instantly.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">2. Test Product Management</h4>
                        <p className="text-sm text-blue-700">
                          Admin can add/delete products, manager can only add, viewer can only view.
                          All controlled by AI + policies, no hardcoded logic.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">3. Experiment with API Tester</h4>
                        <p className="text-sm text-blue-700">
                          Try any endpoint path. The AI intelligently handles unknown requests 
                          and provides different responses based on your role.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">4. Edit Policies</h4>
                        <p className="text-sm text-blue-700">
                          Modify <code className="bg-white px-1 rounded">backend/policies.yaml</code> 
                          and see application behavior change instantly without any code deployment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>🤖 Powered by AI Runtime Engine | 🚀 Zero hardcoded business logic | 🎯 Pure policy-driven application</p>
          </div>
        </div>
      </footer>
    </div>
  );
}