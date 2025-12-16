import React from 'react';
import { cn } from '@/lib/utils';

export interface ListSkeletonProps {
  variant?: 'default' | 'bullet' | 'number' | 'icon';
  count?: number;
  itemsPerRow?: number;
  showAvatar?: boolean;
  showMeta?: boolean;
  showDescription?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  className?: string;
  itemClassName?: string;
}

const ListSkeleton: React.FC<ListSkeletonProps> = ({
  variant = 'default',
  count = 5,
  itemsPerRow = 1,
  showAvatar = false,
  showMeta = false,
  showDescription = true,
  avatarSize = 'md',
  bordered = false,
  className,
  itemClassName,
}) => {
  const avatarSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const renderListItem = (index: number) => {
    const isNumbered = variant === 'number';
    const hasIcon = variant === 'icon';

    return (
      <div
        key={index}
        className={cn(
          'flex items-start gap-3 animate-pulse',
          bordered && 'p-4 border border-gray-200 dark:border-gray-800 rounded-lg',
          itemsPerRow > 1 && 'flex-col',
          itemClassName
        )}
      >
        {isNumbered && (
          <div className="flex-shrink-0 h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
        )}

        {hasIcon && (
          <div className="flex-shrink-0 h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded" />
        )}

        {showAvatar && (
          <div
            className={cn(
              'flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-800',
              avatarSizeClasses[avatarSize]
            )}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            {showMeta && (
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-20" />
            )}
          </div>

          {showDescription && (
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
            </div>
          )}

          {showMeta && !showDescription && (
            <div className="flex items-center gap-4 mt-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (itemsPerRow > 1) {
    return (
      <div className={cn('grid gap-4', className)} style={{
        gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`
      }}>
        {Array.from({ length: count }).map((_, index) => renderListItem(index))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => renderListItem(index))}
    </div>
  );
};

export interface ListGroupSkeletonProps {
  groups?: number;
  itemsPerGroup?: number;
  showGroupTitle?: boolean;
  className?: string;
  itemProps?: Omit<ListSkeletonProps, 'count' | 'className'>;
}

export const ListGroupSkeleton: React.FC<ListGroupSkeletonProps> = ({
  groups = 3,
  itemsPerGroup = 3,
  showGroupTitle = true,
  className,
  itemProps,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: groups }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-3">
          {showGroupTitle && (
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            </div>
          )}
          <ListSkeleton count={itemsPerGroup} {...itemProps} />
        </div>
      ))}
    </div>
  );
};

export default ListSkeleton;