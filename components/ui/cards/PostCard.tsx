'use client';

import { WordPressPost } from '@/types/wordpress';
import { useState, useEffect } from 'react';
import DesktopPostCard from './DesktopPostCard';
import TabletPostCard from './TabletPostCard';
import MobilePostCard from './MobilePostCard';

interface PostCardProps {
  post: WordPressPost;
  variant?: 'default' | 'featured' | 'compact';
  forceView?: 'desktop' | 'tablet' | 'mobile';
}

export default function PostCard({ post, variant = 'default', forceView }: PostCardProps) {
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    if (forceView) {
      setDeviceType(forceView);
      return;
    }

    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setDeviceType('desktop');
      } else if (width >= 640) {
        setDeviceType('tablet');
      } else {
        setDeviceType('mobile');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [forceView]);

  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  // Render based on device type
  switch (deviceType) {
    case 'desktop':
      return <DesktopPostCard post={post} featured={isFeatured} />;
    
    case 'tablet':
      return <TabletPostCard post={post} compact={isCompact} />;
    
    case 'mobile':
      return <MobilePostCard post={post} showImage={!isCompact} />;
    
    default:
      return <DesktopPostCard post={post} />;
  }
}
