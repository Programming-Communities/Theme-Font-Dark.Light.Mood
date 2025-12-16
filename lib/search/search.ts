import { wordpressClient } from '@/lib/wordpress/client';

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  type: 'post' | 'page';
  date: string;
  categories?: Array<{
    name: string;
    slug: string;
  }>;
  featuredImage?: {
    sourceUrl: string;
    altText: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  suggestions?: string[];
}

export class SearchManager {
  private cache: Map<string, SearchResponse> = new Map();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  async search(query: string, limit: number = 10): Promise<SearchResponse> {
    if (!query.trim()) {
      return { results: [], total: 0 };
    }

    // Check cache
    const cacheKey = `${query.toLowerCase()}-${limit}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - (cached as any).timestamp < this.cacheDuration) {
      return cached;
    }

    try {
      const searchQuery = `
        query SearchPosts($search: String!, $first: Int = 10) {
          posts(where: { search: $search }, first: $first) {
            nodes {
              id
              databaseId
              title
              slug
              excerpt
              date
              categories {
                nodes {
                  name
                  slug
                }
              }
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
          pages(where: { search: $search }, first: $first) {
            nodes {
              id
              databaseId
              title
              slug
              excerpt: content
              date
            }
          }
        }
      `;

      const data = await wordpressClient.query(searchQuery, { search: query, first: limit });

      const postResults: SearchResult[] = data.posts?.nodes?.map((post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        type: 'post' as const,
        date: post.date,
        categories: post.categories?.nodes?.map((cat: any) => ({
          name: cat.name,
          slug: cat.slug,
        })),
        featuredImage: post.featuredImage?.node ? {
          sourceUrl: post.featuredImage.node.sourceUrl,
          altText: post.featuredImage.node.altText,
        } : undefined,
      })) || [];

      const pageResults: SearchResult[] = data.pages?.nodes?.map((page: any) => ({
        id: page.id,
        title: page.title,
        excerpt: this.truncateText(page.excerpt || '', 150),
        slug: page.slug,
        type: 'page' as const,
        date: page.date,
      })) || [];

      const results = [...postResults, ...pageResults].slice(0, limit);
      
      // Generate suggestions
      const suggestions = this.generateSuggestions(query, results);

      const response: SearchResponse = {
        results,
        total: results.length,
        suggestions,
      };

      // Cache the result
      this.cache.set(cacheKey, {
        ...response,
        timestamp: Date.now(),
      } as any);

      return response;
    } catch (error) {
      console.error('Search error:', error);
      return { results: [], total: 0 };
    }
  }

  async searchByCategory(categorySlug: string, limit: number = 10): Promise<SearchResponse> {
    try {
      const query = `
        query SearchByCategory($categorySlug: String!, $first: Int = 10) {
          category(id: $categorySlug, idType: SLUG) {
            posts(first: $first) {
              nodes {
                id
                databaseId
                title
                slug
                excerpt
                date
                categories {
                  nodes {
                    name
                    slug
                  }
                }
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      `;

      const data = await wordpressClient.query(query, { categorySlug, first: limit });

      const results: SearchResult[] = data.category?.posts?.nodes?.map((post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        type: 'post' as const,
        date: post.date,
        categories: post.categories?.nodes?.map((cat: any) => ({
          name: cat.name,
          slug: cat.slug,
        })),
        featuredImage: post.featuredImage?.node ? {
          sourceUrl: post.featuredImage.node.sourceUrl,
          altText: post.featuredImage.node.altText,
        } : undefined,
      })) || [];

      return {
        results,
        total: results.length,
      };
    } catch (error) {
      console.error('Category search error:', error);
      return { results: [], total: 0 };
    }
  }

  async getPopularSearches(limit: number = 5): Promise<string[]> {
    // In a real app, this would come from your analytics
    // For now, return some common searches
    return [
      'english learning',
      'grammar tips',
      'vocabulary',
      'speaking practice',
      'writing skills',
    ].slice(0, limit);
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      // Get recent searches from localStorage
      const recentSearches = this.getRecentSearches();
      
      // Filter recent searches that match the query
      const matchingRecent = recentSearches
        .filter(search => search.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3);

      // Add some common suggestions
      const commonSuggestions = [
        `${query} tips`,
        `${query} tutorial`,
        `learn ${query}`,
        `${query} for beginners`,
      ];

      return [...new Set([...matchingRecent, ...commonSuggestions])].slice(0, 5);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  private generateSuggestions(query: string, results: SearchResult[]): string[] {
    const suggestions: string[] = [];
    
    // Extract categories from results
    const categories = new Set<string>();
    results.forEach(result => {
      result.categories?.forEach(cat => {
        categories.add(cat.name);
      });
    });
    
    // Add category-based suggestions
    categories.forEach(category => {
      suggestions.push(`${query} in ${category}`);
    });
    
    // Add related term suggestions
    const relatedTerms = this.getRelatedTerms(query);
    suggestions.push(...relatedTerms);
    
    return suggestions.slice(0, 5);
  }

  private getRelatedTerms(query: string): string[] {
    // Simple related terms mapping
    const termMap: Record<string, string[]> = {
      'english': ['grammar', 'vocabulary', 'speaking', 'writing', 'reading'],
      'learn': ['study', 'practice', 'master', 'understand'],
      'tips': ['tricks', 'advice', 'guidance', 'suggestions'],
      'beginner': ['starter', 'newbie', 'novice', 'entry-level'],
    };
    
    const terms: string[] = [];
    Object.keys(termMap).forEach(key => {
      if (query.toLowerCase().includes(key)) {
        terms.push(...termMap[key]);
      }
    });
    
    return [...new Set(terms)].slice(0, 3);
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    
    const cleanText = text.replace(/<[^>]*>/g, '');
    
    if (cleanText.length <= maxLength) return cleanText;
    
    return cleanText.substring(0, maxLength).trim() + '...';
  }

  // Recent searches management
  addRecentSearch(query: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const recentSearches = this.getRecentSearches();
      const filtered = recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 10);
      
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }

  getRecentSearches(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  clearRecentSearches(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('recent_searches');
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }
}

// Singleton instance
export const searchManager = new SearchManager();
