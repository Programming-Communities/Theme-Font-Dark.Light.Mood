'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export interface AlertProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  variant?: 'solid' | 'outline' | 'light';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  autoDismiss?: number; // milliseconds
}

const typeConfig = {
  success: {
    solid: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    outline: 'border-green-500 text-green-700 dark:text-green-300 bg-transparent',
    light: 'bg-green-50/50 dark:bg-green-900/10 text-green-700 dark:text-green-300',
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
  },
  error: {
    solid: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    outline: 'border-red-500 text-red-700 dark:text-red-300 bg-transparent',
    light: 'bg-red-50/50 dark:bg-red-900/10 text-red-700 dark:text-red-300',
    icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
  },
  warning: {
    solid: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
    outline: 'border-yellow-500 text-yellow-700 dark:text-yellow-300 bg-transparent',
    light: 'bg-yellow-50/50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-300',
    icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
  },
  info: {
    solid: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    outline: 'border-blue-500 text-blue-700 dark:text-blue-300 bg-transparent',
    light: 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300',
    icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
  },
  neutral: {
    solid: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300',
    outline: 'border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent',
    light: 'bg-gray-50/50 dark:bg-gray-800/10 text-gray-700 dark:text-gray-300',
    icon: <InformationCircleIcon className="h-5 w-5 text-gray-500" />,
  },
};

const actionVariantConfig = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-secondary text-white hover:bg-secondary/90',
  ghost: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
};

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  type = 'info',
  variant = 'solid',
  dismissible = false,
  onDismiss,
  className,
  icon,
  action,
  autoDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    if (autoDismiss && isVisible) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismiss);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const config = typeConfig[type];
  const alertIcon = icon || config.icon;

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4 transition-all duration-200',
        config[variant],
        dismissible && 'pr-10',
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        {alertIcon && (
          <div className="flex-shrink-0 mr-3 mt-0.5">{alertIcon}</div>
        )}
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-semibold mb-1">{title}</h3>
          )}
          <div className="text-sm">{message}</div>
          {action && (
            <div className="mt-3">
              <button
                type="button"
                onClick={action.onClick}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  actionVariantConfig[action.variant || 'primary']
                )}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:hover:text-gray-300"
          aria-label="Dismiss"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export interface AlertContainerProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  maxAlerts?: number;
  className?: string;
}

export const AlertContainer: React.FC<AlertContainerProps> = ({
  children,
  position = 'top-right',
  maxAlerts = 5,
  className,
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  };

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col space-y-3 w-full max-w-sm',
        positionClasses[position],
        className
      )}
    >
      {React.Children.toArray(children).slice(0, maxAlerts)}
    </div>
  );
};

export default Alert;