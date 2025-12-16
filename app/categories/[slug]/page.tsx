import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { wordpressClient } from '@/lib/wordpress/client';
import CategoryDetailClient from './CategoryDetailClient';
import { Suspense } from 'react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const data = await wordpressClient.getCategoryBySlug(slug, 1);
    const category = data.category;
    
    if (!category) {
      return {
        title: 'Category Not Found - English Communities PK',
        description: 'The requested category could not be found.',
      };
    }
    
    return {
      title: `${category.name} - English Communities PK`,
      description: category.description || `Browse articles in ${category.name}`,
      keywords: [category.name, 'english learning', 'category'],
      openGraph: {
        type: 'website',
        title: `${category.name} - English Communities PK`,
        description: category.description || `Browse articles in ${category.name}`,
      },
    };
  } catch (error) {
    return {
      title: 'Category Not Found - English Communities PK',
      description: 'The requested category could not be found.',
    };
  }
}

export const revalidate = 3600;

async function getCategoryData(slug: string) {
  try {
    const data = await wordpressClient.getCategoryBySlug(slug, 12);
    
    if (!data.category) {
      notFound();
    }
    
    return {
      category: data.category,
      posts: data.category.posts?.nodes || [],
      pageInfo: data.category.posts?.pageInfo || {},
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    notFound();
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { category, posts, pageInfo } = await getCategoryData(slug);
  
  return (
    <Suspense fallback={<CategoryDetailLoading />}>
      <CategoryDetailClient 
        category={category} 
        initialPosts={posts}
        pageInfo={pageInfo}
      />
    </Suspense>
  );
}

function CategoryDetailLoading() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 rounded animate-pulse bg-border/40 mb-4" />
          <div className="h-4 w-96 rounded animate-pulse bg-border/30" />
        </div>
        
        {/* Posts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden animate-pulse bg-surface/40">
              <div className="h-48 bg-border/40" />
              <div className="p-4">
                <div className="h-4 w-20 rounded-full mb-3 bg-border/40" />
                <div className="h-5 w-full rounded mb-2 bg-border/40" />
                <div className="h-5 w-3/4 rounded mb-3 bg-border/40" />
                <div className="space-y-1.5 mb-4">
                  <div className="h-3 w-full rounded bg-border/40" />
                  <div className="h-3 w-5/6 rounded bg-border/40" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 rounded bg-border/40" />
                  <div className="h-3 w-10 rounded bg-border/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}