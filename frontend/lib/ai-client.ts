/**
 * AI Runtime Engine Client
 * Connects to the zero-code backend AI engine
 */

const API_BASE = 'http://localhost:8000';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AIResponse {
  [key: string]: any;
  generated_by?: string;
  ai_enhancement?: {
    insight: string;
    enhanced_by: string;
    context: string;
  };
  timestamp?: string;
}

export interface ProductsResponse extends AIResponse {
  products: Product[];
  user_role: string;
  permissions: string[];
  ui_elements: string[];
  theme?: {
    color: string;
    layout: string;
    style: string;
  };
  admin_insights?: {
    total_products: number;
    total_value: number;
    low_stock_alerts: Product[];
    categories: string[];
  };
  manager_insights?: {
    total_products: number;
    categories: string[];
    action_needed: boolean;
  };
}

export interface UserContextResponse extends AIResponse {
  user_role: string;
  user_data?: User;
  permissions: string[];
  ui_elements: string[];
  theme: {
    color: string;
    layout: string;
    style: string;
  };
  available_actions: string[];
  ai_suggestions: string[];
}

export class AIRuntimeClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest(path: string, options: RequestInit = {}, isUiRequest: boolean = false): Promise<any> {
    const url = `${this.baseUrl}${path}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (isUiRequest) {
      headers['X-UI-Request'] = 'true';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`AI Runtime API Error:`, error);
      throw error;
    }
  }

  /**
   * Get products with AI-driven role-based filtering
   */
  async getProducts(userRole: string): Promise<ProductsResponse> {
    return this.makeRequest('/api/products', {
      headers: {
        'X-User-Role': userRole,
      },
    }, true);
  }

  /**
   * Add new product (if user has permission)
   */
  async addProduct(userRole: string, product: Omit<Product, 'id'>): Promise<AIResponse> {
    return this.makeRequest('/api/products', {
      method: 'POST',
      headers: {
        'X-User-Role': userRole,
      },
      body: JSON.stringify(product),
    });
  }

  /**
   * Delete product (if user has permission)
   */
  async deleteProduct(userRole: string, productId: string): Promise<AIResponse> {
    return this.makeRequest(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'X-User-Role': userRole,
      },
    });
  }

  /**
   * Get user context and AI-determined capabilities
   */
  async getUserContext(userRole: string): Promise<UserContextResponse> {
    return this.makeRequest(`/api/user-context/${userRole}`);
  }

  /**
   * Get demo information
   */
  async getDemoInfo(): Promise<AIResponse> {
    return this.makeRequest('/api/demo-info');
  }

  /**
   * Test any arbitrary endpoint (demonstrates AI's dynamic handling)
   */
  async testArbitraryEndpoint(path: string, method: string = 'GET', userRole: string = 'viewer', data?: any, isUiRequest: boolean = false): Promise<AIResponse> {
    const options: RequestInit = {
      method,
      headers: {
        'X-User-Role': userRole,
      },
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    return this.makeRequest(path, options, isUiRequest);
  }

  /**
   * Get available menu items based on loaded policies
   */
  async getMenuItems(userRole: string): Promise<AIResponse> {
    return this.makeRequest('/api/menu-items', {
      method: 'GET',
      headers: {
        'X-User-Role': userRole
      }
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<AIResponse> {
    return this.makeRequest('/');
  }
}

// Export singleton instance
export const aiClient = new AIRuntimeClient();

// Theme utilities based on AI responses
export const getThemeClasses = (theme?: { color: string; layout: string; style: string }) => {
  if (!theme) return 'bg-gray-50 text-gray-900';

  const colorMap = {
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
    green: 'bg-green-50 text-green-900 border-green-200',
    red: 'bg-red-50 text-red-900 border-red-200',
    gray: 'bg-gray-50 text-gray-900 border-gray-200',
  };

  return colorMap[theme.color as keyof typeof colorMap] || colorMap.gray;
};

export const getButtonClasses = (theme?: { color: string }) => {
  if (!theme) return 'bg-gray-600 hover:bg-gray-700 text-white';

  const colorMap = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    gray: 'bg-gray-600 hover:bg-gray-700 text-white',
  };

  return colorMap[theme.color as keyof typeof colorMap] || colorMap.gray;
};