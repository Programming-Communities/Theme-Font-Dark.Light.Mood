'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  disabled?: boolean;
  className?: string;
  pageSizeOptions?: number[];
  siblingCount?: number;
  boundaryCount?: number;
  simple?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  showSizeChanger = false,
  showQuickJumper = false,
  showTotal = false,
  showFirstLast = true,
  showPrevNext = true,
  disabled = false,
  className,
  pageSizeOptions = [10, 20, 50, 100],
  siblingCount = 1,
  boundaryCount = 1,
  simple = false,
}) => {
  if (totalPages <= 0) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || disabled) return;
    onPageChange(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value, 10);
    onPageSizeChange?.(size);
  };

  const handleQuickJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      const page = parseInt(input.value, 10);
      if (page >= 1 && page <= totalPages) {
        handlePageChange(page);
        input.value = '';
      }
    }
  };

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const totalNumbers = (siblingCount * 2) + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftBoundary = Math.max(2, currentPage - siblingCount);
    const rightBoundary = Math.min(totalPages - 1, currentPage + siblingCount);

    const shouldShowLeftDots = leftBoundary > 2;
    const shouldShowRightDots = rightBoundary < totalPages - 1;

    const pageNumbers: (number | string)[] = [1];

    if (shouldShowLeftDots) {
      pageNumbers.push('...');
    }

    for (let i = leftBoundary; i <= rightBoundary; i++) {
      pageNumbers.push(i);
    }

    if (shouldShowRightDots) {
      pageNumbers.push('...');
    }

    pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  if (simple) {
    return (
      <div className={cn('flex items-center justify-between', className)}>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    );
  }

  const renderTotal = () => {
    if (!showTotal || totalItems === undefined) return null;
    
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    
    return (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {start} to {end} of {totalItems.toLocaleString()} entries
      </div>
    );
  };

  const renderSizeChanger = () => {
    if (!showSizeChanger || !onPageSizeChange) return null;

    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          disabled={disabled}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
      </div>
    );
  };

  const renderQuickJumper = () => {
    if (!showQuickJumper) return null;

    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Go to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          onKeyDown={handleQuickJump}
          disabled={disabled}
          className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="Page"
        />
      </div>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {renderTotal()}
        <div className="flex items-center space-x-4">
          {renderSizeChanger()}
          {renderQuickJumper()}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <nav className="flex items-center space-x-1" aria-label="Pagination">
          {showFirstLast && (
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || disabled}
              className="inline-flex items-center p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            </button>
          )}

          {showPrevNext && (
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || disabled}
              className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-1">
            {pageNumbers.map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePageChange(pageNumber as number)}
                    disabled={disabled}
                    className={cn(
                      'inline-flex items-center justify-center min-w-[2.5rem] px-3 py-2 text-sm font-medium rounded-md border transition-colors',
                      currentPage === pageNumber
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="sm:hidden">
            <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
              {currentPage} of {totalPages}
            </span>
          </div>

          {showPrevNext && (
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || disabled}
              className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          )}

          {showFirstLast && (
            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || disabled}
              className="inline-flex items-center p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <ChevronDoubleRightIcon className="h-4 w-4" />
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  className,
}) => {
  if (!totalItems) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn('text-sm text-gray-600 dark:text-gray-400', className)}>
      Showing <span className="font-semibold">{start.toLocaleString()}</span> to{' '}
      <span className="font-semibold">{end.toLocaleString()}</span> of{' '}
      <span className="font-semibold">{totalItems.toLocaleString()}</span> results
      {totalPages > 1 && (
        <> (Page <span className="font-semibold">{currentPage}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>)</>
      )}
    </div>
  );
};

export default Pagination;