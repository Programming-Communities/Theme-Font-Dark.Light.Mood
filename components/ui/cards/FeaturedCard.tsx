'use client';

import { WordPressPost } from '@/types/wordpress';
import { formatRelativeTime, truncateText, getCategoryColor } from '@/lib/wordpress/utils';
import { Calendar, User, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface FeaturedCardProps {
  post: WordPressPost;
  index?: number;
}

export default function FeaturedCard({ post, index = 0 }: FeaturedCardProps) {
  const { themeColors } = useTheme();
  const primaryCategory = post.categories?.nodes?.[0];
  const categoryColor = primaryCategory ? getCategoryColor(primaryCategory.slug) : themeColors.primary;

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
      {/* Background Image with Gradient */}
      {post.featuredImage?.node?.sourceUrl && (
        <div className="absolute inset-0">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority={index < 2}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>
      )}

      {/* Featured Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-sm"
             style={{ 
               backgroundColor: `${categoryColor}40`,
               border: `1px solid ${categoryColor}60`
             }}>
          <Star className="h-3 w-3" style={{ color: 'white' }} />
          <span className="text-xs font-medium text-white">Featured</span>
        </div>
      </div>

      {/* Number Badge (for carousel) */}
      {index !== undefined && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white backdrop-blur-sm"
               style={{ 
                 backgroundColor: `${categoryColor}60`,
                 border: `1px solid ${categoryColor}80`
               }}>
            {index + 1}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative p-6 md:p-8 h-[400px] flex flex-col justify-end">
        {/* Category */}
        {primaryCategory && (
          <Link 
            href={`/categories/${primaryCategory.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 transition-all hover:scale-105 self-start backdrop-blur-sm"
            style={{ 
              backgroundColor: `${categoryColor}40`,
              color: 'white',
              border: `1px solid ${categoryColor}60`
            }}
          >
            {primaryCategory.name}
          </Link>
        )}

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary-100 transition-colors">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-200 mb-4 line-clamp-2">
          {truncateText(post.excerpt || '', 150)}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author?.node?.name || 'Unknown Author'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatRelativeTime(post.date)}</span>
          </div>
          {post.commentCount > 0 && (
            <div className="flex items-center gap-2">
              <span>{post.commentCount} comments</span>
            </div>
          )}
        </div>

        {/* Read More Button */}
        <Link 
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium transition-all hover:gap-3 group/btn self-start backdrop-blur-sm"
          style={{ 
            backgroundColor: categoryColor,
            border: `1px solid ${categoryColor}80`
          }}
        >
          Read Story
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}