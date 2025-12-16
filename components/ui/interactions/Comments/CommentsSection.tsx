'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { WordPressComment, commentsManager } from '@/lib/wordpress/comments';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { MessageSquare, Loader2, AlertCircle } from 'lucide-react';

interface CommentsSectionProps {
  postId: number;
  postTitle: string;
  initialComments?: WordPressComment[];
  commentCount?: number;
}

export default function CommentsSection({
  postId,
  postTitle,
  initialComments = [],
  commentCount = 0,
}: CommentsSectionProps) {
  const { themeColors } = useTheme();
  const [comments, setComments] = useState<WordPressComment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const loadComments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/comments/get?postId=${postId}`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data.comments.nodes || []);
      } else {
        setError(data.error || 'Failed to load comments');
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Failed to load comments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (commentData: {
    content: string;
    author: string;
    email: string;
    website?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/comments/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          ...commentData,
          parentId: replyingTo || undefined,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Reload comments
        await loadComments();
        setShowForm(false);
        setReplyingTo(null);
      } else {
        setError(data.error || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
    setShowForm(true);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setShowForm(false);
  };

  useEffect(() => {
    if (initialComments.length === 0) {
      loadComments();
    }
  }, [postId]);

  return (
    <div className="mt-12 pt-8 border-t" style={{ borderColor: themeColors.border }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" style={{ color: themeColors.primary }} />
          <h2 className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
            Comments {commentCount > 0 && `(${commentCount})`}
          </h2>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: themeColors.primary,
            color: themeColors.text.accent,
          }}
        >
          {showForm ? 'Cancel' : 'Add Comment'}
        </button>
      </div>

      {/* Comment Form */}
      {showForm && (
        <div className="mb-8">
          <CommentForm
            onSubmit={handleCommentSubmit}
            onCancel={handleCancelReply}
            isSubmitting={isLoading}
            replyingTo={replyingTo ? comments.find(c => c.databaseId === replyingTo)?.author.node.name : undefined}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg flex items-start gap-3"
             style={{ 
               backgroundColor: `${themeColors.error}15`,
               border: `1px solid ${themeColors.error}30`
             }}>
          <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: themeColors.error }} />
          <div>
            <p className="font-medium" style={{ color: themeColors.error }}>Error</p>
            <p className="text-sm" style={{ color: themeColors.text.secondary }}>{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" style={{ color: themeColors.primary }} />
          <p style={{ color: themeColors.text.secondary }}>Loading comments...</p>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <CommentList
          comments={comments}
          onReply={handleReply}
          isLoading={isLoading}
        />
      ) : !isLoading && !error ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 opacity-30">💬</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
            No comments yet
          </h3>
          <p style={{ color: themeColors.text.secondary }}>
            Be the first to share your thoughts!
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: themeColors.primary,
                color: themeColors.text.accent,
              }}
            >
              Start Discussion
            </button>
          )}
        </div>
      ) : null}

      {/* Load More Button */}
      {comments.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={loadComments}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: themeColors.surface,
              color: themeColors.text.primary,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More Comments'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
