'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
}: ButtonProps) {
  const { themeColors } = useTheme();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyles = {
    primary: {
      backgroundColor: themeColors.primary,
      color: themeColors.text.accent,
      border: 'none',
      hover: `opacity-90`,
    },
    secondary: {
      backgroundColor: themeColors.secondary,
      color: themeColors.text.accent,
      border: 'none',
      hover: `opacity-90`,
    },
    outline: {
      backgroundColor: 'transparent',
      color: themeColors.primary,
      border: `1px solid ${themeColors.primary}`,
      hover: `bg-${themeColors.primary}10`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: themeColors.text.primary,
      border: 'none',
      hover: `bg-${themeColors.surface}`,
    },
    danger: {
      backgroundColor: themeColors.error,
      color: themeColors.text.accent,
      border: 'none',
      hover: `opacity-90`,
    },
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative inline-flex items-center justify-center gap-2
        rounded-lg font-medium
        transition-all duration-200
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 active:scale-98'}
        ${className}
      `}
      style={{
        backgroundColor: variantStyles[variant].backgroundColor,
        color: variantStyles[variant].color,
        border: variantStyles[variant].border,
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg"
             style={{ backgroundColor: variantStyles[variant].backgroundColor }}>
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}

      {/* Content */}
      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
        {leftIcon && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
      </span>
    </button>
  );
}