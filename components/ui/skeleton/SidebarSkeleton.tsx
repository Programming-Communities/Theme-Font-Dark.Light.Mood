import React from 'react';
import { cn } from '@/lib/utils';

export interface SidebarSkeletonProps {
  variant?: 'default' | 'compact' | 'floating';
  showSearch?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showRecentPosts?: boolean;
  showNewsletter?: boolean;
  showSocialLinks?: boolean;
  showAd?: boolean;
  categoriesCount?: number;
  tagsCount?: number;
  postsCount?: number;
  width?: string;
  position?: 'left' | 'right';
  sticky?: boolean;
  className?: string;
}

const SidebarSkeleton: React.FC<SidebarSkeletonProps> = ({
  variant = 'default',
  showSearch = true,
  showCategories = true,
  showTags = true,
  showRecentPosts = true,
  showNewsletter = true,
  showSocialLinks = false,
  showAd = true,
  categoriesCount = 5,
  tagsCount = 10,
  postsCount = 5,
  width = 'w-64',
  position = 'right',
  sticky = true,
  className,
}) => {
  const isCompact = variant === 'compact';
  const isFloating = variant === 'floating';

  const renderWidget = (title: string, content: React.ReactNode) => (
    <div className="animate-pulse mb-6 last:mb-0">
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4" />
      {content}
    </div>
  );

  const renderSearch = () => (
    <div className="mb-6">
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full" />
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-2">
      {Array.from({ length: categoriesCount }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-8" />
        </div>
      ))}
    </div>
  );

  const renderTags = () => (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: tagsCount }).map((_, i) => (
        <div
          key={i}
          className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full"
          style={{ width: `${Math.random() * 40 + 40}px` }}
        />
      ))}
    </div>
  );

  const renderRecentPosts = () => (
    <div className="space-y-4">
      {Array.from({ length: postsCount }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderNewsletter = () => (
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full" />
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full" />
    </div>
  );

  const renderSocialLinks = () => (
    <div className="flex gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
      ))}
    </div>
  );

  const renderAd = () => (
    <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
  );

  const sidebarContent = (
    <>
      {showSearch && renderSearch()}
      {showCategories && renderWidget('Categories', renderCategories())}
      {showRecentPosts && renderWidget('Recent Posts', renderRecentPosts())}
      {showTags && renderWidget('Popular Tags', renderTags())}
      {showNewsletter && renderWidget('Newsletter', renderNewsletter())}
      {showSocialLinks && renderWidget('Follow Us', renderSocialLinks())}
      {showAd && (
        <div className="mt-6">
          {renderAd()}
        </div>
      )}
    </>
  );

  if (isFloating) {
    return (
      <div
        className={cn(
          'fixed top-24 z-40',
          position === 'left' ? 'left-4' : 'right-4',
          width,
          className
        )}
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 animate-pulse">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        width,
        sticky && 'sticky top-24 self-start',
        className
      )}
    >
      <div className={cn(
        'space-y-6',
        isCompact && 'space-y-4'
      )}>
        {sidebarContent}
      </div>
    </aside>
  );
};

export interface DoubleSidebarSkeletonProps {
  leftProps?: SidebarSkeletonProps;
  rightProps?: SidebarSkeletonProps;
  contentWidth?: string;
  gap?: string;
  className?: string;
}

export const DoubleSidebarSkeleton: React.FC<DoubleSidebarSkeletonProps> = ({
  leftProps,
  rightProps,
  contentWidth = 'flex-1',
  gap = 'gap-8',
  className,
}) => {
  return (
    <div className={cn('flex', gap, className)}>
      <SidebarSkeleton
        position="left"
        variant="compact"
        {...leftProps}
      />
      <div className={cn(contentWidth, 'min-w-0')}>
        {/* Main content skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      <SidebarSkeleton
        position="right"
        {...rightProps}
      />
    </div>
  );
};

export default SidebarSkeleton;