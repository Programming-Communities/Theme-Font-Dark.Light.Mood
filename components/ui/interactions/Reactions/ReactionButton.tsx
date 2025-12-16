'use client';

import { ReactionType } from '@/lib/reactions/reactions';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { ThumbsUp, Heart, Lightbulb, HelpCircle, PartyPopper } from 'lucide-react';

interface ReactionButtonProps {
  type: ReactionType;
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  compact?: boolean;
  label?: string;
  icon?: React.ReactNode;
  color?: string;
}

const DEFAULT_ICONS: Record<ReactionType, React.ReactNode> = {
  like: <ThumbsUp className="h-4 w-4" />,
  love: <Heart className="h-4 w-4" />,
  insightful: <Lightbulb className="h-4 w-4" />,
  helpful: <HelpCircle className="h-4 w-4" />,
  celebrate: <PartyPopper className="h-4 w-4" />,
};

const DEFAULT_LABELS: Record<ReactionType, string> = {
  like: 'Like',
  love: 'Love',
  insightful: 'Insightful',
  helpful: 'Helpful',
  celebrate: 'Celebrate',
};

const DEFAULT_COLORS: Record<ReactionType, string> = {
  like: '#3B82F6', // blue
  love: '#EF4444', // red
  insightful: '#F59E0B', // amber
  helpful: '#10B981', // emerald
  celebrate: '#8B5CF6', // violet
};

export default function ReactionButton({
  type,
  count,
  isActive,
  onClick,
  disabled = false,
  compact = false,
  label = DEFAULT_LABELS[type],
  icon = DEFAULT_ICONS[type],
  color = DEFAULT_COLORS[type],
}: ReactionButtonProps) {
  const { themeColors } = useTheme();

  if (compact) {
    return (
      <button
        id={`reaction-${type}`}
        onClick={onClick}
        disabled={disabled}
        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
          isActive ? 'scale-110' : 'hover:scale-105'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
        style={{
          backgroundColor: isActive ? `${color}20` : themeColors.surface,
          border: `1px solid ${isActive ? color : themeColors.border}`,
          color: isActive ? color : themeColors.text.secondary,
        }}
        title={label}
      >
        {icon}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: color,
                  color: 'white',
                  border: `1px solid ${themeColors.background}`
                }}>
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      id={`reaction-${type}`}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive ? 'scale-105 shadow-md' : 'hover:scale-102 hover:shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
      style={{
        backgroundColor: isActive ? `${color}15` : themeColors.surface,
        border: `1px solid ${isActive ? color : themeColors.border}`,
        color: isActive ? color : themeColors.text.secondary,
      }}
    >
      <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </div>
      
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">{label}</span>
        {count > 0 && (
          <span className="text-xs font-bold" style={{ color }}>
            {count}
          </span>
        )}
      </div>
    </button>
  );
}
