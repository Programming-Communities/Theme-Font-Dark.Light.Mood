/**
 * TrendingSidebar Component
 * Displays trending posts from WordPress with real-time data
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWordPress } from '@/hooks/useWordPress';
import { formatDate } from '@/lib/utils/format';

interface TrendingPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featured_media: {
    source_url: string;
    alt_text: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  author: {
    name: string;
    slug: string;
  };
  views: number;
  comments_count: number;
}

const TrendingSidebar: React.FC = () => {
  const { data: posts, isLoading, error } = useWordPress('posts', {
    per_page: 5,
    orderby: 'views',
    order: 'desc',
    _embed: true,
  });

  const { data: trendingStats } = useWordPress('stats/trending');

  if (error) {
    return (
      <div className="trending-sidebar">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Failed to load trending posts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-sidebar">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
            Trending Now
          </h2>
          {trendingStats && (
            <div className="text-xs px-2 py-1 rounded-full" style={{ 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary)' 
            }}>
              {trendingStats.total_views.toLocaleString()} views today
            </div>
          )}
        </div>
        <p className="text-sm opacity-80" style={{ color: 'var(--text-secondary)' }}>
          Most popular posts in the last 24 hours
        </p>
      </div>

      {/* Trending Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton Loaders
          [...Array(5)].map((_, index) => (
            <div key={index} className="flex space-x-3 animate-pulse">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : posts?.length === 0 ? (
          <div className="text-center py-6">
            <p className="opacity-70" style={{ color: 'var(--text-secondary)' }}>
              No trending posts yet
            </p>
          </div>
        ) : (
          posts?.map((post: TrendingPost, index: number) => (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="trending-post block group p-3 rounded-lg transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-start space-x-3">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : index === 1
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        : index === 2
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    #{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:underline" style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </h3>
                  
                  {/* Meta Info */}
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <span className="text-xs opacity-70" style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(post.date)}
                    </span>
                    
                    {post.categories?.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                        backgroundColor: 'var(--primary-light)', 
                        color: 'var(--primary)' 
                      }}>
                        {post.categories[0].name}
                      </span>
                    )}
                    
                    <div className="flex items-center space-x-3 ml-auto">
                      <span className="flex items-center text-xs opacity-70" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {post.views?.toLocaleString() || '0'}
                      </span>
                      
                      <span className="flex items-center text-xs opacity-70" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        {post.comments_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* View All Link */}
      <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/trending"
          className="flex items-center justify-center text-sm font-medium transition-colors duration-200"
          style={{ color: 'var(--primary)' }}
        >
          View All Trending Posts
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      <style jsx>{`
        .trending-sidebar :global(.trending-post:hover) {
          transform: translateY(-2px);
          border-color: var(--primary-light);
        }
        
        .trending-sidebar :global(.line-clamp-2) {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TrendingSidebar;