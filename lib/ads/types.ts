// File 36: lib/ads/types.ts
export type AdSize = 
  | '300x250'   // Medium Rectangle
  | '336x280'   // Large Rectangle
  | '728x90'    // Leaderboard
  | '300x600'   // Half Page
  | '320x100'   // Large Mobile Banner
  | '320x50'    // Mobile Banner
  | '970x250'   // Billboard
  | '250x250'   // Square
  | '200x200'   // Small Square
  | '970x90'    // Large Leaderboard
  | 'auto';     // Responsive

export type AdType = 'display' | 'banner' | 'native' | 'video' | 'sticky';

export interface AdTargeting {
  [key: string]: string | number | boolean | string[];
  
  // Standard targeting parameters
  category?: string;
  subcategory?: string;
  contentType?: string;
  pageType?: string;
  keywords?: string[];
  author?: string;
  tags?: string[];
  
  // User targeting
  userId?: string;
  userRole?: string;
  userInterest?: string[];
  
  // Device targeting
  device?: 'desktop' | 'tablet' | 'mobile';
  os?: string;
  browser?: string;
  
  // Geographic targeting
  country?: string;
  region?: string;
  city?: string;
  
  // Custom targeting
  position?: string;
  section?: string;
  placement?: string;
}

export interface AdSlot {
  id: string;
  containerId: string;
  adType: AdType;
  size: AdSize;
  targeting: AdTargeting;
  isLoaded: boolean;
  impressions: number;
  clicks: number;
  revenue?: number;
  refreshes?: number;
  lastRefreshed?: Date;
  createdAt: Date;
}

export interface AdProvider {
  name: string;
  enabled: boolean;
  scriptUrl?: string;
  adClientId?: string;
  priority: number;
  config?: Record<string, any>;
}

export interface AdConfig {
  enabled: boolean;
  adClientId: string;
  providers: AdProvider[];
  defaultAdSize: AdSize;
  refreshInterval: number; // in seconds
  maxRefreshes: number;
  enablePageLevelAds: boolean;
  analyticsEnabled: boolean;
  
  defaultTargeting: AdTargeting;
  
  fallbackAd: {
    title: string;
    description: string;
    link: string;
    image: string;
  };
  
  adSlots: {
    [key: string]: {
      sizes: AdSize[];
      adType: AdType;
      targeting: AdTargeting;
      fallbackImage?: string;
      maxPerPage?: number;
    };
  };
}

export interface AdPerformanceMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
  averageCTR: number;
  averageCPM: number;
  fillRate: number;
}

export interface AdEvent {
  type: 'impression' | 'click' | 'view' | 'refresh' | 'error';
  adSlotId: string;
  timestamp: Date;
  data?: Record<string, any>;
}

export interface AdCreative {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  backgroundColor: string;
  textColor: string;
  ctaText: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface AdCampaign {
  id: string;
  name: string;
  advertiser: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  dailyBudget: number;
  targeting: AdTargeting;
  creatives: AdCreative[];
  status: 'active' | 'paused' | 'completed' | 'draft';
  priority: number;
}