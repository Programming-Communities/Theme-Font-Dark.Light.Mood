'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface PaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
  maxPagesToShow?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export interface PaginationReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  pages: number[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  getPageItems: <T>(items: T[]) => T[];
  getPageInfo: () => {
    from: number;
    to: number;
    total: number;
  };
}

export function usePagination(options: PaginationOptions): PaginationReturn {
  const {
    totalItems,
    itemsPerPage: initialItemsPerPage = 10,
    initialPage = 1,
    maxPagesToShow = 5,
    onPageChange,
    onItemsPerPageChange,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calculate derived values
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  // Generate page numbers with ellipsis
  const pages = useMemo(() => {
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxPagesToShow / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = Math.min(maxPagesToShow, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    const pages: number[] = [];
    
    // Always show first page
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Always show last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(-1); // -1 represents ellipsis
      }
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxPagesToShow]);

  // Validate and adjust current page when total pages changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Call onPageChange callback
  useEffect(() => {
    onPageChange?.(currentPage);
  }, [currentPage, onPageChange]);

  // Call onItemsPerPageChange callback
  useEffect(() => {
    onItemsPerPageChange?.(itemsPerPage);
  }, [itemsPerPage, onItemsPerPageChange]);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const updateItemsPerPage = useCallback((newItemsPerPage: number) => {
    const validItemsPerPage = Math.max(1, newItemsPerPage);
    setItemsPerPage(validItemsPerPage);
    
    // Recalculate current page to maintain position
    const newStartIndex = (currentPage - 1) * validItemsPerPage;
    const newCurrentPage = Math.floor(newStartIndex / validItemsPerPage) + 1;
    setCurrentPage(newCurrentPage);
  }, [currentPage]);

  const getPageItems = useCallback(<T>(items: T[]): T[] => {
    return items.slice(startIndex, endIndex);
  }, [startIndex, endIndex]);

  const getPageInfo = useCallback(() => ({
    from: totalItems > 0 ? startIndex + 1 : 0,
    to: endIndex,
    total: totalItems,
  }), [startIndex, endIndex, totalItems]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    startIndex,
    endIndex,
    hasPreviousPage,
    hasNextPage,
    pages,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setItemsPerPage: updateItemsPerPage,
    getPageItems,
    getPageInfo,
  };
}

export interface UseInfiniteScrollOptions<T> {
  items: T[];
  itemsPerPage?: number;
  threshold?: number;
  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function useInfiniteScroll<T>(options: UseInfiniteScrollOptions<T>) {
  const {
    items,
    itemsPerPage = 10,
    threshold = 100,
    onLoadMore,
    hasMore = true,
    isLoading = false,
  } = options;

  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);

  // Calculate visible items based on current page
  useEffect(() => {
    const endIndex = page * itemsPerPage;
    setVisibleItems(items.slice(0, endIndex));
  }, [items, page, itemsPerPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    if (onLoadMore) {
      await onLoadMore();
    }
    setPage(prev => prev + 1);
  }, [hasMore, isLoading, onLoadMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, loadMore, threshold]);

  const reset = useCallback(() => {
    setPage(1);
    setVisibleItems(items.slice(0, itemsPerPage));
  }, [items, itemsPerPage]);

  return {
    visibleItems,
    page,
    hasMore,
    isLoading,
    loadMore,
    reset,
  };
}

export interface UseURLPaginationOptions {
  pageParam?: string;
  itemsPerPageParam?: string;
  defaultItemsPerPage?: number;
  preserveParams?: boolean;
}

export function useURLPagination(
  options: UseURLPaginationOptions = {},
  paginationOptions: Omit<PaginationOptions, 'initialPage' | 'itemsPerPage'>
) {
  const {
    pageParam = 'page',
    itemsPerPageParam = 'per_page',
    defaultItemsPerPage = 10,
    preserveParams = true,
  } = options;

  // Get initial values from URL
  const getInitialValues = () => {
    if (typeof window === 'undefined') {
      return { page: 1, itemsPerPage: defaultItemsPerPage };
    }

    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get(pageParam) || '1', 10);
    const itemsPerPage = parseInt(params.get(itemsPerPageParam) || defaultItemsPerPage.toString(), 10);

    return {
      page: isNaN(page) || page < 1 ? 1 : page,
      itemsPerPage: isNaN(itemsPerPage) || itemsPerPage < 1 ? defaultItemsPerPage : itemsPerPage,
    };
  };

  const initialValues = getInitialValues();

  const pagination = usePagination({
    ...paginationOptions,
    initialPage: initialValues.page,
    itemsPerPage: initialValues.itemsPerPage,
  });

  // Update URL when pagination changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(preserveParams ? window.location.search : '');

    if (pagination.currentPage > 1) {
      params.set(pageParam, pagination.currentPage.toString());
    } else {
      params.delete(pageParam);
    }

    if (pagination.itemsPerPage !== defaultItemsPerPage) {
      params.set(itemsPerPageParam, pagination.itemsPerPage.toString());
    } else {
      params.delete(itemsPerPageParam);
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    
    // Use replaceState to update URL without reloading
    window.history.replaceState({}, '', newUrl);
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    pageParam,
    itemsPerPageParam,
    defaultItemsPerPage,
    preserveParams,
  ]);

  return pagination;
}

export interface PaginationControlsProps {
  pagination: PaginationReturn;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  className?: string;
}

export function usePaginationControls(props: PaginationControlsProps) {
  const {
    pagination,
    showFirstLast = true,
    showPrevNext = true,
    showPageNumbers = true,
    showItemsPerPage = true,
    itemsPerPageOptions = [10, 20, 50, 100],
    className = '',
  } = props;

  const pageInfo = pagination.getPageInfo();

  const controls = {
    canGoFirst: pagination.hasPreviousPage,
    canGoPrev: pagination.hasPreviousPage,
    canGoNext: pagination.hasNextPage,
    canGoLast: pagination.hasNextPage,
    pageNumbers: pagination.pages,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    itemsPerPage: pagination.itemsPerPage,
    pageInfo,
  };

  const handlers = {
    goToPage: pagination.goToPage,
    goToFirst: pagination.firstPage,
    goToPrev: pagination.previousPage,
    goToNext: pagination.nextPage,
    goToLast: pagination.lastPage,
    setItemsPerPage: pagination.setItemsPerPage,
  };

  const getControlProps = () => ({
    showFirstLast,
    showPrevNext,
    showPageNumbers,
    showItemsPerPage,
    itemsPerPageOptions,
    className,
  });

  return {
    controls,
    handlers,
    getControlProps,
  };
}