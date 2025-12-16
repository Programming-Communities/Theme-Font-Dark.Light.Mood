'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showNumbers?: boolean;
  showArrows?: boolean;
  siblingCount?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showNumbers = true,
  showArrows = true,
  siblingCount = 1,
  className = '',
}: PaginationProps) {
  const { themeColors } = useTheme();

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = () => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return range(1, totalPages);
  };

  const pages = paginationRange();

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`}
         aria-label="Pagination">
      {/* Previous Button */}
      {showArrows && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            backgroundColor: themeColors.surface,
            color: themeColors.text.primary,
            border: `1px solid ${themeColors.border}`,
          }}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Page Numbers */}
      {showNumbers && pages.map((pageNumber, index) => {
        if (pageNumber === '...') {
          return (
            <div key={`dots-${index}`} className="flex items-center justify-center w-10 h-10"
                 style={{ color: themeColors.text.secondary }}>
              <MoreHorizontal className="h-4 w-4" />
            </div>
          );
        }

        const page = pageNumber as number;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 ${
              isActive ? 'scale-105 shadow-md' : ''
            }`}
            style={{
              backgroundColor: isActive ? themeColors.primary : themeColors.surface,
              color: isActive ? themeColors.text.accent : themeColors.text.primary,
              border: `1px solid ${isActive ? themeColors.primary : themeColors.border}`,
            }}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      {showArrows && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            backgroundColor: themeColors.surface,
            color: themeColors.text.primary,
            border: `1px solid ${themeColors.border}`,
          }}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
}