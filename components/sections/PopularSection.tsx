'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWordPress } from '@/hooks/useWordPress';
import { useDevice } from '@/hooks/useDevice';
import { SkeletonCard } from '@/components/ui/skeletons/CardSkeleton';
import { Alert } from '@/components/ui/common/Alert';
import { Badge } from '@/components/ui/common/Badge';
import { Tabs } from '@/components/ui/common/Tabs';

interface PopularPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement_score: number;
  featured_image?: string;
  category: string;
  author: string;
  date: string;
  reading_time: number;
}

type TimeRange = 'day' | 'week' | 'month' | 'all';

export default function PopularSection() {
  const { getPopularPosts, isLoading, error } = useWordPress();
  const { isMobile } = useDevice();
  const [posts, setPosts] = useState<PopularPost[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [mounted, setMounted] = useState(false);

  const timeRangeLabels = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    all: 'All Time',
  };

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const data = await getPopularPosts({
          time_range: timeRange,
          limit: isMobile ? 3 : 5,
        });
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch popular posts:', err);
      }
    };

    fetchPopularPosts();
    setMounted(true);
  }, [getPopularPosts, timeRange, isMobile]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getEngagementColor = (score: number): string => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    if (score >= 40) return 'var(--primary)';
    return 'var(--text-secondary)';
  };

  if (error) {
    return (
      <section className="py-8">
        <Alert
          type="error"
          title="Failed to Load Popular Posts"
          message="Unable to fetch popular posts data from WordPress."
        />
      </section>
    );
  }

  if (isLoading || !mounted) {
    return (
      <section className="py-8">
        <div className="mb-6">
          <SkeletonCard className="h-8 w-64 mb-2" />
          <SkeletonCard className="h-4 w-48" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} className="h-20" />
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
          <div className="text-4xl mb-4">🔥</div>
          <h3 className="text-xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            No Popular Posts Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Be the first to engage with our content!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Popular Now
            </h2>
            <p className="text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              Most engaging content from our community
            </p>
          </div>

          {/* Time Range Tabs */}
          <Tabs
            value={timeRange}
            onChange={(value) => setTimeRange(value as TimeRange)}
            tabs={Object.entries(timeRangeLabels).map(([value, label]) => ({
              value,
              label,
            }))}
            variant="underline"
            size="sm"
          />
        </div>

        {/* Popular Posts List */}
        <div className="space-y-3 md:space-y-4">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group relative overflow-hidden rounded-xl p-4 md:p-5 transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div
                    className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg font-bold text-lg ${
                      index < 3
                        ? 'text-white'
                        : 'text-current'
                    }`}
                    style={{
                      backgroundColor:
                        index === 0
                          ? 'var(--warning)'
                          : index === 1
                          ? 'var(--text-secondary)'
                          : index === 2
                          ? 'var(--primary)'
                          : 'var(--surface)',
                      border:
                        index >= 3
                          ? '2px solid var(--border)'
                          : 'none',
                    }}
                  >
                    #{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge
                      text={post.category}
                      variant="secondary"
                      size="sm"
                    />
                    
                    {/* Engagement Score */}
                    <div
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: `${getEngagementColor(post.engagement_score)}20`,
                        color: getEngagementColor(post.engagement_score),
                      }}
                    >
                      <span>🔥</span>
                      <span>{post.engagement_score}%</span>
                    </div>
                  </div>

                  <h3 className="text-base md:text-lg font-semibold mb-2 line-clamp-2">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:underline"
                      style={{ color: 'var(--text-primary)' }}
                      aria-label={`Read popular post: ${post.title}`}
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        👁️
                      </span>
                      <span className="text-xs md:text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {formatNumber(post.views)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        ❤️
                      </span>
                      <span className="text-xs md:text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {formatNumber(post.likes)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        💬
                      </span>
                      <span className="text-xs md:text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {formatNumber(post.comments)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        ↗️
                      </span>
                      <span className="text-xs md:text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {formatNumber(post.shares)}
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-1">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        🕒
                      </span>
                      <span className="text-xs md:text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {post.reading_time} min read
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xl" style={{ color: 'var(--primary)' }}>
                    →
                  </span>
                </div>
              </div>

              {/* Hover effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${'var(--primary)'}08 100%)`,
                }}
              />
            </article>
          ))}
        </div>

        {/* View more link */}
        <div className="mt-8 text-center">
          <Link
            href="/popular"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:gap-3"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--primary)',
              border: '1px solid var(--border)',
            }}
            aria-label="View all popular posts"
          >
            View All Popular Posts
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="mt-10 pt-8 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center"
            style={{ color: 'var(--text-primary)' }}
          >
            Community Engagement Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Views',
                value: posts.reduce((sum, post) => sum + post.views, 0),
                icon: '👁️',
              },
              {
                label: 'Total Likes',
                value: posts.reduce((sum, post) => sum + post.likes, 0),
                icon: '❤️',
              },
              {
                label: 'Total Comments',
                value: posts.reduce((sum, post) => sum + post.comments, 0),
                icon: '💬',
              },
              {
                label: 'Avg. Engagement',
                value: `${Math.round(
                  posts.reduce((sum, post) => sum + post.engagement_score, 0) / posts.length
                )}%`,
                icon: '🔥',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold mb-1"
                  style={{ color: 'var(--primary)' }}
                >
                  {formatNumber(stat.value)}
                </div>
                <div className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}