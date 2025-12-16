import Cookies from 'js-cookie';

export type ReactionType = 'like' | 'love' | 'insightful' | 'helpful' | 'celebrate';

export interface ReactionStats {
  like: number;
  love: number;
  insightful: number;
  helpful: number;
  celebrate: number;
  total: number;
  userReaction?: ReactionType | null;
}

export class ReactionsManager {
  private storageKey = 'ec_reactions';
  private cookieOptions = {
    expires: 365, // 1 year
    path: '/',
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
  };

  // Get reactions for a post
  async getReactions(postId: number): Promise<ReactionStats> {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use localStorage with fallback
      
      const stored = this.getStoredReactions();
      const postReactions = stored[postId] || {
        like: 0,
        love: 0,
        insightful: 0,
        helpful: 0,
        celebrate: 0,
      };

      // Get user's reaction from cookies
      const userReactions = this.getUserReactions();
      const userReaction = userReactions[postId];

      const total = Object.values(postReactions).reduce((sum, count) => sum + count, 0);

      return {
        ...postReactions,
        total,
        userReaction,
      };
    } catch (error) {
      console.error('Error getting reactions:', error);
      return this.getDefaultStats();
    }
  }

  // Update a reaction
  async updateReaction(postId: number, reaction: ReactionType): Promise<ReactionStats> {
    try {
      const stored = this.getStoredReactions();
      const userReactions = this.getUserReactions();
      
      const currentReaction = userReactions[postId];
      const postStats = stored[postId] || this.getDefaultStats();

      // Remove previous reaction if exists
      if (currentReaction && currentReaction !== reaction) {
        postStats[currentReaction] = Math.max(0, postStats[currentReaction] - 1);
      }

      // Toggle reaction
      if (currentReaction === reaction) {
        // Remove reaction
        delete userReactions[postId];
        postStats[reaction] = Math.max(0, postStats[reaction] - 1);
      } else {
        // Add reaction
        userReactions[postId] = reaction;
        postStats[reaction] = (postStats[reaction] || 0) + 1;
      }

      // Update storage
      stored[postId] = postStats;
      this.setStoredReactions(stored);
      this.setUserReactions(userReactions);

      // Calculate total
      const total = Object.values(postStats).reduce((sum, count) => sum + count, 0);

      return {
        ...postStats,
        total,
        userReaction: userReactions[postId] || null,
      };
    } catch (error) {
      console.error('Error updating reaction:', error);
      return this.getDefaultStats();
    }
  }

  // Get top reactions for a post
  getTopReaction(stats: ReactionStats): { type: ReactionType; count: number } | null {
    const reactions = Object.entries(stats)
      .filter(([key]) => key !== 'total' && key !== 'userReaction')
      .map(([type, count]) => ({ type: type as ReactionType, count: count as number }))
      .sort((a, b) => b.count - a.count);

    return reactions.length > 0 && reactions[0].count > 0 ? reactions[0] : null;
  }

  // Get reaction emoji
  getReactionEmoji(type: ReactionType): string {
    const emojis: Record<ReactionType, string> = {
      like: '👍',
      love: '❤️',
      insightful: '💡',
      helpful: '🆘',
      celebrate: '🎉',
    };
    return emojis[type];
  }

  // Get reaction label
  getReactionLabel(type: ReactionType): string {
    const labels: Record<ReactionType, string> = {
      like: 'Like',
      love: 'Love',
      insightful: 'Insightful',
      helpful: 'Helpful',
      celebrate: 'Celebrate',
    };
    return labels[type];
  }

  // Private helper methods
  private getDefaultStats(): ReactionStats {
    return {
      like: 0,
      love: 0,
      insightful: 0,
      helpful: 0,
      celebrate: 0,
      total: 0,
      userReaction: null,
    };
  }

  private getStoredReactions(): Record<number, Omit<ReactionStats, 'total' | 'userReaction'>> {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      return {};
    }
  }

  private setStoredReactions(reactions: Record<number, any>): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(reactions));
    } catch (error) {
      console.error('Error storing reactions:', error);
    }
  }

  private getUserReactions(): Record<number, ReactionType> {
    try {
      const cookie = Cookies.get('user_reactions');
      if (!cookie) return {};
      return JSON.parse(cookie) as Record<number, ReactionType>;
    } catch (error) {
      return {};
    }
  }

  private setUserReactions(reactions: Record<number, ReactionType>): void {
    try {
      Cookies.set('user_reactions', JSON.stringify(reactions), this.cookieOptions);
    } catch (error) {
      console.error('Error setting user reactions:', error);
    }
  }
}

// Singleton instance
export const reactionsManager = new ReactionsManager();