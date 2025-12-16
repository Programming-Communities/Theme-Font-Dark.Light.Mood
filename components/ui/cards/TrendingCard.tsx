'use client';

import { WordPressPost } from '@/types/wordpress';
import { formatRelativeTime, truncateText, getCategoryColor } from '@/lib/wordpress/utils';
import { TrendingUp, MessageSquare, Eye, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface TrendingCardProps {
  post: WordPressPost;
  rank: number;
  showRank?: boolean;
  compact?: boolean;
}

export default function TrendingCard({ post, rank, showRank = true, compact = false }: TrendingCardProps) {
  const { themeColors } = useTheme();
  const primaryCategory = post.categories?.nodes?.[0];
  const categoryColor = primaryCategory ? getCategoryColor(primaryCategory.slug) : themeColors.primary;
  
  const rankColors = [
    '#FFD700', // Gold
    '#C0C0C0', // Silver
    '#CD7F32', // Bronze
    themeColors.primary,
    themeColors.secondary,
  ];

  const rankColor = rank <= 3 ? rankColors[rank - 1] : themeColors.text.secondary;

  if (compact) {
    return (
      <div className="group flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-surface">
        {/* Rank */}
        {showRank && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                 style={{ 
                   backgroundColor: `${rankColor}15`,
                   color: rankColor,
                   border: `1px solid ${rankColor}30`
                 }}>
              {rank}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs" style={{ color: themeColors.text.secondary }}>
            <Clock className="h-3 w-3" />
            <span>{formatRelativeTime(post.date)}</span>
            {post.commentCount > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {post.commentCount}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Trending Icon */}
        <TrendingUp className="h-4 w-4 flex-shrink-0" style={{ color: rankColor }} />
      </div>
    );
  }

  return (
    <div className="group bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      <div className="flex">
        {/* Rank & Image */}
        <div className="relative flex-shrink-0 w-32">
          {post.featuredImage?.node?.sourceUrl ? (
            <div className="absolute inset-0">
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="150px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
          )}
          
          {/* Rank Badge */}
          {showRank && (
            <div className="absolute top-3 left-3 z-10">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold backdrop-blur-sm"
                   style={{ 
                     backgroundColor: `${rankColor}40`,
                     color: 'white',
                     border: `1px solid ${rankColor}60`
                   }}>
                {rank}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {/* Category */}
          {primaryCategory && (
            <Link 
              href={`/categories/${primaryCategory.slug}`}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium mb-2"
              style={{ 
                backgroundColor: `${categoryColor}15`,
                color: categoryColor
              }}
            >
              {primaryCategory.name}
            </Link>
          )}

          {/* Title */}
          <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`} className="hover:underline text-sm">
              {post.title}
            </Link>
          </h3>

          {/* Meta */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(post.date)}</span>
              </div>
              {post.commentCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{post.commentCount}</span>
                </div>
              )}
            </div>

            {/* Trending Indicator */}
            <div className="flex items-center gap-1 text-xs" style={{ color: rankColor }}>
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">Trending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}