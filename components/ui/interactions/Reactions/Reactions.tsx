'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { reactionsManager, ReactionType } from '@/lib/reactions/reactions';
import ReactionButton from './ReactionButton';
import ReactionStats from './ReactionStats';
import { ThumbsUp, Heart, Lightbulb, HelpCircle, PartyPopper } from 'lucide-react';

interface ReactionsProps {
  postId: number;
  initialStats?: {
    like: number;
    love: number;
    insightful: number;
    helpful: number;
    celebrate: number;
    total: number;
    userReaction?: ReactionType | null;
  };
  compact?: boolean;
  showCounts?: boolean;
}

const REACTIONS: Array<{
  type: ReactionType;
  icon: React.ReactNode;
  label: string;
  color: string;
}> = [
  {
    type: 'like',
    icon: <ThumbsUp className="h-4 w-4" />,
    label: 'Like',
    color: '#3B82F6', // blue
  },
  {
    type: 'love',
    icon: <Heart className="h-4 w-4" />,
    label: 'Love',
    color: '#EF4444', // red
  },
  {
    type: 'insightful',
    icon: <Lightbulb className="h-4 w-4" />,
    label: 'Insightful',
    color: '#F59E0B', // amber
  },
  {
    type: 'helpful',
    icon: <HelpCircle className="h-4 w-4" />,
    label: 'Helpful',
    color: '#10B981', // emerald
  },
  {
    type: 'celebrate',
    icon: <PartyPopper className="h-4 w-4" />,
    label: 'Celebrate',
    color: '#8B5CF6', // violet
  },
];

export default function Reactions({
  postId,
  initialStats,
  compact = false,
  showCounts = true,
}: ReactionsProps) {
  const { themeColors } = useTheme();
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadReactions = async () => {
    setIsLoading(true);
    try {
      const reactionStats = await reactionsManager.getReactions(postId);
      setStats(reactionStats);
    } catch (error) {
      console.error('Error loading reactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (reactionType: ReactionType) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/reactions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          reaction: reactionType,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        
        // Show animation feedback
        const button = document.getElementById(`reaction-${reactionType}-${postId}`);
        if (button) {
          button.classList.add('animate-bounce');
          setTimeout(() => {
            button.classList.remove('animate-bounce');
          }, 300);
        }
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!initialStats) {
      loadReactions();
    }
  }, [postId]);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center gap-2">
        {REACTIONS.map((reaction) => (
          <div
            key={reaction.type}
            className="w-8 h-8 rounded-full animate-pulse"
            style={{ backgroundColor: themeColors.border + '40' }}
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {REACTIONS.map((reaction) => (
          <ReactionButton
            key={reaction.type}
            type={reaction.type}
            count={stats[reaction.type]}
            isActive={stats.userReaction === reaction.type}
            onClick={() => handleReaction(reaction.type)}
            disabled={isUpdating}
            compact
          />
        ))}
        {showCounts && stats.total > 0 && (
          <span className="text-sm ml-2" style={{ color: themeColors.text.secondary }}>
            {stats.total}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Reaction Stats Summary */}
      <ReactionStats stats={stats} />
      
      {/* Reaction Buttons */}
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((reaction) => (
          <ReactionButton
            key={reaction.type}
            type={reaction.type}
            count={stats[reaction.type]}
            isActive={stats.userReaction === reaction.type}
            onClick={() => handleReaction(reaction.type)}
            disabled={isUpdating}
            label={reaction.label}
            icon={reaction.icon}
            color={reaction.color}
          />
        ))}
      </div>
      
      {/* Total Reactions */}
      {showCounts && stats.total > 0 && (
        <div className="text-sm pt-2 border-t" style={{ 
          color: themeColors.text.secondary,
          borderColor: themeColors.border + '40'
        }}>
          <span className="font-medium">{stats.total}</span> total reaction{stats.total !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
