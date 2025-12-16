// File 51: types/ads.d.ts
/**
 * Advertisement type definitions for English Communities PK
 */

declare global {
  namespace Ads {
    // Ad Network Types
    type AdNetwork = 'google-adsense' | 'media-net' | 'custom' | 'none';
    
    // Ad Types
    type AdType = 'banner' | 'text' | 'native' | 'video' | 'popup';
    
    // Ad Formats
    type AdFormat = 
      | '728x90'   // Leaderboard
      | '970x90'   // Super Leaderboard
      | '300x250'  // Medium Rectangle
      | '336x280'  // Large Rectangle
      | '160x600'  // Wide Skyscraper
      | '120x600'  // Skyscraper
      | '320x100'  // Large Mobile Banner
      | '320x50'   // Mobile Banner
      | 'responsive'; // Responsive
    
    // Ad Locations
    type AdLocation = 
      | 'header'
      | 'sidebar'
      | 'in-content'
      | 'footer'
      | 'between-posts'
      | 'popup'
      | 'sticky'
      | 'interstitial';
    
    // Device Types
    type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'all';
    
    // Ad Targeting
    interface AdTargeting {
      categories?: string[];
      tags?: string[];
      keywords?: string[];
      userInterests?: string[];
      location?: {
        country?: string;
        city?: string;
        region?: string;
      };
      device?: DeviceType;
      timeOfDay?: {
        start: string;
        end: string;
      };
      frequency?: {
        perSession: number;
        perHour: number;
        perDay: number;
      };
    }
    
    // Ad Slot Configuration
    interface AdSlot {
      id: string;
      name: string;
      location: AdLocation;
      type: AdType;
      format: AdFormat;
      network: AdNetwork;
      code?: string;
      targeting?: AdTargeting;
      priority: number;
      enabled: boolean;
      fallback?: AdSlot;
    }
    
    // Ad Rotation
    interface AdRotation {
      slots: AdSlot[];
      rotationType: 'sequential' | 'random' | 'weighted';
      weights?: Record<string, number>;
      interval?: number; // seconds
    }
    
    // Ad Performance Metrics
    interface AdMetrics {
      impressions: number;
      clicks: number;
      ctr: number; // Click-through rate
      viewability: number; // Percentage
      revenue: number;
      fillRate: number;
      latency: number; // ms
    }
    
    // Ad Schedule
    interface AdSchedule {
      startDate: Date;
      endDate: Date;
      daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
      timeSlots: Array<{
        startTime: string;
        endTime: string;
      }>;
    }
    
    // Ad Block Detection
    interface AdBlockDetection {
      enabled: boolean;
      checkInterval: number; // seconds
      recoveryMethods: Array<'message' | 'redirect' | 'subscription'>;
      message?: string;
      redirectUrl?: string;
    }
    
    // Google AdSense Specific Types
    interface GoogleAdSenseConfig {
      clientId: string;
      slots: Record<AdLocation, string>;
      autoAds: boolean;
      pageLevelAds?: boolean;
      responsive?: boolean;
    }
    
    // Media.net Specific Types
    interface MediaNetConfig {
      cid: string;
      custom?: string;
      slots: Record<string, string>;
    }
    
    // Custom Ad Types
    interface CustomAd {
      id: string;
      name: string;
      html: string;
      css?: string;
      js?: string;
      constraints: {
        minWidth?: number;
        maxWidth?: number;
        aspectRatio?: number;
      };
    }
    
    // Ad Event Types
    type AdEventType = 
      | 'load'
      | 'error'
      | 'click'
      | 'view'
      | 'impression'
      | 'close'
      | 'complete'
      | 'skip';
    
    interface AdEvent {
      type: AdEventType;
      slotId: string;
      timestamp: Date;
      data?: Record<string, any>;
    }
    
    // Ad Provider Interface
    interface AdProvider {
      initialize(): Promise<void>;
      loadSlot(slot: AdSlot): Promise<void>;
      refreshSlot(slotId: string): Promise<void>;
      destroySlot(slotId: string): void;
      on(event: AdEventType, callback: (event: AdEvent) => void): void;
      getMetrics(): AdMetrics;
    }
  }
}

export {};