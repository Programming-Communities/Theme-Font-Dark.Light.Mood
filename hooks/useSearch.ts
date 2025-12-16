'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { useWordPress } from './useWordPress';

export interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  url: string;
  type: 'post' | 'page' | 'category' | 'tag' | 'user';
  date?: string;
  author?: string;
  image?: string;
  relevance?: number;
}

export interface SearchOptions {
  debounce?: number;
  minLength?: number;
  maxResults?: number;
  includeTypes?: SearchResult['type'][];
  searchIn?: ('title' | 'content' | 'excerpt' | 'author')[];
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultsCount: number;
}

export interface UseSearchReturn {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  history: SearchHistoryItem[];
  totalResults: number;
  hasMore: boolean;
  setQuery: (query: string) => void;
  clearSearch: () => void;
  loadMore: () => Promise<void>;
  clearHistory: () => void;
  removeFromHistory: (index: number) => void;
}

export function useSearch(options: SearchOptions = {}): UseSearchReturn {
  const {
    debounce: debounceTime = 300,
    minLength = 2,
    maxResults = 10,
    includeTypes = ['post', 'page'],
    searchIn = ['title', 'content', 'excerpt'],
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  
  const debouncedQuery = useDebounce(query, debounceTime);
  const { searchPosts, searchPages, searchCategories, searchTags, searchUsers } = useWordPress();
  const lastRequestId = useRef(0);

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Error parsing search history:', err);
      }
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((query: string, resultsCount: number) => {
    if (!query.trim() || resultsCount === 0) return;

    setHistory(prev => {
      const newHistory = [
        { query, timestamp: Date.now(), resultsCount },
        ...prev.filter(item => item.query.toLowerCase() !== query.toLowerCase())
      ].slice(0, 10); // Keep only last 10 searches
      return newHistory;
    });
  }, []);

  const performSearch = useCallback(async (
    searchQuery: string,
    pageNum: number = 1,
    isLoadMore: boolean = false
  ): Promise<{ results: SearchResult[]; total: number }> => {
    if (!searchQuery.trim() || searchQuery.length < minLength) {
      return { results: [], total: 0 };
    }

    const requestId = ++lastRequestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const promises: Promise<any[]>[] = [];
      const types: SearchResult['type'][] = [];

      // Prepare search promises based on included types
      if (includeTypes.includes('post')) {
        types.push('post');
        promises.push(searchPosts({
          search: searchQuery,
          per_page: maxResults,
          page: pageNum,
          search_columns: searchIn.includes('title') ? ['post_title'] : [],
        }));
      }

      if (includeTypes.includes('page')) {
        types.push('page');
        promises.push(searchPages({
          search: searchQuery,
          per_page: maxResults,
          page: pageNum,
        }));
      }

      if (includeTypes.includes('category')) {
        types.push('category');
        promises.push(searchCategories({
          search: searchQuery,
          per_page: maxResults,
          page: pageNum,
        }));
      }

      if (includeTypes.includes('tag')) {
        types.push('tag');
        promises.push(searchTags({
          search: searchQuery,
          per_page: maxResults,
          page: pageNum,
        }));
      }

      if (includeTypes.includes('user')) {
        types.push('user');
        promises.push(searchUsers({
          search: searchQuery,
          per_page: maxResults,
          page: pageNum,
          search_columns: searchIn.includes('author') ? ['display_name'] : [],
        }));
      }

      const allResults = await Promise.all(promises);
      
      // Check if this request is still valid
      if (requestId !== lastRequestId.current) {
        return { results: [], total: 0 };
      }

      // Combine and format results
      const formattedResults: SearchResult[] = [];
      allResults.forEach((typeResults, index) => {
        const type = types[index];
        typeResults.forEach((item: any) => {
          let relevance = 1;
          
          // Calculate relevance score based on match quality
          if (type === 'post' || type === 'page') {
            const titleMatch = item.title?.rendered?.toLowerCase().includes(searchQuery.toLowerCase());
            const contentMatch = item.content?.rendered?.toLowerCase().includes(searchQuery.toLowerCase());
            const excerptMatch = item.excerpt?.rendered?.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (titleMatch) relevance += 2;
            if (contentMatch) relevance += 1;
            if (excerptMatch) relevance += 1.5;
          }

          formattedResults.push({
            id: item.id,
            title: type === 'post' || type === 'page' 
              ? item.title?.rendered || 'Untitled'
              : type === 'category' || type === 'tag'
                ? item.name
                : item.name || item.display_name || 'Unknown',
            excerpt: type === 'post' || type === 'page'
              ? item.excerpt?.rendered || ''
              : type === 'category' || type === 'tag'
                ? item.description || ''
                : item.description || '',
            url: type === 'post' || type === 'page'
              ? item.slug
              : type === 'category'
                ? `/category/${item.slug}`
                : type === 'tag'
                  ? `/tag/${item.slug}`
                  : `/author/${item.slug}`,
            type,
            date: type === 'post' || type === 'page' ? item.date : undefined,
            author: type === 'post' ? item.author_name : undefined,
            image: type === 'post' || type === 'page' 
              ? item.featured_media_url || item.jetpack_featured_media_url
              : undefined,
            relevance,
          });
        });
      });

      // Sort by relevance
      formattedResults.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

      // Take only maxResults
      const finalResults = formattedResults.slice(0, maxResults);
      const total = formattedResults.length;

      if (!isLoadMore) {
        addToHistory(searchQuery, total);
      }

      return { results: finalResults, total };
    } catch (err) {
      if (requestId === lastRequestId.current) {
        setError(err instanceof Error ? err.message : 'Search failed');
      }
      return { results: [], total: 0 };
    } finally {
      if (requestId === lastRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [
    minLength,
    maxResults,
    includeTypes,
    searchIn,
    searchPosts,
    searchPages,
    searchCategories,
    searchTags,
    searchUsers,
    addToHistory,
  ]);

  // Perform search when query changes
  useEffect(() => {
    const search = async () => {
      if (debouncedQuery.length >= minLength) {
        const { results: newResults, total } = await performSearch(debouncedQuery, 1);
        setResults(newResults);
        setTotalResults(total);
        setPage(1);
      } else {
        setResults([]);
        setTotalResults(0);
      }
    };

    search();
  }, [debouncedQuery, minLength, performSearch]);

  const loadMore = useCallback(async () => {
    if (isLoading || results.length >= totalResults) return;

    const nextPage = page + 1;
    const { results: newResults } = await performSearch(query, nextPage, true);
    
    setResults(prev => [...prev, ...newResults]);
    setPage(nextPage);
  }, [isLoading, results.length, totalResults, page, query, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setPage(1);
    setTotalResults(0);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('searchHistory');
    }
  }, []);

  const removeFromHistory = useCallback((index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    history,
    totalResults,
    hasMore: results.length < totalResults,
    setQuery: updateQuery,
    clearSearch,
    loadMore,
    clearHistory,
    removeFromHistory,
  };
}

export interface SearchSuggestionsProps {
  query: string;
  maxSuggestions?: number;
  onSelect?: (suggestion: string) => void;
}

export function useSearchSuggestions(props: SearchSuggestionsProps) {
  const { query, maxSuggestions = 5, onSelect } = props;
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getPopularSearches, getRelatedTerms } = useWordPress();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Get suggestions from multiple sources
        const [popularSearches, relatedTerms] = await Promise.all([
          getPopularSearches(10),
          getRelatedTerms(query, 10),
        ]);

        // Combine and filter suggestions
        const allSuggestions = [
          ...popularSearches,
          ...relatedTerms,
        ]
          .filter(term => term.toLowerCase().includes(query.toLowerCase()))
          .filter((term, index, self) => self.indexOf(term) === index) // Remove duplicates
          .slice(0, maxSuggestions);

        setSuggestions(allSuggestions);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounceTimer);
  }, [query, maxSuggestions, getPopularSearches, getRelatedTerms]);

  const handleSelect = useCallback((suggestion: string) => {
    onSelect?.(suggestion);
  }, [onSelect]);

  return {
    suggestions,
    isLoading,
    handleSelect,
  };
}

export interface SearchFilters {
  categories?: number[];
  tags?: number[];
  authors?: number[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'relevance' | 'date' | 'title';
  order?: 'asc' | 'desc';
}

export function useAdvancedSearch(
  initialFilters: SearchFilters = {},
  options: SearchOptions = {}
) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const { query, results, isLoading, error, ...searchProps } = useSearch(options);

  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Apply filters to search results
  const filteredResults = results.filter(result => {
    // Apply category filter
    if (filters.categories?.length && result.type === 'post') {
      // This would require additional data fetching in real implementation
      return true;
    }

    // Apply tag filter
    if (filters.tags?.length && result.type === 'post') {
      // This would require additional data fetching in real implementation
      return true;
    }

    // Apply date range filter
    if (filters.dateRange && result.date) {
      const resultDate = new Date(result.date);
      if (
        resultDate < filters.dateRange.start ||
        resultDate > filters.dateRange.end
      ) {
        return false;
      }
    }

    return true;
  });

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (filters.sortBy === 'date') {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return filters.order === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (filters.sortBy === 'title') {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      const comparison = titleA.localeCompare(titleB);
      return filters.order === 'asc' ? comparison : -comparison;
    }

    // Default: relevance
    const relevanceA = a.relevance || 0;
    const relevanceB = b.relevance || 0;
    return filters.order === 'asc' ? relevanceA - relevanceB : relevanceB - relevanceA;
  });

  return {
    query: searchProps.query,
    results: sortedResults,
    isLoading,
    error,
    filters,
    updateFilter,
    clearFilters,
    ...searchProps,
  };
}