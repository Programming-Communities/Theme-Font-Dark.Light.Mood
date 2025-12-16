'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { WordPressPost } from '@/types/wordpress';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import { formatDate, stripHTML, truncateText } from '@/utils/helpers';
import styles from './PostRenderer.module.css';

interface PostRendererProps {
  post: WordPressPost;
  isExcerpt?: boolean;
  showFeaturedImage?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  maxLength?: number;
}

const PostRenderer: React.FC<PostRendererProps> = ({
  post,
  isExcerpt = false,
  showFeaturedImage = true,
  showAuthor = true,
  showDate = true,
  showCategories = true,
  showTags = false,
  maxLength = 300
}) => {
  const { theme, isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    // Process WordPress content
    const processContent = async () => {
      setIsLoading(true);
      
      let processedContent = isExcerpt ? post.excerpt.rendered : post.content.rendered;
      
      // Remove unnecessary WordPress shortcodes and format content
      processedContent = processedContent
        .replace(/\[.*?\]/g, '') // Remove shortcodes
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
        .replace(/style="[^"]*"/g, '') // Remove inline styles
        .trim();

      // Apply truncation if needed
      if (isExcerpt && maxLength > 0) {
        const plainText = stripHTML(processedContent);
        if (plainText.length > maxLength) {
          processedContent = `<p>${truncateText(plainText, maxLength)}...</p>`;
        }
      }

      setContent(processedContent);
      setIsLoading(false);
    };

    processContent();
  }, [post, isExcerpt, maxLength]);

  // Get featured image URL
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                       post.featured_media_url || 
                       `/api/placeholder/800/400?theme=${theme}`;

  // Get author info
  const author = post._embedded?.author?.[0] || { 
    name: post.author_name || 'Unknown Author', 
    slug: 'author' 
  };

  // Get categories
  const categories = post._embedded?.['wp:term']?.[0] || post.categories || [];

  // Get tags
  const tags = post._embedded?.['wp:term']?.[1] || post.tags || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <article className={`${styles.postContainer} theme-${theme} ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Post Header */}
      <header className={styles.postHeader}>
        {showFeaturedImage && featuredImage && (
          <div className={styles.featuredImage}>
            <Image
              src={featuredImage}
              alt={post.title.rendered || 'Post Image'}
              width={800}
              height={400}
              className={styles.image}
              priority={!isExcerpt}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `/api/placeholder/800/400?theme=${theme}`;
              }}
            />
          </div>
        )}

        <h1 className={styles.postTitle} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

        <div className={styles.postMeta}>
          {showAuthor && (
            <div className={styles.authorInfo}>
              <span className={styles.byText}>By</span>
              <Link href={`/author/${author.slug}`} className={styles.authorLink}>
                {author.name}
              </Link>
            </div>
          )}

          {showDate && (
            <time className={styles.postDate} dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          )}

          {post.modified !== post.date && (
            <div className={styles.updatedDate}>
              Updated: {formatDate(post.modified)}
            </div>
          )}
        </div>
      </header>

      {/* Post Content */}
      <div className={styles.postContent}>
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Post Footer */}
      <footer className={styles.postFooter}>
        {showCategories && categories.length > 0 && (
          <div className={styles.categories}>
            <span className={styles.footerLabel}>Categories:</span>
            <div className={styles.categoryList}>
              {categories.map((cat: any) => (
                <Link 
                  key={cat.id || cat} 
                  href={`/category/${cat.slug || cat}`}
                  className={styles.categoryTag}
                >
                  {cat.name || cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {showTags && tags.length > 0 && (
          <div className={styles.tags}>
            <span className={styles.footerLabel}>Tags:</span>
            <div className={styles.tagList}>
              {tags.map((tag: any) => (
                <Link 
                  key={tag.id || tag} 
                  href={`/tag/${tag.slug || tag}`}
                  className={styles.tag}
                >
                  #{tag.name || tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!isExcerpt && (
          <div className={styles.postStats}>
            <span className={styles.stat}>📊 {post.comment_count || 0} Comments</span>
            <span className={styles.stat}>👁️ {post.view_count || Math.floor(Math.random() * 1000)} Views</span>
            <span className={styles.stat}>⭐ {post.like_count || Math.floor(Math.random() * 500)} Likes</span>
          </div>
        )}
      </footer>
    </article>
  );
};

export default PostRenderer;