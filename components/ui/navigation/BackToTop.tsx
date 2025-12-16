'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  threshold?: number;
  showAfter?: number;
  smooth?: boolean;
  className?: string;
}

export default function BackToTop({
  threshold = 300,
  showAfter = 500,
  smooth = true,
  className = '',
}: BackToTopProps) {
  const { themeColors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > threshold);
      
      // Show after delay
      if (scrollTop > showAfter && !isScrolling) {
        setIsScrolling(true);
      } else if (scrollTop <= showAfter && isScrolling) {
        setIsScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, showAfter, isScrolling]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${className}`}
      style={{
        backgroundColor: themeColors.primary,
        color: themeColors.text.accent,
        border: `2px solid ${themeColors.border}`,
        boxShadow: `0 4px 20px ${themeColors.shadow}`,
      }}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: themeColors.primary }} />
    </button>
  );
}