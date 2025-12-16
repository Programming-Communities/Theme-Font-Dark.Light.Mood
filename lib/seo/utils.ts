// File 40: lib/seo/utils.ts
/**
 * SEO utility functions for the English Communities PK platform
 */

/**
 * Format a string for use in meta descriptions
 * Removes HTML tags, truncates to optimal length, and ensures proper formatting
 */
export function formatMetaDescription(
  text: string,
  maxLength: number = 160
): string {
  if (!text) return '';
  
  // Remove HTML tags
  let formatted = text.replace(/<[^>]*>/g, '');
  
  // Replace multiple spaces with single space
  formatted = formatted.replace(/\s+/g, ' ');
  
  // Trim whitespace
  formatted = formatted.trim();
  
  // Truncate to max length if needed
  if (formatted.length > maxLength) {
    formatted = formatted.substring(0, maxLength - 3) + '...';
  }
  
  return formatted;
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim(); // Trim whitespace
}

/**
 * Truncate text to a specified length while preserving word boundaries
 */
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  // Find the last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return text.substring(0, lastSpace) + ellipsis;
  }
  
  return truncated + ellipsis;
}

/**
 * Extract keywords from text content
 */
export function extractKeywords(
  text: string,
  maxKeywords: number = 10,
  minWordLength: number = 3
): string[] {
  if (!text) return [];
  
  // Remove HTML tags and special characters
  const cleanText = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .toLowerCase();
  
  // Split into words
  const words = cleanText.split(/\s+/);
  
  // Count word frequency
  const wordFrequency: Record<string, number> = {};
  
  words.forEach(word => {
    if (word.length >= minWordLength) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and get top keywords
  const sortedKeywords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
  
  return sortedKeywords;
}

/**
 * Calculate reading time for content
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  if (!text) return 0;
  
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, ' ');
  
  // Count words
  const wordCount = cleanText.split(/\s+/).length;
  
  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Generate a sitemap URL entry
 */
export function generateSitemapUrl(
  url: string,
  lastModified?: Date,
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
  priority: number = 0.5
): string {
  const urlEntry = [
    `<loc>${url}</loc>`,
    lastModified ? `<lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>` : '',
    `<changefreq>${changeFrequency}</changefreq>`,
    `<priority>${priority.toFixed(1)}</priority>`
  ].filter(Boolean).join('');
  
  return `<url>${urlEntry}</url>`;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(
  sitemapUrl: string,
  disallowedPaths: string[] = [],
  allowedPaths: string[] = [],
  crawlDelay?: number
): string {
  const lines: string[] = [
    `User-agent: *`,
    ...disallowedPaths.map(path => `Disallow: ${path}`),
    ...allowedPaths.map(path => `Allow: ${path}`),
    crawlDelay ? `Crawl-delay: ${crawlDelay}` : '',
    `Sitemap: ${sitemapUrl}`,
    `Host: ${new URL(sitemapUrl).origin}`
  ].filter(Boolean);
  
  return lines.join('\n');
}

/**
 * Generate Open Graph image URL with fallback
 */
export function generateOgImageUrl(
  imageUrl?: string,
  fallbackUrl: string = '/og-default.jpg',
  dimensions: { width: number; height: number } = { width: 1200, height: 630 }
): {
  url: string;
  alt: string;
  width: number;
  height: number;
} {
  const url = imageUrl || fallbackUrl;
  
  return {
    url: url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_SITE_URL || ''}${url}`,
    alt: 'Open Graph Image',
    width: dimensions.width,
    height: dimensions.height
  };
}

/**
 * Generate Twitter card data
 */
export function generateTwitterCard(
  title: string,
  description: string,
  imageUrl?: string,
  cardType: 'summary' | 'summary_large_image' | 'app' | 'player' = 'summary_large_image',
  siteHandle?: string,
  creatorHandle?: string
): Record<string, string> {
  const card: Record<string, string> = {
    'twitter:card': cardType,
    'twitter:title': title,
    'twitter:description': description
  };
  
  if (imageUrl) {
    card['twitter:image'] = imageUrl;
  }
  
  if (siteHandle) {
    card['twitter:site'] = `@${siteHandle}`;
  }
  
  if (creatorHandle) {
    card['twitter:creator'] = `@${creatorHandle}`;
  }
  
  return card;
}

/**
 * Generate meta tags for social sharing
 */
export function generateSocialMetaTags(
  title: string,
  description: string,
  url: string,
  imageUrl?: string,
  type: string = 'website'
): Record<string, string> {
  const metaTags: Record<string, string> = {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:type': type
  };
  
  if (imageUrl) {
    metaTags['og:image'] = imageUrl;
    metaTags['og:image:width'] = '1200';
    metaTags['og:image:height'] = '630';
    metaTags['og:image:alt'] = title;
  }
  
  return metaTags;
}

/**
 * Validate URL for SEO purposes
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(
  path: string,
  baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://english.communities.pk'
): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove trailing slash from baseUrl
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${normalizedBaseUrl}${normalizedPath}`;
}

/**
 * Generate breadcrumb schema data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generate FAQ schema data
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate article schema data
 */
export function generateArticleSchema(
  article: {
    headline: string;
    description: string;
    image: string[];
    datePublished: string;
    dateModified: string;
    author: { '@type': string; name: string; url?: string }[];
    publisher: { '@type': string; name: string; logo: { '@type': string; url: string } };
  }
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    ...article
  };
}

/**
 * Generate organization schema data
 */
export function generateOrganizationSchema(
  organization: {
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
  }
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...organization
  };
}

/**
 * Generate person schema data
 */
export function generatePersonSchema(
  person: {
    name: string;
    url: string;
    image?: string;
    sameAs?: string[];
    jobTitle?: string;
    worksFor?: { '@type': string; name: string };
  }
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...person
  };
}

/**
 * Generate website schema data
 */
export function generateWebsiteSchema(
  website: {
    name: string;
    url: string;
    description?: string;
    potentialAction?: { '@type': string; target: string; 'query-input': string };
  }
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    ...website
  };
}

/**
 * Sanitize text for meta tags (prevent XSS)
 */
export function sanitizeMetaText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generate a unique ID for schema elements
 */
export function generateSchemaId(prefix: string = 'schema'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate content score for SEO optimization
 */
export function calculateContentScore(
  content: string,
  targetKeyword?: string
): {
  score: number;
  factors: {
    wordCount: number;
    headingCount: number;
    imageCount: number;
    linkCount: number;
    keywordDensity: number;
    readability: number;
  };
} {
  const cleanContent = content.replace(/<[^>]*>/g, ' ');
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0);
  
  const wordCount = words.length;
  const headingCount = (content.match(/<h[1-6]/g) || []).length;
  const imageCount = (content.match(/<img/g) || []).length;
  const linkCount = (content.match(/<a\s+href=/g) || []).length;
  
  let keywordDensity = 0;
  if (targetKeyword && wordCount > 0) {
    const keywordMatches = words.filter(word => 
      word.toLowerCase().includes(targetKeyword.toLowerCase())
    ).length;
    keywordDensity = (keywordMatches / wordCount) * 100;
  }
  
  // Simple readability score based on average word length
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
  const readability = Math.min(100, Math.max(0, 100 - (avgWordLength - 5) * 10));
  
  // Calculate overall score
  const scoreFactors = {
    wordCount: Math.min(100, (wordCount / 1000) * 100), // Target 1000 words
    headingCount: Math.min(100, (headingCount / 5) * 100), // Target 5 headings
    imageCount: Math.min(100, (imageCount / 3) * 100), // Target 3 images
    linkCount: Math.min(100, (linkCount / 5) * 100), // Target 5 links
    keywordDensity: Math.min(100, keywordDensity * 10), // Target 1-2% density
    readability: readability
  };
  
  const totalScore = Object.values(scoreFactors).reduce((sum, factor) => sum + factor, 0);
  const averageScore = totalScore / Object.keys(scoreFactors).length;
  
  return {
    score: Math.round(averageScore),
    factors: {
      wordCount,
      headingCount,
      imageCount,
      linkCount,
      keywordDensity,
      readability: Math.round(readability)
    }
  };
}