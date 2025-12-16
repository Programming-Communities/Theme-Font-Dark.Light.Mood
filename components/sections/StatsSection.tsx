'use client';

import { useEffect, useState } from 'react';
import { useWordPress } from '@/hooks/useWordPress';
import { useDevice } from '@/hooks/useDevice';
import { SkeletonCard } from '@/components/ui/skeletons/CardSkeleton';
import { Alert } from '@/components/ui/common/Alert';

interface StatsData {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  categories: number;
  tags: number;
  pageViews?: number;
}

export default function StatsSection() {
  const { getStats, isLoading, error } = useWordPress();
  const { isMobile } = useDevice();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
    setMounted(true);
  }, [getStats]);

  const statCards = [
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      icon: '📝',
      color: 'var(--primary)',
    },
    {
      title: 'Community Members',
      value: stats?.totalUsers || 0,
      icon: '👥',
      color: 'var(--secondary)',
    },
    {
      title: 'Comments',
      value: stats?.totalComments || 0,
      icon: '💬',
      color: 'var(--success)',
    },
    {
      title: 'Categories',
      value: stats?.categories || 0,
      icon: '🏷️',
      color: 'var(--warning)',
    },
    {
      title: 'Tags',
      value: stats?.tags || 0,
      icon: '🔖',
      color: 'var(--error)',
    },
    {
      title: 'Page Views',
      value: stats?.pageViews ? `${(stats.pageViews / 1000).toFixed(1)}K` : 'N/A',
      icon: '👁️',
      color: 'var(--primary)',
    },
  ];

  if (error) {
    return (
      <div className="py-8">
        <Alert
          type="error"
          title="Failed to Load Statistics"
          message="Unable to fetch statistics data from WordPress."
        />
      </div>
    );
  }

  if (isLoading || !mounted) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section 
      className="py-8 md:py-12"
      aria-label="Website Statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Community Statistics
          </h2>
          <p className="text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
            Real-time data from our growing English learning community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl p-5 md:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 6px var(--shadow)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  Live
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline">
                  <span 
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {stat.value}
                  </span>
                  {stat.title === 'Page Views' && stats?.pageViews && (
                    <span 
                      className="ml-2 text-sm font-medium"
                      style={{ color: 'var(--success)' }}
                    >
                      ↗
                    </span>
                  )}
                </div>
                <p 
                  className="text-sm md:text-base font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {stat.title}
                </p>
              </div>

              {/* Animated progress bar */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: `${stat.color}30` }}
              >
                <div
                  className="h-full transition-all duration-1000 ease-out"
                  style={{
                    width: '100%',
                    backgroundColor: stat.color,
                    animation: 'pulse 2s infinite',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live update indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--text-secondary)',
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
            <span>Updated every 5 minutes</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}