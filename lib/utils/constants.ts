// File 45: lib/utils/constants.ts (Continued)
/**
 * Cache & Performance Constants
 */
export const CACHE_CONSTANTS = {
  // Cache TTL (Time To Live) in milliseconds
  TTL: {
    SHORT: 5 * 60 * 1000,      // 5 minutes
    MEDIUM: 30 * 60 * 1000,    // 30 minutes
    LONG: 2 * 60 * 60 * 1000,  // 2 hours
    VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Cache Keys
  CACHE_KEYS: {
    POSTS: 'posts',
    PAGES: 'pages',
    CATEGORIES: 'categories',
    TAGS: 'tags',
    USERS: 'users',
    COMMENTS: 'comments',
    SETTINGS: 'settings',
    SESSION: 'session',
    THEME: 'theme',
  },
  
  // Cache Strategies
  STRATEGIES: {
    NETWORK_FIRST: 'network-first',
    CACHE_FIRST: 'cache-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
    CACHE_ONLY: 'cache-only',
    NETWORK_ONLY: 'network-only',
  },
};

/**
 * Routing & Navigation Constants
 */
export const ROUTING_CONSTANTS = {
  // Route Paths
  PATHS: {
    HOME: '/',
    ARTICLES: '/articles',
    ARTICLES_DETAIL: '/articles/[slug]',
    CATEGORIES: '/categories',
    CATEGORIES_DETAIL: '/categories/[slug]',
    TAGS: '/tags',
    TAGS_DETAIL: '/tags/[slug]',
    AUTHORS: '/authors',
    AUTHORS_DETAIL: '/authors/[slug]',
    COMMUNITY: '/community',
    RESOURCES: '/resources',
    ABOUT: '/about',
    CONTACT: '/contact',
    SEARCH: '/search',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    DASHBOARD: '/dashboard',
    SETTINGS: '/settings',
    NOT_FOUND: '/404',
  },
  
  // Route Names
  NAMES: {
    HOME: 'Home',
    ARTICLES: 'Articles',
    CATEGORIES: 'Categories',
    TAGS: 'Tags',
    AUTHORS: 'Authors',
    COMMUNITY: 'Community',
    RESOURCES: 'Resources',
    ABOUT: 'About Us',
    CONTACT: 'Contact',
    SEARCH: 'Search',
    LOGIN: 'Login',
    REGISTER: 'Register',
    PROFILE: 'Profile',
    DASHBOARD: 'Dashboard',
    SETTINGS: 'Settings',
  },
  
  // Navigation Categories
  NAVIGATION: {
    MAIN: [
      { name: 'Home', path: '/', icon: 'home' },
      { name: 'Articles', path: '/articles', icon: 'article' },
      { name: 'Categories', path: '/categories', icon: 'category' },
      { name: 'Community', path: '/community', icon: 'community' },
      { name: 'Resources', path: '/resources', icon: 'resources' },
      { name: 'About', path: '/about', icon: 'info' },
    ],
    USER: [
      { name: 'Profile', path: '/profile', icon: 'user', auth: true },
      { name: 'Dashboard', path: '/dashboard', icon: 'dashboard', auth: true },
      { name: 'Settings', path: '/settings', icon: 'settings', auth: true },
      { name: 'Login', path: '/login', icon: 'login', auth: false },
      { name: 'Register', path: '/register', icon: 'register', auth: false },
    ],
    FOOTER: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Sitemap', path: '/sitemap' },
    ],
  },
  
  // Query Parameters
  QUERY_PARAMS: {
    PAGE: 'page',
    SEARCH: 'search',
    CATEGORY: 'category',
    TAG: 'tag',
    AUTHOR: 'author',
    SORT: 'sort',
    ORDER: 'order',
    VIEW: 'view',
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PER_PAGE: 10,
    PER_PAGE_OPTIONS: [5, 10, 20, 50],
    MAX_PAGES_TO_SHOW: 5,
  },
};

/**
 * UI & Component Constants
 */
export const UI_CONSTANTS = {
  // Breakpoints
  BREAKPOINTS: {
    XS: 0,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  
  // Container Sizes
  CONTAINER_SIZES: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
    FULL: '100%',
  },
  
  // Z-Index Layers
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
  },
  
  // Animation Durations
  ANIMATION_DURATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000,
  },
  
  // Animation Easing
  ANIMATION_EASING: {
    LINEAR: 'linear',
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
  
  // Component Variants
  VARIANTS: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    DANGER: 'danger',
    WARNING: 'warning',
    INFO: 'info',
    LIGHT: 'light',
    DARK: 'dark',
    OUTLINE: 'outline',
    GHOST: 'ghost',
    LINK: 'link',
  },
  
  // Component Sizes
  SIZES: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
};

/**
 * Form & Input Constants
 */
export const FORM_CONSTANTS = {
  // Input Types
  INPUT_TYPES: {
    TEXT: 'text',
    EMAIL: 'email',
    PASSWORD: 'password',
    NUMBER: 'number',
    TEL: 'tel',
    URL: 'url',
    DATE: 'date',
    TIME: 'time',
    DATETIME_LOCAL: 'datetime-local',
    MONTH: 'month',
    WEEK: 'week',
    COLOR: 'color',
    FILE: 'file',
    HIDDEN: 'hidden',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    RANGE: 'range',
    SEARCH: 'search',
    TEXTAREA: 'textarea',
    SELECT: 'select',
  },
  
  // Validation Messages
  VALIDATION_MESSAGES: {
    REQUIRED: 'This field is required',
    EMAIL: 'Please enter a valid email address',
    URL: 'Please enter a valid URL',
    PHONE: 'Please enter a valid phone number',
    MIN_LENGTH: 'Must be at least {min} characters',
    MAX_LENGTH: 'Must be at most {max} characters',
    MIN_VALUE: 'Must be at least {min}',
    MAX_VALUE: 'Must be at most {max}',
    PATTERN: 'Please match the requested format',
    PASSWORD_MISMATCH: 'Passwords do not match',
  },
  
  // Form States
  STATES: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
    DISABLED: 'disabled',
  },
};

/**
 * Error & Status Code Constants
 */
export const ERROR_CONSTANTS = {
  // HTTP Status Codes
  HTTP_STATUS: {
    // Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    
    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    
    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  },
  
  // Application Error Codes
  ERROR_CODES: {
    // General Errors
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    
    // Auth Errors
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    ACCESS_DENIED: 'ACCESS_DENIED',
    
    // Validation Errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    REQUIRED_FIELD: 'REQUIRED_FIELD',
    INVALID_FORMAT: 'INVALID_FORMAT',
    
    // Resource Errors
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    RESOURCE_EXISTS: 'RESOURCE_EXISTS',
    RESOURCE_LIMIT: 'RESOURCE_LIMIT',
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    DEFAULT: 'An unexpected error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    TIMEOUT: 'Request timeout. Please try again.',
    NOT_FOUND: 'The requested resource was not found.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    FORBIDDEN: 'Access to this resource is forbidden.',
    VALIDATION: 'Please check your input and try again.',
  },
};

/**
 * Localization & Language Constants
 */
export const I18N_CONSTANTS = {
  // Supported Languages
  LANGUAGES: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ],
  
  // Default Language
  DEFAULT_LANGUAGE: 'en',
  
  // Language Codes
  LANGUAGE_CODES: {
    ENGLISH: 'en',
    URDU: 'ur',
    ARABIC: 'ar',
  },
  
  // Locales
  LOCALES: {
    EN_US: 'en-US',
    UR_PK: 'ur-PK',
    AR_SA: 'ar-SA',
  },
  
  // Date/Time Formats
  DATE_FORMATS: {
    SHORT: 'MM/DD/YYYY',
    MEDIUM: 'MMM DD, YYYY',
    LONG: 'MMMM DD, YYYY',
    FULL: 'EEEE, MMMM DD, YYYY',
  },
  
  TIME_FORMATS: {
    SHORT: 'HH:mm',
    MEDIUM: 'HH:mm:ss',
    LONG: 'HH:mm:ss.SSS',
  },
  
  // Number Formats
  NUMBER_FORMATS: {
    DECIMAL: {
      MIN_FRACTION_DIGITS: 0,
      MAX_FRACTION_DIGITS: 2,
    },
    CURRENCY: {
      STYLE: 'currency',
      CURRENCY: 'USD',
    },
    PERCENT: {
      STYLE: 'percent',
      MIN_FRACTION_DIGITS: 0,
      MAX_FRACTION_DIGITS: 2,
    },
  },
};

/**
 * Analytics & Tracking Constants
 */
export const ANALYTICS_CONSTANTS = {
  // Analytics Providers
  PROVIDERS: {
    GOOGLE_ANALYTICS: 'google-analytics',
    FACEBOOK_PIXEL: 'facebook-pixel',
    HOTJAR: 'hotjar',
    GOOGLE_TAG_MANAGER: 'google-tag-manager',
  },
  
  // Event Categories
  EVENT_CATEGORIES: {
    USER: 'user',
    CONTENT: 'content',
    NAVIGATION: 'navigation',
    FORM: 'form',
    ECOMMERCE: 'ecommerce',
    SOCIAL: 'social',
    ERROR: 'error',
  },
  
  // Event Actions
  EVENT_ACTIONS: {
    LOGIN: 'login',
    LOGOUT: 'logout',
    SIGNUP: 'signup',
    VIEW: 'view',
    CLICK: 'click',
    SUBMIT: 'submit',
    PURCHASE: 'purchase',
    SHARE: 'share',
    SEARCH: 'search',
    ERROR: 'error',
  },
  
  // Event Labels
  EVENT_LABELS: {
    SUCCESS: 'success',
    FAILURE: 'failure',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    TIMEOUT: 'timeout',
  },
  
  // User Properties
  USER_PROPERTIES: {
    USER_ID: 'user_id',
    ROLE: 'role',
    SUBSCRIPTION: 'subscription',
    REGION: 'region',
    LANGUAGE: 'language',
  },
  
  // Content Properties
  CONTENT_PROPERTIES: {
    CONTENT_ID: 'content_id',
    CONTENT_TYPE: 'content_type',
    CATEGORY: 'category',
    TAGS: 'tags',
    AUTHOR: 'author',
    WORD_COUNT: 'word_count',
    READING_TIME: 'reading_time',
  },
};

/**
 * Social Media Constants
 */
export const SOCIAL_CONSTANTS = {
  // Social Platforms
  PLATFORMS: {
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    INSTAGRAM: 'instagram',
    LINKEDIN: 'linkedin',
    YOUTUBE: 'youtube',
    PINTEREST: 'pinterest',
    WHATSAPP: 'whatsapp',
    TELEGRAM: 'telegram',
    REDDIT: 'reddit',
    TIKTOK: 'tiktok',
  },
  
  // Social URLs
  URLs: {
    FACEBOOK: 'https://facebook.com/EnglishCommunitiesPK',
    TWITTER: 'https://twitter.com/EnglishCommPK',
    INSTAGRAM: 'https://instagram.com/EnglishCommunitiesPK',
    LINKEDIN: 'https://linkedin.com/company/EnglishCommunitiesPK',
    YOUTUBE: 'https://youtube.com/@EnglishCommunitiesPK',
    WHATSAPP: 'https://wa.me/1234567890',
    TELEGRAM: 'https://t.me/EnglishCommunitiesPK',
  },
  
  // Share Text Templates
  SHARE_TEMPLATES: {
    DEFAULT: 'Check out this article on English Communities PK: {url}',
    ARTICLE: 'I found this interesting article about {title} on English Communities PK: {url}',
    RESOURCE: 'This resource from English Communities PK might be helpful: {url}',
  },
  
  // Hashtags
  HASHTAGS: {
    PRIMARY: '#EnglishCommunitiesPK',
    SECONDARY: ['#LearnEnglish', '#Pakistan', '#EnglishLearning', '#LanguageLearning'],
  },
};

/**
 * Notification Constants
 */
export const NOTIFICATION_CONSTANTS = {
  // Notification Types
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    DEFAULT: 'default',
  },
  
  // Notification Positions
  POSITIONS: {
    TOP_LEFT: 'top-left',
    TOP_CENTER: 'top-center',
    TOP_RIGHT: 'top-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_CENTER: 'bottom-center',
    BOTTOM_RIGHT: 'bottom-right',
  },
  
  // Notification Durations
  DURATIONS: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 10000,
    PERSISTENT: 0,
  },
  
  // Notification Categories
  CATEGORIES: {
    SYSTEM: 'system',
    USER: 'user',
    CONTENT: 'content',
    COMMUNITY: 'community',
    PROMOTIONAL: 'promotional',
  },
};

/**
 * Performance & Optimization Constants
 */
export const PERFORMANCE_CONSTANTS = {
  // Performance Metrics
  METRICS: {
    FCP: 'FCP', // First Contentful Paint
    LCP: 'LCP', // Largest Contentful Paint
    FID: 'FID', // First Input Delay
    CLS: 'CLS', // Cumulative Layout Shift
    TTFB: 'TTFB', // Time to First Byte
    INP: 'INP', // Interaction to Next Paint
  },
  
  // Performance Thresholds
  THRESHOLDS: {
    GOOD: {
      FCP: 1800,
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      TTFB: 800,
    },
    NEEDS_IMPROVEMENT: {
      FCP: 3000,
      LCP: 4000,
      FID: 300,
      CLS: 0.25,
      TTFB: 1800,
    },
    POOR: {
      FCP: 4000,
      LCP: 6000,
      FID: 500,
      CLS: 0.5,
      TTFB: 3000,
    },
  },
  
  // Resource Limits
  RESOURCE_LIMITS: {
    MAX_IMAGE_SIZE: 1024 * 1024, // 1MB
    MAX_SCRIPT_SIZE: 512 * 1024, // 512KB
    MAX_STYLE_SIZE: 256 * 1024, // 256KB
    MAX_FONT_SIZE: 256 * 1024, // 256KB
  },
  
  // Lazy Loading
  LAZY_LOADING: {
    THRESHOLD: 0.1,
    ROOT_MARGIN: '50px',
  },
};

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  // Feature Toggles
  ENABLED_FEATURES: {
    DARK_MODE: true,
    FONT_SELECTOR: true,
    THEME_SWITCHER: true,
    COMMENTS: true,
    REACTIONS: true,
    NOTIFICATIONS: true,
    SOCIAL_SHARING: true,
    SEARCH: true,
    FILTERS: true,
    SORTING: true,
    PAGINATION: true,
    INFINITE_SCROLL: true,
    LAZY_LOADING: true,
    CACHING: true,
    OFFLINE_SUPPORT: true,
    PWA: true,
    ADS: process.env.NODE_ENV === 'production',
    ANALYTICS: process.env.NODE_ENV === 'production',
  },
  
  // Experimental Features
  EXPERIMENTAL: {
    AI_SUGGESTIONS: false,
    VOICE_SEARCH: false,
    AR_VISUALIZATIONS: false,
    REAL_TIME_COLLABORATION: false,
    BLOCKCHAIN_VERIFICATION: false,
  },
  
  // Beta Features
  BETA: {
    NEW_COMMENT_SYSTEM: false,
    ADVANCED_ANALYTICS: false,
    PREMIUM_CONTENT: false,
    COMMUNITY_CHALLENGES: false,
  },
};

/**
 * Environment Constants
 */
export const ENV_CONSTANTS = {
  // Environment Variables
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  
  // Build Information
  BUILD: {
    VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID || 'local',
    BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
  },
  
  // Feature Detection
  FEATURES: {
    IS_SSR: typeof window === 'undefined',
    IS_CSR: typeof window !== 'undefined',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_TEST: process.env.NODE_ENV === 'test',
  },
  
  // API Configuration
  API: {
    ENABLE_MOCK_API: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true',
    ENABLE_CACHE: process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false',
    CACHE_DURATION: parseInt(process.env.NEXT_PUBLIC_CACHE_DURATION || '300000', 10),
  },
};

/**
 * Export all constants as a single object
 */
export const CONSTANTS = {
  WORDPRESS: WORDPRESS_CONSTANTS,
  THEME: THEME_CONSTANTS,
  SEO: SEO_CONSTANTS,
  AD: AD_CONSTANTS,
  AUTH: AUTH_CONSTANTS,
  CONTENT: CONTENT_CONSTANTS,
  MEDIA: MEDIA_CONSTANTS,
  CACHE: CACHE_CONSTANTS,
  ROUTING: ROUTING_CONSTANTS,
  UI: UI_CONSTANTS,
  FORM: FORM_CONSTANTS,
  ERROR: ERROR_CONSTANTS,
  I18N: I18N_CONSTANTS,
  ANALYTICS: ANALYTICS_CONSTANTS,
  SOCIAL: SOCIAL_CONSTANTS,
  NOTIFICATION: NOTIFICATION_CONSTANTS,
  PERFORMANCE: PERFORMANCE_CONSTANTS,
  FEATURE_FLAGS: FEATURE_FLAGS,
  ENV: ENV_CONSTANTS,
} as const;

/**
 * Type exports for constants
 */
export type ThemeName = typeof THEME_CONSTANTS.THEMES[number];
export type ColorMode = typeof THEME_CONSTANTS.COLOR_MODES[keyof typeof THEME_CONSTANTS.COLOR_MODES];
export type FontFamily = typeof THEME_CONSTANTS.FONT_FAMILIES[number];
export type Variant = typeof UI_CONSTANTS.VARIANTS[keyof typeof UI_CONSTANTS.VARIANTS];
export type Size = typeof UI_CONSTANTS.SIZES[keyof typeof UI_CONSTANTS.SIZES];
export type Breakpoint = keyof typeof UI_CONSTANTS.BREAKPOINTS;
export type NotificationType = typeof NOTIFICATION_CONSTANTS.TYPES[keyof typeof NOTIFICATION_CONSTANTS.TYPES];
export type UserRole = typeof AUTH_CONSTANTS.ROLES[keyof typeof AUTH_CONSTANTS.ROLES];

export default CONSTANTS;