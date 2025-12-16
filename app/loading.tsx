// File 63: app/loading.tsx
/**
 * Global Loading Component - Shows loading state for pages
 */

import { FluidContainer } from '@/components/layout/FluidContainer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function Loading() {
  return (
    <FluidContainer>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header Skeleton */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SkeletonLoader className="w-32 h-8" />
                <div className="hidden md:flex gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonLoader key={i} className="w-16 h-4" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <SkeletonLoader className="w-24 h-8" />
                <SkeletonLoader className="w-10 h-10 rounded-full" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Loading */}
        <main className="flex-1">
          {/* Hero Section Skeleton */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <SkeletonLoader className="w-48 h-4 mx-auto mb-4" />
                <SkeletonLoader className="w-3/4 h-8 mx-auto mb-6" />
                <SkeletonLoader className="w-1/2 h-6 mx-auto mb-8" />
                <SkeletonLoader className="w-64 h-10 mx-auto" />
              </div>
            </div>
          </section>
          
          {/* Content Grid Skeleton */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {/* Filter Skeleton */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <SkeletonLoader className="w-48 h-6 mb-2" />
                  <SkeletonLoader className="w-32 h-4" />
                </div>
                <div className="flex gap-4">
                  <SkeletonLoader className="w-24 h-8" />
                  <SkeletonLoader className="w-24 h-8" />
                </div>
              </div>
              
              {/* Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-lg overflow-hidden">
                    {/* Image Skeleton */}
                    <SkeletonLoader className="w-full h-48" />
                    
                    {/* Content Skeleton */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <SkeletonLoader className="w-16 h-4" />
                        <SkeletonLoader className="w-16 h-4" />
                      </div>
                      
                      <SkeletonLoader className="w-3/4 h-5 mb-3" />
                      <SkeletonLoader className="w-full h-4 mb-2" />
                      <SkeletonLoader className="w-2/3 h-4 mb-4" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <SkeletonLoader className="w-8 h-8 rounded-full" />
                          <SkeletonLoader className="w-16 h-4" />
                        </div>
                        <SkeletonLoader className="w-16 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination Skeleton */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonLoader key={i} className="w-10 h-10" />
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* Sidebar Content Skeleton */}
          <section className="py-12 bg-card">
            <div className="container mx-auto px-4">
              <SkeletonLoader className="w-48 h-6 mx-auto mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonLoader key={i} className="w-full h-32" />
                ))}
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer Skeleton */}
        <footer className="border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <SkeletonLoader className="w-32 h-5 mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <SkeletonLoader key={j} className="w-24 h-3" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <SkeletonLoader className="w-48 h-4" />
                <div className="flex gap-4 mt-4 md:mt-0">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonLoader key={i} className="w-8 h-8 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Full Page Loading Overlay (Alternative) */}
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">
              Loading content...
            </p>
          </div>
        </div>
      </div>
    </FluidContainer>
  );
}

// Component-specific loading states
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );
}

export function CardLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg p-6">
          <SkeletonLoader className="w-3/4 h-5 mb-4" />
          <SkeletonLoader className="w-full h-4 mb-2" />
          <SkeletonLoader className="w-2/3 h-4 mb-4" />
          <SkeletonLoader className="w-1/2 h-8" />
        </div>
      ))}
    </div>
  );
}

export function ListLoading({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-lg">
          <SkeletonLoader className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <SkeletonLoader className="w-32 h-4 mb-2" />
            <SkeletonLoader className="w-48 h-3" />
          </div>
          <SkeletonLoader className="w-16 h-8" />
        </div>
      ))}
    </div>
  );
}

export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Header */}
      <div className="grid gap-4 p-4 border-b" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonLoader key={i} className="h-4" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="grid gap-4 p-4 border-b last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLoader key={colIndex} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FormLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <SkeletonLoader className="w-32 h-4 mb-2" />
          <SkeletonLoader className="w-full h-10" />
        </div>
      ))}
      <SkeletonLoader className="w-32 h-10 mx-auto" />
    </div>
  );
}

export function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <SkeletonLoader className="w-32 h-32 rounded-full" />
        <div className="flex-1">
          <SkeletonLoader className="w-48 h-8 mb-2" />
          <SkeletonLoader className="w-32 h-4 mb-4" />
          <SkeletonLoader className="w-64 h-6" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonLoader key={i} className="w-full h-20 rounded-lg" />
        ))}
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <SkeletonLoader key={i} className="w-full h-32 rounded-lg" />
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <SkeletonLoader key={i} className="w-full h-40 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}