// File 44: lib/utils/api.ts
/**
 * API utility functions for the English Communities PK platform
 */

import { APIResponse, APIError, RequestOptions, RequestConfig } from '@/types/api';

/**
 * Base API configuration
 */
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.communities.pk',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

/**
 * Create an API client with default configuration
 */
export function createAPIClient(config?: Partial<RequestConfig>) {
  const baseConfig: RequestConfig = {
    baseURL: config?.baseURL || API_CONFIG.baseURL,
    timeout: config?.timeout || API_CONFIG.timeout,
    headers: {
      ...API_CONFIG.defaultHeaders,
      ...config?.headers,
    },
  };

  return {
    /**
     * Make a GET request
     */
    async get<T = any>(
      url: string,
      options?: RequestOptions
    ): Promise<APIResponse<T>> {
      return makeRequest<T>('GET', url, undefined, { ...baseConfig, ...options });
    },

    /**
     * Make a POST request
     */
    async post<T = any>(
      url: string,
      data?: any,
      options?: RequestOptions
    ): Promise<APIResponse<T>> {
      return makeRequest<T>('POST', url, data, { ...baseConfig, ...options });
    },

    /**
     * Make a PUT request
     */
    async put<T = any>(
      url: string,
      data?: any,
      options?: RequestOptions
    ): Promise<APIResponse<T>> {
      return makeRequest<T>('PUT', url, data, { ...baseConfig, ...options });
    },

    /**
     * Make a PATCH request
     */
    async patch<T = any>(
      url: string,
      data?: any,
      options?: RequestOptions
    ): Promise<APIResponse<T>> {
      return makeRequest<T>('PATCH', url, data, { ...baseConfig, ...options });
    },

    /**
     * Make a DELETE request
     */
    async delete<T = any>(
      url: string,
      options?: RequestOptions
    ): Promise<APIResponse<T>> {
      return makeRequest<T>('DELETE', url, undefined, { ...baseConfig, ...options });
    },

    /**
     * Upload a file
     */
    async upload<T = any>(
      url: string,
      file: File,
      options?: RequestOptions
    ): Promise<APIResponse<T>> {
      const formData = new FormData();
      formData.append('file', file);

      return makeRequest<T>('POST', url, formData, {
        ...baseConfig,
        headers: {
          ...baseConfig.headers,
          'Content-Type': 'multipart/form-data',
        },
        ...options,
      });
    },

    /**
     * Set authentication token
     */
    setAuthToken(token: string): void {
      baseConfig.headers = {
        ...baseConfig.headers,
        'Authorization': `Bearer ${token}`,
      };
    },

    /**
     * Clear authentication token
     */
    clearAuthToken(): void {
      const { Authorization, ...headers } = baseConfig.headers;
      baseConfig.headers = headers as any;
    },
  };
}

/**
 * Make an HTTP request with retry logic
 */
async function makeRequest<T = any>(
  method: string,
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<APIResponse<T>> {
  const {
    baseURL = API_CONFIG.baseURL,
    timeout = API_CONFIG.timeout,
    headers = {},
    retryAttempts = API_CONFIG.retryAttempts,
    retryDelay = API_CONFIG.retryDelay,
    ...options
  } = config || {};

  let attempts = 0;
  let lastError: APIError | null = null;

  while (attempts <= retryAttempts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const requestUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
      
      const requestOptions: RequestInit = {
        method,
        headers: {
          ...headers,
        },
        signal: controller.signal,
        ...options,
      };

      // Add body for methods that support it
      if (data && !['GET', 'HEAD'].includes(method)) {
        if (data instanceof FormData) {
          // Don't set Content-Type for FormData, let browser set it
          delete (requestOptions.headers as any)['Content-Type'];
          requestOptions.body = data;
        } else {
          requestOptions.body = JSON.stringify(data);
        }
      }

      const response = await fetch(requestUrl, requestOptions);
      clearTimeout(timeoutId);

      const responseData = await parseResponse<T>(response);

      if (!response.ok) {
        throw createAPIError(response, responseData);
      }

      return {
        data: responseData,
        status: response.status,
        headers: response.headers,
        success: true,
      };
    } catch (error) {
      lastError = error instanceof APIError ? error : createAPIErrorFromError(error);
      
      // Don't retry for certain status codes
      if (shouldRetry(lastError.status)) {
        attempts++;
        if (attempts <= retryAttempts) {
          await delay(retryDelay * attempts); // Exponential backoff
          continue;
        }
      }

      throw lastError;
    }
  }

  throw lastError;
}

/**
 * Parse response based on content type
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null as any;
    }
  }

  if (contentType.includes('text/')) {
    return (await response.text()) as any;
  }

  if (contentType.includes('multipart/form-data')) {
    return (await response.formData()) as any;
  }

  if (contentType.includes('application/octet-stream')) {
    return (await response.blob()) as any;
  }

  // Fallback to text
  return (await response.text()) as any;
}

/**
 * Create an API error from response
 */
function createAPIError(response: Response, data?: any): APIError {
  const status = response.status;
  const statusText = response.statusText;

  let message = statusText;
  let code = 'UNKNOWN_ERROR';
  let details: any = null;

  if (data) {
    if (typeof data === 'object') {
      message = data.message || data.error || statusText;
      code = data.code || `HTTP_${status}`;
      details = data.details || data.errors || null;
    } else if (typeof data === 'string') {
      message = data;
      code = `HTTP_${status}`;
    }
  }

  return {
    name: 'APIError',
    message,
    status,
    code,
    details,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an API error from generic error
 */
function createAPIErrorFromError(error: any): APIError {
  if (error.name === 'AbortError') {
    return {
      name: 'APIError',
      message: 'Request timeout',
      status: 408,
      code: 'TIMEOUT',
      details: null,
      timestamp: new Date().toISOString(),
    };
  }

  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      name: 'APIError',
      message: 'Network error',
      status: 0,
      code: 'NETWORK_ERROR',
      details: error.message,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    name: 'APIError',
    message: error.message || 'Unknown error',
    status: 500,
    code: 'UNKNOWN_ERROR',
    details: error,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if request should be retried based on status code
 */
function shouldRetry(status?: number): boolean {
  if (!status) return true;

  // Retry on these status codes
  const retryStatusCodes = [408, 429, 500, 502, 503, 504];
  return retryStatusCodes.includes(status);
}

/**
 * Delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * WordPress REST API utilities
 */
export const wpAPI = {
  /**
   * Get posts from WordPress
   */
  async getPosts(options: {
    per_page?: number;
    page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}) {
    const params = new URLSearchParams();

    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.categories?.length) params.append('categories', options.categories.join(','));
    if (options.tags?.length) params.append('tags', options.tags.join(','));
    if (options.author) params.append('author', options.author.toString());
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);

    const queryString = params.toString();
    const url = `/wp-json/wp/v2/posts${queryString ? `?${queryString}` : ''}`;

    return makeRequest('GET', url);
  },

  /**
   * Get a single post by ID
   */
  async getPost(id: number | string) {
    return makeRequest('GET', `/wp-json/wp/v2/posts/${id}`);
  },

  /**
   * Get categories from WordPress
   */
  async getCategories(options: {
    per_page?: number;
    page?: number;
    search?: string;
    parent?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}) {
    const params = new URLSearchParams();

    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.parent) params.append('parent', options.parent.toString());
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);

    const queryString = params.toString();
    const url = `/wp-json/wp/v2/categories${queryString ? `?${queryString}` : ''}`;

    return makeRequest('GET', url);
  },

  /**
   * Get tags from WordPress
   */
  async getTags(options: {
    per_page?: number;
    page?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}) {
    const params = new URLSearchParams();

    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);

    const queryString = params.toString();
    const url = `/wp-json/wp/v2/tags${queryString ? `?${queryString}` : ''}`;

    return makeRequest('GET', url);
  },

  /**
   * Get media from WordPress
   */
  async getMedia(options: {
    per_page?: number;
    page?: number;
    search?: string;
    media_type?: string;
    mime_type?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}) {
    const params = new URLSearchParams();

    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.media_type) params.append('media_type', options.media_type);
    if (options.mime_type) params.append('mime_type', options.mime_type);
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);

    const queryString = params.toString();
    const url = `/wp-json/wp/v2/media${queryString ? `?${queryString}` : ''}`;

    return makeRequest('GET', url);
  },

  /**
   * Get users from WordPress
   */
  async getUsers(options: {
    per_page?: number;
    page?: number;
    search?: string;
    roles?: string[];
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}) {
    const params = new URLSearchParams();

    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.roles?.length) params.append('roles', options.roles.join(','));
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);

    const queryString = params.toString();
    const url = `/wp-json/wp/v2/users${queryString ? `?${queryString}` : ''}`;

    return makeRequest('GET', url);
  },

  /**
   * Get comments from WordPress
   */
  async getComments(options: {
    per_page?: number;
    page?: number;
    post?: number;
    parent?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}) {
    const params = new URLSearchParams();

    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.post) params.append('post', options.post.toString());
    if (options.parent) params.append('parent', options.parent.toString());
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);

    const queryString = params.toString();
    const url = `/wp-json/wp/v2/comments${queryString ? `?${queryString}` : ''}`;

    return makeRequest('GET', url);
  },

  /**
   * Create a comment
   */
  async createComment(data: {
    post: number;
    content: string;
    author_name?: string;
    author_email?: string;
    parent?: number;
  }) {
    return makeRequest('POST', '/wp-json/wp/v2/comments', data);
  },

  /**
   * WordPress JWT authentication
   */
  auth: {
    /**
     * Login with username/email and password
     */
    async login(credentials: { username: string; password: string }) {
      return makeRequest('POST', '/wp-json/jwt-auth/v1/token', credentials);
    },

    /**
     * Validate JWT token
     */
    async validate(token: string) {
      return makeRequest('POST', '/wp-json/jwt-auth/v1/token/validate', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    },

    /**
     * Refresh JWT token
     */
    async refresh(token: string) {
      return makeRequest('POST', '/wp-json/jwt-auth/v1/token/refresh', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    },
  },
};

/**
 * GraphQL client for WordPress
 */
export const graphqlClient = {
  async query<T = any>(query: string, variables?: Record<string, any>) {
    return makeRequest<T>('POST', '/graphql', {
      query,
      variables,
    });
  },

  async mutate<T = any>(mutation: string, variables?: Record<string, any>) {
    return makeRequest<T>('POST', '/graphql', {
      query: mutation,
      variables,
    });
  },
};

/**
 * Cache utilities for API responses
 */
export const cache = {
  storage: typeof window !== 'undefined' ? window.localStorage : null,
  prefix: 'api_cache_',

  set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    if (!this.storage) return;

    const item = {
      data,
      expiry: Date.now() + ttl,
    };

    try {
      this.storage.setItem(`${this.prefix}${key}`, JSON.stringify(item));
    } catch (error) {
      // Storage might be full, silently fail
    }
  },

  get(key: string): any | null {
    if (!this.storage) return null;

    try {
      const itemStr = this.storage.getItem(`${this.prefix}${key}`);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch {
      return null;
    }
  },

  remove(key: string): void {
    if (!this.storage) return;
    this.storage.removeItem(`${this.prefix}${key}`);
  },

  clear(): void {
    if (!this.storage) return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => this.storage.removeItem(key));
  },
};

/**
 * Rate limiting utilities
 */
export const rateLimit = {
  requests: new Map<string, { count: number; resetTime: number }>(),

  check(key: string, limit: number = 60, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count++;
    return true;
  },

  getRemaining(key: string, limit: number = 60): number {
    const record = this.requests.get(key);
    if (!record) return limit;
    return Math.max(0, limit - record.count);
  },

  getResetTime(key: string): number | null {
    const record = this.requests.get(key);
    return record ? record.resetTime : null;
  },

  clear(key: string): void {
    this.requests.delete(key);
  },

  clearAll(): void {
    this.requests.clear();
  },
};

/**
 * Create API hooks for React components
 */
export function createAPIHooks(apiClient: ReturnType<typeof createAPIClient>) {
  return {
    useQuery<T = any>(
      key: string,
      fetcher: () => Promise<T>,
      options: {
        enabled?: boolean;
        staleTime?: number;
        cacheTime?: number;
        retry?: boolean;
      } = {}
    ) {
      // This would be implemented in a React component
      // For now, return a simple wrapper
      return {
        data: null as T | null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => Promise.resolve(),
      };
    },

    useMutation<T = any, V = any>(
      mutator: (variables: V) => Promise<T>,
      options: {
        onSuccess?: (data: T, variables: V) => void;
        onError?: (error: APIError, variables: V) => void;
      } = {}
    ) {
      // This would be implemented in a React component
      return {
        mutate: async (variables: V) => {
          try {
            const result = await mutator(variables);
            options.onSuccess?.(result, variables);
            return result;
          } catch (error) {
            options.onError?.(error as APIError, variables);
            throw error;
          }
        },
        isLoading: false,
        isError: false,
        error: null,
      };
    },
  };
}

// Export default API client instance
export const api = createAPIClient();

// Export WordPress API instance
export const wordPressAPI = wpAPI;

// Export GraphQL client
export const graphql = graphqlClient;