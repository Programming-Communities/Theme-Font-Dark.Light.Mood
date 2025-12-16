// File 46: config/site.config.ts
/**
 * Site configuration for English Communities PK
 */

export interface SiteConfig {
  // Basic Information
  name: string;
  description: string;
  url: string;
  language: string;
  locale: string;
  timezone: string;
  
  // Contact Information
  contact: {
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  
  // Social Media Links
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    github?: string;
    telegram?: string;
    whatsapp?: string;
  };
  
  // Site Features
  features: {
    comments: boolean;
    reactions: boolean;
    ratings: boolean;
    bookmarks: boolean;
    notifications: boolean;
    darkMode: boolean;
    fontSwitcher: boolean;
    themeSwitcher: boolean;
    offlineSupport: boolean;
    pushNotifications: boolean;
  };
  
  // SEO Configuration
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string[];
    canonicalUrl: string;
    ogImage: string;
    twitterHandle: string;
  };
  
  // API Configuration
  api: {
    wordpress: {
      baseUrl: string;
      graphqlEndpoint: string;
      restEndpoint: string;
      jwtEndpoint: string;
    };
    nextjs: {
      apiRoutes: {
        auth: string;
        comments: string;
        reactions: string;
        bookmarks: string;
        search: string;
      };
    };
  };
  
  // Content Configuration
  content: {
    postsPerPage: number;
    categoriesPerPage: number;
    tagsPerPage: number;
    authorsPerPage: number;
    commentsPerPage: number;
    searchResultsPerPage: number;
    excerptLength: number;
    readingSpeed: number; // words per minute
  };
  
  // Comment System
  comments: {
    enabled: boolean;
    moderation: boolean;
    nesting: boolean;
    maxDepth: number;
    voting: boolean;
    sorting: 'newest' | 'oldest' | 'popular';
  };
  
  // Analytics
  analytics: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    facebookPixelId?: string;
    hotjarId?: string;
  };
  
  // Monetization
  monetization: {
    ads: boolean;
    membership: boolean;
    donations: boolean;
    sponsors: boolean;
  };
  
  // Performance
  performance: {
    imageOptimization: boolean;
    lazyLoading: boolean;
    caching: boolean;
    cdn: boolean;
    preload: boolean;
    prefetch: boolean;
  };
  
  // Security
  security: {
    https: boolean;
    csp: boolean;
    hsts: boolean;
    xssProtection: boolean;
    csrfProtection: boolean;
    rateLimiting: boolean;
  };
  
  // Accessibility
  accessibility: {
    skipLinks: boolean;
    ariaLabels: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
    screenReader: boolean;
  };
}

const siteConfig: SiteConfig = {
  // Basic Information
  name: 'English Communities PK',
  description: 'Join the largest English learning community in Pakistan. Free resources, courses, and community support for English learners.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk',
  language: 'en',
  locale: 'en_US',
  timezone: 'Asia/Karachi',
  
  // Contact Information
  contact: {
    email: 'contact@english.communities.pk',
    phone: '+92 300 1234567',
    address: '123 Learning Street',
    city: 'Lahore',
    country: 'Pakistan',
  },
  
  // Social Media Links
  social: {
    twitter: 'EnglishCommPK',
    facebook: 'EnglishCommunitiesPK',
    instagram: 'englishcommunitiespk',
    youtube: '@EnglishCommunitiesPK',
    linkedin: 'company/english-communities-pk',
    github: 'englishcommunitiespk',
    telegram: 'EnglishCommunitiesPK',
    whatsapp: '+923001234567',
  },
  
  // Site Features
  features: {
    comments: true,
    reactions: true,
    ratings: true,
    bookmarks: true,
    notifications: true,
    darkMode: true,
    fontSwitcher: true,
    themeSwitcher: true,
    offlineSupport: true,
    pushNotifications: true,
  },
  
  // SEO Configuration
  seo: {
    titleTemplate: '%s | English Communities PK',
    defaultTitle: 'English Communities PK - Learn English in Pakistan',
    defaultDescription: 'Join the largest English learning community in Pakistan. Free resources, courses, and community support for English learners.',
    defaultKeywords: ['English', 'Learn English', 'Pakistan', 'English Community', 'Language Learning'],
    canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk',
    ogImage: '/og-default.jpg',
    twitterHandle: '@EnglishCommPK',
  },
  
  // API Configuration
  api: {
    wordpress: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.communities.pk',
      graphqlEndpoint: '/graphql',
      restEndpoint: '/wp-json',
      jwtEndpoint: '/wp-json/jwt-auth/v1/token',
    },
    nextjs: {
      apiRoutes: {
        auth: '/api/auth',
        comments: '/api/comments',
        reactions: '/api/reactions',
        bookmarks: '/api/bookmarks',
        search: '/api/search',
      },
    },
  },
  
  // Content Configuration
  content: {
    postsPerPage: 10,
    categoriesPerPage: 20,
    tagsPerPage: 30,
    authorsPerPage: 20,
    commentsPerPage: 10,
    searchResultsPerPage: 10,
    excerptLength: 55,
    readingSpeed: 200, // words per minute
  },
  
  // Comment System
  comments: {
    enabled: true,
    moderation: true,
    nesting: true,
    maxDepth: 3,
    voting: true,
    sorting: 'newest',
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
    facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },
  
  // Monetization
  monetization: {
    ads: true,
    membership: true,
    donations: true,
    sponsors: true,
  },
  
  // Performance
  performance: {
    imageOptimization: true,
    lazyLoading: true,
    caching: true,
    cdn: true,
    preload: true,
    prefetch: true,
  },
  
  // Security
  security: {
    https: true,
    csp: true,
    hsts: true,
    xssProtection: true,
    csrfProtection: true,
    rateLimiting: true,
  },
  
  // Accessibility
  accessibility: {
    skipLinks: true,
    ariaLabels: true,
    keyboardNavigation: true,
    highContrast: true,
    screenReader: true,
  },
};

export default siteConfig;