'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { WordPressPost } from '@/types/wordpress';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import { formatDate, stripHTML } from '@/utils/helpers';
import styles from './RelatedPosts.module.css';

interface RelatedPostsProps {
  currentPostId: number;
  categories?: number[];
  tags?: number[];
  limit?: number;
  showThumbnails?: boolean;
  showExcerpt?: boolean;
  showDate?: boolean;
  showReadTime?: boolean;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPostId,
  categories = [],
  tags = [],
  limit = 4,
  showThumbnails = true,
  showExcerpt = true,
  showDate = true,
  showReadTime = true
}) => {
  const { theme, isDarkMode } = useTheme();
  const [relatedPosts, setRelatedPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch related posts
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('exclude', currentPostId.toString());
        params.append('per_page', limit.toString());
        params.append('orderby', 'relevance');
        
        if (categories.length > 0) {
          params.append('categories', categories.join(','));
        }
        
        if (tags.length > 0) {
          params.append('tags', tags.join(','));
        }

        const response = await fetch(`/api/wordpress/posts?${params.toString()}`);
        
        if (response.ok) {
          const data = await response.json();
          setRelatedPosts(data);
        } else {
          throw new Error('Failed to fetch related posts');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load related posts');
        console.error('Error fetching related posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentPostId) {
      fetchRelatedPosts();
    }
  }, [currentPostId, categories, tags, limit]);

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const text = stripHTML(content);
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading related posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>📄</div>
        <p className={styles.emptyMessage}>No related posts found</p>
        <Link href="/blog" className={styles.browseButton}>
          Browse All Posts
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.relatedPosts} theme-${theme} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Related Posts</h3>
        <div className={styles.subtitle}>
          You might also be interested in these articles
        </div>
      </div>

      <div className={styles.postsGrid}>
        {relatedPosts.map((post) => {
          const featuredImage = post.featured_media_url || 
                               post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                               `/api/placeholder/300/200?theme=${theme}`;
          
          const excerpt = showExcerpt ? 
            `${stripHTML(post.excerpt.rendered).substring(0, 120)}...` : '';
          
          const readTime = showReadTime ? calculateReadTime(post.content.rendered) : null;

          return (
            <article key={post.id} className={styles.postCard}>
              {showThumbnails && (
                <Link href={`/blog/${post.slug}`} className={styles.imageLink}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={featuredImage}
                      alt={post.title.rendered || 'Post Image'}
                      width={300}
                      height={200}
                      className={styles.image}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `/api/placeholder/300/200?theme=${theme}`;
                      }}
                    />
                    <div className={styles.imageOverlay} />
                  </div>
                </Link>
              )}

              <div className={styles.postContent}>
                {post.categories && post.categories.length > 0 && (
                  <div className={styles.category}>
                    {post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized'}
                  </div>
                )}

                <h4 className={styles.postTitle}>
                  <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
                    <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  </Link>
                </h4>

                {showExcerpt && excerpt && (
                  <p className={styles.postExcerpt}>{excerpt}</p>
                )}

                <div className={styles.postMeta}>
                  {showDate && (
                    <time className={styles.postDate} dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  )}
                  
                  {showReadTime && readTime && (
                    <span className={styles.readTime}>
                      ⏱️ {readTime} min read
                    </span>
                  )}
                  
                  {post.comment_count > 0 && (
                    <span className={styles.commentCount}>
                      💬 {post.comment_count}
                    </span>
                  )}
                </div>

                <Link 
                  href={`/blog/${post.slug}`} 
                  className={styles.readMore}
                  aria-label={`Read more about ${post.title.rendered}`}
                >
                  Read More →
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {relatedPosts.length >= limit && (
        <div className={styles.footer}>
          <Link href="/blog" className={styles.viewAllButton}>
            View All Posts →
          </Link>
        </div>
      )}
    </div>
  );
};

export default RelatedPosts;