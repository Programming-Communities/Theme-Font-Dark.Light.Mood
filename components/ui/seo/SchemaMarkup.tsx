'use client';

import React from 'react';
import { SchemaType, OrganizationSchema, ArticleSchema, BreadcrumbSchema, FAQSchema, ProductSchema } from '@/types/components';
import { defaultSiteConfig } from '@/config/site.config';

interface SchemaMarkupProps {
  type: SchemaType;
  data: any;
  keyOverride?: string;
}

export default function SchemaMarkup({ type, data, keyOverride }: SchemaMarkupProps) {
  const schemaData = generateSchema(type, data);
  
  if (!schemaData) {
    console.warn(`No schema generated for type: ${type}`);
    return null;
  }

  return (
    <script
      type="application/ld+json"
      key={keyOverride || `${type}-schema`}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData, null, 2) }}
    />
  );
}

function generateSchema(type: SchemaType, data: any) {
  switch (type) {
    case 'Organization':
      return generateOrganizationSchema(data);
    case 'Article':
      return generateArticleSchema(data);
    case 'NewsArticle':
      return generateNewsArticleSchema(data);
    case 'BlogPosting':
      return generateBlogPostingSchema(data);
    case 'WebPage':
      return generateWebPageSchema(data);
    case 'WebSite':
      return generateWebsiteSchema(data);
    case 'BreadcrumbList':
      return generateBreadcrumbSchema(data);
    case 'FAQPage':
      return generateFAQSchema(data);
    case 'Product':
      return generateProductSchema(data);
    case 'Event':
      return generateEventSchema(data);
    case 'Person':
      return generatePersonSchema(data);
    case 'LocalBusiness':
      return generateLocalBusinessSchema(data);
    default:
      return null;
  }
}

// Organization Schema
function generateOrganizationSchema(data: OrganizationSchema) {
  const siteConfig = defaultSiteConfig;
  
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: data.name || siteConfig.name,
    url: data.url || siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: data.logo?.url || `${siteConfig.url}/logo.png`,
      width: data.logo?.width || 512,
      height: data.logo?.height || 512,
    },
    description: data.description || siteConfig.description,
    sameAs: data.sameAs || [
      siteConfig.social.facebook ? `https://facebook.com/${siteConfig.social.facebook}` : null,
      siteConfig.social.twitter ? `https://twitter.com/${siteConfig.social.twitter}` : null,
      siteConfig.social.instagram ? `https://instagram.com/${siteConfig.social.instagram}` : null,
      siteConfig.social.linkedin ? `https://linkedin.com/company/${siteConfig.social.linkedin}` : null,
      siteConfig.social.youtube ? `https://youtube.com/${siteConfig.social.youtube}` : null,
    ].filter(Boolean),
    contactPoint: data.contactPoint || [{
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'customer service',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu'],
    }],
  };

  // Add address if provided
  if (data.address) {
    Object.assign(baseSchema, {
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address.streetAddress,
        addressLocality: data.address.addressLocality,
        addressRegion: data.address.addressRegion,
        postalCode: data.address.postalCode,
        addressCountry: data.address.addressCountry,
      },
    });
  }

  return baseSchema;
}

// Article Schema
function generateArticleSchema(data: ArticleSchema) {
  const siteConfig = defaultSiteConfig;
  
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': data.type || 'Article',
    '@id': data.url || `${siteConfig.url}${data.path}`,
    headline: data.headline,
    description: data.description,
    image: data.images?.map(img => img.url) || [],
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author?.name,
      url: data.author?.url,
      image: data.author?.image,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url || `${siteConfig.url}${data.path}`,
    },
    keywords: data.keywords?.join(', '),
    articleSection: data.articleSection,
    wordCount: data.wordCount,
    timeRequired: data.timeRequired ? `PT${data.timeRequired}M` : undefined,
    inLanguage: 'en-US',
  };

  return baseSchema;
}

// News Article Schema
function generateNewsArticleSchema(data: ArticleSchema) {
  const articleSchema = generateArticleSchema({
    ...data,
    type: 'NewsArticle',
  });

  // Add news-specific properties
  Object.assign(articleSchema, {
    dateline: data.dateline,
    printEdition: data.printEdition,
    printPage: data.printPage,
    printSection: data.printSection,
  });

  return articleSchema;
}

// Blog Posting Schema
function generateBlogPostingSchema(data: ArticleSchema) {
  const articleSchema = generateArticleSchema({
    ...data,
    type: 'BlogPosting',
  });

  // Add blog-specific properties
  Object.assign(articleSchema, {
    sharedContent: data.sharedContent?.map(content => ({
      '@type': 'WebContent',
      url: content.url,
      name: content.name,
    })),
  });

  return articleSchema;
}

// Web Page Schema
function generateWebPageSchema(data: any) {
  const siteConfig = defaultSiteConfig;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': data.url || `${siteConfig.url}${data.path}`,
    name: data.name,
    description: data.description,
    url: data.url || `${siteConfig.url}${data.path}`,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    breadcrumb: data.breadcrumb ? {
      '@type': 'BreadcrumbList',
      itemListElement: data.breadcrumb,
    } : undefined,
    primaryImageOfPage: data.primaryImage ? {
      '@type': 'ImageObject',
      url: data.primaryImage.url,
      width: data.primaryImage.width,
      height: data.primaryImage.height,
    } : undefined,
    speakable: data.speakable ? {
      '@type': 'SpeakableSpecification',
      cssSelector: data.speakable.cssSelector,
      xpath: data.speakable.xpath,
    } : undefined,
  };
}

// Website Schema
function generateWebsiteSchema(data: any) {
  const siteConfig = defaultSiteConfig;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  };
}

// Breadcrumb Schema
function generateBreadcrumbSchema(data: BreadcrumbSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

// FAQ Schema
function generateFAQSchema(data: FAQSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(question => ({
      '@type': 'Question',
      name: question.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer,
      },
    })),
  };
}

// Product Schema
function generateProductSchema(data: ProductSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': data.url,
    name: data.name,
    description: data.description,
    image: data.images,
    sku: data.sku,
    gtin: data.gtin,
    brand: {
      '@type': 'Brand',
      name: data.brand,
    },
    offers: {
      '@type': 'Offer',
      url: data.url,
      priceCurrency: data.priceCurrency,
      price: data.price,
      priceValidUntil: data.priceValidUntil,
      availability: data.availability,
      itemCondition: data.itemCondition,
      seller: {
        '@type': 'Organization',
        name: data.seller?.name,
      },
    },
    aggregateRating: data.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      ratingCount: data.aggregateRating.ratingCount,
      bestRating: data.aggregateRating.bestRating,
      worstRating: data.aggregateRating.worstRating,
    } : undefined,
    review: data.reviews?.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.ratingValue,
        bestRating: review.bestRating,
        worstRating: review.worstRating,
      },
    })),
    additionalProperty: data.additionalProperties?.map(prop => ({
      '@type': 'PropertyValue',
      name: prop.name,
      value: prop.value,
    })),
  };
}

// Event Schema
function generateEventSchema(data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.name,
    description: data.description,
    image: data.images,
    startDate: data.startDate,
    endDate: data.endDate,
    eventStatus: data.eventStatus,
    eventAttendanceMode: data.eventAttendanceMode,
    location: {
      '@type': data.location.type || 'Place',
      name: data.location.name,
      address: data.location.address,
      ...(data.location.type === 'VirtualLocation' && {
        url: data.location.url,
      }),
    },
    organizer: {
      '@type': 'Organization',
      name: data.organizer.name,
      url: data.organizer.url,
    },
    performer: data.performer ? {
      '@type': 'Person',
      name: data.performer.name,
    } : undefined,
    offers: {
      '@type': 'Offer',
      url: data.offers.url,
      price: data.offers.price,
      priceCurrency: data.offers.priceCurrency,
      availability: data.offers.availability,
      validFrom: data.offers.validFrom,
    },
  };
}

// Person Schema
function generatePersonSchema(data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': data.url,
    name: data.name,
    image: data.image,
    description: data.description,
    url: data.url,
    sameAs: data.sameAs,
    jobTitle: data.jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: data.worksFor,
    },
    knowsAbout: data.knowsAbout,
    award: data.awards,
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: data.alumniOf,
    },
  };
}

// Local Business Schema
function generateLocalBusinessSchema(data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': data.businessType || 'LocalBusiness',
    '@id': data.url,
    name: data.name,
    image: data.images,
    description: data.description,
    url: data.url,
    telephone: data.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    },
    openingHoursSpecification: data.openingHours?.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
    priceRange: data.priceRange,
    servesCuisine: data.servesCuisine,
    menu: data.menu,
    acceptsReservations: data.acceptsReservations,
    aggregateRating: data.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      ratingCount: data.aggregateRating.ratingCount,
    } : undefined,
  };
}

// Helper to extract schema data from WordPress post
export function extractSchemaFromPost(post: any): ArticleSchema {
  if (!post) return {} as ArticleSchema;

  const featuredImage = post.featuredImage?.node;
  const author = post.author?.node;
  const categories = post.categories?.nodes || [];

  return {
    type: 'Article',
    headline: post.seo?.title || post.title,
    description: post.seo?.metaDesc || post.excerpt,
    url: post.seo?.canonical || post.uri,
    path: post.uri,
    images: featuredImage ? [{
      url: featuredImage.sourceUrl,
      width: featuredImage.mediaDetails?.width || 1200,
      height: featuredImage.mediaDetails?.height || 630,
      alt: featuredImage.altText || post.title,
    }] : [],
    datePublished: post.date,
    dateModified: post.modified,
    author: author ? {
      name: author.name,
      url: author.uri,
      image: author.avatar?.url,
    } : undefined,
    keywords: (post.tags?.nodes || []).map((tag: any) => tag.name),
    articleSection: categories[0]?.name,
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    timeRequired: Math.ceil((post.content?.split(/\s+/).length || 0) / 200), // 200 words per minute
  };
}