/**
 * AI-Driven UI Client
 * Connects to the AI Runtime Engine to get both data AND UI instructions
 * This enables truly dynamic, policy-driven interface generation
 */

export interface AIUIResponse {
  data: any;
  ui_config: {
    layout: string;
    theme: {
      color: string;
      style: string;
      components: string[];
    };
    components: UIComponent[];
    navigation: NavigationItem[];
    permissions: string[];
    user_role: string;
  };
  metadata: {
    timestamp: string;
    generated_by: string;
    ai_reasoning?: string;
  };
}

export interface UIComponent {
  id: string;
  type: 'table' | 'form' | 'button' | 'card' | 'chart' | 'navigation' | 'dashboard' | 'analytics';
  props: Record<string, any>;
  data?: any;
  permissions?: string[];
  visible_to?: string[];
  position: {
    section: 'header' | 'sidebar' | 'main' | 'footer';
    order: number;
  };
}

export interface NavigationItem {
  label: string;
  endpoint: string;
  icon?: string;
  visible_to: string[];
  active?: boolean;
}

const API_BASE = 'http://localhost:8000';

export class AIUIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async makeAIUIRequest(path: string, userRole: string, options: RequestInit = {}): Promise<AIUIResponse> {
    const url = `${this.baseUrl}${path}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': userRole,
          'X-UI-Request': 'true', // Signal that we want UI instructions
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      // Transform traditional response to AI UI response format
      return this.transformToAIUIResponse(data, userRole, path);
    } catch (error) {
      console.error(`AI UI API Error:`, error);
      throw error;
    }
  }

  private transformToAIUIResponse(backendData: any, userRole: string, endpoint: string): AIUIResponse {
    // Extract UI configuration from backend response
    const permissions = backendData.permissions || [];
    const ui_elements = backendData.ui_elements || [];
    const theme = backendData.theme || { color: 'blue', style: 'minimal', components: [] };

    // Generate UI components based on the endpoint and user permissions
    const components: UIComponent[] = [];
    
    // Add navigation based on permissions
    const navigation: NavigationItem[] = [
      {
        label: '📦 Products',
        endpoint: '/api/products',
        visible_to: ['viewer', 'manager', 'admin'],
        active: endpoint.includes('products')
      }
    ];

    // Add categories navigation if user has permission
    if (permissions.includes('view_categories') || userRole === 'admin' || userRole === 'manager') {
      navigation.push({
        label: '📊 Categories',
        endpoint: '/api/categories',
        visible_to: ['manager', 'admin'],
        active: endpoint.includes('categories')
      });
    }

    // Generate components based on endpoint and data
    if (endpoint.includes('products') && backendData.products) {
      components.push({
        id: 'products-table',
        type: 'table',
        props: {
          title: 'Product Inventory',
          data: backendData.products,
          columns: ['name', 'category', 'price', 'stock'],
          actions: this.getTableActions(permissions)
        },
        data: backendData.products,
        permissions: ['view'],
        visible_to: ['viewer', 'manager', 'admin'],
        position: { section: 'main', order: 1 }
      });

      // Add form if user can add products
      if (permissions.includes('add')) {
        components.push({
          id: 'add-product-form',
          type: 'form',
          props: {
            title: 'Add New Product',
            fields: [
              { name: 'name', type: 'text', required: true, label: 'Product Name' },
              { name: 'category', type: 'select', required: true, label: 'Category', 
                options: ['Electronics', 'Furniture', 'Stationery'] },
              { name: 'price', type: 'number', required: true, label: 'Price', min: 0.01 },
              { name: 'stock', type: 'number', required: true, label: 'Stock', min: 0 }
            ],
            submitEndpoint: '/api/products',
            submitMethod: 'POST'
          },
          permissions: ['add'],
          visible_to: ['manager', 'admin'],
          position: { section: 'main', order: 2 }
        });
      }
    }

    if (endpoint.includes('categories') && backendData.categories) {
      components.push({
        id: 'categories-analytics',
        type: 'analytics',
        props: {
          title: 'Category Analytics',
          data: backendData.categories,
          metrics: ['product_count', 'total_inventory_value', 'low_stock_alerts'],
          chartType: 'bar'
        },
        data: backendData.categories,
        permissions: ['view_categories'],
        visible_to: ['manager', 'admin'],
        position: { section: 'main', order: 1 }
      });
    }

    // Add admin dashboard components
    if (userRole === 'admin' && backendData.admin_insights) {
      components.push({
        id: 'admin-dashboard',
        type: 'dashboard',
        props: {
          title: 'Admin Dashboard',
          insights: backendData.admin_insights,
          widgets: ['total_products', 'total_value', 'low_stock_alerts']
        },
        data: backendData.admin_insights,
        permissions: ['admin'],
        visible_to: ['admin'],
        position: { section: 'main', order: 0 }
      });
    }

    return {
      data: backendData,
      ui_config: {
        layout: this.getLayoutForRole(userRole),
        theme: {
          color: theme.color || 'blue',
          style: theme.style || 'minimal',
          components: theme.components || []
        },
        components: components.filter(comp => 
          comp.visible_to?.includes(userRole) && 
          comp.permissions?.every(perm => permissions.includes(perm))
        ),
        navigation: navigation.filter(nav => nav.visible_to.includes(userRole)),
        permissions,
        user_role: userRole
      },
      metadata: {
        timestamp: backendData.timestamp || new Date().toISOString(),
        generated_by: backendData.generated_by || 'AI UI Runtime Engine',
        ai_reasoning: `Generated UI for ${userRole} role with permissions: ${permissions.join(', ')}`
      }
    };
  }

  private getTableActions(permissions: string[]): string[] {
    const actions = [];
    if (permissions.includes('view')) actions.push('view');
    if (permissions.includes('add')) actions.push('add');
    if (permissions.includes('delete')) actions.push('delete');
    if (permissions.includes('update')) actions.push('edit');
    return actions;
  }

  private getLayoutForRole(userRole: string): string {
    switch (userRole) {
      case 'admin': return 'admin-layout';
      case 'manager': return 'business-layout';
      case 'viewer': return 'minimal-layout';
      default: return 'default-layout';
    }
  }

  /**
   * Get AI-driven UI for products
   */
  async getProductsUI(userRole: string): Promise<AIUIResponse> {
    return this.makeAIUIRequest('/api/products', userRole);
  }

  /**
   * Get AI-driven UI for categories
   */
  async getCategoriesUI(userRole: string): Promise<AIUIResponse> {
    return this.makeAIUIRequest('/api/categories', userRole);
  }

  /**
   * Get AI-driven UI for user context
   */
  async getUserContextUI(userRole: string): Promise<AIUIResponse> {
    return this.makeAIUIRequest(`/api/user-context/${userRole}`, userRole);
  }

  /**
   * Get AI-driven UI for any endpoint
   */
  async getAIUI(endpoint: string, userRole: string, method: string = 'GET', data?: any): Promise<AIUIResponse> {
    const options: RequestInit = { method };
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = JSON.stringify(data);
    }
    return this.makeAIUIRequest(endpoint, userRole, options);
  }
}

// Export singleton instance
export const aiUIClient = new AIUIClient();