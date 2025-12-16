'use client';

import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { WordPressAuth } from '@/lib/auth';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/user';

const AUTH_TOKEN_KEY = 'communities_pk_auth_token';
const REFRESH_TOKEN_KEY = 'communities_pk_refresh_token';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const authClient = new WordPressAuth();

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (storedToken) {
          // Validate token
          const isValid = await validateToken(storedToken);
          
          if (isValid) {
            setToken(storedToken);
            const decodedUser = decodeToken(storedToken);
            setUser(decodedUser);
          } else if (storedRefreshToken) {
            // Try to refresh token
            await refreshAuthToken();
          } else {
            // Clear invalid token
            clearAuth();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiry = () => {
      try {
        const decoded: any = jwtDecode(token);
        const expiryTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        // Refresh if token expires in less than 5 minutes
        if (timeUntilExpiry < 5 * 60 * 1000) {
          refreshAuthToken();
        }
      } catch (err) {
        console.error('Token expiry check error:', err);
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    checkTokenExpiry(); // Initial check

    return () => clearInterval(interval);
  }, [token]);

  const decodeToken = useCallback((tokenString: string): User | null => {
    try {
      const decoded: any = jwtDecode(tokenString);
      
      return {
        id: decoded.data?.user?.id || decoded.sub || '',
        username: decoded.data?.user?.username || decoded.username || '',
        email: decoded.data?.user?.email || decoded.email || '',
        firstName: decoded.data?.user?.firstName || decoded.firstName || '',
        lastName: decoded.data?.user?.lastName || decoded.lastName || '',
        displayName: decoded.data?.user?.displayName || decoded.displayName || '',
        roles: decoded.data?.user?.roles || decoded.roles || ['subscriber'],
        avatar: decoded.data?.user?.avatar || decoded.avatar || '',
        token: tokenString,
      };
    } catch (err) {
      console.error('Token decode error:', err);
      return null;
    }
  }, []);

  const validateToken = useCallback(async (tokenString: string): Promise<boolean> => {
    try {
      const decoded: any = jwtDecode(tokenString);
      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();

      // Check if token is expired
      if (expiryTime < currentTime) {
        return false;
      }

      // Optional: Validate with server
      try {
        await authClient.validateToken(tokenString);
        return true;
      } catch {
        // If server validation fails, still accept local validation for offline
        return expiryTime > currentTime;
      }
    } catch (err) {
      return false;
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authClient.login(credentials);
      
      if (response.token) {
        // Store tokens
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        if (response.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        }

        // Set state
        setToken(response.token);
        const decodedUser = decodeToken(response.token);
        setUser(decodedUser);

        // Track login event
        trackAuthEvent('login', 'success');
        
        return {
          success: true,
          user: decodedUser,
          message: 'Login successful',
        };
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      
      // Track failed login
      trackAuthEvent('login', 'failed', { error: errorMessage });
      
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [decodeToken]);

  const register = useCallback(async (userData: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authClient.register(userData);
      
      // Auto-login after registration
      if (response.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        setToken(response.token);
        const decodedUser = decodeToken(response.token);
        setUser(decodedUser);

        trackAuthEvent('register', 'success');
        
        return {
          success: true,
          user: decodedUser,
          message: 'Registration successful',
        };
      } else {
        // If no auto-login, prompt user to login
        return {
          success: true,
          message: 'Registration successful. Please login with your credentials.',
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      
      trackAuthEvent('register', 'failed', { error: errorMessage });
      
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [decodeToken]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      if (token) {
        await authClient.logout(token);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      trackAuthEvent('logout', 'success');
    }
  }, [token]);

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) return false;

    setIsRefreshing(true);
    
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const newToken = await authClient.refreshToken(refreshToken);
      
      if (newToken) {
        localStorage.setItem(AUTH_TOKEN_KEY, newToken);
        setToken(newToken);
        const decodedUser = decodeToken(newToken);
        setUser(decodedUser);
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Token refresh error:', err);
      clearAuth();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [decodeToken, isRefreshing]);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<User>): Promise<boolean> => {
    if (!token || !user) {
      setError('Authentication required');
      return false;
    }

    setIsLoading(true);

    try {
      const updatedUser = await authClient.updateProfile(user.id, profileData, token);
      
      setUser(updatedUser);
      setError(null);
      
      // Update token if new one provided
      if (updatedUser.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, updatedUser.token);
        setToken(updatedUser.token);
      }

      trackAuthEvent('profile_update', 'success');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      
      trackAuthEvent('profile_update', 'failed', { error: errorMessage });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      await authClient.resetPassword(email);
      setError(null);
      
      trackAuthEvent('password_reset', 'requested');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = useCallback((): boolean => {
    return !!user && !!token;
  }, [user, token]);

  const hasRole = useCallback((role: string): boolean => {
    return user?.roles?.includes(role) || false;
  }, [user]);

  return {
    user,
    token,
    isLoading,
    isRefreshing,
    error,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    refreshAuthToken,
    isAuthenticated,
    hasRole,
    clearError: () => setError(null),
  };
}

function trackAuthEvent(action: string, status: string, metadata?: any) {
  if (window.gtag) {
    window.gtag('event', 'auth', {
      event_category: 'authentication',
      event_label: `${action}_${status}`,
      ...metadata,
    });
  }
}