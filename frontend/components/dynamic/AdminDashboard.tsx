'use client';

import React from 'react';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  BarChart3,
  Shield
} from 'lucide-react';

interface AdminInsights {
  total_products: number;
  total_value: number;
  low_stock_count: number;
  categories_count: number;
  user_activity: number;
  system_health: string;
  recent_actions: string[];
  performance_metrics: {
    api_response_time: number;
    database_queries: number;
    cache_hit_rate: number;
  };
}

interface AdminDashboardProps {
  title: string;
  insights: AdminInsights;
  widgets: string[];
  userRole: string;
  theme: { color: string; style: string };
  onAction?: (action: string, data?: any) => void;
}

export function AdminDashboard({ 
  title, 
  insights, 
  widgets, 
  userRole, 
  theme, 
  onAction 
}: AdminDashboardProps) {
  const getThemeClasses = () => {
    const colorMap = {
      red: 'border-red-200 bg-red-50',
      green: 'border-green-200 bg-green-50',
      blue: 'border-blue-200 bg-blue-50',
      gray: 'border-gray-200 bg-gray-50'
    };
    return colorMap[theme.color as keyof typeof colorMap] || colorMap.blue;
  };

  const getWidgetIcon = (widget: string) => {
    switch (widget) {
      case 'total_products':
        return <Package className="w-6 h-6" />;
      case 'total_value':
        return <DollarSign className="w-6 h-6" />;
      case 'low_stock_alerts':
        return <AlertTriangle className="w-6 h-6" />;
      case 'user_activity':
        return <Users className="w-6 h-6" />;
      case 'system_health':
        return <Activity className="w-6 h-6" />;
      default:
        return <BarChart3 className="w-6 h-6" />;
    }
  };

  const getWidgetColor = (widget: string) => {
    switch (widget) {
      case 'total_products':
        return 'bg-blue-100 text-blue-700';
      case 'total_value':
        return 'bg-green-100 text-green-700';
      case 'low_stock_alerts':
        return 'bg-red-100 text-red-700';
      case 'user_activity':
        return 'bg-purple-100 text-purple-700';
      case 'system_health':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getWidgetValue = (widget: string) => {
    switch (widget) {
      case 'total_products':
        return insights.total_products?.toString() || '0';
      case 'total_value':
        return `$${insights.total_value?.toFixed(2) || '0.00'}`;
      case 'low_stock_alerts':
        return insights.low_stock_count?.toString() || '0';
      case 'user_activity':
        return insights.user_activity?.toString() || '0';
      case 'system_health':
        return insights.system_health || 'Good';
      default:
        return 'N/A';
    }
  };

  const getWidgetLabel = (widget: string) => {
    switch (widget) {
      case 'total_products':
        return 'Total Products';
      case 'total_value':
        return 'Inventory Value';
      case 'low_stock_alerts':
        return 'Low Stock';
      case 'user_activity':
        return 'Active Users';
      case 'system_health':
        return 'System Health';
      default:
        return widget.replace('_', ' ').toUpperCase();
    }
  };

  const getHealthStatus = (health: string) => {
    switch (health?.toLowerCase()) {
      case 'excellent':
        return { color: 'text-green-600', bg: 'bg-green-100' };
      case 'good':
        return { color: 'text-green-600', bg: 'bg-green-100' };
      case 'warning':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'critical':
        return { color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const healthStatus = getHealthStatus(insights.system_health);

  return (
    <div className={`bg-white rounded-lg shadow ${getThemeClasses()} border`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              AI-Generated for {userRole}
            </span>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${healthStatus.bg} ${healthStatus.color}`}>
              {insights.system_health}
            </div>
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {widgets.map((widget) => (
            <div key={widget} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${getWidgetColor(widget)}`}>
                  {getWidgetIcon(widget)}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {getWidgetValue(widget)}
                  </p>
                  <p className="text-sm text-gray-500">{getWidgetLabel(widget)}</p>
                </div>
              </div>
              
              {widget === 'low_stock_alerts' && insights.low_stock_count > 0 && (
                <div className="mt-2 text-xs text-red-600 font-medium">
                  ⚠️ Requires attention
                </div>
              )}
              
              {widget === 'total_value' && (
                <div className="mt-2 text-xs text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Inventory tracking
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      {insights.performance_metrics && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">System Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className="text-sm font-medium text-gray-900">
                  {insights.performance_metrics.api_response_time}ms
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-green-500" 
                  style={{ width: `${Math.min(100, (200 - insights.performance_metrics.api_response_time) / 2)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">DB Queries</span>
                <span className="text-sm font-medium text-gray-900">
                  {insights.performance_metrics.database_queries}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500" 
                  style={{ width: `${Math.min(100, insights.performance_metrics.database_queries * 5)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cache Hit Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {insights.performance_metrics.cache_hit_rate}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-purple-500" 
                  style={{ width: `${insights.performance_metrics.cache_hit_rate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Actions */}
      {insights.recent_actions && insights.recent_actions.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Recent System Activity</h3>
          <div className="space-y-2">
            {insights.recent_actions.slice(0, 5).map((action, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">AI Administrative Insights</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• System running at {insights.system_health} performance level</p>
          <p>• Managing {insights.total_products} products across {insights.categories_count} categories</p>
          <p>• {insights.user_activity} active user sessions</p>
          {insights.low_stock_count > 0 && (
            <p className="text-red-600">• ⚠️ {insights.low_stock_count} products require immediate restocking</p>
          )}
          <p>• API performance: {insights.performance_metrics?.api_response_time}ms average response time</p>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          🤖 Admin dashboard generated by AI • Real-time metrics • Role: {userRole}
        </p>
      </div>
    </div>
  );
}