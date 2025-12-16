import { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';
import { wordpressClient } from '@/lib/wordpress/client';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Categories - English Communities PK',
  description: 'Browse all categories of English learning resources',
  keywords: ['categories', 'english learning', 'topics', 'resources'],
  openGraph: {
    type: 'website',
    title: 'Categories - English Communities PK',
    description: 'Browse all categories of English learning resources',
  },
};

export const revalidate = 3600; // Revalidate every hour

async function getCategories() {
  try {
    const data = await wordpressClient.getCategories();
    // Sort by count descending
    const sortedCategories = (data.categories?.nodes || [])
      .sort((a, b) => b.count - a.count);
    return sortedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <Suspense fallback={<CategoriesLoading />}>
      <CategoriesClient categories={categories} />
    </Suspense>
  );
}

function CategoriesLoading() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 rounded animate-pulse bg-border/40 mb-4" />
          <div className="h-4 w-96 rounded animate-pulse bg-border/30" />
        </div>
        
        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl animate-pulse bg-surface/40">
              <div className="h-12 w-12 rounded-lg mb-4 mx-auto bg-border/40" />
              <div className="h-4 w-3/4 mx-auto rounded mb-2 bg-border/40" />
              <div className="h-3 w-1/2 mx-auto rounded bg-border/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}