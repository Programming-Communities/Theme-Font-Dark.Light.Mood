import { WORDPRESS_CONFIG } from '@/config/wordpress.config';

export class WordPressClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = WORDPRESS_CONFIG.url;
    this.timeout = WORDPRESS_CONFIG.apiTimeout;
  }

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${WORDPRESS_CONFIG.graphqlEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        throw new Error(data.errors[0]?.message || 'GraphQL query failed');
      }

      return data.data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout: WordPress server took too long to respond');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred while fetching data');
    }
  }

  // Helper methods for common queries
  async getPosts(first: number = 10, after?: string) {
    const { GET_POSTS } = await import('./queries');
    return this.query(GET_POSTS, { first, after });
  }

  async getPostBySlug(slug: string) {
    const { GET_POST_BY_SLUG } = await import('./queries');
    return this.query(GET_POST_BY_SLUG, { slug });
  }

  async getCategories() {
    const { GET_CATEGORIES } = await import('./queries');
    return this.query(GET_CATEGORIES);
  }

  async getCategoryBySlug(slug: string, first: number = 10, after?: string) {
    const { GET_CATEGORY_BY_SLUG } = await import('./queries');
    return this.query(GET_CATEGORY_BY_SLUG, { slug, first, after });
  }

  async getTags() {
    const { GET_TAGS } = await import('./queries');
    return this.query(GET_TAGS);
  }
}

// Singleton instance
export const wordpressClient = new WordPressClient();
