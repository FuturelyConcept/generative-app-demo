'use client';

import React from 'react';
import { BarChart3, TrendingUp, Package, AlertTriangle } from 'lucide-react';

interface CategoryData {
  name: string;
  product_count: number;
  total_inventory_value: number;
  low_stock_alerts: number;
  average_price: number;
}

interface CategoryAnalyticsProps {
  title: string;
  data: CategoryData[];
  metrics: string[];
  chartType: string;
  userRole: string;
  theme: { color: string; style: string };
  onAction?: (action: string, data?: any) => void;
}

export function CategoryAnalytics({ 
  title, 
  data, 
  metrics, 
  chartType, 
  userRole, 
  theme, 
  onAction 
}: CategoryAnalyticsProps) {
  const getThemeClasses = () => {
    const colorMap = {
      red: 'border-red-200 bg-red-50',
      green: 'border-green-200 bg-green-50',
      blue: 'border-blue-200 bg-blue-50',
      gray: 'border-gray-200 bg-gray-50'
    };
    return colorMap[theme.color as keyof typeof colorMap] || colorMap.blue;
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'product_count':
        return <Package className="w-5 h-5" />;
      case 'total_inventory_value':
        return <TrendingUp className="w-5 h-5" />;
      case 'low_stock_alerts':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'product_count':
        return 'bg-blue-100 text-blue-700';
      case 'total_inventory_value':
        return 'bg-green-100 text-green-700';
      case 'low_stock_alerts':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatValue = (value: number, metric: string) => {
    if (metric === 'total_inventory_value' || metric === 'average_price') {
      return `$${value.toFixed(2)}`;
    }
    return value.toString();
  };

  const getMetricValue = (category: CategoryData, metric: string) => {
    switch (metric) {
      case 'product_count':
        return category.product_count;
      case 'total_inventory_value':
        return category.total_inventory_value;
      case 'low_stock_alerts':
        return category.low_stock_alerts;
      default:
        return 0;
    }
  };

  const getTotalMetric = (metric: string) => {
    return data.reduce((sum, category) => sum + getMetricValue(category, metric), 0);
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'product_count':
        return 'Total Products';
      case 'total_inventory_value':
        return 'Total Value';
      case 'low_stock_alerts':
        return 'Low Stock Items';
      default:
        return metric.replace('_', ' ').toUpperCase();
    }
  };

  const maxValue = Math.max(...data.map(cat => 
    Math.max(...metrics.map(metric => getMetricValue(cat, metric)))
  ));

  return (
    <div className={`bg-white rounded-lg shadow ${getThemeClasses()} border`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              AI-Generated for {userRole}
            </span>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${getMetricColor(metric)}`}>
                  {getMetricIcon(metric)}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatValue(getTotalMetric(metric), metric)}
                  </p>
                  <p className="text-sm text-gray-500">{getMetricLabel(metric)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Category Breakdown</h3>
        
        <div className="space-y-4">
          {data.map((category) => (
            <div key={category.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <span className="text-sm text-gray-500">
                  {category.product_count} products
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.map((metric) => {
                  const value = getMetricValue(category, metric);
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  
                  return (
                    <div key={metric} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {getMetricLabel(metric)}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatValue(value, metric)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            metric === 'low_stock_alerts' 
                              ? 'bg-red-500' 
                              : metric === 'total_inventory_value'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">AI Insights</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• {data.length} categories analyzed</p>
          <p>• Total products: {getTotalMetric('product_count')}</p>
          <p>• Total inventory value: {formatValue(getTotalMetric('total_inventory_value'), 'total_inventory_value')}</p>
          {getTotalMetric('low_stock_alerts') > 0 && (
            <p className="text-red-600">• ⚠️ {getTotalMetric('low_stock_alerts')} items need restocking</p>
          )}
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          🤖 Dynamic analytics generated by AI • Chart: {chartType} • Role: {userRole}
        </p>
      </div>
    </div>
  );
}