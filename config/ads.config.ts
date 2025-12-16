// File 47: config/ads.config.ts
/**
 * Advertisements configuration for English Communities PK
 * Supports Google AdSense, Media.net, and custom ads
 */

export interface AdConfig {
  // Ad Network Settings
  network: 'google-adsense' | 'media-net' | 'custom' | 'none';
  
  // Google AdSense Configuration
  googleAdsense: {
    clientId?: string;
    slotIds: {
      header: string;
      sidebar: string;
      inContent: string;
      footer: string;
      betweenPosts: string;
      popup: string;
    };
    format: {
      leaderboard: '728x90' | '970x90';
      rectangle: '300x250' | '336x280';
      skyscraper: '120x600' | '160x600';
      mobile: '320x100' | '320x50';
    };
    autoAds: boolean;
  };
  
  // Media.net Configuration
  medianet: {
    cid?: string;
    custom?: string;
    slots: Record<string, string>;
  };
  
  // Custom Ad Configuration
  customAds: {
    enabled: boolean;
    ads: Array<{
      id: string;
      name: string;
      location: 'header' | 'sidebar' | 'in-content' | 'footer' | 'popup';
      type: 'banner' | 'text' | 'native' | 'video';
      code: string;
      width: number;
      height: number;
      priority: number;
      devices: ('desktop' | 'tablet' | 'mobile')[];
      schedules?: Array<{
        start: Date;
        end: Date;
      }>;
    }>;
  };
  
  // Ad Placement Configuration
  placements: {
    header: {
      enabled: boolean;
      type: 'leaderboard' | 'banner';
      maxHeight: number;
      positions: number[];
    };
    sidebar: {
      enabled: boolean;
      type: 'rectangle' | 'skyscraper';
      positions: number[];
      sticky: boolean;
    };
    inContent: {
      enabled: boolean;
      frequency: number; // ads after every X paragraphs
      types: ('rectangle' | 'native' | 'text')[];
    };
    footer: {
      enabled: boolean;
      type: 'leaderboard' | 'banner';
    };
    betweenPosts: {
      enabled: boolean;
      frequency: number; // ads after every X posts
    };
    popup: {
      enabled: boolean;
      frequency: number; // minutes between popups
      delay: number; // seconds before showing
      showOncePerSession: boolean;
    };
  };
  
  // Targeting Configuration
  targeting: {
    categories: boolean;
    tags: boolean;
    keywords: boolean;
    userInterests: boolean;
    deviceType: boolean;
    location: boolean;
    timeOfDay: boolean;
  };
  
  // Ad Blocking Handling
  adBlock: {
    detection: boolean;
    message: string;
    recoveryUrl?: string;
  };
  
  // Privacy & Compliance
  privacy: {
    gdprCompliant: boolean;
    ccpaCompliant: boolean;
    nonPersonalized: boolean;
    restrictedDataProcessing: boolean;
  };
  
  // Performance
  performance: {
    lazyLoad: boolean;
    viewability: boolean;
    refresh: {
      enabled: boolean;
      interval: number; // seconds
    };
  };
}

const adConfig: AdConfig = {
  network: 'google-adsense',
  
  googleAdsense: {
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
    slotIds: {
      header: process.env.NEXT_PUBLIC_ADS_SLOT_HEADER || '',
      sidebar: process.env.NEXT_PUBLIC_ADS_SLOT_SIDEBAR || '',
      inContent: process.env.NEXT_PUBLIC_ADS_SLOT_INCONTENT || '',
      footer: process.env.NEXT_PUBLIC_ADS_SLOT_FOOTER || '',
      betweenPosts: process.env.NEXT_PUBLIC_ADS_SLOT_BETWEEN_POSTS || '',
      popup: process.env.NEXT_PUBLIC_ADS_SLOT_POPUP || '',
    },
    format: {
      leaderboard: '728x90',
      rectangle: '300x250',
      skyscraper: '160x600',
      mobile: '320x100',
    },
    autoAds: true,
  },
  
  medianet: {
    cid: process.env.NEXT_PUBLIC_MEDIANET_CID,
    custom: process.env.NEXT_PUBLIC_MEDIANET_CUSTOM,
    slots: {},
  },
  
  customAds: {
    enabled: false,
    ads: [],
  },
  
  placements: {
    header: {
      enabled: true,
      type: 'leaderboard',
      maxHeight: 90,
      positions: [1],
    },
    sidebar: {
      enabled: true,
      type: 'rectangle',
      positions: [1, 3, 5],
      sticky: true,
    },
    inContent: {
      enabled: true,
      frequency: 3,
      types: ['rectangle', 'native'],
    },
    footer: {
      enabled: true,
      type: 'leaderboard',
    },
    betweenPosts: {
      enabled: true,
      frequency: 3,
    },
    popup: {
      enabled: false,
      frequency: 60,
      delay: 30,
      showOncePerSession: true,
    },
  },
  
  targeting: {
    categories: true,
    tags: true,
    keywords: true,
    userInterests: true,
    deviceType: true,
    location: true,
    timeOfDay: true,
  },
  
  adBlock: {
    detection: true,
    message: 'We notice you\'re using an ad blocker. Our content is supported by ads. Please consider whitelisting our site to support our community.',
    recoveryUrl: '/support-us',
  },
  
  privacy: {
    gdprCompliant: true,
    ccpaCompliant: true,
    nonPersonalized: false,
    restrictedDataProcessing: false,
  },
  
  performance: {
    lazyLoad: true,
    viewability: true,
    refresh: {
      enabled: true,
      interval: 30,
    },
  },
};

export default adConfig;