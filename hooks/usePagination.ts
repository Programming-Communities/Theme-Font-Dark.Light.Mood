'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PaginationParams, PaginationResult } from '@/types/wordpress';

const DEFAULT_PER_PAGE = 10;
const MAX_PAGE_BUTTONS = 7;

export function usePagination(
  totalItems: number,
  initialPage: number = 1,
  itemsPerPage: number = DEFAULT_PER_PAGE
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(itemsPerPage);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  // Sync with URL search params
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const perPageParam = searchParams.get('per_page');

    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    }

    if (perPageParam) {
      const perPageValue = parseInt(perPageParam, 10);
      if (!isNaN(perPageValue) && perPageValue > 0) {
        setPerPage(perPageValue);
      }
    }
  }, [searchParams, totalPages]);

  // Update URL when pagination changes
  const updateURL = useCallback((page: number, perPageValue: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    
    if (perPageValue !== DEFAULT_PER_PAGE) {
      params.set('per_page', perPageValue.toString());
    } else {
      params.delete('per_page');
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Go to specific page
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    setCurrentPage(page);
    updateURL(page, perPage);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track page change
    trackPaginationEvent('page_change', { from: currentPage, to: page });
  }, [currentPage, totalPages, perPage, updateURL]);

  // Go to next page
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  // Go to previous page
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Go to first page
  const firstPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(1);
    }
  }, [currentPage, goToPage]);

  // Go to last page
  const lastPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(totalPages);
    }
  }, [currentPage, totalPages, goToPage]);

  // Change items per page
  const changePerPage = useCallback((newPerPage: number) => {
    if (newPerPage === perPage || newPerPage < 1) return;
    
    const newTotalPages = Math.max(1, Math.ceil(totalItems / newPerPage));
    const newCurrentPage = Math.min(currentPage, newTotalPages);
    
    setPerPage(newPerPage);
    setCurrentPage(newCurrentPage);
    updateURL(newCurrentPage, newPerPage);
    
    // Track per page change
    trackPaginationEvent('per_page_change', { 
      from: perPage, 
      to: newPerPage,
      totalPages: newTotalPages,
    });
  }, [perPage, currentPage, totalItems, updateURL]);

  // Get pagination buttons to display
  const getPaginationButtons = useCallback((): number[] => {
    const buttons: number[] = [];
    
    if (totalPages <= MAX_PAGE_BUTTONS) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      const leftBound = Math.max(2, currentPage - 2);
      const rightBound = Math.min(totalPages - 1, currentPage + 2);
      
      buttons.push(1);
      
      if (leftBound > 2) {
        buttons.push(-1); // -1 represents ellipsis
      }
      
      for (let i = leftBound; i <= rightBound; i++) {
        buttons.push(i);
      }
      
      if (rightBound < totalPages - 1) {
        buttons.push(-1); // -1 represents ellipsis
      }
      
      if (totalPages > 1) {
        buttons.push(totalPages);
      }
    }
    
    return buttons;
  }, [currentPage, totalPages]);

  // Get visible items range
  const getVisibleRange = useCallback(() => {
    const start = (currentPage - 1) * perPage + 1;
    const end = Math.min(currentPage * perPage, totalItems);
    
    return {
      start,
      end,
      total: totalItems,
      hasItems: totalItems > 0,
    };
  }, [currentPage, perPage, totalItems]);

  // Get pagination params for API calls
  const getPaginationParams = useCallback((): PaginationParams => {
    return {
      page: currentPage,
      perPage,
      offset: (currentPage - 1) * perPage,
    };
  }, [currentPage, perPage]);

  // Check if pagination is needed
  const isPaginationNeeded = totalItems > perPage;

  return {
    // State
    currentPage,
    totalPages,
    perPage,
    totalItems,
    
    // Actions
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changePerPage,
    
    // Helpers
    getPaginationButtons,
    getVisibleRange,
    getPaginationParams,
    isPaginationNeeded,
    
    // Status
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
    
    // For displaying
    visibleRange: getVisibleRange(),
    paginationButtons: getPaginationButtons(),
  };
}

// Hook for WordPress-specific pagination
export function useWordPressPagination(
  totalItems: number,
  initialPage: number = 1,
  itemsPerPage: number = DEFAULT_PER_PAGE
) {
  const pagination = usePagination(totalItems, initialPage, itemsPerPage);
  
  // WordPress-specific pagination logic
  const getWordPressPaginationParams = useCallback(() => {
    const params = pagination.getPaginationParams();
    
    return {
      page: params.page,
      per_page: params.perPage,
      offset: params.offset,
    };
  }, [pagination]);
  
  // Get pagination result for API response
  const getPaginationResult = useCallback((): PaginationResult => {
    return {
      page: pagination.currentPage,
      perPage: pagination.perPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
    };
  }, [pagination]);
  
  return {
    ...pagination,
    getWordPressPaginationParams,
    getPaginationResult,
  };
}

// Hook for infinite scroll pagination
export function useInfinitePagination(
  fetchMore: () => Promise<any>,
  hasMore: boolean,
  isLoading: boolean
) {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || isFetching) return;
    
    setIsFetching(true);
    setError(null);
    
    try {
      await fetchMore();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more');
    } finally {
      setIsFetching(false);
    }
  }, [hasMore, isLoading, isFetching, fetchMore]);
  
  // Auto-load when scrolling to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more when 80% scrolled
      if (scrollTop + windowHeight >= documentHeight * 0.8) {
        loadMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);
  
  return {
    loadMore,
    isFetching,
    error,
    hasMore,
  };
}

function trackPaginationEvent(action: string, data?: any) {
  if (window.gtag) {
    window.gtag('event', 'pagination', {
      event_category: 'navigation',
      event_label: action,
      ...data,
    });
  }
}