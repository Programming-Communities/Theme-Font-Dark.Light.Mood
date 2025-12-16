// File 45: lib/utils/constants.ts
/**
 * Application-wide constants for the English Communities PK platform
 */

/**
 * WordPress API Constants
 */
export const WORDPRESS_CONSTANTS = {
  // API Endpoints
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.communities.pk',
  FRONTEND_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk',
  
  // REST API Endpoints
  REST_API: {
    BASE: '/wp-json',
    POSTS: '/wp/v2/posts',
    PAGES: '/wp/v2/pages',
    CATEGORIES: '/wp/v2/categories',
    TAGS: '/wp/v2/tags',
    MEDIA: '/wp/v2/media',
    USERS: '/wp/v2/users',
    COMMENTS: '/wp/v2/comments',
    SEARCH: '/wp/v2/search',
    SETTINGS: '/wp/v2/settings',
  },
  
  // JWT Authentication Endpoints
  JWT_AUTH: {
    BASE: '/wp-json/jwt-auth/v1',
    TOKEN: '/token',
    VALIDATE: '/token/validate',
    REFRESH: '/token/refresh',
  },
  
  // GraphQL Endpoint
  GRAPHQL_ENDPOINT: '/graphql',
  
  // Default API Parameters
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
  
  // Post Statuses
  POST_STATUS: {
    PUBLISH: 'publish',
    DRAFT: 'draft',
    PENDING: 'pending',
    PRIVATE: 'private',
    TRASH: 'trash',
  },
  
  // Comment Statuses
  COMMENT_STATUS: {
    OPEN: 'open',
    CLOSED: 'closed',
  },
  
  // User Roles
  USER_ROLES: {
    ADMINISTRATOR: 'administrator',
    EDITOR: 'editor',
    AUTHOR: 'author',
    CONTRIBUTOR: 'contributor',
    SUBSCRIBER: 'subscriber',
  },
  
  // Media Types
  MEDIA_TYPES: {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    APPLICATION: 'application',
  },
};

/**
 * Application Theme Constants
 */
export const THEME_CONSTANTS = {
  // Theme Names
  THEMES: [
    'professional-blue',
    'corporate-green',
    'premium-purple',
    'luxury-gold',
    'minimal-gray',
    'tech-cyan',
    'nature-green',
    'ocean-blue',
    'sunset-orange',
    'midnight-purple',
    'rose-pink',
    'vibrant-red',
    'cool-teal',
    'classic-white',
  ] as const,
  
  // Default Theme
  DEFAULT_THEME: 'professional-blue',
  
  // Color Mode
  COLOR_MODES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
  } as const,
  
  // Default Color Mode
  DEFAULT_COLOR_MODE: 'light',
  
  // LocalStorage Keys
  STORAGE_KEYS: {
    THEME: 'theme',
    COLOR_MODE: 'colorMode',
    FONT_FAMILY: 'fontFamily',
  },
  
  // Font Families
  FONT_FAMILIES: [
    'system-ui',
    'Inter',
    'Roboto',
    'Open Sans',
    'Poppins',
    'Montserrat',
    'Merriweather',
    'Playfair Display',
    'Lora',
    'Source Sans Pro',
    'Nunito',
    'Roboto Mono',
    'Source Code Pro',
    'Comic Neue',
    'Dancing Script',
  ] as const,
  
  // Default Font Family
  DEFAULT_FONT_FAMILY: 'system-ui',
  
  // Font Sizes
  FONT_SIZES: {
    XS: '0.75rem',    // 12px
    SM: '0.875rem',   // 14px
    BASE: '1rem',     // 16px
    LG: '1.125rem',   // 18px
    XL: '1.25rem',    // 20px
    '2XL': '1.5rem',  // 24px
    '3XL': '1.875rem', // 30px
    '4XL': '2.25rem',  // 36px
    '5XL': '3rem',     // 48px
  },
  
  // Border Radius
  BORDER_RADIUS: {
    NONE: '0',
    SM: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    MD: '0.375rem',   // 6px
    LG: '0.5rem',     // 8px
    XL: '0.75rem',    // 12px
    '2XL': '1rem',    // 16px
    FULL: '9999px',
  },
  
  // Spacing
  SPACING: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
  },
};

/**
 * SEO & Meta Constants
 */
export const SEO_CONSTANTS = {
  // Default Meta
  DEFAULT_TITLE: 'English Communities PK - Learn English in Pakistan',
  DEFAULT_DESCRIPTION: 'Join the largest English learning community in Pakistan. Free resources, courses, and community support for English learners.',
  DEFAULT_KEYWORDS: ['English', 'Learn English', 'Pakistan', 'English Community', 'Language Learning'],
  
  // Open Graph
  OPEN_GRAPH: {
    TYPE: 'website',
    LOCALE: 'en_US',
    SITE_NAME: 'English Communities PK',
  },
  
  // Twitter
  TWITTER: {
    CARD_TYPE: 'summary_large_image',
    HANDLE: '@EnglishCommPK',
  },
  
  // Robots
  ROBOTS: {
    DEFAULT: 'index, follow',
    NOINDEX: 'noindex, nofollow',
  },
  
  // Structured Data Types
  SCHEMA_TYPES: {
    WEBSITE: 'WebSite',
    ORGANIZATION: 'Organization',
    ARTICLE: 'Article',
    PERSON: 'Person',
    BREADCRUMB: 'BreadcrumbList',
    FAQ: 'FAQPage',
    HOWTO: 'HowTo',
  },
};

/**
 * Advertisement Constants
 */
export const AD_CONSTANTS = {
  // Ad Providers
  PROVIDERS: {
    GOOGLE_ADSENSE: 'google-adsense',
    CUSTOM: 'custom',
    FALLBACK: 'fallback',
  },
  
  // Ad Types
  TYPES: {
    DISPLAY: 'display',
    BANNER: 'banner',
    NATIVE: 'native',
    VIDEO: 'video',
    STICKY: 'sticky',
  },
  
  // Ad Sizes
  SIZES: {
    // Standard IAB sizes
    MEDIUM_RECTANGLE: '300x250',
    LARGE_RECTANGLE: '336x280',
    LEADERBOARD: '728x90',
    HALF_PAGE: '300x600',
    MOBILE_BANNER: '320x50',
    LARGE_MOBILE_BANNER: '320x100',
    BILLBOARD: '970x250',
    SQUARE: '250x250',
    SMALL_SQUARE: '200x200',
    LARGE_LEADERBOARD: '970x90',
    RESPONSIVE: 'auto',
  },
  
  // Ad Positions
  POSITIONS: {
    HEADER: 'header',
    SIDEBAR: 'sidebar',
    IN_ARTICLE: 'in-article',
    FOOTER: 'footer',
    STICKY_BOTTOM: 'sticky-bottom',
  },
  
  // Targeting Parameters
  TARGETING: {
    CATEGORIES: ['general', 'education', 'language', 'community', 'pakistan'],
    CONTENT_TYPES: ['article', 'page', 'category', 'tag', 'author', 'homepage'],
    PAGE_TYPES: ['content', 'list', 'detail', 'archive', 'search'],
  },
  
  // Refresh Intervals (in seconds)
  REFRESH_INTERVALS: {
    MIN: 30,
    DEFAULT: 60,
    MAX: 300,
  },
};

/**
 * User & Authentication Constants
 */
export const AUTH_CONSTANTS = {
  // JWT Token
  JWT: {
    STORAGE_KEY: 'jwt_token',
    REFRESH_STORAGE_KEY: 'jwt_refresh_token',
    EXPIRY_BUFFER: 300, // 5 minutes before expiry
  },
  
  // User Roles
  ROLES: {
    ADMIN: 'administrator',
    EDITOR: 'editor',
    AUTHOR: 'author',
    CONTRIBUTOR: 'contributor',
    SUBSCRIBER: 'subscriber',
    GUEST: 'guest',
  },
  
  // Permissions
  PERMISSIONS: {
    // Content permissions
    CREATE_POST: 'create_posts',
    EDIT_POST: 'edit_posts',
    DELETE_POST: 'delete_posts',
    PUBLISH_POST: 'publish_posts',
    
    // Comment permissions
    CREATE_COMMENT: 'create_comments',
    EDIT_COMMENT: 'edit_comments',
    DELETE_COMMENT: 'delete_comments',
    MODERATE_COMMENTS: 'moderate_comments',
    
    // User permissions
    EDIT_USERS: 'edit_users',
    DELETE_USERS: 'delete_users',
    PROMOTE_USERS: 'promote_users',
    
    // Settings permissions
    MANAGE_OPTIONS: 'manage_options',
  },
  
  // Login Methods
  LOGIN_METHODS: {
    EMAIL: 'email',
    USERNAME: 'username',
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
  },
  
  // Password Requirements
  PASSWORD_REQUIREMENTS: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
};

/**
 * Content & Post Constants
 */
export const CONTENT_CONSTANTS = {
  // Post Types
  POST_TYPES: {
    POST: 'post',
    PAGE: 'page',
    ATTACHMENT: 'attachment',
    REVISION: 'revision',
  },
  
  // Content Status
  STATUS: {
    PUBLISH: 'publish',
    DRAFT: 'draft',
    PENDING: 'pending',
    PRIVATE: 'private',
    TRASH: 'trash',
    AUTO_DRAFT: 'auto-draft',
    INHERIT: 'inherit',
  },
  
  // Comment Status
  COMMENT_STATUS: {
    OPEN: 'open',
    CLOSED: 'closed',
  },
  
  // Ping Status
  PING_STATUS: {
    OPEN: 'open',
    CLOSED: 'closed',
  },
  
  // Format
  FORMAT: {
    STANDARD: 'standard',
    ASIDE: 'aside',
    GALLERY: 'gallery',
    LINK: 'link',
    IMAGE: 'image',
    QUOTE: 'quote',
    STATUS: 'status',
    VIDEO: 'video',
    AUDIO: 'audio',
    CHAT: 'chat',
  },
  
  // Reading Time
  READING_TIME: {
    WORDS_PER_MINUTE: 200,
  },
  
  // Excerpt Length
  EXCERPT_LENGTH: {
    DEFAULT: 55,
    MAX: 160,
  },
};

/**
 * Media & File Constants
 */
export const MEDIA_CONSTANTS = {
  // File Types
  FILE_TYPES: {
    IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
    VIDEO: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv'],
    AUDIO: ['mp3', 'wav', 'ogg', 'm4a'],
    DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
  },
  
  // Max File Sizes (in bytes)
  MAX_FILE_SIZES: {
    IMAGE: 10 * 1024 * 1024, // 10MB
    VIDEO: 100 * 1024 * 1024, // 100MB
    AUDIO: 50 * 1024 * 1024, // 50MB
    DOCUMENT: 25 * 1024 * 1024, // 25MB
    DEFAULT: 10 * 1024 * 1024, // 10MB
  },
  
  // Image Dimensions
  IMAGE_DIMENSIONS: {
    THUMBNAIL: { width: 150, height: 150 },
    MEDIUM: { width: 300, height: 300 },
    LARGE: { width: 1024, height: 1024 },
    FULL: 'full',
  },
  
  // Quality Settings
  QUALITY: {
    LOW: 0.6,
    MEDIUM: 0.8,
    HIGH: 0.95,
    MAX: 1.0,
  },
};

/**
 * Cache & Performance Constants
 */
export const CACHE_CONSTANTS = {
  // Cache TTL (Time To Live) in milliseconds
  TTL: {
    SHORT: 5 * 60 * 1000,      // 5 minutes
    MEDIUM: 30 * 60 * 1000,    // 30 minutes
    LONG: 2 * 