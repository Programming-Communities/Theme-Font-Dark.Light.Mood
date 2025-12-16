'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  maxWidth?: string;
  title?: string;
}

const variantClasses = {
  primary: 'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
  error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
  outline: 'bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600',
};

const sizeClasses = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-sm',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  className,
  icon,
  iconPosition = 'left',
  onClick,
  removable,
  onRemove,
  maxWidth,
  title,
}) => {
  const [isRemoved, setIsRemoved] = React.useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoved(true);
    onRemove?.();
  };

  if (isRemoved) return null;

  const badgeContent = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="mr-1.5 -ml-0.5">{icon}</span>
      )}
      <span className="truncate" title={title}>
        {children}
      </span>
      {icon && iconPosition === 'right' && (
        <span className="ml-1.5 -mr-0.5">{icon}</span>
      )}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-1.5 -mr-0.5 inline-flex items-center justify-center h-3 w-3 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-current"
          aria-label="Remove badge"
        >
          <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </>
  );

  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium whitespace-nowrap',
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    onClick && 'cursor-pointer hover:opacity-90 transition-opacity',
    className
  );

  const style = maxWidth ? { maxWidth } : undefined;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={baseClasses}
        style={style}
        title={title}
      >
        {badgeContent}
      </button>
    );
  }

  return (
    <span className={baseClasses} style={style} title={title}>
      {badgeContent}
    </span>
  );
};

export interface BadgeGroupProps {
  children: React.ReactNode;
  spacing?: 'none' | 'tight' | 'normal' | 'loose';
  className?: string;
  maxVisible?: number;
  moreLabel?: string;
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  children,
  spacing = 'normal',
  className,
  maxVisible,
  moreLabel = '+{count} more',
}) => {
  const spacingClasses = {
    none: 'space-x-0',
    tight: 'space-x-1',
    normal: 'space-x-2',
    loose: 'space-x-3',
  };

  const badges = React.Children.toArray(children);
  const visibleBadges = maxVisible ? badges.slice(0, maxVisible) : badges;
  const hiddenCount = maxVisible ? badges.length - maxVisible : 0;

  return (
    <div className={cn('flex flex-wrap items-center', spacingClasses[spacing], className)}>
      {visibleBadges.map((badge, index) => (
        <div key={index} className="mb-1">
          {badge}
        </div>
      ))}
      {hiddenCount > 0 && (
        <Badge variant="neutral" size="sm" title={`${hiddenCount} more items`}>
          {moreLabel.replace('{count}', hiddenCount.toString())}
        </Badge>
      )}
    </div>
  );
};

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft' | 'published' | 'archived';
  size?: BadgeProps['size'];
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  showIcon = true,
}) => {
  const statusConfig = {
    active: {
      variant: 'success' as const,
      label: 'Active',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    inactive: {
      variant: 'neutral' as const,
      label: 'Inactive',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
    },
    pending: {
      variant: 'warning' as const,
      label: 'Pending',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
    approved: {
      variant: 'success' as const,
      label: 'Approved',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    rejected: {
      variant: 'error' as const,
      label: 'Rejected',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
    },
    draft: {
      variant: 'neutral' as const,
      label: 'Draft',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
    },
    published: {
      variant: 'success' as const,
      label: 'Published',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    archived: {
      variant: 'neutral' as const,
      label: 'Archived',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
      ),
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      icon={showIcon ? config.icon : undefined}
    >
      {config.label}
    </Badge>
  );
};

export default Badge;