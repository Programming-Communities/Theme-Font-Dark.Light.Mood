'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
  notification?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  activeId?: string;
  onChange?: (id: string) => void;
  variant?: 'default' | 'underline' | 'pills' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  keepMounted?: boolean;
}

interface TabsContextType {
  activeId: string;
  setActiveId: (id: string) => void;
  variant: TabsProps['variant'];
  size: TabsProps['size'];
  orientation: TabsProps['orientation'];
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const variantClasses = {
  default: {
    active: 'border-primary text-primary',
    inactive: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300',
    container: 'border-b border-gray-200 dark:border-gray-700',
  },
  underline: {
    active: 'text-primary border-b-2 border-primary',
    inactive: 'text-gray-600 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-900 dark:hover:text-gray-300',
    container: 'border-b border-gray-200 dark:border-gray-700',
  },
  pills: {
    active: 'bg-primary text-white',
    inactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    container: 'space-x-1',
  },
  cards: {
    active: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-primary shadow-sm',
    inactive: 'bg-gray-50 dark:bg-gray-900 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
    container: 'space-x-2',
  },
};

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveId,
  activeId: controlledActiveId,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  tabClassName,
  contentClassName,
  orientation = 'horizontal',
  keepMounted = false,
}) => {
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId || items[0]?.id || ''
  );

  const activeId = controlledActiveId ?? internalActiveId;

  const setActiveId = (id: string) => {
    if (!controlledActiveId) {
      setInternalActiveId(id);
    }
    onChange?.(id);
  };

  useEffect(() => {
    if (!activeId && items.length > 0) {
      const firstEnabled = items.find(item => !item.disabled);
      if (firstEnabled) {
        setActiveId(firstEnabled.id);
      }
    }
  }, [activeId, items]);

  const activeTab = items.find(item => item.id === activeId);

  const contextValue: TabsContextType = {
    activeId,
    setActiveId,
    variant,
    size,
    orientation,
  };

  const renderTabContent = () => {
    if (!activeTab) return null;

    if (keepMounted) {
      return (
        <div className={cn('mt-4', contentClassName)}>
          {items.map(item => (
            <div
              key={item.id}
              className={cn(item.id !== activeId && 'hidden')}
            >
              {item.content}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={cn('mt-4', contentClassName)}>
        {activeTab.content}
      </div>
    );
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          orientation === 'vertical' && 'flex space-x-4',
          className
        )}
      >
        <div
          className={cn(
            'flex',
            orientation === 'vertical' 
              ? 'flex-col space-y-1 border-r border-gray-200 dark:border-gray-700 pr-4' 
              : cn('space-x-1', variantClasses[variant].container),
            fullWidth && orientation === 'horizontal' && 'w-full'
          )}
          role="tablist"
        >
          {items.map((item) => (
            <TabTrigger
              key={item.id}
              item={item}
              fullWidth={fullWidth}
              className={tabClassName}
            />
          ))}
        </div>
        {renderTabContent()}
      </div>
    </TabsContext.Provider>
  );
};

interface TabTriggerProps {
  item: TabItem;
  fullWidth?: boolean;
  className?: string;
}

const TabTrigger: React.FC<TabTriggerProps> = ({
  item,
  fullWidth,
  className,
}) => {
  const { activeId, setActiveId, variant, size, orientation } = useTabs();
  const isActive = activeId === item.id;
  const config = variantClasses[variant];

  const handleClick = () => {
    if (!item.disabled) {
      setActiveId(item.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={item.disabled}
      disabled={item.disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md',
        sizeClasses[size],
        isActive ? config.active : config.inactive,
        item.disabled && 'opacity-50 cursor-not-allowed',
        fullWidth && orientation === 'horizontal' && 'flex-1',
        orientation === 'vertical' && 'justify-start text-left',
        variant === 'pills' && 'rounded-full',
        variant === 'cards' && 'rounded-lg border',
        className
      )}
      tabIndex={item.disabled ? -1 : 0}
    >
      {item.icon && (
        <span className={cn('mr-2', size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')}>
          {item.icon}
        </span>
      )}
      <span>{item.label}</span>
      {(item.badge !== undefined || item.notification) && (
        <span className="ml-2 flex items-center">
          {item.badge !== undefined && (
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-full text-xs font-semibold min-w-[1.25rem] h-5 px-1',
                isActive && variant === 'pills'
                  ? 'bg-white/20'
                  : 'bg-primary text-white'
              )}
            >
              {item.badge}
            </span>
          )}
          {item.notification && !item.badge && (
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isActive && variant === 'pills'
                  ? 'bg-white'
                  : 'bg-primary'
              )}
            />
          )}
        </span>
      )}
    </button>
  );
};

export interface TabsContentProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  id,
  children,
  className,
}) => {
  const { activeId } = useTabs();

  if (activeId !== id) return null;

  return <div className={className}>{children}</div>;
};

export default Tabs;