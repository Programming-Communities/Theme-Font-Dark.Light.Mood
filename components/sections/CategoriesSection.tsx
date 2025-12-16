'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { WordPressCategory } from '@/types/wordpress';
import { wordpressClient } from '@/lib/wordpress/client';
import { Hash, ChevronRight, TrendingUp, Star, BookOpen, Users, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

interface CategoriesSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
  columns?: 2 | 3 | 4 | 6;
  variant?: 'grid' | 'carousel';
}

const categoryIcons = [Hash, BookOpen, Users, Globe, TrendingUp, Star, Zap];

export default function CategoriesSection({
  title = "Browse Categories",
  subtitle = "Explore our collection of English learning resources by category",
  limit = 6,
  showViewAll = true,
  columns = 3,
  variant = 'grid',
}: CategoriesSectionProps) {
  const { themeColors } = useTheme();
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await wordpressClient.getCategories();
        // Sort by count and take limit
        const sortedCategories = (data.categories?.nodes || [])
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [limit]);

  const getCategoryColor = (index: number) => {
    const colors = [
      themeColors.primary,
      themeColors.secondary,
      themeColors.success,
      themeColors.warning,
      '#8B5CF6', // purple
      '#0EA5E9', // sky
      '#F97316', // orange
    ];
    return colors[index % colors.length];
  };

  const getCategoryIcon = (index: number) => {
    return categoryIcons[index % categoryIcons.length];
  };

  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

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
          <div className={`grid ${gridClasses[columns]} gap-6`}>
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="p-6 rounded-xl animate-pulse"
                   style={{ backgroundColor: themeColors.surface + '40' }}>
                <div className="h-8 w-8 rounded-lg mb-4 mx-auto"
                     style={{ backgroundColor: themeColors.border }} />
                <div className="h-4 w-3/4 mx-auto rounded mb-2"
                     style={{ backgroundColor: themeColors.border }} />
                <div className="h-3 w-1/2 mx-auto rounded"
                     style={{ backgroundColor: themeColors.border }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: themeColors.text.primary }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg max-w-3xl mx-auto mb-8"
               style={{ color: themeColors.text.secondary }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div className={`grid ${gridClasses[columns]} gap-6`}>
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(index);
            const color = getCategoryColor(index);
            
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
                style={{ 
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  boxShadow: `0 4px 20px ${themeColors.shadow}`
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0"
                       style={{
                         backgroundImage: `radial-gradient(${color}40 1px, transparent 1px)`,
                         backgroundSize: '20px 20px',
                       }} />
                </div>

                <div className="relative z-10">
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
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="text-sm font-medium px-3 py-1 rounded-full"
                           style={{ 
                             backgroundColor: `${color}15`,
                             color: color
                           }}>
                        {category.count} articles
                      </div>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                       style={{ color: color }}>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        {showViewAll && categories.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg active:scale-95"
              style={{ 
                backgroundColor: themeColors.primary,
                color: themeColors.text.accent,
                border: `2px solid ${themeColors.primary}`
              }}
            >
              View All Categories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}