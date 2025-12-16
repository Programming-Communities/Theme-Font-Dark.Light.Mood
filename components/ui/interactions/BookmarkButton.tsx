'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';

export interface BookmarkButtonProps {
  itemId: string | number;
  itemType: 'post' | 'page' | 'resource' | 'video' | 'product';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'badge';
  showCount?: boolean;
  initialBookmarked?: boolean;
  initialCount?: number;
  className?: string;
  onToggle?: (bookmarked: boolean, count: number) => void;
}

interface BookmarkItem {
  id: string | number;
  type: BookmarkButtonProps['itemType'];
  title?: string;
  url?: string;
  image?: string;
  date?: Date;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  itemId,
  itemType,
  size = 'md',
  variant = 'icon',
  showCount = false,
  initialBookmarked = false,
  initialCount = 0,
  className,
  onToggle,
}) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Load bookmark state from localStorage for non-authenticated users
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      try {
        const bookmarks: BookmarkItem[] = JSON.parse(savedBookmarks);
        const isBookmarked = bookmarks.some(
          item => item.id === itemId && item.type === itemType
        );
        setBookmarked(isBookmarked);
      } catch (error) {
        console.error('Error parsing bookmarks from localStorage:', error);
      }
    }
  }, [itemId, itemType]);

  // Fetch bookmark count from API
  useEffect(() => {
    const fetchBookmarkCount = async () => {
      try {
        // This would be an API call to get bookmark count
        // For now, we'll simulate it
        // const response = await fetch(`/api/bookmarks/${itemId}/count`);
        // const data = await response.json();
        // setCount(data.count);
      } catch (error) {
        console.error('Error fetching bookmark count:', error);
      }
    };

    fetchBookmarkCount();
  }, [itemId, itemType]);

  const handleToggleBookmark = async () => {
    if (loading) return;

    setLoading(true);
    const newBookmarked = !bookmarked;
    const newCount = newBookmarked ? count + 1 : count - 1;

    try {
      if (user) {
        // API call for authenticated users
        // await fetch('/api/bookmarks/toggle', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ itemId, itemType, bookmarked: newBookmarked }),
        // });
      } else {
        // LocalStorage for non-authenticated users
        const savedBookmarks = localStorage.getItem('bookmarks');
        let bookmarks: BookmarkItem[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];

        if (newBookmarked) {
          bookmarks.push({
            id: itemId,
            type: itemType,
            date: new Date(),
          });
        } else {
          bookmarks = bookmarks.filter(
            item => !(item.id === itemId && item.type === itemType)
          );
        }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      }

      setBookmarked(newBookmarked);
      setCount(newCount);
      onToggle?.(newBookmarked, newCount);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: {
      icon: 'h-4 w-4',
      button: 'p-1.5 text-xs',
      count: 'text-xs',
    },
    md: {
      icon: 'h-5 w-5',
      button: 'p-2 text-sm',
      count: 'text-sm',
    },
    lg: {
      icon: 'h-6 w-6',
      button: 'p-3 text-base',
      count: 'text-base',
    },
  };

  const variantClasses = {
    icon: 'p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800',
    button: cn(
      'inline-flex items-center rounded-md border border-transparent',
      bookmarked
        ? 'bg-primary text-white hover:bg-primary/90'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    ),
    badge: cn(
      'inline-flex items-center rounded-full border',
      bookmarked
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300'
    ),
  };

  const sizeConfig = sizeClasses[size];

  const renderContent = () => (
    <>
      {bookmarked ? (
        <BookmarkSolid className={sizeConfig.icon} />
      ) : (
        <BookmarkOutline className={sizeConfig.icon} />
      )}
      {(variant === 'button' || variant === 'badge') && (
        <span className="ml-1.5">
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
      {showCount && count > 0 && (
        <span className={cn('ml-1.5 font-medium', sizeConfig.count)}>
          {count}
        </span>
      )}
    </>
  );

  const buttonClasses = cn(
    'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    variantClasses[variant],
    variant !== 'icon' && sizeConfig.button,
    loading && 'opacity-50 cursor-not-allowed',
    className
  );

  return (
    <button
      type="button"
      onClick={handleToggleBookmark}
      disabled={loading}
      className={buttonClasses}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {renderContent()}
    </button>
  );
};

export interface BookmarkListProps {
  items: BookmarkItem[];
  onRemove?: (itemId: string | number) => void;
  className?: string;
  emptyMessage?: string;
}

export const BookmarkList: React.FC<BookmarkListProps> = ({
  items,
  onRemove,
  className,
  emptyMessage = 'No bookmarks yet',
}) => {
  const handleRemove = (itemId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(itemId);
  };

  if (items.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500 dark:text-gray-400', className)}>
        <BookmarkOutline className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">{emptyMessage}</p>
        <p className="text-sm">Start bookmarking content to see it here.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <div
          key={`${item.type}-${item.id}`}
          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {item.title || `Bookmarked ${item.type}`}
            </h4>
            {item.url && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                {item.url}
              </p>
            )}
            {item.date && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Bookmarked {item.date.toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => handleRemove(item.id, e)}
            className="ml-3 p-1.5 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
            aria-label="Remove bookmark"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export interface BookmarkManagerProps {
  storageKey?: string;
  onBookmarksChange?: (bookmarks: BookmarkItem[]) => void;
}

export const useBookmarkManager = (props?: BookmarkManagerProps) => {
  const storageKey = props?.storageKey || 'bookmarks';
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedBookmarks = localStorage.getItem(storageKey);
    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        // Convert date strings back to Date objects
        const bookmarksWithDates = parsedBookmarks.map((item: any) => ({
          ...item,
          date: item.date ? new Date(item.date) : undefined,
        }));
        setBookmarks(bookmarksWithDates);
      } catch (error) {
        console.error('Error parsing bookmarks:', error);
      }
    }
  }, [storageKey]);

  const addBookmark = (item: BookmarkItem) => {
    const newBookmarks = [...bookmarks, item];
    setBookmarks(newBookmarks);
    localStorage.setItem(storageKey, JSON.stringify(newBookmarks));
    props?.onBookmarksChange?.(newBookmarks);
  };

  const removeBookmark = (itemId: string | number, itemType?: BookmarkItem['type']) => {
    const newBookmarks = bookmarks.filter(
      item => !(item.id === itemId && (!itemType || item.type === itemType))
    );
    setBookmarks(newBookmarks);
    localStorage.setItem(storageKey, JSON.stringify(newBookmarks));
    props?.onBookmarksChange?.(newBookmarks);
  };

  const clearBookmarks = () => {
    setBookmarks([]);
    localStorage.removeItem(storageKey);
    props?.onBookmarksChange?.([]);
  };

  const isBookmarked = (itemId: string | number, itemType?: BookmarkItem['type']) => {
    return bookmarks.some(
      item => item.id === itemId && (!itemType || item.type === itemType)
    );
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    clearBookmarks,
    isBookmarked,
  };
};

export default BookmarkButton;