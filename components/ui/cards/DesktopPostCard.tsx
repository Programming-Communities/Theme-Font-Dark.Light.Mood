'use client';

import { WordPressPost } from '@/types/wordpress';
import { formatRelativeTime, truncateText, getCategoryColor } from '@/lib/wordpress/utils';
import { Calendar, User, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DesktopPostCardProps {
  post: WordPressPost;
  featured?: boolean;
}

export default function DesktopPostCard({ post, featured = false }: DesktopPostCardProps) {
  const primaryCategory = post.categories?.nodes?.[0];
  const categoryColor = primaryCategory ? getCategoryColor(primaryCategory.slug) : '#2563EB';
  
  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl">
        {/* Background Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <div className="absolute inset-0">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}
        
        {/* Content */}
        <div className="relative p-8 h-[500px] flex flex-col justify-end">
          {/* Category Badge */}
          {primaryCategory && (
            <Link 
              href={`/categories/${primaryCategory.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 transition-all hover:scale-105 self-start"
              style={{ 
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
                border: `1px solid ${categoryColor}40`
              }}
            >
              {primaryCategory.name}
            </Link>
          )}
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-primary-100 transition-colors">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          
          {/* Excerpt */}
          <p className="text-lg text-gray-200 mb-6 line-clamp-3">
            {truncateText(post.excerpt || '', 200)}
          </p>
          
          {/* Meta Information */}
          <div className="flex items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author?.node?.name || 'Unknown Author'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatRelativeTime(post.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentCount || 0} comments</span>
            </div>
          </div>
          
          {/* Read More Button */}
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full text-white font-medium transition-all hover:gap-3 group/btn self-start"
            style={{ backgroundColor: categoryColor }}
          >
            Read Article
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  // Regular desktop card
  return (
    <div className="group bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30">
      {/* Image */}
      {post.featuredImage?.node?.sourceUrl ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {/* Category Overlay */}
          {primaryCategory && (
            <Link 
              href={`/categories/${primaryCategory.slug}`}
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
              style={{ 
                backgroundColor: `${categoryColor}40`,
                color: 'white',
                border: `1px solid ${categoryColor}60`
              }}
            >
              {primaryCategory.name}
            </Link>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <div className="text-4xl opacity-30">📝</div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatRelativeTime(post.date)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>5 min read</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="text-text-secondary text-sm mb-4 line-clamp-3">
          {truncateText(post.excerpt || '', 120)}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
              {post.author?.node?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm text-text-secondary">
              {post.author?.node?.name || 'Unknown'}
            </span>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
          >
            Read
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
