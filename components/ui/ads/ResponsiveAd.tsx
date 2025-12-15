'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import AdPlaceholder from './AdPlaceholder';

interface ResponsiveAdProps {
  position: string;
  slotId: string;
  sizes?: {
    desktop: string[];
    tablet: string[];
    mobile: string[];
  };
  className?: string;
  fallback?: React.ReactNode;
}

const DEFAULT_SIZES = {
  desktop: ['728x90', '300x250', '160x600'],
  tablet: ['468x60', '300x250'],
  mobile: ['320x50', '300x250'],
};

export default function ResponsiveAd({ 
  position, 
  slotId, 
  sizes = DEFAULT_SIZES,
  className = '',
  fallback 
}: ResponsiveAdProps) {
  const { themeColors } = useTheme();
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentSize, setCurrentSize] = useState<string>('300x250');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newDeviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop';
      let newSize = '300x250';

      if (width >= 1024) {
        newDeviceType = 'desktop';
        newSize = sizes.desktop[0] || '728x90';
      } else if (width >= 640) {
        newDeviceType = 'tablet';
        newSize = sizes.tablet[0] || '468x60';
      } else {
        newDeviceType = 'mobile';
        newSize = sizes.mobile[0] || '320x50';
      }

      setDeviceType(newDeviceType);
      setCurrentSize(newSize);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sizes]);

  useEffect(() => {
    // Simulate ad loading delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getSizeDimensions = () => {
    const [width, height] = currentSize.split('x').map(Number);
    return { width, height };
  };

  const handleAdClick = () => {
    // Track ad click
    console.log(`Ad clicked: ${slotId} (${position})`);
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_click', {
        ad_position: position,
        ad_slot: slotId,
        ad_size: currentSize,
        device_type: deviceType,
      });
    }
  };

  const dimensions = getSizeDimensions();

  if (!isVisible) {
    return (
      <div className={`animate-pulse ${className}`}>
        <AdPlaceholder size={currentSize} />
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${className}`}
      style={{ 
        borderColor: themeColors.border,
        backgroundColor: themeColors.surface,
        minWidth: dimensions.width,
        minHeight: dimensions.height,
        maxWidth: '100%',
      }}
      onClick={handleAdClick}
    >
      {/* Ad Label */}
      <div className="absolute top-2 left-2 z-10">
        <div className="px-2 py-1 rounded text-xs font-medium backdrop-blur-sm"
             style={{ 
               backgroundColor: `${themeColors.primary}20`,
               color: themeColors.primary,
               border: `1px solid ${themeColors.primary}30`
             }}>
          Ad • {deviceType}
        </div>
      </div>

      {/* Ad Content */}
      <div className="h-full flex flex-col items-center justify-center p-4 cursor-pointer">
        {/* Dynamic Ad Content based on position and device */}
        <div className="text-center">
          <div className="text-2xl mb-2 opacity-60" style={{ color: themeColors.primary }}>
            {position === 'header' ? '🚀' : 
             position === 'sidebar' ? '💡' : 
             position === 'content' ? '📈' : 
             position === 'footer' ? '🌟' : '📢'}
          </div>
          
          <div className="mb-1">
            <div className="text-sm font-medium" style={{ color: themeColors.primary }}>
              {position === 'header' ? 'Premium Sponsorship' :
               position === 'sidebar' ? 'Recommended For You' :
               position === 'content' ? 'Sponsored Content' :
               position === 'footer' ? 'Community Partner' : 'Advertisement'}
            </div>
            <div className="text-xs text-text-secondary">
              {currentSize} • {deviceType.toUpperCase()}
            </div>
          </div>
          
          <div className="mt-3">
            <div className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                 style={{ 
                   backgroundColor: `${themeColors.primary}15`,
                   color: themeColors.primary,
                   border: `1px solid ${themeColors.primary}30`
                 }}>
              Learn More
            </div>
          </div>
        </div>
      </div>

      {/* Ad Info */}
      <div className="absolute bottom-2 right-2">
        <div className="text-xs opacity-50" style={{ color: themeColors.text.secondary }}>
          Ad
        </div>
      </div>
    </div>
  );
}
