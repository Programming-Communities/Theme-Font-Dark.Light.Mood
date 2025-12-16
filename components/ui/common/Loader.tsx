'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bar';
  className?: string;
  text?: string;
  fullScreen?: boolean;
  color?: 'primary' | 'secondary' | 'white' | 'muted';
}

const sizeClasses = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const colorClasses = {
  primary: 'text-primary border-primary',
  secondary: 'text-secondary border-secondary',
  white: 'text-white border-white',
  muted: 'text-gray-400 border-gray-400',
};

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  className,
  text,
  fullScreen = false,
  color = 'primary',
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex items-center justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-current animate-bounce',
                  size === 'xs' && 'h-1 w-1',
                  size === 'sm' && 'h-1.5 w-1.5',
                  size === 'md' && 'h-2 w-2',
                  size === 'lg' && 'h-2.5 w-2.5',
                  size === 'xl' && 'h-3 w-3',
                  colorClasses[color].split(' ')[0]
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={cn(
              'rounded-full bg-current animate-pulse',
              sizeClasses[size],
              colorClasses[color].split(' ')[0]
            )}
          />
        );

      case 'bar':
        return (
          <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full animate-loading-bar',
                color === 'primary' && 'bg-gradient-to-r from-primary to-secondary',
                color === 'secondary' && 'bg-gradient-to-r from-secondary to-primary',
                color === 'white' && 'bg-white',
                color === 'muted' && 'bg-gray-400'
              )}
            />
          </div>
        );

      case 'spinner':
      default:
        return (
          <div
            className={cn(
              'animate-spin rounded-full border-2 border-solid border-current border-t-transparent',
              sizeClasses[size],
              colorClasses[color]
            )}
          />
        );
    }
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {renderLoader()}
      {text && (
        <p
          className={cn(
            'mt-3 text-sm font-medium',
            color === 'white' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export interface SkeletonLoaderProps {
  count?: number;
  className?: string;
  type?: 'text' | 'card' | 'avatar' | 'image';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  className,
  type = 'text',
}) => {
  const renderSkeleton = (key: number) => {
    switch (type) {
      case 'card':
        return (
          <div
            key={key}
            className={cn(
              'rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse',
              className
            )}
          >
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg" />
            <div className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        );

      case 'avatar':
        return (
          <div
            key={key}
            className={cn(
              'rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse',
              className
            )}
          />
        );

      case 'image':
        return (
          <div
            key={key}
            className={cn(
              'bg-gray-200 dark:bg-gray-800 animate-pulse',
              className
            )}
          />
        );

      case 'text':
      default:
        return (
          <div
            key={key}
            className={cn(
              'h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse',
              className
            )}
          />
        );
    }
  };

  return <>{Array.from({ length: count }).map((_, i) => renderSkeleton(i))}</>;
};

export default Loader;