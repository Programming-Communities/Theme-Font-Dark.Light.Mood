// File 38: lib/seo/generator.ts
import { SiteConfig } from '@/config/site.config';
import { SEOConfig } from '@/config/seo.config';
import { generateStructuredData, SchemaType } from './schemas';
import { formatMetaDescription, generateSlug, truncateText } from './utils';

export interface MetaTags {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogType: string;
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  twitterCard: string;
  twitterSite?: string;
  twitterCreator?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  articleTags?: string[];
  locale: string;
  siteName: string;
  robots?: string;
}

export interface PageSEOData {
  type: 'article' | 'page' | 'category' | 'tag' | 'author' | 'homepage';
  title: string;
  description: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  publishedTime?: Date;
  modifiedTime?: Date;
  author?: {
    name: string;
    bio?: string;
    avatar?: string;
    social?: Record<string, string>;
  };
  category?: string;
  tags?: string[];
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  readingTime?: number;
  wordCount?: number;
}

export class SEOGenerator {
  private siteConfig: SiteConfig;
  private seoConfig: SEOConfig;

  constructor() {
    // Dynamic imports to avoid circular dependencies
    this.siteConfig = require('@/config/site.config').default;
    this.seoConfig = require('@/config/seo.config').default;
  }

  /**
   * Generate meta tags for any page
   */
  generateMetaTags(pageData: PageSEOData): MetaTags {
    const {
      type,
      title,
      description,
      excerpt,
      slug,
      publishedTime,
      modifiedTime,
      author,
      category,
      tags,
      featuredImage,
      readingTime,
      wordCount
    } = pageData;

    // Generate canonical URL
    const canonicalUrl = this.generateCanonicalUrl(slug, type);
    
    // Generate meta title
    const metaTitle = this.generateMetaTitle(title, type);
    
    // Generate meta description
    const metaDescription = this.generateMetaDescription(description, excerpt, content);
    
    // Get Open Graph image
    const ogImage = this.getOGImage(featuredImage);
    
    // Generate meta tags object
    const metaTags: MetaTags = {
      title: metaTitle,
      description: metaDescription,
      canonicalUrl,
      ogType: this.getOgType(type),
      ogImage: ogImage.url,
      ogImageAlt: ogImage.alt,
      ogImageWidth: ogImage.width,
      ogImageHeight: ogImage.height,
      twitterCard: 'summary_large_image',
      locale: this.siteConfig.locale,
      siteName: this.siteConfig.name
    };

    // Add keywords if available
    if (tags && tags.length > 0) {
      metaTags.keywords = tags.slice(0, 5);
    }

    // Add Twitter handles
    if (this.seoConfig.twitter.handle) {
      metaTags.twitterSite = `@${this.seoConfig.twitter.handle}`;
    }

    // Add author Twitter if available
    if (author?.social?.twitter) {
      metaTags.twitterCreator = `@${author.social.twitter}`;
    }

    // Add article-specific meta tags
    if (type === 'article') {
      if (publishedTime) {
        metaTags.articlePublishedTime = publishedTime.toISOString();
      }
      
      if (modifiedTime) {
        metaTags.articleModifiedTime = modifiedTime.toISOString();
      }
      
      if (author?.name) {
        metaTags.articleAuthor = author.name;
      }
      
      if (category) {
        metaTags.articleSection = category;
      }
      
      if (tags) {
        metaTags.articleTags = tags;
      }
    }

    // Add robots meta tag
    metaTags.robots = this.generateRobotsMeta(type);

    return metaTags;
  }

  /**
   * Generate structured data for any page
   */
  generateStructuredData(pageData: PageSEOData): any[] {
    const schemas: any[] = [];
    const { type, title, description, slug, publishedTime, modifiedTime, author, featuredImage } = pageData;

    // Always add Website schema
    const websiteSchema = generateStructuredData('website', {
      name: this.siteConfig.name,
      description: this.siteConfig.description,
      url: this.siteConfig.url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.siteConfig.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });
    schemas.push(websiteSchema);

    // Add Organization schema
    const organizationSchema = generateStructuredData('organization', {
      '@type': 'Organization',
      name: this.siteConfig.name,
      description: this.siteConfig.description,
      url: this.siteConfig.url,
      logo: this.seoConfig.openGraph.logo,
      sameAs: this.seoConfig.socialLinks
    });
    schemas.push(organizationSchema);

    // Add BreadcrumbList schema
    const breadcrumbSchema = this.generateBreadcrumbSchema(pageData);
    if (breadcrumbSchema) {
      schemas.push(breadcrumbSchema);
    }

    // Add page-type specific schemas
    switch (type) {
      case 'article':
        const articleSchema = this.generateArticleSchema(pageData);
        schemas.push(articleSchema);
        break;
      
      case 'author':
        const authorSchema = this.generateAuthorSchema(pageData);
        schemas.push(authorSchema);
        break;
      
      case 'category':
      case 'tag':
        const collectionPageSchema = this.generateCollectionPageSchema(pageData);
        schemas.push(collectionPageSchema);
        break;
      
      case 'homepage':
        const homepageSchema = this.generateHomepageSchema(pageData);
        schemas.push(homepageSchema);
        break;
    }

    return schemas;
  }

  /**
   * Generate Article schema
   */
  private generateArticleSchema(pageData: PageSEOData): any {
    const {
      title,
      description,
      excerpt,
      publishedTime,
      modifiedTime,
      author,
      category,
      tags,
      featuredImage,
      readingTime,
      wordCount,
      content
    } = pageData;

    const articleData: any = {
      '@type': 'Article',
      headline: title,
      description: description || excerpt,
      image: featuredImage ? [featuredImage.url] : [this.seoConfig.openGraph.defaultImage],
      datePublished: publishedTime?.toISOString(),
      dateModified: modifiedTime?.toISOString() || publishedTime?.toISOString(),
      author: author ? {
        '@type': 'Person',
        name: author.name,
        description: author.bio,
        image: author.avatar
      } : {
        '@type': 'Person',
        name: this.siteConfig.name
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteConfig.name,
        logo: {
          '@type': 'ImageObject',
          url: this.seoConfig.openGraph.logo
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': this.generateCanonicalUrl(pageData.slug, 'article')
      }
    };

    if (category) {
      articleData.articleSection = category;
    }

    if (tags && tags.length > 0) {
      articleData.keywords = tags.join(', ');
    }

    if (readingTime) {
      articleData.timeRequired = `PT${readingTime}M`;
    }

    if (wordCount) {
      articleData.wordCount = wordCount;
    }

    if (content) {
      articleData.articleBody = content;
    }

    return generateStructuredData('article', articleData);
  }

  /**
   * Generate Author schema
   */
  private generateAuthorSchema(pageData: PageSEOData): any {
    const { title, description, author } = pageData;

    const authorData = {
      '@type': 'Person',
      name: title,
      description: description,
      url: this.generateCanonicalUrl(pageData.slug, 'author'),
      image: author?.avatar || this.seoConfig.openGraph.defaultImage,
      sameAs: author?.social ? Object.values(author.social) : []
    };

    return generateStructuredData('author', authorData);
  }

  /**
   * Generate CollectionPage schema for categories/tags
   */
  private generateCollectionPageSchema(pageData: PageSEOData): any {
    const { title, description } = pageData;

    const collectionData = {
      '@type': 'CollectionPage',
      name: title,
      description: description,
      url: this.generateCanonicalUrl(pageData.slug, pageData.type),
      isPartOf: {
        '@type': 'WebSite',
        name: this.siteConfig.name,
        url: this.siteConfig.url
      }
    };

    return generateStructuredData('collection', collectionData);
  }

  /**
   * Generate Homepage schema
   */
  private generateHomepageSchema(pageData: PageSEOData): any {
    const homepageData = {
      '@type': 'WebPage',
      name: this.siteConfig.name,
      description: this.siteConfig.description,
      url: this.siteConfig.url,
      isPartOf: {
        '@type': 'WebSite',
        name: this.siteConfig.name,
        url: this.siteConfig.url
      }
    };

    return generateStructuredData('homepage', homepageData);
  }

  /**
   * Generate BreadcrumbList schema
   */
  private generateBreadcrumbSchema(pageData: PageSEOData): any | null {
    const { type, title, slug, category } = pageData;
    
    if (type === 'homepage') return null;

    const breadcrumbs: any[] = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: this.siteConfig.url
      }
    ];

    let position = 2;

    // Add category if available
    if (category && type === 'article') {
      breadcrumbs.push({
        '@type': 'ListItem',
        position: position++,
        name: category,
        item: `${this.siteConfig.url}/category/${generateSlug(category)}`
      });
    }

    // Add current page
    breadcrumbs.push({
      '@type': 'ListItem',
      position: position,
      name: title,
      item: this.generateCanonicalUrl(slug, type)
    });

    return generateStructuredData('breadcrumb', {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs
    });
  }

  /**
   * Generate canonical URL
   */
  private generateCanonicalUrl(slug?: string, type?: string): string {
    if (!slug || type === 'homepage') {
      return this.siteConfig.url;
    }

    switch (type) {
      case 'article':
        return `${this.siteConfig.url}/article/${slug}`;
      case 'category':
        return `${this.siteConfig.url}/category/${slug}`;
      case 'tag':
        return `${this.siteConfig.url}/tag/${slug}`;
      case 'author':
        return `${this.siteConfig.url}/author/${slug}`;
      default:
        return `${this.siteConfig.url}/${slug}`;
    }
  }

  /**
   * Generate meta title
   */
  private generateMetaTitle(title: string, type: string): string {
    let metaTitle = title;
    
    if (type !== 'homepage') {
      metaTitle += ` | ${this.siteConfig.name}`;
    }
    
    // Ensure title length is optimal
    if (metaTitle.length > 60) {
      metaTitle = truncateText(metaTitle, 60);
    }
    
    return metaTitle;
  }

  /**
   * Generate meta description
   */
  private generateMetaDescription(description?: string, excerpt?: string, content?: string): string {
    let metaDescription = description || excerpt || this.siteConfig.description;
    
    // If no description is provided, generate from content
    if (!metaDescription && content) {
      metaDescription = formatMetaDescription(content);
    }
    
    // Ensure description length is optimal
    if (metaDescription.length > 160) {
      metaDescription = truncateText(metaDescription, 155) + '...';
    }
    
    return metaDescription;
  }

  /**
   * Get Open Graph image
   */
  private getOGImage(featuredImage?: PageSEOData['featuredImage']): {
    url: string;
    alt: string;
    width: number;
    height: number;
  } {
    if (featuredImage) {
      return {
        url: featuredImage.url,
        alt: featuredImage.alt,
        width: featuredImage.width,
        height: featuredImage.height
      };
    }
    
    return {
      url: this.seoConfig.openGraph.defaultImage,
      alt: this.siteConfig.name,
      width: 1200,
      height: 630
    };
  }

  /**
   * Get Open Graph type
   */
  private getOgType(type: string): string {
    switch (type) {
      case 'article':
        return 'article';
      case 'author':
        return 'profile';
      case 'category':
      case 'tag':
        return 'website';
      default:
        return 'website';
    }
  }

  /**
   * Generate robots meta tag
   */
  private generateRobotsMeta(type: string): string {
    const defaults = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    
    // Add noindex for certain pages if needed
    if (type === 'author' && !this.seoConfig.indexAuthors) {
      return 'noindex, follow';
    }
    
    return defaults;
  }

  /**
   * Generate JSON-LD script for structured data
   */
  generateJsonLdScript(pageData: PageSEOData): string {
    const structuredData = this.generateStructuredData(pageData);
    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
  }

  /**
   * Generate HTML meta tags string
   */
  generateMetaTagsHTML(metaTags: MetaTags): string {
    const tags: string[] = [];

    // Basic meta tags
    tags.push(`<title>${metaTags.title}</title>`);
    tags.push(`<meta name="description" content="${metaTags.description}">`);
    
    if (metaTags.keywords && metaTags.keywords.length > 0) {
      tags.push(`<meta name="keywords" content="${metaTags.keywords.join(', ')}">`);
    }
    
    if (metaTags.robots) {
      tags.push(`<meta name="robots" content="${metaTags.robots}">`);
    }

    // Open Graph tags
    tags.push(`<meta property="og:title" content="${metaTags.title}">`);
    tags.push(`<meta property="og:description" content="${metaTags.description}">`);
    tags.push(`<meta property="og:url" content="${metaTags.canonicalUrl}">`);
    tags.push(`<meta property="og:type" content="${metaTags.ogType}">`);
    tags.push(`<meta property="og:image" content="${metaTags.ogImage}">`);
    tags.push(`<meta property="og:image:alt" content="${metaTags.ogImageAlt}">`);
    tags.push(`<meta property="og:image:width" content="${metaTags.ogImageWidth}">`);
    tags.push(`<meta property="og:image:height" content="${metaTags.ogImageHeight}">`);
    tags.push(`<meta property="og:locale" content="${metaTags.locale}">`);
    tags.push(`<meta property="og:site_name" content="${metaTags.siteName}">`);

    // Article-specific OG tags
    if (metaTags.articlePublishedTime) {
      tags.push(`<meta property="article:published_time" content="${metaTags.articlePublishedTime}">`);
    }
    
    if (metaTags.articleModifiedTime) {
      tags.push(`<meta property="article:modified_time" content="${metaTags.articleModifiedTime}">`);
    }
    
    if (metaTags.articleAuthor) {
      tags.push(`<meta property="article:author" content="${metaTags.articleAuthor}">`);
    }
    
    if (metaTags.articleSection) {
      tags.push(`<meta property="article:section" content="${metaTags.articleSection}">`);
    }
    
    if (metaTags.articleTags) {
      metaTags.articleTags.forEach(tag => {
        tags.push(`<meta property="article:tag" content="${tag}">`);
      });
    }

    // Twitter Card tags
    tags.push(`<meta name="twitter:card" content="${metaTags.twitterCard}">`);
    tags.push(`<meta name="twitter:title" content="${metaTags.title}">`);
    tags.push(`<meta name="twitter:description" content="${metaTags.description}">`);
    tags.push(`<meta name="twitter:image" content="${metaTags.ogImage}">`);
    
    if (metaTags.twitterSite) {
      tags.push(`<meta name="twitter:site" content="${metaTags.twitterSite}">`);
    }
    
    if (metaTags.twitterCreator) {
      tags.push(`<meta name="twitter:creator" content="${metaTags.twitterCreator}">`);
    }

    // Canonical link
    tags.push(`<link rel="canonical" href="${metaTags.canonicalUrl}">`);

    return tags.join('\n');
  }
}

// Export singleton instance
let seoGeneratorInstance: SEOGenerator | null = null;

export function getSEOGenerator(): SEOGenerator {
  if (!seoGeneratorInstance) {
    seoGeneratorInstance = new SEOGenerator();
  }
  return seoGeneratorInstance;
}

export default SEOGenerator;