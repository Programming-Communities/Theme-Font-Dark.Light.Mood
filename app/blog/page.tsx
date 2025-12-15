import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { wordpressClient } from '@/lib/wordpress/client';
import { Suspense } from 'react';
import PostSkeleton from '@/components/ui/skeleton/PostSkeleton';

export const metadata: Metadata = {
  title: 'Blog - English Communities PK',
  description: 'Read the latest articles, tutorials, and community updates',
  keywords: ['blog', 'articles', 'tutorials', 'english learning', 'community'],
  openGraph: {
    type: 'website',
    title: 'Blog - English Communities PK',
    description: 'Read the latest articles, tutorials, and community updates',
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getPosts() {
  try {
    const data = await wordpressClient.getPosts(12);
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: { nodes: [], pageInfo: {} } };
  }
}

async function getCategories() {
  try {
    const data = await wordpressClient.getCategories();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: { nodes: [] } };
  }
}

export default async function BlogPage() {
  const [postsData, categoriesData] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);

  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogClient 
        initialPosts={postsData.posts.nodes}
        pageInfo={postsData.posts.pageInfo}
        categories={categoriesData.categories.nodes}
      />
    </Suspense>
  );
}

function BlogSkeleton() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 rounded animate-pulse bg-border/40 mb-4" />
          <div className="h-4 w-96 rounded animate-pulse bg-border/30" />
        </div>
        
        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full animate-pulse bg-border/30" />
          ))}
        </div>
        
        {/* Posts Grid Skeleton */}
        <PostSkeleton count={6} variant="card" />
      </div>
    </div>
  );
}
