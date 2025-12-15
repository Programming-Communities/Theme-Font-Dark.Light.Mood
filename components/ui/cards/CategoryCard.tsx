'use client';

import { WordPressCategory } from '@/types/wordpress';
import { getCategoryColor } from '@/lib/wordpress/utils';
import Link from 'next/link';
import { ChevronRight, Hash } from 'lucide-react';

interface CategoryCardProps {
  category: WordPressCategory;
  showCount?: boolean;
  compact?: boolean;
}

export default function CategoryCard({ category, showCount = true, compact = false }: CategoryCardProps) {
  const categoryColor = getCategoryColor(category.slug);
  
  if (compact) {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className="group flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-md active:scale-95"
        style={{
          backgroundColor: `${categoryColor}05`,
          borderColor: `${categoryColor}20`,
          color: categoryColor,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md" style={{ backgroundColor: `${categoryColor}15` }}>
            <Hash className="h-3 w-3" />
          </div>
          <span className="font-medium text-sm">{category.name}</span>
        </div>
        {showCount && (
          <span className="text-xs px-2 py-0.5 rounded-full" 
                style={{ backgroundColor: `${categoryColor}15` }}>
            {category.count}
          </span>
        )}
      </Link>
    );
  }
  
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-lg active:scale-95"
      style={{
        backgroundColor: `${categoryColor}08`,
        border: `1px solid ${categoryColor}20`,
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `radial-gradient(${categoryColor}40 1px, transparent 1px)`,
               backgroundSize: '20px 20px',
             }} />
      </div>
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
               style={{ backgroundColor: `${categoryColor}20` }}>
            <Hash className="h-5 w-5" style={{ color: categoryColor }} />
          </div>
        </div>
        
        {/* Content */}
        <div>
          <h3 className="font-bold text-lg mb-1" style={{ color: categoryColor }}>
            {category.name}
          </h3>
          
          {category.description && (
            <p className="text-sm mb-2 line-clamp-2 opacity-80" 
               style={{ color: categoryColor }}>
              {category.description}
            </p>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            {showCount && (
              <div className="px-2 py-0.5 rounded-full text-xs font-medium"
                   style={{ 
                     backgroundColor: `${categoryColor}20`,
                     color: categoryColor
                   }}>
                {category.count} articles
              </div>
            )}
            
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          style={{ color: categoryColor }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
