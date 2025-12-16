// File 35: lib/ads/config.ts
import { AdConfig, AdProvider, AdSize } from './types';

export const DEFAULT_AD_SIZES: AdSize[] = [
  '300x250',  // Medium Rectangle
  '336x280',  // Large Rectangle
  '728x90',   // Leaderboard
  '300x600',  // Half Page
  '320x100',  // Large Mobile Banner
  '320x50',   // Mobile Banner
  '970x250',  // Billboard
  '250x250',  // Square
  '200x200',  // Small Square
  'auto'      // Responsive
];

export const AD_PROVIDERS: AdProvider[] = [
  {
    name: 'google-adsense',
    enabled: true,
    scriptUrl: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    adClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx',
    priority: 1
  },
  {
    name: 'custom-banner',
    enabled: true,
    scriptUrl: '',
    priority: 2
  },
  {
    name: 'native-ads',
    enabled: true,
    scriptUrl: '',
    priority: 3
  }
];

export const DEFAULT_AD_CONFIG: AdConfig = {
  enabled: process.env.NODE_ENV === 'production',
  adClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx',
  providers: AD_PROVIDERS,
  defaultAdSize: 'auto',
  refreshInterval: 30, // seconds
  maxRefreshes: 5,
  enablePageLevelAds: false,
  analyticsEnabled: true,
  defaultTargeting: {
    category: 'general',
    contentType: 'article',
    pageType: 'content',
    keywords: ['english', 'learning', 'community', 'pakistan']
  },
  fallbackAd: {
    title: 'English Communities PK',
    description: 'Join our community for English learning resources',
    link: 'https://english.communities.pk',
    image: ''
  },
  adSlots: {
    header: {
      sizes: ['728x90', '970x250', 'auto'],
      adType: 'banner',
      targeting: { position: 'header' }
    },
    sidebar: {
      sizes: ['300x250', '300x600', 'auto'],
      adType: 'display',
      targeting: { position: 'sidebar' }
    },
    'in-article': {
      sizes: ['300x250', '336x280', 'auto'],
      adType: 'display',
      targeting: { position: 'in-article' }
    },
    footer: {
      sizes: ['728x90', '970x90', 'auto'],
      adType: 'banner',
      targeting: { position: 'footer' }
    },
    'sticky-bottom': {
      sizes: ['320x50', '320x100', 'auto'],
      adType: 'banner',
      targeting: { position: 'sticky', device: 'mobile' }
    }
  }
};

export function getAdConfig(): AdConfig {
  const config = { ...DEFAULT_AD_CONFIG };

  // Override with environment variables
  if (process.env.NEXT_PUBLIC_ADS_ENABLED) {
    config.enabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
  }

  if (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    config.adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  }

  // Disable ads in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ADS_IN_DEV) {
    config.enabled = false;
  }

  return config;
}

export function getAdSlotConfig(slotName: string) {
  return DEFAULT_AD_CONFIG.adSlots[slotName as keyof typeof DEFAULT_AD_CONFIG.adSlots];
}

export function isValidAdSlot(slotName: string): boolean {
  return slotName in DEFAULT_AD_CONFIG.adSlots;
}

export function getAvailableAdSlots(): string[] {
  return Object.keys(DEFAULT_AD_CONFIG.adSlots);
}