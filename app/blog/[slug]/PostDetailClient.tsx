'use client';

import { WordPressPost } from '@/types/wordpress';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { formatDate, getReadingTime, getCategoryColor } from '@/lib/wordpress/utils';
import { Calendar, User, Clock, MessageSquare, Share2, Bookmark, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PostCard from '@/components/ui/cards/PostCard';
import CommentsSection from '@/components/ui/interactions/Comments/CommentsSection';
import Reactions from '@/components/ui/interactions/Reactions/Reactions';
import { useState } from 'react';

interface PostDetailClientProps {
  post: WordPressPost;
  relatedPosts: WordPressPost[];
}

export default function PostDetailClient({ post, relatedPosts }: PostDetailClientProps) {
  const { themeColors } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [views, setViews] = useState(Math.floor(Math.random() * 1000) + 500);

  const primaryCategory = post.categories?.nodes?.[0];
  const categoryColor = primaryCategory ? getCategoryColor(primaryCategory.slug) : themeColors.primary;
  const readingTime = getReadingTime(post.content);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you would save this to localStorage or API
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      {/* Back Button */}
      <div className="sticky top-0 z-40 py-4 px-4 backdrop-blur-lg border-b"
           style={{ 
             backgroundColor: `${themeColors.background}dd`,
             borderColor: themeColors.border 
           }}>
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-surface"
            style={{ 
              color: themeColors.text.primary,
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Featured Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            
            {/* Category Overlay */}
            {primaryCategory && (
              <Link 
                href={`/categories/${primaryCategory.slug}`}
                className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
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
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" 
              style={{ color: themeColors.text.primary }}>
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6" style={{ color: themeColors.text.secondary }}>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{post.author?.node?.name || 'Unknown Author'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="p-4 rounded-lg mb-6" 
                 style={{ 
                   backgroundColor: `${themeColors.primary}10`,
                   border: `1px solid ${themeColors.primary}20`
                 }}>
              <p className="text-lg italic" style={{ color: themeColors.text.primary }}>
                {post.excerpt.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div 
            className="post-content"
            style={{ color: themeColors.text.primary }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Tags */}
        {post.tags?.nodes && post.tags.nodes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3" style={{ color: themeColors.text.primary }}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.nodes.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:opacity-90"
                  style={{ 
                    backgroundColor: `${themeColors.primary}15`,
                    color: themeColors.primary,
                    border: `1px solid ${themeColors.primary}30`
                  }}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reactions */}
        <div className="mb-8">
          <Reactions 
            postId={post.databaseId} 
            showCounts={true}
            compact={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-12 pb-8 border-b"
             style={{ borderColor: themeColors.border }}>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-surface"
            style={{ 
              color: themeColors.text.primary,
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`
            }}
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>

          <button
            onClick={handleBookmark}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: isBookmarked ? themeColors.primary : themeColors.surface,
              color: isBookmarked ? themeColors.text.accent : themeColors.text.primary,
              border: `1px solid ${isBookmarked ? themeColors.primary : themeColors.border}`
            }}
          >
            <Bookmark className="h-4 w-4" />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <Link
            href={`/blog/${post.slug}#comments`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-surface"
            style={{ 
              color: themeColors.text.primary,
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`
            }}
          >
            <MessageSquare className="h-4 w-4" />
            {post.commentCount || 0} Comments
          </Link>
        </div>

        {/* About Author */}
        {post.author?.node && (
          <div className="mb-12 p-6 rounded-xl border"
               style={{ 
                 backgroundColor: themeColors.surface,
                 borderColor: themeColors.border 
               }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
              About the Author
            </h3>
            <div className="flex items-start gap-4">
              {post.author.node.avatar?.url ? (
                <Image
                  src={post.author.node.avatar.url}
                  alt={post.author.node.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                     style={{ 
                       backgroundColor: themeColors.primary,
                       color: themeColors.text.accent 
                     }}>
                  {post.author.node.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-bold text-lg mb-2" style={{ color: themeColors.text.primary }}>
                  {post.author.node.name}
                </h4>
                <p style={{ color: themeColors.text.secondary }}>
                  Contributor at English Communities PK
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: themeColors.text.primary }}>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <CommentsSection 
          postId={post.databaseId}
          postTitle={post.title}
          commentCount={post.commentCount}
        />
      </div>
    </div>
  );
}