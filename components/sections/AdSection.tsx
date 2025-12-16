'use client';

import { useState, useEffect } from 'react';
import { useAds } from '@/hooks/useAds';
import { useDevice } from '@/hooks/useDevice';
import { Alert } from '@/components/ui/common/Alert';

interface AdSectionProps {
  position: 'header' | 'sidebar' | 'content' | 'footer' | 'in-content';
  format?: 'banner' | 'rectangle' | 'square' | 'skyscraper' | 'native';
  className?: string;
}

interface AdUnit {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  advertiser: string;
  type: 'display' | 'native' | 'video';
  dimensions: {
    width: number;
    height: number;
  };
  tracking_pixel?: string;
}

export default function AdSection({
  position,
  format = 'banner',
  className = '',
}: AdSectionProps) {
  const { getAdUnit, trackImpression, trackClick } = useAds();
  const { isMobile, isTablet, isDesktop } = useDevice();
  const [adUnit, setAdUnit] = useState<AdUnit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasImpressionTracked, setHasImpressionTracked] = useState(false);

  const formatDimensions = {
    banner: { width: 728, height: 90 },
    rectangle: { width: 300, height: 250 },
    square: { width: 250, height: 250 },
    skyscraper: { width: 160, height: 600 },
    native: { width: 0, height: 0 },
  };

  useEffect(() => {
    const loadAd = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const ad = await getAdUnit({
          position,
          format,
          device: isMobile ? 'mobile' : isDesktop ? 'desktop' : 'tablet',
        });

        if (ad) {
          setAdUnit(ad);
        } else {
          setError('No ads available at this time');
        }
      } catch (err) {
        console.error('Failed to load ad:', err);
        setError('Failed to load advertisement');
      } finally {
        setIsLoading(false);
      }
    };

    loadAd();

    // Refresh ad every 30 seconds
    const refreshInterval = setInterval(loadAd, 30000);
    return () => clearInterval(refreshInterval);
  }, [getAdUnit, position, format, isMobile, isDesktop]);

  useEffect(() => {
    if (adUnit && !hasImpressionTracked) {
      trackImpression(adUnit.id);
      setHasImpressionTracked(true);
    }
  }, [adUnit, hasImpressionTracked, trackImpression]);

  const handleAdClick = () => {
    if (adUnit) {
      trackClick(adUnit.id);
      window.open(adUnit.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleError = () => {
    setError('Failed to load ad image');
    setAdUnit(null);
  };

  if (error) {
    return (
      <div className={`${className} p-4 rounded-lg`}
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px dashed var(--border)',
        }}
      >
        <p className="text-sm text-center"
          style={{ color: 'var(--text-secondary)' }}
        >
          Advertisement
        </p>
        <div className="text-center py-4">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {error}
          </span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="rounded-lg"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            width: formatDimensions[format].width,
            height: formatDimensions[format].height,
            maxWidth: '100%',
          }}
        />
      </div>
    );
  }

  if (!adUnit) {
    return null;
  }

  return (
    <div className={`${className} relative`}>
      {/* Ad label */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          Advertisement
        </span>
        <button
          onClick={() => setAdUnit(null)}
          className="text-xs hover:underline"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Close advertisement"
        >
          Hide ad
        </button>
      </div>

      {/* Ad container */}
      <div
        className="relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          width: format === 'native' ? '100%' : formatDimensions[format].width,
          height: format === 'native' ? 'auto' : formatDimensions[format].height,
          maxWidth: '100%',
        }}
        onClick={handleAdClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleAdClick();
          }
        }}
        aria-label={`Advertisement: ${adUnit.title}. Click to learn more.`}
      >
        {/* Native ad format */}
        {format === 'native' ? (
          <div className="p-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Ad image */}
              {adUnit.image_url && (
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20 rounded overflow-hidden">
                    <img
                      src={adUnit.image_url}
                      alt={adUnit.title}
                      className="w-full h-full object-cover"
                      onError={handleError}
                    />
                  </div>
                </div>
              )}

              {/* Ad content */}
              <div className="flex-1 min-w-0">
                <div className="mb-1">
                  <span className="text-xs font-medium px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--primary)20',
                      color: 'var(--primary)',
                    }}
                  >
                    Sponsored
                  </span>
                </div>

                <h3 className="text-sm font-semibold mb-1 line-clamp-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {adUnit.title}
                </h3>

                {adUnit.description && (
                  <p className="text-xs mb-2 line-clamp-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {adUnit.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    By {adUnit.advertiser}
                  </span>
                  <span className="text-xs font-semibold"
                    style={{ color: 'var(--primary)' }}
                  >
                    Learn More →
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Display ad format */
          <div className="relative w-full h-full">
            <img
              src={adUnit.image_url}
              alt={adUnit.title}
              className="w-full h-full object-cover"
              onError={handleError}
            />
            
            {/* Overlay with ad info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/90">
                    {adUnit.title}
                  </p>
                  {adUnit.advertiser && (
                    <p className="text-xs text-white/70">
                      by {adUnit.advertiser}
                    </p>
                  )}
                </div>
                <span className="text-xs font-semibold text-white">
                  Visit Site →
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tracking pixel (hidden) */}
        {adUnit.tracking_pixel && (
          <img
            src={adUnit.tracking_pixel}
            alt=""
            className="hidden"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Ad disclosure */}
      <div className="mt-2 text-center">
        <p className="text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          Ads help support our community. {' '}
          <button
            onClick={() => {
              // Show ad preferences modal
              console.log('Show ad preferences');
            }}
            className="hover:underline"
            style={{ color: 'var(--primary)' }}
            aria-label="Manage ad preferences"
          >
            Manage preferences
          </button>
        </p>
      </div>

      {/* Report ad button */}
      <button
        onClick={() => {
          // Report ad functionality
          console.log('Report ad:', adUnit.id);
        }}
        className="absolute top-0 right-0 -mt-6 text-xs hover:underline"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Report this advertisement"
      >
        Report ad
      </button>
    </div>
  );
}