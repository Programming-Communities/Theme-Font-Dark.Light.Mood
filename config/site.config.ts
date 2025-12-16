export const SITE_CONFIG = {
  name: 'English Communities PK',
  description: 'A dynamic community platform for English speakers in Pakistan',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/englishcommunitiespk',
    github: 'https://github.com/englishcommunitiespk',
    facebook: 'https://facebook.com/englishcommunitiespk',
    instagram: 'https://instagram.com/englishcommunitiespk',
    linkedin: 'https://linkedin.com/company/englishcommunitiespk',
    youtube: 'https://youtube.com/@englishcommunitiespk',
  },
  authors: [
    {
      name: 'English Communities PK Team',
      url: 'https://english.communities.pk/team',
    },
  ],
  keywords: [
    'english',
    'community',
    'pakistan',
    'learning',
    'education',
    'language',
    'grammar',
    'vocabulary',
    'speaking',
    'writing',
    'reading',
    'listening',
  ],
  social: {
    twitterHandle: '@englishcommunitiespk',
    facebookAppId: '',
    instagramUsername: 'englishcommunitiespk',
  },
  contact: {
    email: 'hello@englishcommunities.pk',
    phone: '+92 300 1234567',
    address: 'Lahore, Pakistan',
  },
  features: {
    comments: true,
    reactions: true,
    search: true,
    darkMode: true,
    pwa: true,
    analytics: true,
    ads: true,
    notifications: true,
  },
  limits: {
    maxPostsPerPage: 12,
    maxCommentsPerPage: 10,
    maxReactionsPerPost: 1000,
    maxUploadSize: 5 * 1024 * 1024, // 5MB
  },
  cache: {
    posts: 60 * 1000, // 1 minute
    categories: 5 * 60 * 1000, // 5 minutes
    comments: 30 * 1000, // 30 seconds
  },
} as const;