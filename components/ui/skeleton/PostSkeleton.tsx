'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface PostSkeletonProps {
  count?: number;
  variant?: 'card' | 'list' | 'detailed';
}

export default function PostSkeleton({ count = 1, variant = 'card' }: PostSkeletonProps) {
  const { themeColors } = useTheme();
  
  const SkeletonCard = () => (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="absolute inset-0 animate-pulse" 
             style={{ backgroundColor: themeColors.border + '40' }} />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6">
        {/* Category Skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-20 rounded-full animate-pulse" 
               style={{ backgroundColor: themeColors.border + '60' }} />
        </div>
        
        {/* Title Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-6 w-3/4 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '60' }} />
          <div className="h-6 w-1/2 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '60' }} />
        </div>
        
        {/* Excerpt Skeleton */}
        <div className="space-y-1.5 mb-4">
          <div className="h-3 w-full rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
          <div className="h-3 w-5/6 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
          <div className="h-3 w-4/6 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
        </div>
        
        {/* Meta Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="h-3 w-16 rounded animate-pulse" 
                   style={{ backgroundColor: themeColors.border + '40' }} />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-12 rounded animate-pulse" 
                   style={{ backgroundColor: themeColors.border + '40' }} />
            </div>
          </div>
          <div className="h-3 w-10 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
        </div>
      </div>
    </div>
  );
  
  const SkeletonList = () => (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="flex gap-4">
        {/* Image Skeleton */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
        </div>
        
        {/* Content Skeleton */}
        <div className="flex-1">
          {/* Category Skeleton */}
          <div className="h-4 w-16 rounded-full animate-pulse mb-2" 
               style={{ backgroundColor: themeColors.border + '40' }} />
          
          {/* Title Skeleton */}
          <div className="h-5 w-3/4 rounded animate-pulse mb-2" 
               style={{ backgroundColor: themeColors.border + '60' }} />
          
          {/* Excerpt Skeleton */}
          <div className="space-y-1 mb-2">
            <div className="h-3 w-full rounded animate-pulse" 
                 style={{ backgroundColor: themeColors.border + '40' }} />
            <div className="h-3 w-2/3 rounded animate-pulse" 
                 style={{ backgroundColor: themeColors.border + '40' }} />
          </div>
          
          {/* Meta Skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-20 rounded animate-pulse" 
                 style={{ backgroundColor: themeColors.border + '40' }} />
            <div className="h-3 w-16 rounded animate-pulse" 
                 style={{ backgroundColor: themeColors.border + '40' }} />
          </div>
        </div>
      </div>
    </div>
  );
  
  const SkeletonDetailed = () => (
    <div className="max-w-4xl mx-auto">
      {/* Featured Image Skeleton */}
      <div className="h-96 rounded-2xl overflow-hidden mb-8">
        <div className="h-full w-full animate-pulse" 
             style={{ backgroundColor: themeColors.border + '40' }} />
      </div>
      
      {/* Header Skeleton */}
      <div className="mb-8">
        {/* Category Skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-24 rounded-full animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
          <div className="h-6 w-20 rounded-full animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
        </div>
        
        {/* Title Skeleton */}
        <div className="space-y-3 mb-4">
          <div className="h-10 w-3/4 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '60' }} />
          <div className="h-10 w-1/2 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '60' }} />
        </div>
        
        {/* Meta Skeleton */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full animate-pulse" 
                 style={{ backgroundColor: themeColors.border + '40' }} />
            <div className="h-4 w-24 rounded animate-pulse" 
                 style={{ backgroundColor: themeColors.border + '40' }} />
          </div>
          <div className="h-4 w-32 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
          <div className="h-4 w-20 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 w-full rounded animate-pulse" 
               style={{ 
                 backgroundColor: themeColors.border + (i % 3 === 0 ? '40' : '30'),
                 animationDelay: `${i * 50}ms`
               }} />
        ))}
      </div>
    </div>
  );
  
  if (variant === 'list') {
    return (
      <div className="space-y-0">
        {[...Array(count)].map((_, i) => (
          <SkeletonList key={i} />
        ))}
      </div>
    );
  }
  
  if (variant === 'detailed') {
    return <SkeletonDetailed />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
