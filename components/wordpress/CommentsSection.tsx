'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { WordPressComment, CommentFormData } from '@/types/wordpress';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import { formatDate, validateEmail, sanitizeHTML } from '@/utils/helpers';
import styles from './CommentsSection.module.css';

interface CommentsSectionProps {
  postId: number;
  comments?: WordPressComment[];
  totalComments?: number;
  allowComments?: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  comments: initialComments = [],
  totalComments = 0,
  allowComments = true
}) => {
  const { theme, isDarkMode } = useTheme();
  const [comments, setComments] = useState<WordPressComment[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<CommentFormData>({
    author_name: '',
    author_email: '',
    author_url: '',
    content: '',
    parent: 0
  });

  // Fetch comments if not provided
  useEffect(() => {
    const fetchComments = async () => {
      if (initialComments.length === 0 && postId) {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/wordpress/comments?postId=${postId}&per_page=50&order=asc`
          );
          
          if (response.ok) {
            const data = await response.json();
            setComments(data);
          }
        } catch (err) {
          console.error('Error fetching comments:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchComments();
  }, [postId, initialComments.length]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Handle comment submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.author_name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!formData.author_email.trim() || !validateEmail(formData.author_email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Please enter a comment');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/wordpress/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          post: postId,
          parent: replyTo || 0
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        
        // Add new comment to list
        if (replyTo) {
          // Find parent comment and add reply
          setComments(prev => prev.map(comment => {
            if (comment.id === replyTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment]
              };
            }
            return comment;
          }));
        } else {
          // Add as top-level comment
          setComments(prev => [newComment, ...prev]);
        }

        // Reset form
        setFormData({
          author_name: '',
          author_email: '',
          author_url: '',
          content: '',
          parent: 0
        });
        setReplyTo(null);
        setShowForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit comment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle reply form
  const handleReplyClick = (commentId: number, authorName: string) => {
    setReplyTo(commentId);
    setShowForm(true);
    setFormData(prev => ({
      ...prev,
      content: `@${authorName} `
    }));
    // Scroll to form
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cancel reply
  const handleCancelReply = () => {
    setReplyTo(null);
    setFormData(prev => ({
      ...prev,
      content: '',
      parent: 0
    }));
  };

  // Render comment with replies
  const renderComment = (comment: WordPressComment, depth = 0) => {
    const isReply = depth > 0;
    
    return (
      <div 
        key={comment.id} 
        className={`${styles.comment} ${isReply ? styles.reply : ''}`}
        style={{ marginLeft: `${depth * 40}px` }}
      >
        <div className={styles.commentHeader}>
          <div className={styles.authorInfo}>
            {comment.author_avatar_urls?.['96'] && (
              <img
                src={comment.author_avatar_urls['96']}
                alt={comment.author_name}
                className={styles.avatar}
              />
            )}
            <div className={styles.authorMeta}>
              <strong className={styles.authorName}>
                {comment.author_name}
              </strong>
              {comment.author_url && (
                <a 
                  href={comment.author_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.authorWebsite}
                >
                  Website
                </a>
              )}
            </div>
          </div>
          
          <div className={styles.commentMeta}>
            <time className={styles.commentDate} dateTime={comment.date}>
              {formatDate(comment.date)}
            </time>
            {allowComments && !isReply && depth < 2 && (
              <button
                onClick={() => handleReplyClick(comment.id, comment.author_name)}
                className={styles.replyButton}
              >
                Reply
              </button>
            )}
          </div>
        </div>

        <div 
          className={styles.commentContent}
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(comment.content.rendered) }}
        />

        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.replies}>
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading comments...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.commentsSection} theme-${theme} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Comments ({totalComments || comments.length})
        </h2>
        
        {allowComments && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.addCommentButton}
          >
            Add Comment
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showForm && allowComments && (
        <form 
          id="comment-form" 
          onSubmit={handleSubmit} 
          className={styles.commentForm}
        >
          <h3 className={styles.formTitle}>
            {replyTo ? 'Reply to Comment' : 'Leave a Comment'}
          </h3>

          {replyTo && (
            <div className={styles.replyNotice}>
              Replying to comment #{replyTo}
              <button
                type="button"
                onClick={handleCancelReply}
                className={styles.cancelReplyButton}
              >
                Cancel Reply
              </button>
            </div>
          )}

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="author_name" className={styles.label}>
                Name *
              </label>
              <input
                type="text"
                id="author_name"
                name="author_name"
                value={formData.author_name}
                onChange={handleInputChange}
                className={styles.input}
                required
                disabled={submitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="author_email" className={styles.label}>
                Email *
              </label>
              <input
                type="email"
                id="author_email"
                name="author_email"
                value={formData.author_email}
                onChange={handleInputChange}
                className={styles.input}
                required
                disabled={submitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="author_url" className={styles.label}>
                Website (optional)
              </label>
              <input
                type="url"
                id="author_url"
                name="author_url"
                value={formData.author_url}
                onChange={handleInputChange}
                className={styles.input}
                disabled={submitting}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              Comment *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className={styles.textarea}
              rows={5}
              required
              disabled={submitting}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="small" />
                  Submitting...
                </>
              ) : (
                'Submit Comment'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                handleCancelReply();
              }}
              className={styles.cancelButton}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className={styles.noComments}>
          <p>No comments yet. Be the first to comment!</p>
          {!showForm && allowComments && (
            <button
              onClick={() => setShowForm(true)}
              className={styles.addCommentButton}
            >
              Add First Comment
            </button>
          )}
        </div>
      ) : (
        <div className={styles.commentsList}>
          {comments
            .filter(comment => !comment.parent)
            .map(comment => renderComment(comment))}
        </div>
      )}

      {/* Comment Guidelines */}
      <div className={styles.guidelines}>
        <h4 className={styles.guidelinesTitle}>Comment Guidelines:</h4>
        <ul className={styles.guidelinesList}>
          <li>Be respectful and constructive</li>
          <li>Stay on topic</li>
          <li>No spam or self-promotion</li>
          <li>Use appropriate language</li>
          <li>Your email will not be published</li>
        </ul>
      </div>
    </div>
  );
};

export default CommentsSection;