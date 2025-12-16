    'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { WordPressClient } from '@/lib/wordpress';
import { SearchResult, SearchFilters } from '@/types/wordpress';
import { useDebounce } from './useDebounce';
import { useDevice } from './useDevice';

const wordpressClient = new WordPressClient();
const RECENT_SEARCHES_KEY = 'communities_pk_recent_searches';
const MAX_RECENT_SEARCHES = 10;
const SEARCH_DELAY_MS = 300;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [totalResults, setTotalResults] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const device = useDevice();
  const debouncedQuery = useDebounce(query, SEARCH_DELAY_MS);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setTotalResults(0);
    }
  }, [debouncedQuery, filters]);

  // Load recent searches from localStorage
  const loadRecentSearches = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const searches = JSON.parse(stored);
        setRecentSearches(Array.isArray(searches) ? searches : []);
      }
    } catch (err) {
      console.error('Failed to load recent searches:', err);
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = useCallback((searchQuery: string) => {
    if (!searchQuery.trim() || typeof window === 'undefined') return;

    const trimmedQuery = searchQuery.trim();
    const updatedSearches = [
      trimmedQuery,
      ...recentSearches.filter(s => s.toLowerCase() !== trimmedQuery.toLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updatedSearches);

    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    } catch (err) {
      console.error('Failed to save recent searches:', err);
    }
  }, [recentSearches]);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.error('Failed to clear recent searches:', err);
    }
  }, []);

  // Get search suggestions
  const getSuggestions = useCallback(async (partialQuery: string) => {
    if (partialQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      // Get suggestions from WordPress
      const data = await wordpressClient.searchPosts(partialQuery, {
        perPage: 5,
        fields: ['title'],
      });

      // Extract titles as suggestions
      const newSuggestions = data.results
        .map(result => result.title)
        .filter((title, index, array) => 
          title && array.indexOf(title) === index
        )
        .slice(0, 5);

      // Add from recent searches
      const recentSuggestions = recentSearches
        .filter(search => 
          search.toLowerCase().includes(partialQuery.toLowerCase()) &&
          !newSuggestions.some(s => s.toLowerCase() === search.toLowerCase())
        )
        .slice(0, 3);

      setSuggestions([...newSuggestions, ...recentSuggestions]);
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      setSuggestions([]);
    }
  }, [recentSearches]);

  // Perform the actual search
  const performSearch = useCallback(async (searchQuery: string) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setIsSearching(true);
    setError(null);

    try {
      const searchParams = {
        ...filters,
        perPage: device.isMobile ? 10 : 20,
      };

      const data = await wordpressClient.searchPosts(
        searchQuery,
        searchParams,
        abortControllerRef.current.signal
      );

      setResults(data.results);
      setTotalResults(data.totalResults);
      
      // Save to recent searches
      saveToRecentSearches(searchQuery);
      
      // Track search event
      trackSearchEvent(searchQuery, data.totalResults);
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResults([]);
      setTotalResults(0);
      
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  }, [filters, device.isMobile, saveToRecentSearches]);

  // Update search query
  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    
    // Get suggestions for the new query
    if (newQuery.trim().length >= 2) {
      getSuggestions(newQuery);
    } else {
      setSuggestions([]);
    }
  }, [getSuggestions]);

  // Update search filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setTotalResults(0);
    setSuggestions([]);
    setError(null);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Perform a search with specific query
  const search = useCallback((searchQuery: string, searchFilters?: SearchFilters) => {
    setQuery(searchQuery);
    
    if (searchFilters) {
      setFilters(searchFilters);
    }
    
    // Trigger immediate search
    setTimeout(() => {
      performSearch(searchQuery);
    }, 0);
  }, [performSearch]);

  // Get search history statistics
  const getSearchStats = useCallback(() => {
    const today = new Date().toDateString();
    const searchesToday = recentSearches.filter(search => {
      // This would need proper date tracking in real implementation
      return true; // Simplified for now
    }).length;

    return {
      totalSearches: recentSearches.length,
      searchesToday,
      mostCommonSearch: recentSearches.length > 0 
        ? recentSearches.reduce((a, b, i, arr) => 
            arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
          )
        : null,
    };
  }, [recentSearches]);

  return {
    query,
    results,
    isSearching,
    error,
    filters,
    totalResults,
    suggestions,
    recentSearches,
    updateQuery,
    updateFilters,
    clearFilters,
    clearSearch,
    search,
    clearRecentSearches,
    getSearchStats,
    performSearch: () => performSearch(query),
  };
}

function trackSearchEvent(query: string, resultCount: number) {
  if (window.gtag) {
    window.gtag('event', 'search', {
      event_category: 'engagement',
      event_label: query,
      search_term: query,
      search_results: resultCount,
    });
  }
}

// Hook for search input with autocomplete
export function useSearchInput() {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const { query, suggestions, updateQuery, search } = useSearch();

  // Sync with main search query
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    updateQuery(value);
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
  }, [updateQuery]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else {
          search(inputValue);
          setShowSuggestions(false);
        }
        break;

      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, selectedSuggestionIndex, inputValue, search]);

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setInputValue(suggestion);
    search(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  }, [search]);

  const handleInputFocus = useCallback(() => {
    if (inputValue.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [inputValue, suggestions]);

  const handleInputBlur = useCallback(() => {
    // Delay hiding to allow click on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 200);
  }, []);

  return {
    inputValue,
    showSuggestions,
    suggestions,
    selectedSuggestionIndex,
    handleInputChange,
    handleKeyDown,
    handleSuggestionSelect,
    handleInputFocus,
    handleInputBlur,
    setShowSuggestions,
  };
}