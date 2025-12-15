'use client';

import { WordPressPost } from '@/types/wordpress';
import { formatRelativeTime, truncateText, getCategoryColor } from '@/lib/wordpress/utils';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TabletPostCardProps {
  post: WordPressPost;
  compact?: boolean;
}

export default function TabletPostCard({ post, compact = false }: TabletPostCardProps) {
  const primaryCategory = post.categories?.nodes?.[0];
  const categoryColor = primaryCategory ? getCategoryColor(primaryCategory.slug) : '#2563EB';
  
  if (compact) {
    return (
      <div className="group flex items-center gap-4 p-4 border border-border rounded-xl transition-all hover:border-primary/30 hover:shadow-lg">
        {/* Image */}
        {post.featuredImage?.node?.sourceUrl ? (
          <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="100px"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-2xl opacity-30">📝</div>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category */}
          {primaryCategory && (
            <Link 
              href={`/categories/${primaryCategory.slug}`}
              className="inline-block px-2 py-1 rounded text-xs font-medium mb-2"
              style={{ 
                backgroundColor: `${categoryColor}15`,
                color: categoryColor
              }}
            >
              {primaryCategory.name}
            </Link>
          )}
          
          {/* Title */}
          <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`} className="hover:underline text-sm">
              {post.title}
            </Link>
          </h3>
          
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatRelativeTime(post.date)}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.author?.node?.name || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="group bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      {/* Image */}
      {post.featuredImage?.node?.sourceUrl ? (
        <div className="relative h-40 overflow-hidden">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 300px"
          />
          {/* Category Badge */}
          {primaryCategory && (
            <Link 
              href={`/categories/${primaryCategory.slug}`}
              className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm"
              style={{ 
                backgroundColor: `${categoryColor}40`,
                color: 'white'
              }}
            >
              {primaryCategory.name}
            </Link>
          )}
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <div className="text-3xl opacity-30">📝</div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`} className="hover:underline text-base">
            {post.title}
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
          {truncateText(post.excerpt || '', 80)}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Calendar className="h-3 w-3" />
            <span>{formatRelativeTime(post.date)}</span>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-primary text-xs font-medium hover:gap-2 transition-all"
          >
            Read
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
