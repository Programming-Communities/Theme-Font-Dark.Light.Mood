'use client';

import { WordPressCategory, WordPressPost } from '@/types/wordpress';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import PostCard from '@/components/ui/cards/PostCard';
import { Hash, ArrowLeft, Search, Filter, Grid, List, BookOpen, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface CategoryDetailClientProps {
  category: WordPressCategory & {
    posts?: {
      nodes: WordPressPost[];
      pageInfo: any;
    };
  };
  initialPosts: WordPressPost[];
  pageInfo: any;
}

export default function CategoryDetailClient({ 
  category, 
  initialPosts,
  pageInfo 
}: CategoryDetailClientProps) {
  const { themeColors } = useTheme();
  const [posts, setPosts] = useState(initialPosts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = posts.filter(post => 
    searchQuery === '' || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPosts = posts.filter(post => post.featuredImage?.node?.sourceUrl).slice(0, 2);
  const regularPosts = filteredPosts.filter(post => !featuredPosts.includes(post));

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      {/* Hero Section */}
      <div className="relative py-12 px-4 overflow-hidden"
           style={{ 
             backgroundColor: themeColors.surface,
             borderBottom: `1px solid ${themeColors.border}`
           }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `radial-gradient(${themeColors.primary}40 1px, transparent 1px)`,
                 backgroundSize: '40px 40px',
               }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              style={{ color: themeColors.text.secondary }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Link>
          </div>

          {/* Category Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-4"
                 style={{ 
                   backgroundColor: `${themeColors.primary}15`,
                   color: themeColors.primary,
                   border: `1px solid ${themeColors.primary}30`
                 }}>
              <Hash className="h-5 w-5" />
              <span className="text-lg font-medium">Category</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
              {category.name}
            </h1>
            
            {category.description && (
              <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 leading-relaxed"
                 style={{ color: themeColors.text.secondary }}>
                {category.description}
              </p>
            )}

            {/* Category Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: themeColors.primary }} />
                <div>
                  <div className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
                    {category.count}
                  </div>
                  <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                    Articles
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" style={{ color: themeColors.primary }} />
                <div>
                  <div className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
                    {Math.floor(category.count * 0.1)}K
                  </div>
                  <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                    Readers
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" style={{ color: themeColors.primary }} />
                <div>
                  <div className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
                    {Math.floor(category.count * 0.05)}K
                  </div>
                  <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                    Comments
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                      style={{ color: themeColors.text.secondary }} />
              <input
                type="text"
                placeholder={`Search in ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  color: themeColors.text.primary
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm" style={{ color: themeColors.text.secondary }}>
              Showing {filteredPosts.length} of {posts.length} articles
              {searchQuery && ` for "${searchQuery}"`}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-surface' : 'opacity-50 hover:opacity-100'}`}
                style={{ 
                  color: themeColors.text.primary,
                  border: `1px solid ${themeColors.border}`
                }}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-surface' : 'opacity-50 hover:opacity-100'}`}
                style={{ 
                  color: themeColors.text.primary,
                  border: `1px solid ${themeColors.border}`
                }}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && !searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: themeColors.text.primary }}>
                Featured in {category.name}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} variant="featured" />
                ))}
              </div>
            </div>
          )}

          {/* Posts Grid/List */}
          {filteredPosts.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {regularPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                  forceView={viewMode === 'list' ? 'tablet' : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 opacity-30">📭</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
                No articles found
              </h3>
              <p style={{ color: themeColors.text.secondary }}>
                {searchQuery 
                  ? `No results for "${searchQuery}" in ${category.name}`
                  : `No articles available in ${category.name}`
                }
              </p>
            </div>
          )}

          {/* Load More Button (if more posts available) */}
          {pageInfo?.hasNextPage && (
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  // Implement load more functionality
                  console.log('Load more posts');
                }}
                disabled={isLoading}
                className="px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50"
                style={{ 
                  backgroundColor: themeColors.surface,
                  color: themeColors.text.primary,
                  border: `1px solid ${themeColors.border}`
                }}
              >
                {isLoading ? 'Loading...' : 'Load More Articles'}
              </button>
            </div>
          )}

          {/* Related Categories */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: themeColors.border }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: themeColors.text.primary }}>
              Explore Related Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                'Grammar', 'Vocabulary', 'Speaking', 'Writing', 
                'Listening', 'Reading', 'Pronunciation', 'Business English'
              ].map((topic) => (
                <Link
                  key={topic}
                  href={`/categories/${topic.toLowerCase().replace(' ', '-')}`}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: themeColors.surface,
                    color: themeColors.text.primary,
                    border: `1px solid ${themeColors.border}`
                  }}
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}