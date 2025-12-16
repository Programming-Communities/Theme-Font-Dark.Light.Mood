'use client';

import { WordPressCategory } from '@/types/wordpress';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Hash, BookOpen, Users, TrendingUp, Star, Globe, Zap, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface CategoriesClientProps {
  categories: WordPressCategory[];
}

const categoryIcons = [Hash, BookOpen, Users, Globe, TrendingUp, Star, Zap, MessageSquare];
const colors = [
  '#2563EB', '#059669', '#7C3AED', '#D97706', '#DC2626',
  '#0EA5E9', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
];

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  const { themeColors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count'>('count');

  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.count - a.count;
    });

  const getCategoryIcon = (index: number) => {
    return categoryIcons[index % categoryIcons.length];
  };

  const getCategoryColor = (index: number) => {
    return colors[index % colors.length];
  };

  const getSizeClass = (count: number) => {
    if (count > 100) return 'lg';
    if (count > 50) return 'md';
    if (count > 20) return 'sm';
    return 'xs';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      {/* Hero Section */}
      <div className="py-12 px-4"
           style={{ 
             backgroundColor: themeColors.surface,
             borderBottom: `1px solid ${themeColors.border}`
           }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: themeColors.primary }}>
              Browse Categories
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6" style={{ color: themeColors.text.secondary }}>
              Explore {categories.length}+ categories of English learning resources
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text.primary
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: themeColors.background }}>
              <div className="text-2xl font-bold mb-1" style={{ color: themeColors.primary }}>
                {categories.length}
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                Total Categories
              </div>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: themeColors.background }}>
              <div className="text-2xl font-bold mb-1" style={{ color: themeColors.primary }}>
                {categories.reduce((sum, cat) => sum + cat.count, 0)}
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                Total Articles
              </div>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: themeColors.background }}>
              <div className="text-2xl font-bold mb-1" style={{ color: themeColors.primary }}>
                {Math.max(...categories.map(cat => cat.count))}
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                Most Articles
              </div>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: themeColors.background }}>
              <div className="text-2xl font-bold mb-1" style={{ color: themeColors.primary }}>
                {categories.filter(cat => cat.count > 10).length}
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                Active Categories
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm" style={{ color: themeColors.text.secondary }}>
              Showing {filteredCategories.length} of {categories.length} categories
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: themeColors.text.secondary }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'count')}
                className="px-3 py-1.5 rounded-lg border text-sm"
                style={{ 
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  color: themeColors.text.primary
                }}
              >
                <option value="count">Most Articles</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category, index) => {
                const Icon = getCategoryIcon(index);
                const color = getCategoryColor(index);
                const sizeClass = getSizeClass(category.count);
                
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                    style={{ 
                      backgroundColor: themeColors.surface,
                      border: `1px solid ${themeColors.border}`,
                    }}
                  >
                    {/* Size Indicator */}
                    <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold ${
                      sizeClass === 'lg' ? 'bg-green-100 text-green-800' :
                      sizeClass === 'md' ? 'bg-blue-100 text-blue-800' :
                      sizeClass === 'sm' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sizeClass.toUpperCase()}
                    </div>

                    {/* Icon */}
                    <div className="mb-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                           style={{ 
                             backgroundColor: `${color}15`,
                             color: color,
                           }}>
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors"
                          style={{ color: themeColors.text.primary }}>
                        {category.name}
                      </h3>
                      
                      {category.description && (
                        <p className="text-sm mb-3 line-clamp-2 opacity-75"
                           style={{ color: themeColors.text.secondary }}>
                          {category.description}
                        </p>
                      )}
                      
                      {/* Stats */}
                      <div className="flex flex-col items-center gap-2 mt-4">
                        <div className="text-2xl font-bold" style={{ color: color }}>
                          {category.count}
                        </div>
                        <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                          articles
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                         style={{ borderColor: color }} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 opacity-30">🔍</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
                No categories found
              </h3>
              <p style={{ color: themeColors.text.secondary }}>
                {searchQuery 
                  ? `No results for "${searchQuery}"`
                  : 'No categories available'
                }
              </p>
            </div>
          )}

          {/* Back to Blog */}
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: themeColors.surface,
                color: themeColors.text.primary,
                border: `1px solid ${themeColors.border}`
              }}
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}