'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface MainContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  centered?: boolean;
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: 'px-0',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
};

export default function MainContainer({
  children,
  size = 'lg',
  padding = 'md',
  className = '',
  centered = true,
}: MainContainerProps) {
  const { themeColors } = useTheme();

  return (
    <div className={`${centered ? 'mx-auto' : ''} ${sizeClasses[size]} ${paddingClasses[padding]} ${className}`}
         style={{ color: themeColors.text.primary }}>
      {children}
    </div>
  );
}