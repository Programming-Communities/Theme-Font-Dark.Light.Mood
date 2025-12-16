import React from 'react';
import { cn } from '@/lib/utils';

export interface GridSkeletonProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  rows?: number;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  itemHeight?: string;
  itemVariant?: 'card' | 'simple' | 'image' | 'text';
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
  itemClassName?: string;
}

const GridSkeleton: React.FC<GridSkeletonProps> = ({
  columns = 3,
  rows = 3,
  gap = 'md',
  itemHeight = 'h-32',
  itemVariant = 'simple',
  showHeader = false,
  showFooter = false,
  className,
  itemClassName,
}) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12',
  };

  const renderGridItem = (key: number) => {
    switch (itemVariant) {
      case 'card':
        return (
          <div
            key={key}
            className={cn(
              'animate-pulse rounded-lg border border-gray-200 dark:border-gray-800 p-4',
              itemHeight,
              itemClassName
            )}
          >
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
            </div>
          </div>
        );

      case 'image':
        return (
          <div
            key={key}
            className={cn(
              'animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800',
              itemHeight,
              itemClassName
            )}
          />
        );

      case 'text':
        return (
          <div
            key={key}
            className={cn(
              'animate-pulse space-y-2',
              itemClassName
            )}
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        );

      case 'simple':
      default:
        return (
          <div
            key={key}
            className={cn(
              'animate-pulse bg-gray-200 dark:bg-gray-800 rounded',
              itemHeight,
              itemClassName
            )}
          />
        );
    }
  };

  const totalItems = columns * rows;

  return (
    <div className={cn('space-y-6', className)}>
      {showHeader && (
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        </div>
      )}

      <div
        className={cn(
          'grid',
          gridColumns[columns],
          gapClasses[gap]
        )}
      >
        {Array.from({ length: totalItems }).map((_, index) => renderGridItem(index))}
      </div>

      {showFooter && (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        </div>
      )}
    </div>
  );
};

export interface MasonryGridSkeletonProps {
  columns?: 2 | 3 | 4 | 5;
  itemsPerColumn?: number;
  gap?: string;
  itemHeights?: string[];
  className?: string;
}

export const MasonryGridSkeleton: React.FC<MasonryGridSkeletonProps> = ({
  columns = 3,
  itemsPerColumn = 4,
  gap = 'gap-4',
  itemHeights = ['h-32', 'h-48', 'h-40', 'h-56'],
  className,
}) => {
  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };

  const getRandomHeight = () => {
    return itemHeights[Math.floor(Math.random() * itemHeights.length)];
  };

  return (
    <div className={cn('grid', gridColumns[columns], gap, className)}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div key={colIndex} className="space-y-4">
          {Array.from({ length: itemsPerColumn }).map((_, itemIndex) => (
            <div
              key={itemIndex}
              className={cn(
                'animate-pulse bg-gray-200 dark:bg-gray-800 rounded',
                getRandomHeight()
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GridSkeleton;