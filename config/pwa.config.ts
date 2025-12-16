// File 50: config/pwa.config.ts
/**
 * Progressive Web App configuration for English Communities PK
 */

export interface PWAConfig {
  // Basic PWA Configuration
  enabled: boolean;
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'minimal-ui' | 'fullscreen' | 'browser';
  orientation: 'portrait' | 'landscape' | 'any';
  
  // Icons Configuration
  icons: {
    src: string;
    sizes: number[];
    purpose: 'any' | 'maskable' | 'monochrome';
    type: 'image/png' | 'image/jpeg' | 'image/svg+xml';
  }[];
  
  // Splash Screens
  splash: {
    enabled: boolean;
    image: string;
    backgroundColor: string;
  };
  
  // Installation
  installation: {
    prompt: boolean;
    criteria: {
      engagementTime: number; // minutes
      visits: number;
      pagesPerSession: number;
    };
    customPrompt: boolean;
  };
  
  // Offline Support
  offline: {
    enabled: boolean;
    strategy: 'NetworkFirst' | 'CacheFirst' | 'StaleWhileRevalidate';
    cacheName: string;
    precache: string[];
    runtimeCache: Array<{
      urlPattern: RegExp | string;
      handler: 'NetworkFirst' | 'CacheFirst' | 'StaleWhileRevalidate' | 'NetworkOnly' | 'CacheOnly';
      options: {
        cacheName: string;
        expiration: {
          maxEntries: number;
          maxAgeSeconds: number;
        };
      };
    }>;
  };
  
  // Push Notifications
  push: {
    enabled: boolean;
    vapidKey: string;
    prompt: {
      delay: number; // seconds
      interval: number; // days
      maxPrompts: number;
    };
    topics: string[];
  };
  
  // Background Sync
  backgroundSync: {
    enabled: boolean;
    queueName: string;
    maxRetentionTime: number; // minutes
  };
  
  // App Features
  features: {
    share: boolean;
    fileSystem: boolean;
    clipboard: boolean;
    periodicSync: boolean;
    wakeLock: boolean;
    screenWakeLock: boolean;
  };
  
  // Platform Specific
  platform: {
    android: {
      packageName: string;
      intentFilters: Array<{
        action: string;
        category: string[];
        data: {
          scheme: string;
          host: string;
          pathPrefix: string;
        };
      }>;
    };
    ios: {
      appleMobileWebAppCapable: 'yes' | 'no';
      appleMobileWebAppStatusBarStyle: 'default' | 'black' | 'black-translucent';
      appleTouchIcon: string;
    };
    windows: {
      tileColor: string;
      tileImage: string;
    };
  };
  
  // Update Management
  updates: {
    checkInterval: number; // hours
    notification: boolean;
    reloadOnUpdate: boolean;
    skipWaiting: boolean;
  };
}

const pwaConfig: PWAConfig = {
  enabled: true,
  name: 'English Communities PK',
  shortName: 'English PK',
  description: 'Learn English with Pakistan\'s largest English learning community',
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  display: 'standalone',
  orientation: 'any',
  
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: [72],
      purpose: 'any',
      type: 'image/png',
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: [96],
      purpose: 'any',
      type: 'image/png',
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: [128],
      purpose: 'any',
      type: 'image/png',
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: [144],
      purpose: 'any',
      type: 'image/png',
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: [152],
      purpose: 'any',
      type: 'image/png',
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: [192],
      purpose: 'maskable',
      type: 'image/png',
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: [384],
      purpose: 'any',
      type: 'image/png',
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: [512],
      purpose: 'maskable',
      type: 'image/png',
    },
  ],
  
  splash: {
    enabled: true,
    image: '/splash/splash-640x1136.png',
    backgroundColor: '#3b82f6',
  },
  
  installation: {
    prompt: true,
    criteria: {
      engagementTime: 5,
      visits: 2,
      pagesPerSession: 3,
    },
    customPrompt: true,
  },
  
  offline: {
    enabled: true,
    strategy: 'StaleWhileRevalidate',
    cacheName: 'english-communities-pk-cache-v1',
    precache: [
      '/',
      '/manifest.json',
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png',
    ],
    runtimeCache: [
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|png|gif|webp|svg)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/api\.communities\.pk\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 5, // 5 minutes
          },
        },
      },
    ],
  },
  
  push: {
    enabled: true,
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY || '',
    prompt: {
      delay: 10,
      interval: 7,
      maxPrompts: 3,
    },
    topics: ['new-posts', 'community-updates', 'learning-tips'],
  },
  
  backgroundSync: {
    enabled: true,
    queueName: 'english-pk-queue',
    maxRetentionTime: 48 * 60, // 48 hours
  },
  
  features: {
    share: true,
    fileSystem: false,
    clipboard: true,
    periodicSync: true,
    wakeLock: false,
    screenWakeLock: false,
  },
  
  platform: {
    android: {
      packageName: 'pk.communities.english',
      intentFilters: [
        {
          action: 'VIEW',
          category: ['BROWSABLE', 'DEFAULT'],
          data: {
            scheme: 'https',
            host: 'english.communities.pk',
            pathPrefix: '/',
          },
        },
      ],
    },
    ios: {
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'default',
      appleTouchIcon: '/icons/apple-touch-icon.png',
    },
    windows: {
      tileColor: '#3b82f6',
      tileImage: '/icons/mstile-150x150.png',
    },
  },
  
  updates: {
    checkInterval: 24,
    notification: true,
    reloadOnUpdate: true,
    skipWaiting: true,
  },
};

export default pwaConfig;