'use client';

import { useState } from 'react';
import { aiClient } from '../lib/ai-client';

interface APITestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error';
  response: any;
  timestamp: string;
}

interface APITesterProps {
  currentRole: string;
}

const PRESET_ENDPOINTS = [
  { path: '/api/products', method: 'GET', description: 'Get products (role-based)' },
  { path: '/api/user-context/admin', method: 'GET', description: 'Get admin context' },
  { path: '/api/user-context/manager', method: 'GET', description: 'Get manager context' },
  { path: '/api/user-context/viewer', method: 'GET', description: 'Get viewer context' },
  { path: '/api/demo-info', method: 'GET', description: 'Demo information' },
  { path: '/', method: 'GET', description: 'Health check' },
  { path: '/unknown/endpoint', method: 'GET', description: 'Test AI unknown handling' },
  { path: '/completely/random/path', method: 'GET', description: 'Random path (AI magic!)' },
];

const SAMPLE_PRODUCT = {
  name: 'API Test Product',
  category: 'Electronics',
  price: 99.99,
  stock: 25
};

export default function APITester({ currentRole }: APITesterProps) {
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [customMethod, setCustomMethod] = useState('GET');
  const [customData, setCustomData] = useState('');
  const [results, setResults] = useState<APITestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (endpoint: string, method: string, status: 'success' | 'error', response: any) => {
    const result: APITestResult = {
      endpoint,
      method,
      status,
      response,
      timestamp: new Date().toISOString()
    };
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const testPresetEndpoint = async (path: string, method: string) => {
    setLoading(true);
    try {
      let response;
      
      if (method === 'POST' && path === '/api/products') {
        response = await aiClient.testArbitraryEndpoint(path, method, currentRole, SAMPLE_PRODUCT);
      } else {
        response = await aiClient.testArbitraryEndpoint(path, method, currentRole);
      }
      
      addResult(path, method, 'success', response);
    } catch (error) {
      addResult(path, method, 'error', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testCustomEndpoint = async () => {
    if (!customEndpoint.trim()) return;
    
    setLoading(true);
    try {
      let data = undefined;
      if (customData.trim() && (customMethod === 'POST' || customMethod === 'PUT' || customMethod === 'PATCH')) {
        try {
          data = JSON.parse(customData);
        } catch {
          throw new Error('Invalid JSON in request body');
        }
      }
      
      const response = await aiClient.testArbitraryEndpoint(customEndpoint, customMethod, currentRole, data);
      addResult(customEndpoint, customMethod, 'success', response);
    } catch (error) {
      addResult(customEndpoint, customMethod, 'error', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const formatJSON = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  return (
    <div className=\"space-y-6\">
      {/* Header */}
      <div className=\"bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4\">
        <h2 className=\"text-xl font-bold text-cyan-800 mb-2\">🧪 AI Runtime API Tester</h2>
        <p className=\"text-cyan-700 text-sm\">
          Test any endpoint and see how the AI Runtime Engine handles requests dynamically. 
          Current role: <span className=\"font-semibold\">{currentRole}</span>
        </p>
      </div>

      {/* Preset Endpoints */}
      <div className=\"bg-white rounded-lg shadow p-4\">
        <h3 className=\"font-semibold mb-3\">🎯 Preset Endpoints</h3>
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-3\">
          {PRESET_ENDPOINTS.map((endpoint, index) => (
            <button
              key={index}
              onClick={() => testPresetEndpoint(endpoint.path, endpoint.method)}
              disabled={loading}
              className=\"p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50\"
            >
              <div className=\"flex items-center justify-between\">
                <div>
                  <div className=\"font-mono text-sm text-blue-600\">{endpoint.method} {endpoint.path}</div>
                  <div className=\"text-xs text-gray-600\">{endpoint.description}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {endpoint.method}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Special Actions */}
        <div className=\"mt-4 pt-4 border-t\">
          <h4 className=\"font-medium mb-2\">Special Actions (Role-dependent)</h4>
          <div className=\"flex flex-wrap gap-2\">
            <button
              onClick={() => testPresetEndpoint('/api/products', 'POST')}
              disabled={loading}
              className=\"px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 disabled:opacity-50\"
            >
              POST Add Product
            </button>
            <button
              onClick={() => testPresetEndpoint('/api/products/p1', 'DELETE')}
              disabled={loading}
              className=\"px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 disabled:opacity-50\"
            >
              DELETE Product
            </button>
          </div>
        </div>
      </div>

      {/* Custom Endpoint Tester */}
      <div className=\"bg-white rounded-lg shadow p-4\">
        <h3 className=\"font-semibold mb-3\">🔧 Custom Endpoint Tester</h3>
        <div className=\"space-y-3\">
          <div className=\"flex space-x-2\">
            <select
              value={customMethod}
              onChange={(e) => setCustomMethod(e.target.value)}
              className=\"border rounded px-3 py-2\"
            >
              <option value=\"GET\">GET</option>
              <option value=\"POST\">POST</option>
              <option value=\"PUT\">PUT</option>
              <option value=\"DELETE\">DELETE</option>
              <option value=\"PATCH\">PATCH</option>
            </select>
            <input
              type=\"text\"
              placeholder=\"/your/custom/endpoint\"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              className=\"flex-1 border rounded px-3 py-2\"
            />
            <button
              onClick={testCustomEndpoint}
              disabled={loading || !customEndpoint.trim()}
              className=\"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50\"
            >
              Test
            </button>
          </div>

          {(customMethod === 'POST' || customMethod === 'PUT' || customMethod === 'PATCH') && (
            <textarea
              placeholder='Request body (JSON)&#10;Example:&#10;{&#10;  \"name\": \"Test Product\",&#10;  \"category\": \"Electronics\",&#10;  \"price\": 99.99,&#10;  \"stock\": 10&#10;}'
              value={customData}
              onChange={(e) => setCustomData(e.target.value)}
              className=\"w-full border rounded px-3 py-2 h-32 font-mono text-sm\"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className=\"bg-white rounded-lg shadow p-4\">
        <div className=\"flex items-center justify-between mb-3\">
          <h3 className=\"font-semibold\">📊 API Test Results</h3>
          <div className=\"flex space-x-2\">
            {loading && (
              <div className=\"flex items-center text-blue-600\">
                <div className=\"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2\"></div>
                Testing...
              </div>
            )}
            <button
              onClick={clearResults}
              className=\"px-3 py-1 text-sm text-gray-600 hover:text-gray-800\"
            >
              Clear
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <p className=\"text-gray-500 text-center py-8\">No API tests yet. Try testing an endpoint above!</p>
        ) : (
          <div className=\"space-y-3 max-h-96 overflow-y-auto\">
            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 ${
                  result.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className=\"flex items-center justify-between mb-2\">
                  <div className=\"flex items-center space-x-2\">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.method === 'GET' ? 'bg-green-100 text-green-800' :
                      result.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      result.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.method}
                    </span>
                    <span className=\"font-mono text-sm\">{result.endpoint}</span>
                  </div>
                  <div className=\"flex items-center space-x-2\">
                    <span className={`w-2 h-2 rounded-full ${
                      result.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className=\"text-xs text-gray-500\">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <pre className=\"text-xs bg-white p-2 rounded border overflow-x-auto\">
                  {formatJSON(result.response)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Info */}
      <div className=\"bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4\">
        <h3 className=\"font-semibold text-purple-800 mb-2\">🤖 AI Runtime Magic</h3>
        <ul className=\"text-sm text-purple-700 space-y-1\">
          <li>• AI handles ANY endpoint path dynamically</li>
          <li>• Same endpoint returns different data per role</li>
          <li>• Unknown paths get intelligent AI responses</li>
          <li>• Zero hardcoded endpoints in backend</li>
          <li>• Real HuggingFace AI enhances responses</li>
        </ul>
      </div>
    </div>
  );
}