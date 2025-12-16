import { WORDPRESS_AUTH_CONFIG } from '@/config/wordpress-auth.config';
import { WORDPRESS_CONFIG } from '@/config/wordpress.config';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  roles: string[];
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

class JWTClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = WORDPRESS_CONFIG.url;
    this.token = this.getTokenFromStorage();
  }

  // ========== Token Management ==========
  private getTokenFromStorage(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Try cookies first
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === WORDPRESS_AUTH_CONFIG.cookieName) {
        return decodeURIComponent(value);
      }
    }
    
    // Fallback to localStorage
    return localStorage.getItem(WORDPRESS_AUTH_CONFIG.cookieName);
  }

  private setToken(token: string, remember: boolean = false): void {
    this.token = token;
    
    if (typeof window === 'undefined') return;
    
    // Set cookie
    const cookieOptions = WORDPRESS_AUTH_CONFIG.cookieOptions;
    const maxAge = remember ? cookieOptions.maxAge : undefined;
    
    document.cookie = `${WORDPRESS_AUTH_CONFIG.cookieName}=${encodeURIComponent(token)}; ${
      cookieOptions.httpOnly ? 'HttpOnly;' : ''
    } ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite}; ${
      maxAge ? `Max-Age=${maxAge};` : ''
    } Path=${cookieOptions.path}`;
    
    // Also store in localStorage for easier access (not httpOnly)
    if (remember) {
      localStorage.setItem(WORDPRESS_AUTH_CONFIG.cookieName, token);
    }
  }

  private removeToken(): void {
    this.token = null;
    
    if (typeof window === 'undefined') return;
    
    // Remove from cookie
    document.cookie = `${WORDPRESS_AUTH_CONFIG.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    // Remove from localStorage
    localStorage.removeItem(WORDPRESS_AUTH_CONFIG.cookieName);
  }

  // ========== API Methods ==========
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${WORDPRESS_AUTH_CONFIG.authEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        this.setToken(data.token, credentials.remember);
        
        // Get user data
        const userResponse = await this.getCurrentUser();
        
        return {
          success: true,
          token: data.token,
          user: userResponse.user,
        };
      }

      return {
        success: false,
        error: data.message || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // WordPress doesn't have a built-in registration endpoint via JWT
      // You'll need to use WordPress REST API or custom endpoint
      // This is a placeholder implementation
      
      const response = await fetch(`${this.baseUrl}/wp-json/wp/v2/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Auto-login after registration
      return await this.login({
        username: userData.username,
        password: userData.password,
      });
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    if (!this.token) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/wp-json/wp/v2/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        this.removeToken();
        throw new Error('Invalid token');
      }

      const userData = await response.json();

      const user: AuthUser = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        displayName: userData.name,
        roles: userData.roles || [],
        avatar: userData.avatar_urls?.['96'],
      };

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Get user error:', error);
      this.removeToken();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user',
      };
    }
  }

  async validateToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await fetch(`${this.baseUrl}${WORDPRESS_AUTH_CONFIG.tokenValidateEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  logout(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  // ========== GraphQL with Auth ==========
  async authQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
    if (!this.token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${this.baseUrl}${WORDPRESS_CONFIG.graphqlEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken();
        throw new Error('Authentication expired');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      throw new Error(data.errors[0]?.message || 'GraphQL query failed');
    }

    return data.data as T;
  }
}

// Singleton instance
export const jwtClient = new JWTClient();
