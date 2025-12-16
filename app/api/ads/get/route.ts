import { NextRequest, NextResponse } from 'next/server';

interface AdSlot {
  id: string;
  size: string;
  position: string;
  device: 'desktop' | 'tablet' | 'mobile' | 'all';
  enabled: boolean;
  content?: {
    title: string;
    description: string;
    imageUrl?: string;
    ctaText: string;
    ctaUrl: string;
  };
}

const MOCK_ADS: Record<string, AdSlot[]> = {
  desktop: [
    {
      id: 'desktop-header',
      size: '728x90',
      position: 'header',
      device: 'desktop',
      enabled: true,
      content: {
        title: 'Premium English Courses',
        description: 'Master English with our expert-led courses',
        imageUrl: '/ads/course-promo.jpg',
        ctaText: 'Learn More',
        ctaUrl: '/courses',
      },
    },
    {
      id: 'desktop-sidebar',
      size: '300x250',
      position: 'sidebar',
      device: 'desktop',
      enabled: true,
      content: {
        title: 'Community Partner',
        description: 'Join 10,000+ learners',
        ctaText: 'Join Now',
        ctaUrl: '/join',
      },
    },
  ],
  tablet: [
    {
      id: 'tablet-content',
      size: '468x60',
      position: 'content',
      device: 'tablet',
      enabled: true,
      content: {
        title: 'Mobile Learning App',
        description: 'Learn on the go with our app',
        ctaText: 'Download',
        ctaUrl: '/app',
      },
    },
  ],
  mobile: [
    {
      id: 'mobile-footer',
      size: '320x50',
      position: 'footer',
      device: 'mobile',
      enabled: true,
      content: {
        title: 'Free Resources',
        description: 'Get free learning materials',
        ctaText: 'Get Free',
        ctaUrl: '/free',
      },
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const device = searchParams.get('device') as keyof typeof MOCK_ADS || 'desktop';
    const position = searchParams.get('position');

    let ads = MOCK_ADS[device] || MOCK_ADS.desktop;

    // Filter by position if specified
    if (position) {
      ads = ads.filter(ad => ad.position === position);
    }

    // Filter enabled ads only
    ads = ads.filter(ad => ad.enabled);

    // Add tracking IDs and timestamps
    const adsWithTracking = ads.map(ad => ({
      ...ad,
      trackingId: `ad_${ad.id}_${Date.now()}`,
      servedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    }));

    return NextResponse.json({
      success: true,
      data: {
        ads: adsWithTracking,
        count: adsWithTracking.length,
        device,
        position,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch ads',
      data: { ads: [], count: 0 },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}