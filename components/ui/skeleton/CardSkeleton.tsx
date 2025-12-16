import React from 'react';
import { cn } from '@/lib/utils';

export interface CardSkeletonProps {
  variant?: 'default' | 'compact' | 'featured' | 'horizontal';
  count?: number;
  showImage?: boolean;
  showCategory?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showExcerpt?: boolean;
  showTags?: boolean;
  showStats?: boolean;
  imageHeight?: string;
  className?: string;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  variant = 'default',
  count = 1,
  showImage = true,
  showCategory = true,
  showAuthor = true,
  showDate = true,
  showExcerpt = true,
  showTags = false,
  showStats = false,
  imageHeight = 'h-48',
  className,
}) => {
  const renderSkeletonCard = (key: number) => {
    const isHorizontal = variant === 'horizontal';
    const isCompact = variant === 'compact';
    const isFeatured = variant === 'featured';

    return (
      <div
        key={key}
        className={cn(
          'group animate-pulse',
          isHorizontal
            ? 'flex flex-col sm:flex-row gap-4'
            : 'flex flex-col',
          className
        )}
      >
        {showImage && (
          <div
            className={cn(
              'bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden',
              isHorizontal
                ? 'sm:w-48 sm:flex-shrink-0'
                : 'w-full',
              isFeatured ? 'h-64' : isCompact ? 'h-32' : imageHeight
            )}
          />
        )}

        <div
          className={cn(
            'flex-1',
            isHorizontal ? 'py-1' : 'pt-4'
          )}
        >
          {showCategory && (
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          )}

          <div className="space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>

          {showExcerpt && (
            <div className="mt-3 space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
            </div>
          )}

          {(showAuthor || showDate || showTags || showStats) && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {showAuthor && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                )}

                {showDate && (
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                )}
              </div>

              {showStats && (
                <div className="flex items-center gap-4">
                  <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              )}

              {showTags && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (count === 1) {
    return renderSkeletonCard(0);
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => renderSkeletonCard(index))}
    </div>
  );
};

export interface CardGridSkeletonProps {
  columns?: number;
  count?: number;
  gap?: string;
  className?: string;
  cardProps?: Omit<CardSkeletonProps, 'count' | 'className'>;
}

export const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({
  columns = 3,
  count = 6,
  gap = 'gap-6',
  className,
  cardProps,
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  return (
    <div className={cn('grid', gridClasses[columns as keyof typeof gridClasses], gap, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} {...cardProps} />
      ))}
    </div>
  );
};

export default CardSkeleton;