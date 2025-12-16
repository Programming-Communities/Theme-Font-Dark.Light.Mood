'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function PostDetailLoading() {
  const { themeColors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Featured Image Skeleton */}
        <div className="h-96 rounded-2xl overflow-hidden mb-8 animate-pulse"
             style={{ backgroundColor: themeColors.border + '40' }} />

        {/* Header Skeleton */}
        <div className="mb-8">
          {/* Categories Skeleton */}
          <div className="flex gap-2 mb-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-6 w-24 rounded-full animate-pulse"
                   style={{ backgroundColor: themeColors.border + '40' }} />
            ))}
          </div>

          {/* Title Skeleton */}
          <div className="space-y-3 mb-4">
            <div className="h-10 w-3/4 rounded animate-pulse"
                 style={{ backgroundColor: themeColors.border + '40' }} />
            <div className="h-10 w-1/2 rounded animate-pulse"
                 style={{ backgroundColor: themeColors.border + '40' }} />
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
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-4 w-full rounded animate-pulse"
                 style={{ 
                   backgroundColor: themeColors.border + (i % 3 === 0 ? '40' : '30'),
                   animationDelay: `${i * 50}ms`
                 }} />
          ))}
        </div>

        {/* Reactions Skeleton */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: themeColors.border }}>
          <div className="flex items-center gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-12 rounded-full animate-pulse"
                   style={{ backgroundColor: themeColors.border + '40' }} />
            ))}
          </div>
        </div>

        {/* Comments Skeleton */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: themeColors.border }}>
          <div className="h-6 w-32 rounded animate-pulse mb-6"
               style={{ backgroundColor: themeColors.border + '40' }} />
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg animate-pulse"
                   style={{ backgroundColor: themeColors.surface + '40' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="space-y-1">
                    <div className="h-3 w-24 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                    <div className="h-2 w-16 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="h-3 w-4/5 rounded"
                       style={{ backgroundColor: themeColors.border }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}