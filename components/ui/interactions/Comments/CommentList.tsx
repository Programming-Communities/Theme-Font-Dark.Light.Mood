'use client';

import { WordPressComment } from '@/types/wordpress';
import { commentsManager } from '@/lib/wordpress/comments';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { MessageSquare, Reply, User, Clock, MoreVertical, Edit, Trash2, Flag } from 'lucide-react';
import { useState } from 'react';

interface CommentListProps {
  comments: WordPressComment[];
  onReply: (commentId: number) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

export default function CommentList({ 
  comments, 
  onReply, 
  isLoading = false,
  showActions = true 
}: CommentListProps) {
  const { themeColors } = useTheme();
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const formatDate = (dateString: string) => {
    return commentsManager.formatCommentDate(dateString);
  };

  const renderComment = (comment: WordPressComment, level = 0) => {
    const hasReplies = comment.replies?.nodes && comment.replies.nodes.length > 0;
    const isExpanded = expandedReplies[comment.databaseId] || false;
    const isReply = level > 0;

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 md:ml-12' : ''}`}>
        {/* Comment Card */}
        <div className={`p-4 rounded-lg mb-3 ${isReply ? 'border-l-2' : ''}`}
             style={{ 
               backgroundColor: themeColors.surface,
               borderColor: isReply ? `${themeColors.primary}30` : themeColors.border,
               border: isReply ? 'none' : `1px solid ${themeColors.border}`,
             }}>
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {comment.author.node.avatar?.url ? (
                  <img 
                    src={comment.author.node.avatar.url} 
                    alt={comment.author.node.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                       style={{ 
                         background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                       }}>
                    {comment.author.node.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div>
                <div className="font-medium text-sm" style={{ color: themeColors.text.primary }}>
                  {comment.author.node.name}
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: themeColors.text.secondary }}>
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(comment.date)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="relative group">
                <button className="p-1 rounded hover:bg-background transition-colors"
                        style={{ color: themeColors.text.secondary }}>
                  <MoreVertical className="h-4 w-4" />
                </button>
                
                <div className="absolute right-0 top-full mt-1 w-40 bg-surface border rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                     style={{ 
                       backgroundColor: themeColors.surface,
                       borderColor: themeColors.border,
                       color: themeColors.text.primary
                     }}>
                  <button className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-background transition-colors"
                          onClick={() => onReply(comment.databaseId)}>
                    <Reply className="h-3 w-3" />
                    Reply
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-background transition-colors">
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-background transition-colors">
                    <Flag className="h-3 w-3" />
                    Report
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-background transition-colors text-error">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="mb-3" style={{ color: themeColors.text.primary }}>
            <div className="prose prose-sm max-w-none" 
                 dangerouslySetInnerHTML={{ __html: comment.content }} />
          </div>

          {/* Comment Footer */}
          <div className="flex items-center justify-between pt-3 border-t"
               style={{ borderColor: themeColors.border + '40' }}>
            <div className="flex items-center gap-4">
              <button onClick={() => onReply(comment.databaseId)}
                      className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
                      style={{ color: themeColors.text.secondary }}>
                <Reply className="h-3 w-3" />
                Reply
              </button>
              
              {hasReplies && (
                <button onClick={() => toggleReplies(comment.databaseId)}
                        className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
                        style={{ color: themeColors.text.secondary }}>
                  <MessageSquare className="h-3 w-3" />
                  {isExpanded ? 'Hide' : 'Show'} {comment.replies?.nodes?.length} replies
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Replies */}
        {hasReplies && isExpanded && (
          <div className="mt-3">
            {comment.replies?.nodes?.map(reply => (
              <div key={reply.id}>
                {renderComment(reply, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading && comments.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg animate-pulse"
               style={{ backgroundColor: themeColors.surface + '40' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full" 
                   style={{ backgroundColor: themeColors.border }} />
              <div className="space-y-1">
                <div className="h-3 w-24 rounded" 
                     style={{ backgroundColor: themeColors.border }} />
                <div className="h-2 w-16 rounded" 
                     style={{ backgroundColor: themeColors.border }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded" 
                   style={{ backgroundColor: themeColors.border }} />
              <div className="h-3 w-4/5 rounded" 
                   style={{ backgroundColor: themeColors.border }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" 
                       style={{ color: themeColors.text.secondary }} />
        <p style={{ color: themeColors.text.secondary }}>
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => renderComment(comment))}
    </div>
  );
}