'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWordPress } from '@/hooks/useWordPress';
import { useDevice } from '@/hooks/useDevice';
import { SkeletonCard } from '@/components/ui/skeletons/CardSkeleton';
import { Alert } from '@/components/ui/common/Alert';
import { Badge } from '@/components/ui/common/Badge';

interface RecentPostsSectionProps {
  limit?: number;
  category?: string;
  showCategory?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
  modified: string;
  featured_media?: {
    source_url: string;
    alt_text: string;
    caption: string;
  };
  author: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  reading_time?: number;
  comment_count: number;
}

export default function RecentPostsSection({
  limit = 6,
  category = '',
  showCategory = true,
  showAuthor = true,
  showDate = true,
}: RecentPostsSectionProps) {
  const { getRecentPosts, isLoading, error } = useWordPress();
  const { isMobile } = useDevice();
  const [posts, setPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getRecentPosts({
          per_page: limit,
          category,
          _embed: true,
        });
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch recent posts:', err);
      }
    };

    fetchPosts();
    setMounted(true);
  }, [getRecentPosts, limit, category]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (error) {
    return (
      <section className="py-8">
        <Alert
          type="error"
          title="Failed to Load Recent Posts"
          message="Unable to fetch recent posts from WordPress."
        />
      </section>
    );
  }

  if (isLoading || !mounted) {
    return (
      <section className="py-8">
        <div className="mb-6">
          <SkeletonCard className="h-8 w-48 mb-2" />
          <SkeletonCard className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <SkeletonCard key={index} className="h-64" />
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-8">
        <div className="text-center py-12 rounded-xl"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            No Recent Posts
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Check back soon for new content!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Recent Posts
          </h2>
          <p className="text-base md:text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            Latest articles and discussions from our community
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => {
            const readingTime = post.reading_time || calculateReadingTime(post.content);
            
            return (
              <article
                key={post.id}
                className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
                aria-labelledby={`post-title-${post.id}`}
              >
                {/* Featured Image */}
                {post.featured_media?.source_url && (
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <Image
                      src={post.featured_media.source_url}
                      alt={post.featured_media.alt_text || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={posts.indexOf(post) < 3}
                    />
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                      aria-hidden="true"
                    />
                    
                    {/* Category badge overlay */}
                    {showCategory && post.categories.length > 0 && (
                      <div className="absolute top-4 left-4">
                        <Badge
                          text={post.categories[0].name}
                          variant="primary"
                          size="sm"
                          className="backdrop-blur-sm"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="p-5 md:p-6">
                  {/* Date and reading time */}
                  {(showDate || readingTime) && (
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {showDate && (
                        <time
                          dateTime={post.date}
                          className="text-xs font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {formatDate(post.date)}
                        </time>
                      )}
                      
                      {readingTime && (
                        <>
                          <span 
                            className="text-xs"
                            style={{ color: 'var(--border)' }}
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <div className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <span>🕒</span>
                            <span>{readingTime} min read</span>
                          </div>
                        </>
                      )}
                      
                      {post.comment_count > 0 && (
                        <>
                          <span 
                            className="text-xs"
                            style={{ color: 'var(--border)' }}
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <div className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <span>💬</span>
                            <span>{post.comment_count}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    id={`post-title-${post.id}`}
                    className="text-lg md:text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Link 
                      href={`/posts/${post.slug}`}
                      className="hover:no-underline after:absolute after:inset-0"
                      aria-label={`Read more about ${post.title}`}
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p 
                    className="text-sm md:text-base mb-4 line-clamp-3"
                    style={{ color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />

                  {/* Author info */}
                  {showAuthor && post.author && (
                    <div className="flex items-center justify-between pt-4 border-t"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center gap-3">
                        {post.author.avatar_url ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={post.author.avatar_url}
                              alt={post.author.name}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                            style={{
                              backgroundColor: 'var(--primary)',
                              color: 'white',
                            }}
                          >
                            {post.author.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm font-medium"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {post.author.name}
                        </span>
                      </div>

                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-sm font-semibold transition-colors flex items-center gap-1"
                        style={{ color: 'var(--primary)' }}
                        aria-label={`Continue reading ${post.title}`}
                      >
                        Read More
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Hover effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${'var(--primary)'}15 0%, transparent 100%)`,
                  }}
                />
              </article>
            );
          })}
        </div>

        {/* View all link */}
        {posts.length >= limit && (
          <div className="mt-10 text-center">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:gap-3"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--primary)',
                border: '1px solid var(--border)',
              }}
              aria-label="View all recent posts"
            >
              View All Posts
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}