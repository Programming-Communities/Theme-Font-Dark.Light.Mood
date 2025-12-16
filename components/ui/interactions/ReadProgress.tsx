'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface ReadProgressProps {
  targetId?: string;
  containerId?: string;
  height?: string;
  color?: string;
  gradient?: boolean;
  showPercentage?: boolean;
  showTime?: boolean;
  position?: 'top' | 'bottom';
  sticky?: boolean;
  className?: string;
  onProgressChange?: (progress: number) => void;
  onSectionChange?: (sectionId: string, sectionTitle: string) => void;
}

const ReadProgress: React.FC<ReadProgressProps> = ({
  targetId,
  containerId,
  height = 'h-1',
  color = 'bg-primary',
  gradient = false,
  showPercentage = false,
  showTime = false,
  position = 'top',
  sticky = true,
  className,
  onProgressChange,
  onSectionChange,
}) => {
  const [progress, setProgress] = useState(0);
  const [sections, setSections] = useState<Array<{ id: string; title: string; element: HTMLElement }>>([]);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [readingTime, setReadingTime] = useState({ minutes: 0, seconds: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Calculate reading time based on word count
  const calculateReadingTime = useCallback(() => {
    if (typeof window === 'undefined') return;

    const container = containerId 
      ? document.getElementById(containerId)
      : targetId
        ? document.getElementById(targetId)
        : document.body;

    if (!container) return;

    const text = container.textContent || '';
    const wordCount = text.split(/\s+/).length;
    const wordsPerMinute = 200; // Average reading speed
    const minutes = Math.floor(wordCount / wordsPerMinute);
    const seconds = Math.floor((wordCount % wordsPerMinute) / (wordsPerMinute / 60));

    setReadingTime({ minutes, seconds });
  }, [containerId, targetId]);

  // Update progress based on scroll position
  const updateProgress = useCallback(() => {
    if (typeof window === 'undefined') return;

    const container = containerId 
      ? document.getElementById(containerId)
      : targetId
        ? document.getElementById(targetId)
        : document.documentElement;

    const target = targetId ? document.getElementById(targetId) : document.body;

    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const containerTop = containerRect.top + window.scrollY;
    const containerBottom = containerRect.bottom + window.scrollY;
    const targetBottom = targetRect.bottom + window.scrollY;

    const totalHeight = targetBottom - containerTop;
    const scrolled = window.scrollY - containerTop;

    let newProgress = (scrolled / totalHeight) * 100;
    newProgress = Math.max(0, Math.min(100, newProgress));

    setProgress(newProgress);
    onProgressChange?.(newProgress);
  }, [containerId, targetId, onProgressChange]);

  // Detect sections for table of contents
  const detectSections = useCallback(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const container = containerId 
      ? document.getElementById(containerId)
      : targetId
        ? document.getElementById(targetId)
        : document.body;

    if (!container) return;

    const headings = container.querySelectorAll('h1, h2, h3, h4');
    const newSections: Array<{ id: string; title: string; element: HTMLElement }> = [];

    headings.forEach((heading, index) => {
      const element = heading as HTMLElement;
      const id = element.id || `section-${index}`;
      const title = element.textContent || `Section ${index + 1}`;

      if (!element.id) {
        element.id = id;
      }

      newSections.push({ id, title, element });
    });

    setSections(newSections);
  }, [containerId, targetId]);

  // Set up intersection observer for section tracking
  const setupObserver = useCallback(() => {
    if (!sections.length || typeof window === 'undefined') return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const section = sections.find(s => s.id === id);
          if (section) {
            setCurrentSection(id);
            onSectionChange?.(id, section.title);
          }
        }
      });
    }, options);

    sections.forEach(section => {
      observerRef.current?.observe(section.element);
    });
  }, [sections, onSectionChange]);

  useEffect(() => {
    calculateReadingTime();
    detectSections();
    updateProgress();

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [calculateReadingTime, detectSections, updateProgress]);

  useEffect(() => {
    setupObserver();
  }, [setupObserver]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const progressBar = (
    <div
      className={cn(
        'w-full bg-gray-200 dark:bg-gray-800 overflow-hidden',
        height,
        sticky && position === 'top' && 'fixed top-0 left-0 right-0 z-50',
        sticky && position === 'bottom' && 'fixed bottom-0 left-0 right-0 z-50',
        className
      )}
    >
      <div
        className={cn(
          'h-full transition-all duration-300 ease-out',
          gradient ? 'bg-gradient-to-r from-primary to-secondary' : color
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  const progressInfo = (showPercentage || showTime) && (
    <div className="fixed right-4 bottom-4 z-50 flex items-center gap-3">
      {showTime && readingTime.minutes > 0 && (
        <div className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg text-sm font-medium text-gray-700 dark:text-gray-300">
          {readingTime.minutes} min read
        </div>
      )}
      {showPercentage && (
        <button
          type="button"
          onClick={handleScrollToTop}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <span className="text-sm font-bold">{Math.round(progress)}%</span>
        </button>
      )}
    </div>
  );

  const tableOfContents = sections.length > 0 && (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 w-64 max-h-96 overflow-y-auto">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Table of Contents
        </h4>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => handleScrollToSection(section.id)}
              className={cn(
                'block w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                currentSection === section.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {progressBar}
      {progressInfo}
      {tableOfContents}
      {/* Spacer for fixed progress bar */}
      {sticky && position === 'top' && <div className={height} />}
    </>
  );
};

export interface ReadingStatsProps {
  wordCount?: number;
  readingTime?: number; // in minutes
  complexity?: 'easy' | 'medium' | 'hard';
  className?: string;
}

export const ReadingStats: React.FC<ReadingStatsProps> = ({
  wordCount,
  readingTime,
  complexity,
  className,
}) => {
  const calculateReadingTime = () => {
    if (readingTime) return readingTime;
    if (!wordCount) return 0;
    return Math.ceil(wordCount / 200); // 200 words per minute
  };

  const getComplexityColor = () => {
    switch (complexity) {
      case 'easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    }
  };

  const getComplexityLabel = () => {
    switch (complexity) {
      case 'easy': return 'Easy';
      case 'hard': return 'Advanced';
      default: return 'Intermediate';
    }
  };

  const time = calculateReadingTime();

  return (
    <div className={cn('flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400', className)}>
      {wordCount !== undefined && (
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{wordCount.toLocaleString()} words</span>
        </div>
      )}
      
      {time > 0 && (
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{time} min read</span>
        </div>
      )}
      
      {complexity && (
        <div className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getComplexityColor())}>
          {getComplexityLabel()}
        </div>
      )}
    </div>
  );
};

export default ReadProgress;