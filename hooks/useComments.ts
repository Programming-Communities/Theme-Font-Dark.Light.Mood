'use client';

import { useState, useCallback } from 'react';
import { WordPressClient } from '@/lib/wordpress';
import { Comment, CommentFormData } from '@/types/wordpress';
import { useAuth } from './useAuth';

const wordpressClient = new WordPressClient();

export function useComments(postId: number) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  const {
    data: comments,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR(
    postId ? ['comments', postId] : null,
    () => wordpressClient.getComments(postId),
    {
      revalidateOnFocus: false,
    }
  );

  const submitComment = useCallback(
    async (formData: CommentFormData, parentId?: number) => {
      if (!user || !token) {
        setError('You must be logged in to comment');
        return false;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const commentData: CommentFormData = {
          ...formData,
          post: postId,
          author: user.id,
          parent: parentId || 0,
        };

        const newComment = await wordpressClient.submitComment(commentData, token);
        
        // Update local cache
        await mutate(
          (currentData) => {
            if (!currentData) return [newComment];
            
            if (parentId) {
              // Add as reply to parent comment
              const updateComments = (comments: Comment[]): Comment[] => {
                return comments.map(comment => {
                  if (comment.id === parentId) {
                    return {
                      ...comment,
                      replies: [...(comment.replies || []), newComment],
                    };
                  }
                  if (comment.replies && comment.replies.length > 0) {
                    return {
                      ...comment,
                      replies: updateComments(comment.replies),
                    };
                  }
                  return comment;
                });
              };
              return updateComments(currentData);
            } else {
              // Add as top-level comment
              return [newComment, ...currentData];
            }
          },
          { revalidate: false }
        );

        setIsSubmitting(false);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit comment');
        setIsSubmitting(false);
        return false;
      }
    },
    [postId, user, token, mutate]
  );

  const deleteComment = useCallback(
    async (commentId: number) => {
      if (!token) {
        setError('Authentication required');
        return false;
      }

      try {
        await wordpressClient.deleteComment(commentId, token);
        
        // Update local cache
        await mutate(
          (currentData) => {
            if (!currentData) return [];
            
            const removeComment = (comments: Comment[]): Comment[] => {
              return comments
                .filter(comment => comment.id !== commentId)
                .map(comment => ({
                  ...comment,
                  replies: comment.replies ? removeComment(comment.replies) : [],
                }));
            };
            
            return removeComment(currentData);
          },
          { revalidate: false }
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete comment');
        return false;
      }
    },
    [token, mutate]
  );

  const updateComment = useCallback(
    async (commentId: number, content: string) => {
      if (!token) {
        setError('Authentication required');
        return false;
      }

      try {
        const updatedComment = await wordpressClient.updateComment(
          commentId,
          { content },
          token
        );
        
        // Update local cache
        await mutate(
          (currentData) => {
            if (!currentData) return [];
            
            const updateComments = (comments: Comment[]): Comment[] => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return { ...updatedComment, replies: comment.replies };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: updateComments(comment.replies),
                  };
                }
                return comment;
              });
            };
            
            return updateComments(currentData);
          },
          { revalidate: false }
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update comment');
        return false;
      }
    },
    [token, mutate]
  );

  return {
    comments: comments || [],
    isLoading,
    error: error || (fetchError?.message || null),
    isSubmitting,
    submitComment,
    deleteComment,
    updateComment,
    mutate,
  };
}

export function useCommentValidation() {
  const validateComment = useCallback((content: string, authorName?: string, authorEmail?: string) => {
    const errors: string[] = [];

    if (!content.trim()) {
      errors.push('Comment content is required');
    } else if (content.trim().length < 10) {
      errors.push('Comment must be at least 10 characters long');
    } else if (content.trim().length > 5000) {
      errors.push('Comment cannot exceed 5000 characters');
    }

    if (!authorName?.trim() && !authorEmail?.trim()) {
      // For guest comments
      if (!authorName?.trim()) errors.push('Name is required');
      if (!authorEmail?.trim()) errors.push('Email is required');
      if (authorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
        errors.push('Valid email is required');
      }
    }

    // Check for spam keywords
    const spamKeywords = ['buy now', 'cheap', 'discount', 'http://', 'https://'];
    const lowerContent = content.toLowerCase();
    spamKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword) && lowerContent.includes('http')) {
        errors.push('Comment appears to contain promotional content');
      }
    });

    return errors;
  }, []);

  return { validateComment };
}