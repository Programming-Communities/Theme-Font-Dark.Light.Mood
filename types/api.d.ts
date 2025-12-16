// File 53: types/api.d.ts
/**
 * API type definitions for English Communities PK
 */

declare global {
  namespace WordPress {
    // Base Types
    interface BaseEntity {
      id: number;
      date: string;
      date_gmt: string;
      modified: string;
      modified_gmt: string;
      slug: string;
      status: 'publish' | 'draft' | 'private' | 'trash';
      type: string;
      link: string;
      title: {
        rendered: string;
      };
      content: {
        rendered: string;
        protected: boolean;
      };
      excerpt: {
        rendered: string;
        protected: boolean;
      };
      _embedded?: Record<string, any>;
    }
    
    // Post Types
    interface Post extends BaseEntity {
      author: number;
      featured_media: number;
      comment_status: 'open' | 'closed';
      ping_status: 'open' | 'closed';
      format: 'standard' | 'aside' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio' | 'chat';
      meta: Record<string, any>;
      categories: number[];
      tags: number[];
      sticky: boolean;
      template: string;
      reading_time?: number;
      views?: number;
      likes?: number;
      bookmarks?: number;
    }
    
    // Page Types
    interface Page extends BaseEntity {
      author: number;
      featured_media: number;
      parent: number;
      menu_order: number;
      template: string;
      meta: Record<string, any>;
    }
    
    // Category Types
    interface Category {
      id: number;
      count: number;
      description: string;
      link: string;
      name: string;
      slug: string;
      taxonomy: 'category';
      parent: number;
      meta: Record<string, any>;
      yoast_title?: string;
      yoast_description?: string;
    }
    
    // Tag Types
    interface Tag {
      id: number;
      count: number;
      description: string;
      link: string;
      name: string;
      slug: string;
      taxonomy: 'tag';
      meta: Record<string, any>;
    }
    
    // Author Types
    interface Author {
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls: {
        24: string;
        48: string;
        96: string;
      };
      meta: Record<string, any>;
    }
    
    // Media Types
    interface Media {
      id: number;
      date: string;
      date_gmt: string;
      modified: string;
      modified_gmt: string;
      slug: string;
      status: string;
      type: string;
      link: string;
      title: {
        rendered: string;
      };
      author: number;
      comment_status: string;
      ping_status: string;
      template: string;
      meta: Record<string, any>;
      description: {
        rendered: string;
      };
      caption: {
        rendered: string;
      };
      alt_text: string;
      media_type: 'image' | 'video' | 'audio';
      mime_type: string;
      media_details: {
        width: number;
        height: number;
        file: string;
        sizes: Record<string, {
          file: string;
          width: number;
          height: number;
          mime_type: string;
          source_url: string;
        }>;
        image_meta: Record<string, any>;
      };
      post: number;
      source_url: string;
    }
    
    // Comment Types
    interface Comment {
      id: number;
      post: number;
      parent: number;
      author: number;
      author_name: string;
      author_email: string;
      author_url: string;
      author_avatar_urls: {
        24: string;
        48: string;
        96: string;
      };
      date: string;
      date_gmt: string;
      content: {
        rendered: string;
      };
      link: string;
      status: 'approved' | 'hold' | 'spam' | 'trash';
      type: string;
      meta: Record<string, any>;
      likes?: number;
      dislikes?: number;
    }
    
    // Search Results
    interface SearchResult {
      id: number;
      title: string;
      url: string;
      type: 'post' | 'page' | 'category' | 'tag' | 'author';
      excerpt: string;
      date: string;
      author?: string;
      category?: string;
      thumbnail?: string;
      score?: number;
    }
    
    // API Response Types
    interface ListResponse<T> {
      data: T[];
      total: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasMore: boolean;
    }
    
    interface SingleResponse<T> {
      data: T;
      related?: {
        posts?: Post[];
        categories?: Category[];
        tags?: Tag[];
      };
    }
    
    // GraphQL Types
    interface GraphQLRequest {
      query: string;
      variables?: Record<string, any>;
    }
    
    interface GraphQLResponse<T = any> {
      data?: T;
      errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
      }>;
    }
    
    // REST API Types
    interface RestRequest {
      endpoint: string;
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      params?: Record<string, any>;
      headers?: Record<string, string>;
      body?: any;
    }
    
    interface RestResponse<T = any> {
      status: number;
      data: T;
      headers: Record<string, string>;
      error?: string;
    }
    
    // Authentication Types
    interface AuthCredentials {
      username: string;
      password: string;
    }
    
    interface JWTToken {
      token: string;
      user_display_name: string;
      user_email: string;
      user_nicename: string;
    }
    
    interface UserSession {
      token: string;
      user: {
        id: number;
        username: string;
        email: string;
        name: string;
        roles: string[];
        capabilities: Record<string, boolean>;
      };
      expires_at: string;
    }
  }
  
  namespace API {
    // API Configuration
    interface APIConfig {
      baseURL: string;
      timeout: number;
      headers: Record<string, string>;
      retries: number;
      retryDelay: number;
    }
    
    // Request Options
    interface RequestOptions {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      params?: Record<string, any>;
      timeout?: number;
      retries?: number;
      cache?: boolean;
      cacheTTL?: number;
    }
    
    // Response Handler
    interface ResponseHandler<T = any> {
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
      onLoading?: (loading: boolean) => void;
    }
    
    // Query Parameters
    interface QueryParams {
      page?: number;
      per_page?: number;
      search?: string;
      categories?: number[];
      tags?: number[];
      author?: number;
      orderby?: 'date' | 'title' | 'modified' | 'comment_count' | 'views' | 'likes';
      order?: 'asc' | 'desc';
      after?: string;
      before?: string;
      include?: number[];
      exclude?: number[];
      slug?: string;
      status?: string;
      sticky?: boolean;
      featured?: boolean;
      meta_key?: string;
      meta_value?: string;
      meta_compare?: string;
    }
    
    // Cache Types
    interface CacheItem<T = any> {
      data: T;
      timestamp: number;
      expiresAt: number;
      etag?: string;
    }
    
    // WebSocket Types
    interface WebSocketMessage {
      type: 'notification' | 'update' | 'message' | 'error';
      data: any;
      timestamp: string;
    }
  }
}

export {};