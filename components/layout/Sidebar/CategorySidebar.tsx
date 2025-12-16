/**
 * CategorySidebar Component
 * Displays WordPress categories with post counts and filtering
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWordPress } from '@/hooks/useWordPress';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
  taxonomy: string;
}

interface CategoryStats {
  total_categories: number;
  total_posts: number;
  posts_by_category: Array<{
    category_id: number;
    post_count: number;
  }>;
}

const CategorySidebar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Fetch categories with hierarchical structure
  const { data: categories, isLoading, error } = useWordPress('categories', {
    per_page: 100,
    orderby: 'count',
    order: 'desc',
    hide_empty: true,
  });

  const { data: categoryStats } = useWordPress('stats/categories');

  // Update selected category from URL
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  }, [searchParams]);

  // Filter categories based on search term
  const filteredCategories = React.useMemo(() => {
    if (!categories) return [];
    
    let filtered = categories.filter((cat: Category) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by count (descending)
    filtered.sort((a: Category, b: Category) => b.count - a.count);

    return filtered;
  }, [categories, searchTerm]);

  // Build hierarchical category tree
  const buildCategoryTree = (cats: Category[]) => {
    const categoryMap = new Map<number, Category & { children: Category[] }>();
    const rootCategories: (Category & { children: Category[] })[] = [];

    // Initialize map
    cats.forEach((cat: Category) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Build tree
    cats.forEach((cat: Category) => {
      const categoryNode = categoryMap.get(cat.id);
      if (!categoryNode) return;

      if (cat.parent === 0) {
        rootCategories.push(categoryNode);
      } else {
        const parent = categoryMap.get(cat.parent);
        if (parent) {
          parent.children.push(categoryNode);
        } else {
          rootCategories.push(categoryNode);
        }
      }
    });

    return rootCategories;
  };

  const categoryTree = buildCategoryTree(filteredCategories);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    router.push(`/category/${categorySlug}`);
  };

  const renderCategoryItem = (category: Category & { children: Category[] }, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory === category.slug;
    const hasChildren = category.children.length > 0;

    return (
      <div key={category.id} className="category-item">
        <div
          className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
            isSelected ? 'ring-2 ring-opacity-50' : 'hover:bg-opacity-50'
          }`}
          style={{
            backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
            marginLeft: `${level * 1.5}rem`,
            borderLeft: level > 0 ? '2px solid var(--border)' : 'none',
          }}
          onClick={() => handleCategorySelect(category.slug)}
        >
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
                className="p-1 hover:bg-white/10 dark:hover:bg-black/10 rounded"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              {/* Category Icon based on name */}
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ 
                backgroundColor: `var(--primary-light)`, 
                color: 'var(--primary)' 
              }}>
                {category.name.charAt(0).toUpperCase()}
              </div>
              
              <span className={`text-sm font-medium truncate ${isSelected ? 'font-semibold' : ''}`} style={{ color: 'var(--text-primary)' }}>
                {category.name}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              color: 'var(--text-secondary)' 
            }}>
              {category.count}
            </span>
          </div>
        </div>

        {/* Description */}
        {category.description && (
          <p className="text-xs opacity-70 mt-1 mb-2" style={{ 
            color: 'var(--text-secondary)',
            marginLeft: `${level * 1.5 + 2.5}rem` 
          }}>
            {category.description}
          </p>
        )}

        {/* Child Categories */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {category.children.map(child => renderCategoryItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="category-sidebar">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
          Categories
        </h2>
        {categoryStats && (
          <p className="text-sm opacity-80" style={{ color: 'var(--text-secondary)' }}>
            {categoryStats.total_categories} categories • {categoryStats.total_posts} posts
          </p>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: 'var(--text-secondary)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
        {isLoading ? (
          // Skeleton Loaders
          [...Array(8)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-2 animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
              <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm">Failed to load categories</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-4">
            <p className="opacity-70" style={{ color: 'var(--text-secondary)' }}>
              No categories found
            </p>
          </div>
        ) : (
          categoryTree.map(category => renderCategoryItem(category))
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setExpandedCategories(new Set())}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors duration-200"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            Collapse All
          </button>
          <button
            onClick={() => {
              const allIds = filteredCategories.map((cat: Category) => cat.id);
              setExpandedCategories(new Set(allIds));
            }}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors duration-200"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            Expand All
          </button>
          <Link
            href="/categories"
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 ml-auto"
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white',
            }}
          >
            View All
          </Link>
        </div>
      </div>

      <style jsx>{`
        .category-sidebar :global(.category-item) {
          transition: all 0.2s ease;
        }
        
        .category-sidebar :global(.category-item:hover) {
          background-color: var(--bg-tertiary);
          border-radius: 0.5rem;
        }
        
        /* Custom scrollbar */
        .category-sidebar :global(.max-h-\[400px\])::-webkit-scrollbar {
          width: 6px;
        }
        
        .category-sidebar :global(.max-h-\[400px\])::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 3px;
        }
        
        .category-sidebar :global(.max-h-\[400px\])::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
        
        .category-sidebar :global(.max-h-\[400px\])::-webkit-scrollbar-thumb:hover {
          background: var(--primary-light);
        }
      `}</style>
    </div>
  );
};

export default CategorySidebar;