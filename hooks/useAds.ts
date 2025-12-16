'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDevice } from './useDevice';
import { useCookies } from './useCookies';
import { AdConfig, AdUnit, AdPlacement, AdSize } from '@/types/ads';
import { getAdConfig, getAdPlacements } from '@/lib/ads/config';

export function useAds() {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const device = useDevice();
  const { isCategoryEnabled } = useCookies();

  // Check if ads should be shown
  const shouldShowAds = useCallback((): boolean => {
    // Check cookie consent
    if (!isCategoryEnabled('marketing')) {
      return false;
    }

    // Check if user is logged in (optional: hide ads for logged in users)
    // const { isAuthenticated } = useAuth();
    // if (isAuthenticated() && config.hideAdsForLoggedIn) {
    //   return false;
    // }

    return adsEnabled;
  }, [adsEnabled, isCategoryEnabled]);

  // Initialize ads
  useEffect(() => {
    const initializeAds = async () => {
      setIsLoading(true);
      
      try {
        // Load ad configuration
        const config = getAdConfig();
        
        // Check if ads should be enabled
        if (!config.enabled) {
          setAdsEnabled(false);
          return;
        }

        // Get placements for current device
        const placements = getAdPlacements(device.type);
        
        // Filter placements based on visibility rules
        const visiblePlacements = placements.filter(placement => {
          // Check device-specific rules
          if (placement.devices && !placement.devices.includes(device.type)) {
            return false;
          }

          // Check page-specific rules
          // This would be enhanced with actual page detection
          return true;
        });

        // Create ad units from placements
        const units = visiblePlacements.map(placement => ({
          id: `${placement.id}-${Date.now()}`,
          placementId: placement.id,
          size: placement.size,
          position: placement.position,
          type: placement.type,
          provider: config.provider,
          targeting: placement.targeting || {},
          refreshInterval: placement.refreshInterval || 0,
          lastRefreshed: null,
          isVisible: false,
        }));

        setAdUnits(units);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize ads');
        console.error('Ad initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAds();
  }, [device.type]);

  // Refresh ad units periodically
  useEffect(() => {
    if (!adsEnabled || adUnits.length === 0) return;

    const intervals: NodeJS.Timeout[] = [];

    adUnits.forEach(unit => {
      if (unit.refreshInterval > 0) {
        const interval = setInterval(() => {
          refreshAdUnit(unit.id);
        }, unit.refreshInterval * 1000);

        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [adsEnabled, adUnits]);

  const refreshAdUnit = useCallback((adUnitId: string) => {
    setAdUnits(prevUnits =>
      prevUnits.map(unit => {
        if (unit.id === adUnitId) {
          // In a real implementation, this would trigger the ad provider to refresh
          return {
            ...unit,
            lastRefreshed: new Date(),
            id: `${unit.placementId}-${Date.now()}`, // New ID to force re-render
          };
        }
        return unit;
      })
    );
  }, []);

  const trackAdEvent = useCallback((adUnitId: string, event: string, data?: any) => {
    // Track ad events in analytics
    if (window.gtag) {
      window.gtag('event', 'ad_' + event, {
        event_category: 'ads',
        event_label: adUnitId,
        ...data,
      });
    }

    // Track in Facebook Pixel for conversion
    if (window.fbq && event === 'click') {
      window.fbq('track', 'ViewContent', {
        content_type: 'ad',
        content_id: adUnitId,
      });
    }
  }, []);

  const handleAdClick = useCallback((adUnitId: string, clickUrl: string) => {
    // Track click
    trackAdEvent(adUnitId, 'click', { url: clickUrl });

    // Open in new tab
    window.open(clickUrl, '_blank', 'noopener,noreferrer');

    return true;
  }, [trackAdEvent]);

  const handleAdView = useCallback((adUnitId: string) => {
    // Track view
    trackAdEvent(adUnitId, 'view');

    // Update ad unit visibility
    setAdUnits(prevUnits =>
      prevUnits.map(unit => {
        if (unit.id === adUnitId && !unit.isVisible) {
          return { ...unit, isVisible: true };
        }
        return unit;
      })
    );
  }, [trackAdEvent]);

  const getAdUnitByPlacement = useCallback((placementId: string): AdUnit | undefined => {
    return adUnits.find(unit => unit.placementId === placementId);
  }, [adUnits]);

  const getAdUnitsByPosition = useCallback((position: string): AdUnit[] => {
    return adUnits.filter(unit => unit.position === position);
  }, [adUnits]);

  const enableAds = useCallback(() => {
    setAdsEnabled(true);
  }, []);

  const disableAds = useCallback(() => {
    setAdsEnabled(false);
  }, []);

  const getAdSize = useCallback((size: AdSize) => {
    const sizeMap = {
      '728x90': { width: 728, height: 90 },
      '300x250': { width: 300, height: 250 },
      '320x50': { width: 320, height: 50 },
      '300x600': { width: 300, height: 600 },
      '970x250': { width: 970, height: 250 },
      'fluid': { width: '100%', height: 'auto' },
    };

    return sizeMap[size] || sizeMap['300x250'];
  }, []);

  return {
    adsEnabled,
    adUnits,
    isLoading,
    error,
    shouldShowAds,
    refreshAdUnit,
    handleAdClick,
    handleAdView,
    getAdUnitByPlacement,
    getAdUnitsByPosition,
    enableAds,
    disableAds,
    getAdSize,
    trackAdEvent,
  };
}

// Hook for specific ad placement
export function useAdPlacement(placementId: string) {
  const { adUnits, shouldShowAds, handleAdView, handleAdClick } = useAds();
  const [adUnit, setAdUnit] = useState<AdUnit | null>(null);

  useEffect(() => {
    const unit = adUnits.find(u => u.placementId === placementId);
    setAdUnit(unit || null);
  }, [adUnits, placementId]);

  const trackView = useCallback(() => {
    if (adUnit) {
      handleAdView(adUnit.id);
    }
  }, [adUnit, handleAdView]);

  const trackClick = useCallback((clickUrl: string) => {
    if (adUnit) {
      return handleAdClick(adUnit.id, clickUrl);
    }
    return false;
  }, [adUnit, handleAdClick]);

  return {
    adUnit,
    shouldShow: shouldShowAds() && !!adUnit,
    trackView,
    trackClick,
  };
}

// Hook for ad blocker detection
export function useAdBlockerDetection() {
  const [hasAdBlocker, setHasAdBlocker] = useState<boolean | null>(null);

  useEffect(() => {
    const detectAdBlocker = async () => {
      try {
        const testAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        const response = await fetch(testAdUrl, {
          method: 'HEAD',
          mode: 'no-cors',
        });
        
        // If we get here, ad blocker likely not active
        setHasAdBlocker(false);
      } catch (error) {
        // Request failed, likely due to ad blocker
        setHasAdBlocker(true);
      }
    };

    detectAdBlocker();
  }, []);

  return hasAdBlocker;
}