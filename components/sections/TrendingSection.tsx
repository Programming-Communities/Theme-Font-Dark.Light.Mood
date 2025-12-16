'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWordPress } from '@/hooks/useWordPress';
import { useDevice } from '@/hooks/useDevice';
import { SkeletonCard } from '@/components/ui/skeletons/CardSkeleton';
import { SkeletonGrid } from '@/components/ui/skeletons/GridSkeleton';
import { Alert } from '@/components/ui/common/Alert';
import { Badge } from '@/components/ui/common/Badge';

interface TrendingItem {
  id: number;
  type: 'post' | 'topic' | 'category' | 'tag';
  title: string;
  slug: string;
  description?: string;
  count: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
  featured_image?: string;
  color?: string;
  icon?: string;
}

type TrendingFilter = 'all' | 'posts' | 'topics' | 'categories' | 'tags';

export default function TrendingSection() {
  const { getTrendingData, isLoading, error } = useWordPress();
  const { isMobile } = useDevice();
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [filter, setFilter] = useState<TrendingFilter>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const data = await getTrendingData({
          filter,
          limit: isMobile ? 8 : 12,
        });
        setTrendingItems(data);
      } catch (err) {
        console.error('Failed to fetch trending data:', err);
      }
    };

    fetchTrendingData();
    setMounted(true);
  }, [getTrendingData, filter, isMobile]);

  const getTypeIcon = (type: TrendingItem['type']): string => {
    switch (type) {
      case 'post': return '📝';
      case 'topic': return '💬';
      case 'category': return '🏷️';
      case 'tag': return '🔖';
      default: return '📈';
    }
  };

  const getTypeLabel = (type: TrendingItem['type']): string => {
    switch (type) {
      case 'post': return 'Post';
      case 'topic': return 'Discussion';
      case 'category': return 'Category';
      case 'tag': return 'Tag';
      default: return 'Item';
    }
  };

  const getGrowthColor = (growth: number): string => {
    if (growth > 20) return 'var(--success)';
    if (growth > 0) return 'var(--warning)';
    if (growth < 0) return 'var(--error)';
    return 'var(--text-secondary)';
  };

  const getTrendIcon = (trend: TrendingItem['trend']): string => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  };

  const filters = [
    { value: 'all', label: 'All Trending' },
    { value: 'posts', label: 'Posts' },
    { value: 'topics', label: 'Discussions' },
    { value: 'categories', label: 'Categories' },
    { value: 'tags', label: 'Tags' },
  ] as const;

  if (error) {
    return (
      <section className="py-8">
        <Alert
          type="error"
          title="Failed to Load Trending Data"
          message="Unable to fetch trending data from WordPress."
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
        <SkeletonGrid columns={isMobile ? 2 : 4} count={8} />
      </section>
    );
  }

  if (trendingItems.length === 0) {
    return (
      <section className="py-8">
        <div className="text-center py-12 rounded-xl"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Nothing Trending Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Start engaging with content to see trending items!
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Trending Now
              </h2>
              <p className="text-base"
                style={{ color: 'var(--text-secondary)' }}
              >
                What's hot in the English learning community
              </p>
            </div>

            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--success)',
                border: '1px solid var(--border)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: 'var(--success)' }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: 'var(--success)' }}
                />
              </span>
              <span>Live Updates</span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filterItem) => (
              <button
                key={filterItem.value}
                onClick={() => setFilter(filterItem.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === filterItem.value
                    ? 'text-white'
                    : 'hover:shadow-md'
                }`}
                style={{
                  backgroundColor:
                    filter === filterItem.value
                      ? 'var(--primary)'
                      : 'var(--surface)',
                  color:
                    filter === filterItem.value
                      ? 'white'
                      : 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
                aria-label={`Filter by ${filterItem.label}`}
              >
                {filterItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {trendingItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              {/* Rank indicator */}
              <div className="absolute top-3 left-3 z-10">
                <div className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 2px 8px var(--shadow)',
                  }}
                >
                  #{index + 1}
                </div>
              </div>

              {/* Featured Image or Color Background */}
              {item.featured_image ? (
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={item.featured_image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <div
                  className="h-40 flex items-center justify-center"
                  style={{
                    backgroundColor: item.color || 'var(--primary)',
                    opacity: 0.9,
                  }}
                >
                  <span className="text-4xl">
                    {item.icon || getTypeIcon(item.type)}
                  </span>
                </div>
              )}

              <div className="p-4">
                {/* Type Badge */}
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    text={getTypeLabel(item.type)}
                    variant="secondary"
                    size="xs"
                    icon={getTypeIcon(item.type)}
                  />
                  
                  {/* Growth Indicator */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm"
                      style={{ color: getGrowthColor(item.growth) }}
                    >
                      {getTrendIcon(item.trend)}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        item.growth >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                      style={{ color: getGrowthColor(item.growth) }}
                    >
                      {item.growth > 0 ? '+' : ''}{item.growth}%
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold mb-2 line-clamp-2">
                  <Link
                    href={`/${item.type === 'post' ? 'posts' : item.type}s/${item.slug}`}
                    className="hover:underline"
                    style={{ color: 'var(--text-primary)' }}
                    aria-label={`View trending ${item.type}: ${item.title}`}
                  >
                    {item.title}
                  </Link>
                </h3>

                {/* Description */}
                {item.description && (
                  <p className="text-sm mb-3 line-clamp-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.description}
                  </p>
                )}

                {/* Engagement Count */}
                <div className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🔥</span>
                    <span className="text-xs font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.count.toLocaleString()} engagement
                      {item.count !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <Link
                    href={`/${item.type === 'post' ? 'posts' : item.type}s/${item.slug}`}
                    className="text-xs font-medium transition-colors flex items-center gap-1"
                    style={{ color: 'var(--primary)' }}
                    aria-label={`Explore ${item.title}`}
                  >
                    Explore
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                </div>
              </div>

              {/* Hover effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${item.color || 'var(--primary)'}10 0%, transparent 100%)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Time-based trends */}
        <div className="mt-12 pt-8 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <h3 className="text-lg font-semibold mb-6 text-center"
            style={{ color: 'var(--text-primary)' }}
          >
            Trending Patterns
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Rising Fast',
                description: 'Gaining momentum quickly',
                icon: '🚀',
                color: 'var(--success)',
                items: trendingItems
                  .filter(item => item.growth > 50)
                  .slice(0, 3),
              },
              {
                title: 'Consistently Hot',
                description: 'Steady engagement over time',
                icon: '🔥',
                color: 'var(--warning)',
                items: trendingItems
                  .filter(item => item.trend === 'stable' && item.count > 1000)
                  .slice(0, 3),
              },
              {
                title: 'New & Notable',
                description: 'Recently trending topics',
                icon: '🆕',
                color: 'var(--primary)',
                items: trendingItems
                  .filter(item => item.growth > 0 && item.count < 500)
                  .slice(0, 3),
              },
            ].map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="p-5 rounded-xl"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{
                      backgroundColor: `${section.color}20`,
                      color: section.color,
                    }}
                  >
                    {section.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {section.title}
                    </h4>
                    <p className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={item.id}
                      href={`/${item.type === 'post' ? 'posts' : item.type}s/${item.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-hover transition-colors"
                      style={{ backgroundColor: 'var(--background)' }}
                    >
                      <span className="text-sm font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.title}
                      </span>
                      <span className="text-xs font-bold px-2 py-1 rounded"
                        style={{
                          backgroundColor: `${section.color}20`,
                          color: section.color,
                        }}
                      >
                        +{item.growth}%
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}