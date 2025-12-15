'use client';

import { useState } from 'react';
import { WordPressPost, WordPressCategory } from '@/types/wordpress';
import PostCard from '@/components/ui/cards/PostCard';
import CategoryCard from '@/components/ui/cards/CategoryCard';
import { Filter, Search, Grid, List } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface BlogClientProps {
  initialPosts: WordPressPost[];
  pageInfo: any;
  categories: WordPressCategory[];
}

export default function BlogClient({ initialPosts, pageInfo, categories }: BlogClientProps) {
  const { themeColors } = useTheme();
  const [posts, setPosts] = useState(initialPosts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.categories.nodes.some(cat => cat.slug === selectedCategory);
    
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = posts.filter(post => post.featuredImage?.node?.sourceUrl).slice(0, 2);
  const regularPosts = filteredPosts.filter(post => !featuredPosts.includes(post));

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      {/* Hero Section */}
      <div className="relative py-12 px-4"
           style={{ 
             backgroundColor: themeColors.surface,
             borderBottom: `1px solid ${themeColors.border}`
           }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: themeColors.primary }}>
              Community Blog
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6" style={{ color: themeColors.text.secondary }}>
              Discover articles, tutorials, and insights from our community
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                        style={{ color: themeColors.text.secondary }} />
                <input
                  type="text"
                  placeholder="Search articles..."
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

          {/* Categories */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5" style={{ color: themeColors.primary }} />
              <h2 className="text-lg font-bold" style={{ color: themeColors.text.primary }}>
                Browse by Category
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all' ? '' : 'opacity-70 hover:opacity-100'}`}
                style={{ 
                  backgroundColor: selectedCategory === 'all' ? themeColors.primary : themeColors.surface,
                  color: selectedCategory === 'all' ? themeColors.text.accent : themeColors.text.primary,
                  border: `1px solid ${selectedCategory === 'all' ? themeColors.primary : themeColors.border}`
                }}
              >
                All Posts
              </button>
              
              {categories.slice(0, 8).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.slug ? '' : 'opacity-70 hover:opacity-100'}`}
                  style={{ 
                    backgroundColor: selectedCategory === category.slug ? themeColors.primary : themeColors.surface,
                    color: selectedCategory === category.slug ? themeColors.text.accent : themeColors.text.primary,
                    border: `1px solid ${selectedCategory === category.slug ? themeColors.primary : themeColors.border}`
                  }}
                >
                  {category.name}
                </button>
              ))}
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
          {featuredPosts.length > 0 && selectedCategory === 'all' && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: themeColors.text.primary }}>
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  ? `No results for "${searchQuery}"`
                  : `No articles in "${categories.find(c => c.slug === selectedCategory)?.name || 'this category'}"`
                }
              </p>
            </div>
          )}

          {/* Categories Grid */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: themeColors.border }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: themeColors.text.primary }}>
              Explore Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
