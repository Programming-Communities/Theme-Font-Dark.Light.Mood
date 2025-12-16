'use client';

import { ReactionStats as ReactionStatsType } from '@/lib/reactions/reactions';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { ThumbsUp, Heart, Lightbulb, HelpCircle, PartyPopper } from 'lucide-react';

interface ReactionStatsProps {
  stats: ReactionStatsType;
  showPercentage?: boolean;
  showTotal?: boolean;
}

const REACTION_CONFIG = [
  { type: 'like' as const, icon: ThumbsUp, label: 'Likes', color: '#3B82F6' },
  { type: 'love' as const, icon: Heart, label: 'Loves', color: '#EF4444' },
  { type: 'insightful' as const, icon: Lightbulb, label: 'Insightful', color: '#F59E0B' },
  { type: 'helpful' as const, icon: HelpCircle, label: 'Helpful', color: '#10B981' },
  { type: 'celebrate' as const, icon: PartyPopper, label: 'Celebrations', color: '#8B5CF6' },
];

export default function ReactionStats({ 
  stats, 
  showPercentage = false,
  showTotal = true 
}: ReactionStatsProps) {
  const { themeColors } = useTheme();
  
  const total = stats.total;
  const hasReactions = total > 0;

  if (!hasReactions) {
    return (
      <div className="text-center py-4" style={{ color: themeColors.text.secondary }}>
        No reactions yet. Be the first to react!
      </div>
    );
  }

  // Find top reaction
  const topReaction = REACTION_CONFIG.reduce((top, current) => {
    const currentCount = stats[current.type];
    const topCount = top ? stats[top.type] : 0;
    return currentCount > topCount ? current : top;
  }, REACTION_CONFIG[0]);

  return (
    <div className="space-y-4">
      {/* Total Stats */}
      {showTotal && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold" style={{ color: themeColors.text.primary }}>
              {total}
            </div>
            <div style={{ color: themeColors.text.secondary }}>
              reaction{total !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Top Reaction */}
          {topReaction && stats[topReaction.type] > 0 && (
            <div className="flex items-center gap-2">
              <topReaction.icon className="h-4 w-4" style={{ color: topReaction.color }} />
              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                Most {topReaction.label.toLowerCase()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Progress Bars */}
      <div className="space-y-2">
        {REACTION_CONFIG.map((reaction) => {
          const count = stats[reaction.type];
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const isActive = stats.userReaction === reaction.type;

          return (
            <div key={reaction.type} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${isActive ? 'ring-2 ring-offset-1' : ''}`}
                       style={{ 
                         backgroundColor: isActive ? `${reaction.color}20` : 'transparent',
                         color: isActive ? reaction.color : themeColors.text.secondary,
                         ringColor: reaction.color
                       }}>
                    <reaction.icon className="h-3 w-3" />
                  </div>
                  <span className="text-sm" style={{ color: themeColors.text.primary }}>
                    {reaction.label}
                  </span>
                  {isActive && (
                    <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ 
                            backgroundColor: `${reaction.color}20`,
                            color: reaction.color
                          }}>
                      You
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {showPercentage && (
                    <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                      {percentage.toFixed(1)}%
                    </span>
                  )}
                  <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                    {count}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 rounded-full overflow-hidden"
                   style={{ backgroundColor: themeColors.border + '40' }}>
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ 
                       width: `${percentage}%`,
                       backgroundColor: reaction.color,
                     }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="pt-3 border-t" style={{ borderColor: themeColors.border + '40' }}>
        <div className="flex flex-wrap gap-2">
          {REACTION_CONFIG
            .filter(reaction => stats[reaction.type] > 0)
            .map(reaction => (
              <div key={reaction.type} 
                   className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                   style={{ 
                     backgroundColor: `${reaction.color}15`,
                     color: reaction.color,
                     border: `1px solid ${reaction.color}30`
                   }}>
                <reaction.icon className="h-3 w-3" />
                <span>{stats[reaction.type]}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}