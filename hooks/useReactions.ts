'use client';

import { useState, useCallback } from 'react';
import { WordPressClient } from '@/lib/wordpress';
import { ReactionType, UserReaction } from '@/types/wordpress';
import { useAuth } from './useAuth';

const wordpressClient = new WordPressClient();

export type ReactionCount = {
  [key in ReactionType]: number;
};

export type UserReactionState = {
  [key in ReactionType]: boolean;
};

export function useReactions(postId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  const {
    data: reactionData,
    mutate: mutateReactions,
  } = useSWR(
    postId ? ['reactions', postId] : null,
    () => wordpressClient.getPostReactions(postId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  const {
    data: userReactionData,
    mutate: mutateUserReactions,
  } = useSWR(
    user && postId ? ['user-reactions', postId, user.id] : null,
    () => wordpressClient.getUserReactions(postId, user.id, token),
    {
      revalidateOnFocus: false,
    }
  );

  const reactionCounts: ReactionCount = {
    like: reactionData?.like || 0,
    love: reactionData?.love || 0,
    insightful: reactionData?.insightful || 0,
    helpful: reactionData?.helpful || 0,
    celebrate: reactionData?.celebrate || 0,
  };

  const userReactions: UserReactionState = {
    like: userReactionData?.some(r => r.reactionType === 'like') || false,
    love: userReactionData?.some(r => r.reactionType === 'love') || false,
    insightful: userReactionData?.some(r => r.reactionType === 'insightful') || false,
    helpful: userReactionData?.some(r => r.reactionType === 'helpful') || false,
    celebrate: userReactionData?.some(r => r.reactionType === 'celebrate') || false,
  };

  const toggleReaction = useCallback(
    async (reactionType: ReactionType) => {
      if (!user || !token) {
        setError('You must be logged in to react');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const hasReacted = userReactions[reactionType];
        
        if (hasReacted) {
          // Remove reaction
          const userReaction = userReactionData?.find(r => r.reactionType === reactionType);
          if (userReaction) {
            await wordpressClient.removeReaction(userReaction.id, token);
          }
        } else {
          // Add reaction
          await wordpressClient.addReaction({
            post: postId,
            user: user.id,
            reactionType,
          }, token);
        }

        // Update both caches
        await Promise.all([
          mutateReactions(
            (currentData) => {
              if (!currentData) return { [reactionType]: 1 };
              
              return {
                ...currentData,
                [reactionType]: hasReacted
                  ? Math.max(0, (currentData[reactionType] || 0) - 1)
                  : (currentData[reactionType] || 0) + 1,
              };
            },
            { revalidate: false }
          ),
          mutateUserReactions(
            (currentData) => {
              if (!currentData) return [];

              if (hasReacted) {
                // Remove reaction
                return currentData.filter(r => r.reactionType !== reactionType);
              } else {
                // Add reaction
                const newReaction: UserReaction = {
                  id: Date.now(), // Temporary ID
                  post: postId,
                  user: user.id,
                  reactionType,
                  date: new Date().toISOString(),
                };
                return [...currentData, newReaction];
              }
            },
            { revalidate: false }
          ),
        ]);

        // Play animation
        if (!hasReacted) {
          playReactionAnimation(reactionType);
        }

        setIsLoading(false);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update reaction');
        setIsLoading(false);
        return false;
      }
    },
    [postId, user, token, userReactions, userReactionData, mutateReactions, mutateUserReactions]
  );

  const getReactionSummary = useCallback(() => {
    const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);
    const userReactionCount = Object.values(userReactions).filter(Boolean).length;

    let topReaction: ReactionType | null = null;
    let maxCount = 0;

    Object.entries(reactionCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topReaction = type as ReactionType;
      }
    });

    return {
      totalReactions,
      userReactionCount,
      topReaction,
      hasReacted: userReactionCount > 0,
    };
  }, [reactionCounts, userReactions]);

  return {
    reactionCounts,
    userReactions,
    isLoading,
    error,
    toggleReaction,
    getReactionSummary,
    mutateReactions,
    mutateUserReactions,
  };
}

function playReactionAnimation(reactionType: ReactionType) {
  // This would be implemented with a proper animation library
  // For now, we'll just add a CSS class to trigger animation
  const emojiMap = {
    like: '👍',
    love: '❤️',
    insightful: '💡',
    helpful: '✅',
    celebrate: '🎉',
  };

  // Create floating emoji
  const emoji = document.createElement('div');
  emoji.textContent = emojiMap[reactionType];
  emoji.className = 'reaction-float-animation';
  emoji.style.position = 'fixed';
  emoji.style.zIndex = '9999';
  emoji.style.pointerEvents = 'none';
  emoji.style.fontSize = '2rem';
  emoji.style.left = '50%';
  emoji.style.top = '50%';
  emoji.style.transform = 'translate(-50%, -50%)';

  document.body.appendChild(emoji);

  // Remove after animation
  setTimeout(() => {
    emoji.remove();
  }, 1000);
}

export function useReactionAnalytics() {
  const trackReactionEvent = useCallback((reactionType: ReactionType, postId: number) => {
    // Track in analytics
    if (window.gtag) {
      window.gtag('event', 'reaction', {
        event_category: 'engagement',
        event_label: reactionType,
        value: postId,
      });
    }

    // Track in Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'Reaction', {
        reaction_type: reactionType,
        content_id: postId,
      });
    }
  }, []);

  return { trackReactionEvent };
}