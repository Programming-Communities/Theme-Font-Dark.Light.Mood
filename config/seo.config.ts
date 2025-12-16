// File 49: config/seo.config.ts
/**
 * SEO configuration for English Communities PK
 */

export interface SEOConfig {
  // Site Metadata
  site: {
    name: string;
    description: string;
    url: string;
    type: 'website' | 'blog' | 'article';
    locale: string;
    language: string;
    robots: {
      index: boolean;
      follow: boolean;
      maxImagePreview: 'none' | 'standard' | 'large';
      maxSnippet: number;
      maxVideoPreview: number;
    };
  };
  
  // Twitter Card
  twitter: {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
    site: string;
    creator: string;
    title: string;
    description: string;
    image: string;
  };
  
  // Open Graph
  openGraph: {
    type: 'website' | 'article' | 'profile';
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
      type: string;
    }>;
    videos?: Array<{
      url: string;
      width: number;
      height: number;
      type: string;
    }>;
    locale: string;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  
  // Structured Data
  structuredData: {
    organization: {
      type: 'Organization';
      name: string;
      url: string;
      logo: string;
      sameAs: string[];
    };
    website: {
      type: 'WebSite';
      name: string;
      url: string;
      potentialAction: {
        type: 'SearchAction';
        target: string;
        'query-input': string;
      };
    };
    breadcrumb: {
      type: 'BreadcrumbList';
      itemListElement: Array<{
        type: 'ListItem';
        position: number;
        name: string;
        item: string;
      }>;
    };
  };
  
  // SEO Optimization
  optimization: {
    titleLength: {
      min: number;
      max: number;
      optimal: number;
    };
    descriptionLength: {
      min: number;
      max: number;
      optimal: number;
    };
    keywordDensity: {
      min: number;
      max: number;
      optimal: number;
    };
    imageOptimization: {
      format: 'webp' | 'avif' | 'jpg' | 'png';
      quality: number;
      maxSize: number;
    };
    mobileFirst: boolean;
    schemaMarkup: boolean;
    microdata: boolean;
  };
  
  // Performance SEO
  performance: {
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
    };
    loading: {
      preload: boolean;
      prefetch: boolean;
      lazyLoad: boolean;
    };
    caching: {
      static: string;
      dynamic: string;
      images: string;
    };
  };
  
  // Social Media Integration
  social: {
    facebook: {
      appId: string;
      pages: string[];
      admins: string[];
    };
    twitter: {
      card: 'summary' | 'summary_large_image';
      site: string;
      creator: string;
    };
    linkedin: {
      company: string;
      type: 'company' | 'personal';
    };
    pinterest: {
      verification: string;
    };
  };
}

const seoConfig: SEOConfig = {
  site: {
    name: 'English Communities PK',
    description: 'Join the largest English learning community in Pakistan. Free resources, courses, and community support for English learners.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk',
    type: 'website',
    locale: 'en_US',
    language: 'en',
    robots: {
      index: true,
      follow: true,
      maxImagePreview: 'large',
      maxSnippet: 150,
      maxVideoPreview: -1,
    },
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@EnglishCommPK',
    creator: '@EnglishCommPK',
    title: 'English Communities PK - Learn English in Pakistan',
    description: 'Join the largest English learning community in Pakistan. Free resources, courses, and community support for English learners.',
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk'}/twitter-card.jpg`,
  },
  
  openGraph: {
    type: 'website',
    title: 'English Communities PK - Learn English in Pakistan',
    description: 'Join the largest English learning community in Pakistan. Free resources, courses, and community support for English learners.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk',
    siteName: 'English Communities PK',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'English Communities PK - Learn English in Pakistan',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
  },
  
  structuredData: {
    organization: {
      type: 'Organization',
      name: 'English Communities PK',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk',
      logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk'}/logo.png`,
      sameAs: [
        'https://twitter.com/EnglishCommPK',
        'https://facebook.com/EnglishCommunitiesPK',
        'https://instagram.com/englishcommunitiespk',
        'https://youtube.com/@EnglishCommunitiesPK',
      ],
    },
    website: {
      type: 'WebSite',
      name: 'English Communities PK',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk',
      potentialAction: {
        type: 'SearchAction',
        target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk'}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    breadcrumb: {
      type: 'BreadcrumbList',
      itemListElement: [
        {
          type: 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk',
        },
      ],
    },
  },
  
  optimization: {
    titleLength: {
      min: 30,
      max: 60,
      optimal: 50,
    },
    descriptionLength: {
      min: 120,
      max: 160,
      optimal: 150,
    },
    keywordDensity: {
      min: 0.5,
      max: 2.5,
      optimal: 1.5,
    },
    imageOptimization: {
      format: 'webp',
      quality: 85,
      maxSize: 500,
    },
    mobileFirst: true,
    schemaMarkup: true,
    microdata: true,
  },
  
  performance: {
    coreWebVitals: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
    },
    loading: {
      preload: true,
      prefetch: true,
      lazyLoad: true,
    },
    caching: {
      static: 'public, max-age=31536000, immutable',
      dynamic: 'public, max-age=3600, stale-while-revalidate=86400',
      images: 'public, max-age=604800, stale-while-revalidate=86400',
    },
  },
  
  social: {
    facebook: {
      appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
      pages: ['EnglishCommunitiesPK'],
      admins: ['EnglishCommunitiesPK'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@EnglishCommPK',
      creator: '@EnglishCommPK',
    },
    linkedin: {
      company: 'English Communities PK',
      type: 'company',
    },
    pinterest: {
      verification: process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION || '',
    },
  },
};

export default seoConfig;