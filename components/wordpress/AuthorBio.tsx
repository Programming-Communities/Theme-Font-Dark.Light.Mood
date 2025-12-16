'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { WordPressAuthor, WordPressPost } from '@/types/wordpress';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import styles from './AuthorBio.module.css';

interface AuthorBioProps {
  authorId: number;
  authorData?: WordPressAuthor;
  showStats?: boolean;
  showRecentPosts?: boolean;
  showSocialLinks?: boolean;
  compact?: boolean;
}

const AuthorBio: React.FC<AuthorBioProps> = ({
  authorId,
  authorData,
  showStats = true,
  showRecentPosts = false,
  showSocialLinks = true,
  compact = false
}) => {
  const { theme, isDarkMode } = useTheme();
  const [author, setAuthor] = useState<WordPressAuthor | null>(authorData || null);
  const [loading, setLoading] = useState(!authorData);
  const [error, setError] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<WordPressPost[]>([]);
  const [stats, setStats] = useState({
    postCount: 0,
    commentCount: 0,
    likeCount: 0
  });

  // Fetch author data
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!authorData && authorId) {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/wordpress/users/${authorId}`);
          
          if (response.ok) {
            const data = await response.json();
            setAuthor(data);
            
            // Fetch author stats
            if (showStats) {
              await fetchAuthorStats(data.id);
            }
            
            // Fetch recent posts
            if (showRecentPosts) {
              await fetchRecentPosts(data.id);
            }
          } else {
            throw new Error('Failed to fetch author data');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load author');
          console.error('Error fetching author:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAuthorData();
  }, [authorId, authorData, showStats, showRecentPosts]);

  // Fetch author statistics
  const fetchAuthorStats = async (authorId: number) => {
    try {
      const response = await fetch(`/api/wordpress/users/${authorId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching author stats:', err);
    }
  };

  // Fetch recent posts by author
  const fetchRecentPosts = async (authorId: number) => {
    try {
      const response = await fetch(
        `/api/wordpress/posts?author=${authorId}&per_page=3&orderby=date&order=desc`
      );
      
      if (response.ok) {
        const data = await response.json();
        setRecentPosts(data);
      }
    } catch (err) {
      console.error('Error fetching recent posts:', err);
    }
  };

  // Get social links from author meta
  const getSocialLinks = () => {
    if (!author || !author.meta) return [];

    const socialLinks = [];
    
    // Check for common social media fields
    const socialFields = [
      { key: 'facebook', icon: 'facebook', label: 'Facebook' },
      { key: 'twitter', icon: 'twitter', label: 'Twitter' },
      { key: 'instagram', icon: 'instagram', label: 'Instagram' },
      { key: 'linkedin', icon: 'linkedin', label: 'LinkedIn' },
      { key: 'youtube', icon: 'youtube', label: 'YouTube' },
      { key: 'github', icon: 'github', label: 'GitHub' },
      { key: 'website', icon: 'link', label: 'Website' }
    ];

    socialFields.forEach(({ key, icon, label }) => {
      const value = author.meta?.[key] || author.meta?.[`${key}_url`];
      if (value) {
        socialLinks.push({
          platform: key,
          icon,
          label,
          url: key === 'website' ? value : 
               key === 'twitter' ? `https://twitter.com/${value.replace('@', '')}` :
               key === 'github' ? `https://github.com/${value}` :
               value
        });
      }
    });

    return socialLinks;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading author information...</p>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorMessage}>
          {error || 'Author information not available'}
        </p>
      </div>
    );
  }

  const socialLinks = getSocialLinks();
  const avatarUrl = author.avatar_urls?.['96'] || 
                   author.avatar_urls?.['48'] || 
                   `/api/placeholder/96/96?theme=${theme}&text=${encodeURIComponent(author.name.charAt(0))}`;

  return (
    <div className={`${styles.authorBio} theme-${theme} ${isDarkMode ? 'dark' : 'light'} ${compact ? styles.compact : ''}`}>
      {/* Author Header */}
      <div className={styles.authorHeader}>
        <div className={styles.avatarContainer}>
          <Image
            src={avatarUrl}
            alt={author.name}
            width={compact ? 64 : 96}
            height={compact ? 64 : 96}
            className={styles.avatar}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/api/placeholder/${compact ? '64' : '96'}/${compact ? '64' : '96'}?theme=${theme}&text=${encodeURIComponent(author.name.charAt(0))}`;
            }}
          />
          
          {author.meta?.verified && (
            <div className={styles.verifiedBadge} title="Verified Author">
              ✓
            </div>
          )}
        </div>
        
        <div className={styles.authorInfo}>
          <h3 className={styles.authorName}>
            <Link href={`/author/${author.slug}`} className={styles.authorLink}>
              {author.name}
            </Link>
          </h3>
          
          {author.description && (
            <p className={styles.authorDescription}>
              {compact ? 
                `${author.description.substring(0, 100)}${author.description.length > 100 ? '...' : ''}` :
                author.description
              }
            </p>
          )}
          
          {author.meta?.role && (
            <div className={styles.authorRole}>
              <span className={styles.roleIcon}>👨‍💼</span>
              {author.meta.role}
            </div>
          )}
        </div>
      </div>

      {/* Author Stats */}
      {showStats && !compact && (
        <div className={styles.authorStats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {stats.postCount || author.meta?.post_count || 0}
            </div>
            <div className={styles.statLabel}>Posts</div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {stats.commentCount || 0}
            </div>
            <div className={styles.statLabel}>Comments</div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {stats.likeCount || 0}
            </div>
            <div className={styles.statLabel}>Likes</div>
          </div>
          
          {author.meta?.member_since && (
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {new Date(author.meta.member_since).getFullYear()}
              </div>
              <div className={styles.statLabel}>Member Since</div>
            </div>
          )}
        </div>
      )}

      {/* Social Links */}
      {showSocialLinks && socialLinks.length > 0 && !compact && (
        <div className={styles.socialLinks}>
          <h4 className={styles.socialTitle}>Follow Author</h4>
          <div className={styles.socialIcons}>
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                title={`Follow on ${link.label}`}
              >
                <span className={styles.icon}>{getSocialIcon(link.icon)}</span>
                <span className={styles.platform}>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {showRecentPosts && recentPosts.length > 0 && !compact && (
        <div className={styles.recentPosts}>
          <h4 className={styles.recentTitle}>Recent Posts</h4>
          <div className={styles.postsList}>
            {recentPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className={styles.postItem}
              >
                <div className={styles.postThumbnail}>
                  <Image
                    src={post.featured_media_url || `/api/placeholder/60/40?theme=${theme}`}
                    alt={post.title.rendered || 'Post'}
                    width={60}
                    height={40}
                    className={styles.thumbnail}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/api/placeholder/60/40?theme=${theme}`;
                    }}
                  />
                </div>
                <div className={styles.postInfo}>
                  <h5 
                    className={styles.postTitle}
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div className={styles.postDate}>
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Actions */}
      {!compact && (
        <div className={styles.authorActions}>
          <Link 
            href={`/author/${author.slug}`}
            className={styles.viewProfileButton}
          >
            View Full Profile
          </Link>
          
          <button className={styles.followButton}>
            Follow Author
          </button>
          
          <button className={styles.messageButton}>
            Send Message
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to get social icons
const getSocialIcon = (platform: string) => {
  const icons: Record<string, string> = {
    facebook: '📘',
    twitter: '🐦',
    instagram: '📷',
    linkedin: '💼',
    youtube: '📺',
    github: '💻',
    link: '🔗'
  };
  
  return icons[platform] || '🔗';
};

export default AuthorBio;