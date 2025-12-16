'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Search, Filter, Grid, List } from 'lucide-react';

export default function BlogLoading() {
  const { themeColors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      {/* Hero Section Skeleton */}
      <div className="py-12 px-4" style={{ backgroundColor: themeColors.surface }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-12 w-64 mx-auto rounded animate-pulse mb-4"
                 style={{ backgroundColor: themeColors.border + '40' }} />
            <div className="h-4 w-96 mx-auto rounded animate-pulse"
                 style={{ backgroundColor: themeColors.border + '40' }} />
          </div>

          {/* Search Bar Skeleton */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-14 rounded-xl animate-pulse"
                 style={{ backgroundColor: themeColors.border + '40' }} />
          </div>

          {/* Categories Skeleton */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 w-24 rounded-full animate-pulse"
                   style={{ backgroundColor: themeColors.border + '40' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* View Controls Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-4 w-32 rounded animate-pulse"
                 style={{ backgroundColor: themeColors.border + '40' }} />
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg animate-pulse"
                   style={{ backgroundColor: themeColors.border + '40' }} />
              <div className="h-10 w-10 rounded-lg animate-pulse"
                   style={{ backgroundColor: themeColors.border + '40' }} />
            </div>
          </div>

          {/* Featured Posts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                   style={{ backgroundColor: themeColors.surface + '40' }}>
                <div className="h-64" style={{ backgroundColor: themeColors.border }} />
                <div className="p-6">
                  <div className="h-6 w-32 rounded-full mb-4"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="h-8 w-full rounded mb-2"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="h-8 w-3/4 rounded mb-4"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="space-y-2 mb-4">
                    <div className="h-3 w-full rounded"
                         style={{ backgroundColor: themeColors.border }} />
                    <div className="h-3 w-4/5 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                    <div className="h-3 w-3/4 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                    <div className="h-4 w-16 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Regular Posts Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse"
                   style={{ backgroundColor: themeColors.surface + '40' }}>
                <div className="h-48" style={{ backgroundColor: themeColors.border }} />
                <div className="p-4">
                  <div className="h-4 w-20 rounded-full mb-3"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="h-5 w-full rounded mb-2"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="h-5 w-3/4 rounded mb-3"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="space-y-1.5 mb-4">
                    <div className="h-3 w-full rounded"
                         style={{ backgroundColor: themeColors.border }} />
                    <div className="h-3 w-5/6 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                    <div className="h-3 w-10 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}