'use client';

import { useState, useEffect } from 'react';
import { UserContextResponse, aiClient, getThemeClasses, getButtonClasses } from '../lib/ai-client';

interface User {
  id: string;
  name: string;
  role: string;
  description: string;
}

const DEMO_USERS: User[] = [
  {
    id: 'admin',
    name: 'Admin User',
    role: 'admin',
    description: 'Full access (view, add, delete) + analytics'
  },
  {
    id: 'manager',
    name: 'Manager User', 
    role: 'manager',
    description: 'Limited access (view, add) + business insights'
  },
  {
    id: 'viewer',
    name: 'Viewer User',
    role: 'viewer', 
    description: 'Read-only access (view only)'
  }
];

interface UserSwitcherProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export default function UserSwitcher({ currentRole, onRoleChange }: UserSwitcherProps) {
  const [userContext, setUserContext] = useState<UserContextResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadUserContext();
  }, [currentRole]);

  const loadUserContext = async () => {
    try {
      setLoading(true);
      const context = await aiClient.getUserContext(currentRole);
      setUserContext(context);
    } catch (error) {
      console.error('Failed to load user context:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = (newRole: string) => {
    onRoleChange(newRole);
  };

  const currentUser = DEMO_USERS.find(user => user.role === currentRole);
  const otherUsers = DEMO_USERS.filter(user => user.role !== currentRole);

  return (
    <div className="space-y-4">
      {/* Current User Display */}
      <div className={`p-4 rounded-lg border ${getThemeClasses(userContext?.theme)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getButtonClasses(userContext?.theme).split(' ')[0]}`}>
              {currentUser?.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold">{currentUser?.name}</h3>
              <p className="text-sm opacity-75">{currentUser?.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`px-3 py-1 rounded text-sm ${getButtonClasses(userContext?.theme)}`}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* AI-Enhanced User Details */}
        {showDetails && userContext && (
          <div className="mt-4 pt-4 border-t border-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🔐 Permissions</h4>
                <ul className="space-y-1">
                  {userContext.permissions.map(permission => (
                    <li key={permission} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="capitalize">{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🎨 UI Elements</h4>
                <ul className="space-y-1">
                  {userContext.ui_elements.map(element => (
                    <li key={element} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="capitalize">{element.replace('_', ' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">⚡ Available Actions</h4>
                <ul className="space-y-1">
                  {userContext.available_actions.map(action => (
                    <li key={action} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">💡 AI Suggestions</h4>
                <ul className="space-y-1">
                  {userContext.ai_suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></span>
                      <span className="text-xs">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Enhancement */}
            {userContext.ai_enhancement && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-1">🤖 AI Enhancement</h4>
                <p className="text-sm text-purple-700">{userContext.ai_enhancement.insight}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Role Switcher */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Switch User Role</h3>
        <p className="text-sm text-gray-600 mb-4">
          Experience how the AI Runtime Engine adapts the entire application based on user role
        </p>
        
        <div className="space-y-2">
          {otherUsers.map(user => (
            <button
              key={user.role}
              onClick={() => handleRoleSwitch(user.role)}
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  user.role === 'admin' ? 'bg-red-500' : 
                  user.role === 'manager' ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Runtime Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="font-semibold text-indigo-800 mb-2">🚀 AI Runtime Magic</h3>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• Same backend, different UI per role</li>
          <li>• AI determines what you can see & do</li>
          <li>• Zero hardcoded business logic</li>
          <li>• Real-time policy interpretation</li>
        </ul>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading AI context...</span>
        </div>
      )}
    </div>
  );
}