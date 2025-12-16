'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useDebounce } from '@/hooks/useDebounce';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  onSearchClick?: () => void;
  variant?: 'header' | 'expanded' | 'mobile';
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search articles, lessons, resources...',
  autoFocus = false,
  onSearchClick,
  variant = 'header'
}) => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popularSearches, setPopularSearches] = useState([
    'Grammar lessons',
    'Vocabulary builder',
    'Speaking practice',
    'IELTS preparation',
    'Business English',
    'Pronunciation guide'
  ]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce search query
  const debouncedQuery = useDebounce(query, 300);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          // Simulate API call - replace with actual search endpoint
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock suggestions based on query
          const mockSuggestions = [
            `${debouncedQuery} lessons`,
            `${debouncedQuery} exercises`,
            `${debouncedQuery} practice`,
            `Advanced ${debouncedQuery}`,
            `${debouncedQuery} for beginners`
          ];
          
          setSuggestions(mockSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      onSearchClick?.();
    }
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle popular search click
  const handlePopularSearchClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  // Clear search
  const handleClearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Focus input when component mounts
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div 
      ref={searchRef}
      className={`${styles.searchBar} ${styles[variant]} theme-${theme} ${isDarkMode ? 'dark' : 'light'}`}
    >
      <div className={styles.searchContainer}>
        {/* Search Icon */}
        <div className={styles.searchIcon} onClick={() => handleSearch()}>
          🔍
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label="Search"
        />

        {/* Clear Button */}
        {query && (
          <button 
            className={styles.clearButton}
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {/* Search Button (for mobile/expanded) */}
        {variant !== 'header' && (
          <button 
            className={styles.searchButton}
            onClick={() => handleSearch()}
            aria-label="Search"
          >
            Search
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (suggestions.length > 0 || popularSearches.length > 0) && (
        <div className={styles.suggestionsContainer}>
          {/* Recent/Popular Searches */}
          {query.length < 2 && popularSearches.length > 0 && (
            <div className={styles.suggestionsSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>🔥</span>
                <span className={styles.sectionTitle}>Popular Searches</span>
              </div>
              <div className={styles.popularSearches}>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className={styles.popularSearchItem}
                    onClick={() => handlePopularSearchClick(search)}
                  >
                    <span className={styles.searchIcon}>🔍</span>
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className={styles.suggestionsSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>💡</span>
                <span className={styles.sectionTitle}>Suggestions</span>
              </div>
              <div className={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className={styles.suggestionIcon}>🔍</span>
                    <span className={styles.suggestionText}>{suggestion}</span>
                    <span className={styles.suggestionAction}>Search</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Filters */}
          <div className={styles.suggestionsSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>⚡</span>
              <span className={styles.sectionTitle}>Quick Filters</span>
            </div>
            <div className={styles.quickFilters}>
              <button 
                className={styles.filterButton}
                onClick={() => handleSearch('grammar')}
              >
                Grammar
              </button>
              <button 
                className={styles.filterButton}
                onClick={() => handleSearch('vocabulary')}
              >
                Vocabulary
              </button>
              <button 
                className={styles.filterButton}
                onClick={() => handleSearch('speaking')}
              >
                Speaking
              </button>
              <button 
                className={styles.filterButton}
                onClick={() => handleSearch('writing')}
              >
                Writing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;