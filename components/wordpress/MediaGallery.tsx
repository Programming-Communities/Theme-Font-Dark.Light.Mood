'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import { WordPressMedia } from '@/types/wordpress';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import styles from './MediaGallery.module.css';

interface MediaGalleryProps {
  mediaIds?: number[];
  mediaItems?: WordPressMedia[];
  postId?: number;
  columns?: number;
  gap?: number;
  showLightbox?: boolean;
  maxItems?: number;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  mediaIds = [],
  mediaItems = [],
  postId,
  columns = 3,
  gap = 4,
  showLightbox = true,
  maxItems = 12
}) => {
  const { theme, isDarkMode } = useTheme();
  const [media, setMedia] = useState<WordPressMedia[]>(mediaItems);
  const [loading, setLoading] = useState(mediaItems.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch media if not provided
  useEffect(() => {
    const fetchMedia = async () => {
      if (mediaItems.length === 0 && (mediaIds.length > 0 || postId)) {
        setLoading(true);
        setError(null);

        try {
          let queryParams = '';
          
          if (mediaIds.length > 0) {
            queryParams = `include=${mediaIds.join(',')}&per_page=${maxItems}`;
          } else if (postId) {
            queryParams = `post=${postId}&per_page=${maxItems}`;
          }

          const response = await fetch(`/api/wordpress/media?${queryParams}`);
          
          if (response.ok) {
            const data = await response.json();
            setMedia(data);
          } else {
            throw new Error('Failed to fetch media');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load media');
          console.error('Error fetching media:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMedia();
  }, [mediaIds, mediaItems.length, postId, maxItems]);

  // Handle image click for lightbox
  const handleImageClick = (index: number) => {
    if (showLightbox) {
      setSelectedImage(index);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Navigate lightbox
  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage(prev => 
        prev === 0 ? media.length - 1 : prev - 1
      );
    } else {
      setSelectedImage(prev => 
        prev === media.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox || selectedImage === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          navigateLightbox('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, showLightbox]);

  // Calculate pagination
  const itemsPerPage = columns * 3; // Show 3 rows initially
  const totalPages = Math.ceil(media.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMedia = media.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading media...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>🖼️</div>
        <p className={styles.emptyMessage}>No media found</p>
      </div>
    );
  }

  return (
    <div className={`${styles.mediaGallery} theme-${theme} ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Gallery Header */}
      <div className={styles.galleryHeader}>
        <h3 className={styles.galleryTitle}>Media Gallery</h3>
        <div className={styles.galleryStats}>
          <span className={styles.stat}>
            📸 {media.length} {media.length === 1 ? 'Item' : 'Items'}
          </span>
          {media.length > maxItems && (
            <span className={styles.stat}>
              Showing {paginatedMedia.length} of {media.length}
            </span>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div 
        className={styles.galleryGrid}
        style={{
          '--columns': columns,
          '--gap': `${gap}px`
        } as React.CSSProperties}
      >
        {paginatedMedia.map((item, index) => {
          const mediaUrl = item.source_url || item.media_details?.sizes?.full?.source_url;
          const thumbnailUrl = item.media_details?.sizes?.medium?.source_url || mediaUrl;
          const altText = item.alt_text || item.title?.rendered || 'Media item';
          const caption = item.caption?.rendered || '';
          
          return (
            <div 
              key={item.id} 
              className={styles.galleryItem}
              onClick={() => handleImageClick(startIndex + index)}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={thumbnailUrl || `/api/placeholder/300/200?theme=${theme}`}
                  alt={altText}
                  width={300}
                  height={200}
                  className={styles.image}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/api/placeholder/300/200?theme=${theme}`;
                  }}
                />
                
                {/* Media Type Badge */}
                <div className={styles.mediaType}>
                  {item.mime_type?.startsWith('image/') ? '📷' : 
                   item.mime_type?.startsWith('video/') ? '🎬' : 
                   item.mime_type?.startsWith('audio/') ? '🎵' : '📄'}
                </div>
              </div>
              
              {/* Media Info */}
              <div className={styles.mediaInfo}>
                {item.title?.rendered && (
                  <h4 
                    className={styles.mediaTitle}
                    dangerouslySetInnerHTML={{ __html: item.title.rendered }}
                  />
                )}
                
                {caption && (
                  <div 
                    className={styles.mediaCaption}
                    dangerouslySetInnerHTML={{ __html: caption }}
                  />
                )}
                
                <div className={styles.mediaMeta}>
                  {item.mime_type && (
                    <span className={styles.metaItem}>
                      {item.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                  )}
                  
                  {item.media_details?.filesize && (
                    <span className={styles.metaItem}>
                      📦 {Math.round(item.media_details.filesize / 1024)}KB
                    </span>
                  )}
                  
                  {item.date && (
                    <span className={styles.metaItem}>
                      📅 {new Date(item.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            ← Previous
          </button>
          
          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`${styles.pageButton} ${
                    currentPage === pageNum ? styles.active : ''
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next →
          </button>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage !== null && showLightbox && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button 
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ×
            </button>
            
            <div className={styles.lightboxImageContainer}>
              <Image
                src={media[selectedImage].source_url || `/api/placeholder/800/600?theme=${theme}`}
                alt={media[selectedImage].alt_text || 'Media'}
                width={800}
                height={600}
                className={styles.lightboxImage}
                priority
              />
              
              {/* Navigation Buttons */}
              <button
                className={styles.lightboxNavPrev}
                onClick={() => navigateLightbox('prev')}
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                className={styles.lightboxNavNext}
                onClick={() => navigateLightbox('next')}
                aria-label="Next image"
              >
                →
              </button>
            </div>
            
            {/* Lightbox Info */}
            <div className={styles.lightboxInfo}>
              <h4 className={styles.lightboxTitle}>
                {media[selectedImage].title?.rendered || 'Untitled'}
              </h4>
              
              {media[selectedImage].caption?.rendered && (
                <div 
                  className={styles.lightboxCaption}
                  dangerouslySetInnerHTML={{ 
                    __html: media[selectedImage].caption?.rendered || '' 
                  }}
                />
              )}
              
              {media[selectedImage].description?.rendered && (
                <div 
                  className={styles.lightboxDescription}
                  dangerouslySetInnerHTML={{ 
                    __html: media[selectedImage].description?.rendered || '' 
                  }}
                />
              )}
              
              <div className={styles.lightboxMeta}>
                <span className={styles.metaItem}>
                  Image {selectedImage + 1} of {media.length}
                </span>
                
                {media[selectedImage].mime_type && (
                  <span className={styles.metaItem}>
                    Type: {media[selectedImage].mime_type}
                  </span>
                )}
                
                {media[selectedImage].media_details?.width && (
                  <span className={styles.metaItem}>
                    Size: {media[selectedImage].media_details.width} ×{' '}
                    {media[selectedImage].media_details.height}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;