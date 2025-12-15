'use client';

import { WordPressPost } from '@/types/wordpress';
import { formatRelativeTime, truncateText, getCategoryColor } from '@/lib/wordpress/utils';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface MobilePostCardProps {
  post: WordPressPost;
  showImage?: boolean;
}

export default function MobilePostCard({ post, showImage = true }: MobilePostCardProps) {
  const primaryCategory = post.categories?.nodes?.[0];
  const categoryColor = primaryCategory ? getCategoryColor(primaryCategory.slug) : '#2563EB';
  
  if (!showImage) {
    return (
      <div className="group py-3 border-b border-border last:border-b-0">
        {/* Category */}
        {primaryCategory && (
          <Link 
            href={`/categories/${primaryCategory.slug}`}
            className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-1"
            style={{ 
              backgroundColor: `${categoryColor}15`,
              color: categoryColor
            }}
          >
            {primaryCategory.name}
          </Link>
        )}
        
        {/* Title */}
        <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
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
            <Clock className="h-3 w-3" />
            <span>3 min</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="group bg-surface rounded-lg overflow-hidden shadow-sm transition-all duration-300 active:scale-[0.99]">
      {/* Image */}
      {post.featuredImage?.node?.sourceUrl && (
        <div className="relative h-32 overflow-hidden">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 480px) 100vw, 300px"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          {/* Category Badge */}
          {primaryCategory && (
            <Link 
              href={`/categories/${primaryCategory.slug}`}
              className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm"
              style={{ 
                backgroundColor: `${categoryColor}60`,
                color: 'white'
              }}
            >
              {primaryCategory.name}
            </Link>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors text-sm">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="text-text-secondary text-xs mb-2 line-clamp-2">
          {truncateText(post.excerpt || '', 60)}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Calendar className="h-3 w-3" />
            <span>{formatRelativeTime(post.date)}</span>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-primary text-xs font-medium"
          >
            Read
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
