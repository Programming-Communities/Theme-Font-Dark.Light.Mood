'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { X, RefreshCw, AlertCircle } from 'lucide-react';

interface AdSlot {
  id: string;
  size: string;
  device: 'desktop' | 'tablet' | 'mobile';
  position: string;
  enabled: boolean;
}

interface AdManagerProps {
  slots?: AdSlot[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function AdManager({ 
  slots = [], 
  autoRefresh = false, 
  refreshInterval = 30000 
}: AdManagerProps) {
  const { themeColors } = useTheme();
  const [activeSlots, setActiveSlots] = useState<AdSlot[]>(slots);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // Simulate ad refresh
      console.log('Refreshing ads...');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const filteredSlots = activeSlots.filter(slot => 
    slot.enabled && (slot.device === deviceType || slot.device === 'all')
  );

  const getAdDimensions = (size: string) => {
    const dimensions: Record<string, { width: number; height: number }> = {
      '728x90': { width: 728, height: 90 },
      '300x250': { width: 300, height: 250 },
      '468x60': { width: 468, height: 60 },
      '320x50': { width: 320, height: 50 },
      '970x250': { width: 970, height: 250 },
      '160x600': { width: 160, height: 600 },
      '300x600': { width: 300, height: 600 },
    };
    return dimensions[size] || { width: 300, height: 250 };
  };

  const handleAdClick = (slotId: string) => {
    console.log(`Ad clicked: ${slotId}`);
    // Track ad click analytics
  };

  const handleCloseAd = (slotId: string) => {
    setActiveSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, enabled: false } : slot
    ));
  };

  const handleRefreshAd = (slotId: string) => {
    setLastRefresh(new Date());
    console.log(`Refreshing ad: ${slotId}`);
  };

  if (filteredSlots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Ad Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded text-xs font-medium"
               style={{ 
                 backgroundColor: `${themeColors.primary}15`,
                 color: themeColors.primary
               }}>
            Ads • {deviceType}
          </div>
          {autoRefresh && (
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <RefreshCw className="h-3 w-3" />
              Auto-refresh: {refreshInterval / 1000}s
            </div>
          )}
        </div>
        <div className="text-xs text-text-secondary">
          Last: {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Ad Slots */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSlots.map((slot) => {
          const dimensions = getAdDimensions(slot.size);
          
          return (
            <div 
              key={slot.id}
              className="relative overflow-hidden rounded-lg border transition-all hover:shadow-md"
              style={{ 
                borderColor: themeColors.border,
                backgroundColor: themeColors.surface
              }}
            >
              {/* Ad Header */}
              <div className="flex items-center justify-between p-2 border-b"
                   style={{ borderColor: themeColors.border }}>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded text-xs font-medium"
                       style={{ 
                         backgroundColor: `${themeColors.primary}10`,
                         color: themeColors.text.secondary
                       }}>
                    {slot.size} • {slot.position}
                  </div>
                  <span className="text-xs text-text-secondary">
                    {dimensions.width}×{dimensions.height}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRefreshAd(slot.id)}
                    className="p-1 rounded hover:bg-surface transition-colors"
                    title="Refresh ad"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleCloseAd(slot.id)}
                    className="p-1 rounded hover:bg-surface transition-colors"
                    title="Close ad"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Ad Content */}
              <div 
                className="flex flex-col items-center justify-center p-4 cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => handleAdClick(slot.id)}
                style={{ 
                  minHeight: dimensions.height,
                  backgroundColor: `${themeColors.primary}05`
                }}
              >
                {/* Ad Placeholder/Content */}
                <div className="text-center">
                  <div className="text-3xl mb-2 opacity-50" style={{ color: themeColors.primary }}>
                    📢
                  </div>
                  <div className="text-sm font-medium mb-1" style={{ color: themeColors.primary }}>
                    Advertisement
                  </div>
                  <div className="text-xs text-text-secondary mb-3">
                    {slot.size} • {slot.device}
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium"
                       style={{ 
                         backgroundColor: `${themeColors.primary}15`,
                         color: themeColors.primary
                       }}>
                    Your Ad Here
                  </div>
                </div>
              </div>

              {/* Ad Info */}
              <div className="p-2 border-t text-center"
                   style={{ borderColor: themeColors.border }}>
                <div className="flex items-center justify-center gap-1 text-xs text-text-secondary">
                  <AlertCircle className="h-3 w-3" />
                  <span>Advertisement • Supports our community</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ad Stats */}
      <div className="text-xs text-text-secondary text-center">
        {filteredSlots.length} active ad{filteredSlots.length !== 1 ? 's' : ''} for {deviceType} devices
      </div>
    </div>
  );
}
