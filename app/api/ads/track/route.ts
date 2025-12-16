import { NextRequest, NextResponse } from 'next/server';

interface TrackRequest {
  adId: string;
  trackingId: string;
  event: 'impression' | 'click' | 'view' | 'close';
  metadata?: {
    device?: string;
    position?: string;
    userId?: string;
    sessionId?: string;
    referrer?: string;
    userAgent?: string;
  };
}

// In-memory store for demo (use database in production)
const adAnalytics: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const body: TrackRequest = await request.json();
    const { adId, trackingId, event, metadata = {} } = body;

    if (!adId || !trackingId || !event) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: adId, trackingId, event',
      }, { status: 400 });
    }

    // Initialize analytics for this ad if not exists
    if (!adAnalytics[adId]) {
      adAnalytics[adId] = {
        impressions: 0,
        clicks: 0,
        views: 0,
        closes: 0,
        uniqueUsers: new Set<string>(),
        sessions: new Set<string>(),
        events: [],
      };
    }

    const analytics = adAnalytics[adId];

    // Update counters
    switch (event) {
      case 'impression':
        analytics.impressions++;
        break;
      case 'click':
        analytics.clicks++;
        break;
      case 'view':
        analytics.views++;
        break;
      case 'close':
        analytics.closes++;
        break;
    }

    // Track unique users and sessions
    if (metadata.userId) {
      analytics.uniqueUsers.add(metadata.userId);
    }
    if (metadata.sessionId) {
      analytics.sessions.add(metadata.sessionId);
    }

    // Store event with metadata
    analytics.events.push({
      event,
      trackingId,
      timestamp: new Date().toISOString(),
      metadata,
    });

    // Keep only last 1000 events
    if (analytics.events.length > 1000) {
      analytics.events = analytics.events.slice(-1000);
    }

    // Calculate metrics
    const metrics = {
      impressions: analytics.impressions,
      clicks: analytics.clicks,
      views: analytics.views,
      closes: analytics.closes,
      uniqueUsers: analytics.uniqueUsers.size,
      sessions: analytics.sessions.size,
      ctr: analytics.impressions > 0 
        ? (analytics.clicks / analytics.impressions * 100).toFixed(2) 
        : '0.00',
      viewRate: analytics.impressions > 0 
        ? (analytics.views / analytics.impressions * 100).toFixed(2) 
        : '0.00',
    };

    return NextResponse.json({
      success: true,
      data: {
        adId,
        trackingId,
        event,
        metrics,
        timestamp: new Date().toISOString(),
      },
      message: 'Event tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking ad event:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track event',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const adId = searchParams.get('adId');

    if (!adId) {
      return NextResponse.json({
        success: false,
        error: 'adId is required',
      }, { status: 400 });
    }

    const analytics = adAnalytics[adId];

    if (!analytics) {
      return NextResponse.json({
        success: true,
        data: {
          adId,
          metrics: {
            impressions: 0,
            clicks: 0,
            views: 0,
            closes: 0,
            uniqueUsers: 0,
            sessions: 0,
            ctr: '0.00',
            viewRate: '0.00',
          },
          events: [],
        },
        timestamp: new Date().toISOString(),
      });
    }

    const metrics = {
      impressions: analytics.impressions,
      clicks: analytics.clicks,
      views: analytics.views,
      closes: analytics.closes,
      uniqueUsers: analytics.uniqueUsers.size,
      sessions: analytics.sessions.size,
      ctr: analytics.impressions > 0 
        ? (analytics.clicks / analytics.impressions * 100).toFixed(2) 
        : '0.00',
      viewRate: analytics.impressions > 0 
        ? (analytics.views / analytics.impressions * 100).toFixed(2) 
        : '0.00',
    };

    return NextResponse.json({
      success: true,
      data: {
        adId,
        metrics,
        recentEvents: analytics.events.slice(-10),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching ad analytics:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch analytics',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}