import React from 'react';
import { cn } from '@/lib/utils';

export interface HeroSkeletonProps {
  variant?: 'default' | 'centered' | 'split' | 'with-image';
  size?: 'sm' | 'md' | 'lg' | 'full';
  showImage?: boolean;
  showCategory?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showButtons?: boolean;
  showStats?: boolean;
  showBreadcrumb?: boolean;
  imagePosition?: 'left' | 'right' | 'background';
  className?: string;
}

const HeroSkeleton: React.FC<HeroSkeletonProps> = ({
  variant = 'default',
  size = 'md',
  showImage = true,
  showCategory = true,
  showTitle = true,
  showDescription = true,
  showButtons = true,
  showStats = false,
  showBreadcrumb = false,
  imagePosition = 'background',
  className,
}) => {
  const isCentered = variant === 'centered';
  const isSplit = variant === 'split';
  const hasImage = variant === 'with-image' || showImage;

  const containerHeight = {
    sm: 'min-h-[30vh]',
    md: 'min-h-[50vh]',
    lg: 'min-h-[70vh]',
    full: 'min-h-screen',
  };

  const renderContent = () => (
    <div
      className={cn(
        'space-y-6 animate-pulse',
        isCentered && 'text-center mx-auto max-w-3xl',
        isSplit && 'lg:w-1/2'
      )}
    >
      {showBreadcrumb && (
        <div className="flex items-center gap-2 mb-6">
          <div className="h-3 bg-white/20 rounded w-16" />
          <div className="h-3 bg-white/20 rounded w-3" />
          <div className="h-3 bg-white/20 rounded w-20" />
          <div className="h-3 bg-white/20 rounded w-3" />
          <div className="h-3 bg-white/20 rounded w-24" />
        </div>
      )}

      {showCategory && (
        <div className="inline-block">
          <div className="h-6 bg-white/20 rounded-full w-32" />
        </div>
      )}

      {showTitle && (
        <div className="space-y-3">
          <div className="h-8 bg-white/30 rounded w-3/4 mx-auto" />
          <div className="h-8 bg-white/30 rounded w-1/2 mx-auto" />
        </div>
      )}

      {showDescription && (
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="h-4 bg-white/20 rounded w-full" />
          <div className="h-4 bg-white/20 rounded w-5/6 mx-auto" />
          <div className="h-4 bg-white/20 rounded w-4/6 mx-auto" />
        </div>
      )}

      {showButtons && (
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="h-10 bg-white/30 rounded w-32" />
          <div className="h-10 bg-transparent border border-white/30 rounded w-28" />
        </div>
      )}

      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="h-8 bg-white/20 rounded w-16 mx-auto mb-2" />
              <div className="h-3 bg-white/20 rounded w-24 mx-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderImage = () => {
    if (!hasImage) return null;

    return (
      <div
        className={cn(
          'animate-pulse bg-gray-800/50 rounded-lg overflow-hidden',
          imagePosition === 'background' 
            ? 'absolute inset-0 -z-10' 
            : isSplit 
              ? 'lg:w-1/2' 
              : 'w-full'
        )}
      >
        <div className="w-full h-full bg-gradient-to-r from-gray-800/30 to-gray-900/30" />
      </div>
    );
  };

  if (imagePosition === 'background') {
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800',
          containerHeight[size],
          className
        )}
      >
        {renderImage()}
        <div className="relative z-10 flex items-center">
          <div className="container mx-auto px-4 py-16">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  if (isSplit) {
    return (
      <div
        className={cn(
          'py-12 lg:py-16',
          containerHeight[size],
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {imagePosition === 'left' && renderImage()}
            {renderContent()}
            {imagePosition === 'right' && renderImage()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'py-12 lg:py-16',
        containerHeight[size],
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {renderContent()}
          {hasImage && imagePosition !== 'background' && (
            <div className="mt-8">
              {renderImage()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export interface HeroGridSkeletonProps {
  items?: number;
  columns?: number;
  variant?: 'card' | 'simple';
  className?: string;
}

export const HeroGridSkeleton: React.FC<HeroGridSkeletonProps> = ({
  items = 3,
  columns = 3,
  variant = 'card',
  className,
}) => {
  const gridColumns = {
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-3',
    4: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4',
  };

  const renderHeroItem = (index: number) => {
    if (variant === 'simple') {
      return (
        <div key={index} className="animate-pulse space-y-3">
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      );
    }

    return (
      <div
        key={index}
        className="animate-pulse relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 min-h-[300px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="h-5 bg-white/30 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/20 rounded w-1/2" />
        </div>
      </div>
    );
  };

  return (
    <div className={cn('grid gap-6', gridColumns[columns as keyof typeof gridColumns], className)}>
      {Array.from({ length: items }).map((_, index) => renderHeroItem(index))}
    </div>
  );
};

export default HeroSkeleton;