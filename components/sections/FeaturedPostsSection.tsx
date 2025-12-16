'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { WordPressPost } from '@/types/wordpress';
import { wordpressClient } from '@/lib/wordpress/client';
import PostCard from '@/components/ui/cards/PostCard';
import { Star, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeaturedPostsSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
  variant?: 'grid' | 'slider';
}

export default function FeaturedPostsSection({
  title = "Featured Articles",
  subtitle = "Handpicked content from our editorial team",
  limit = 3,
  showViewAll = true,
  variant = 'grid',
}: FeaturedPostsSectionProps) {
  const { themeColors } = useTheme();
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      setIsLoading(true);
      try {
        const data = await wordpressClient.getPosts(limit);
        // Filter posts with featured images
        const featuredPosts = (data.posts?.nodes || [])
          .filter(post => post.featuredImage?.node?.sourceUrl)
          .slice(0, limit);
        setPosts(featuredPosts);
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, [limit]);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 w-64 mx-auto rounded animate-pulse mb-4"
                 style={{ backgroundColor: themeColors.border + '40' }} />
            <div className="h-4 w-96 mx-auto rounded animate-pulse"
                 style={{ backgroundColor: themeColors.border + '40' }} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse"
                   style={{ backgroundColor: themeColors.surface + '40' }}>
                <div className="h-48" style={{ backgroundColor: themeColors.border }} />
                <div className="p-6">
                  <div className="h-4 w-24 rounded-full mb-4"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="h-6 w-full rounded mb-2"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="h-6 w-3/4 rounded mb-4"
                       style={{ backgroundColor: themeColors.border }} />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded"
                         style={{ backgroundColor: themeColors.border }} />
                    <div className="h-3 w-4/5 rounded"
                         style={{ backgroundColor: themeColors.border }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg"
                   style={{ 
                     backgroundColor: `${themeColors.primary}15`,
                     color: themeColors.primary
                   }}>
                <Star className="h-5 w-5" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold"
                  style={{ color: themeColors.text.primary }}>
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-lg max-w-2xl"
                 style={{ color: themeColors.text.secondary }}>
                {subtitle}
              </p>
            )}
          </div>
          
          {showViewAll && (
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:gap-3 group"
              style={{ 
                backgroundColor: themeColors.surface,
                color: themeColors.text.primary,
                border: `1px solid ${themeColors.border}`
              }}
            >
              View All Articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Featured Posts Grid */}
        {variant === 'slider' ? (
          <div className="relative">
            {/* Slider implementation would go here */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div key={post.id} className={index === 0 ? 'lg:col-span-2' : ''}>
                  <PostCard 
                    post={post} 
                    variant={index === 0 ? 'featured' : 'default'}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="featured" />
            ))}
          </div>
        )}

        {/* Stats Banner */}
        <div className="mt-16 p-8 rounded-2xl"
             style={{ 
               background: `linear-gradient(135deg, ${themeColors.primary}15, ${themeColors.secondary}15)`,
               border: `1px solid ${themeColors.border}`
             }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 flex items-center justify-center gap-2"
                   style={{ color: themeColors.primary }}>
                <TrendingUp className="h-6 w-6" />
                <span>95%</span>
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                User Satisfaction
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: themeColors.primary }}>
                24/7
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                Active Support
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 flex items-center justify-center gap-2"
                   style={{ color: themeColors.primary }}>
                <Clock className="h-6 w-6" />
                <span>5min</span>
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                Avg. Response Time
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: themeColors.primary }}>
                100K+
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                Monthly Readers
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}