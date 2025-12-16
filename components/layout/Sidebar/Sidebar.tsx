'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  TrendingUp, 
  Clock, 
  Star, 
  Hash, 
  Users, 
  Calendar, 
  Flame,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { WordPressCategory } from '@/types/wordpress';
import { wordpressClient } from '@/lib/wordpress/client';

interface SidebarProps {
  variant?: 'default' | 'compact' | 'sticky';
  showCategories?: boolean;
  showTrending?: boolean;
  showRecent?: boolean;
  className?: string;
}

export default function Sidebar({ 
  variant = 'default',
  showCategories = true,
  showTrending = true,
  showRecent = true,
  className = ''
}: SidebarProps) {
  const { themeColors } = useTheme();
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        if (showCategories) {
          const categoriesData = await wordpressClient.getCategories();
          setCategories(categoriesData.categories?.nodes?.slice(0, 8) || []);
        }

        // Fetch trending posts (simulated - in real app would be from analytics)
        if (showTrending) {
          const postsData = await wordpressClient.getPosts(5);
          setTrendingPosts(postsData.posts?.nodes?.slice(0, 5) || []);
        }

        // Fetch recent posts
        if (showRecent) {
          const recentData = await wordpressClient.getPosts(5);
          setRecentPosts(recentData.posts?.nodes?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showCategories, showTrending, showRecent]);

  const renderSkeleton = () => (
    <div className="space-y-6">
      {showCategories && (
        <div className="space-y-3">
          <div className="h-5 w-32 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-full rounded animate-pulse" 
                 style={{ backgroundColor: themeColors.border + '40' }} />
          ))}
        </div>
      )}
      
      {showTrending && (
        <div className="space-y-3">
          <div className="h-5 w-32 rounded animate-pulse" 
               style={{ backgroundColor: themeColors.border + '40' }} />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 w-full rounded animate-pulse" 
                 style={{ backgroundColor: themeColors.border + '40' }} />
          ))}
        </div>
      )}
    </div>
  );

  if (variant === 'compact') {
    return (
      <aside className={`space-y-6 ${className}`}>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            {showCategories && categories.length > 0 && (
              <div className="bg-surface border rounded-xl p-4"
                   style={{ 
                     backgroundColor: themeColors.surface,
                     borderColor: themeColors.border
                   }}>
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="h-4 w-4" style={{ color: themeColors.primary }} />
                  <h3 className="font-bold text-sm" style={{ color: themeColors.text.primary }}>
                    Categories
                  </h3>
                </div>
                <div className="space-y-1">
                  {categories.slice(0, 5).map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="flex items-center justify-between py-1.5 text-sm hover:text-primary transition-colors group"
                      style={{ color: themeColors.text.secondary }}
                    >
                      <span>{category.name}</span>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {showTrending && trendingPosts.length > 0 && (
              <div className="bg-surface border rounded-xl p-4"
                   style={{ 
                     backgroundColor: themeColors.surface,
                     borderColor: themeColors.border
                   }}>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-4 w-4" style={{ color: themeColors.primary }} />
                  <h3 className="font-bold text-sm" style={{ color: themeColors.text.primary }}>
                    Trending
                  </h3>
                </div>
                <div className="space-y-3">
                  {trendingPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                             style={{ 
                               backgroundColor: `${themeColors.primary}20`,
                               color: themeColors.primary
                             }}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors"
                               style={{ color: themeColors.text.primary }}>
                            {post.title}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </aside>
    );
  }

  return (
    <aside className={`space-y-8 ${className}`}>
      {isLoading ? (
        renderSkeleton()
      ) : (
        <>
          {/* Categories Widget */}
          {showCategories && categories.length > 0 && (
            <div className="bg-surface border rounded-xl p-6"
                 style={{ 
                   backgroundColor: themeColors.surface,
                   borderColor: themeColors.border
                 }}>
              <div className="flex items-center gap-2 mb-4">
                <Hash className="h-5 w-5" style={{ color: themeColors.primary }} />
                <h3 className="font-bold text-lg" style={{ color: themeColors.text.primary }}>
                  Browse Categories
                </h3>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-background group transition-all"
                    style={{ 
                      color: themeColors.text.secondary,
                      backgroundColor: themeColors.background + '00'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{ 
                             backgroundColor: `${themeColors.primary}10`,
                             color: themeColors.primary
                           }}>
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: themeColors.text.primary }}>
                          {category.name}
                        </div>
                        <div className="text-xs">
                          {category.count} articles
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Trending Posts Widget */}
          {showTrending && trendingPosts.length > 0 && (
            <div className="bg-surface border rounded-xl p-6"
                 style={{ 
                   backgroundColor: themeColors.surface,
                   borderColor: themeColors.border
                 }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5" style={{ color: themeColors.primary }} />
                <h3 className="font-bold text-lg" style={{ color: themeColors.text.primary }}>
                  Trending Now
                </h3>
              </div>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         style={{ 
                           backgroundColor: `${themeColors.primary}20`,
                           color: themeColors.primary
                         }}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors"
                           style={{ color: themeColors.text.primary }}>
                        {post.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                          {post.categories?.nodes?.[0]?.name || 'Uncategorized'}
                        </div>
                        <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                          •
                        </div>
                        <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                          {new Date(post.date).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent Posts Widget */}
          {showRecent && recentPosts.length > 0 && (
            <div className="bg-surface border rounded-xl p-6"
                 style={{ 
                   backgroundColor: themeColors.surface,
                   borderColor: themeColors.border
                 }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5" style={{ color: themeColors.primary }} />
                <h3 className="font-bold text-lg" style={{ color: themeColors.text.primary }}>
                  Recent Posts
                </h3>
              </div>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    {post.featuredImage?.node?.sourceUrl ? (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                        <img
                          src={post.featuredImage.node.sourceUrl}
                          alt={post.featuredImage.node.altText || post.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                           style={{ 
                             backgroundColor: `${themeColors.primary}10`,
                             color: themeColors.primary
                           }}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors"
                           style={{ color: themeColors.text.primary }}>
                        {post.title}
                      </div>
                      <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                        {new Date(post.date).toLocaleDateString('en-PK', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Community Stats Widget */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border rounded-xl p-6"
               style={{ 
                 borderColor: themeColors.border + '40'
               }}>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5" style={{ color: themeColors.primary }} />
              <h3 className="font-bold text-lg" style={{ color: themeColors.text.primary }}>
                Community Stats
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: themeColors.background + '80' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: themeColors.primary }}>
                  1.2K+
                </div>
                <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                  Members
                </div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: themeColors.background + '80' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: themeColors.primary }}>
                  5.6K+
                </div>
                <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                  Articles
                </div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: themeColors.background + '80' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: themeColors.primary }}>
                  24.8K+
                </div>
                <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                  Comments
                </div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: themeColors.background + '80' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: themeColors.primary }}>
                  89.5K+
                </div>
                <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                  Reactions
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}