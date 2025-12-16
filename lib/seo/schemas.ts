// File 39: lib/seo/schemas.ts
export type SchemaType = 
  | 'website'
  | 'article'
  | 'breadcrumb'
  | 'organization'
  | 'person'
  | 'product'
  | 'event'
  | 'recipe'
  | 'review'
  | 'faq'
  | 'howTo'
  | 'video'
  | 'localBusiness'
  | 'course'
  | 'collection'
  | 'homepage'
  | 'author';

export interface SchemaOptions {
  [key: string]: any;
}

/**
 * Generate structured data for different schema types
 */
export function generateStructuredData(type: SchemaType, data: SchemaOptions): any {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': getSchemaType(type)
  };

  const typeSpecificData = getTypeSpecificData(type, data);
  
  return {
    ...baseSchema,
    ...typeSpecificData
  };
}

/**
 * Get schema.org type from internal type
 */
function getSchemaType(type: SchemaType): string {
  const typeMap: Record<SchemaType, string> = {
    'website': 'WebSite',
    'article': 'Article',
    'breadcrumb': 'BreadcrumbList',
    'organization': 'Organization',
    'person': 'Person',
    'product': 'Product',
    'event': 'Event',
    'recipe': 'Recipe',
    'review': 'Review',
    'faq': 'FAQPage',
    'howTo': 'HowTo',
    'video': 'VideoObject',
    'localBusiness': 'LocalBusiness',
    'course': 'Course',
    'collection': 'CollectionPage',
    'homepage': 'WebPage',
    'author': 'Person'
  };

  return typeMap[type] || 'Thing';
}

/**
 * Get type-specific data structure
 */
function getTypeSpecificData(type: SchemaType, data: SchemaOptions): any {
  switch (type) {
    case 'article':
      return getArticleSchema(data);
    
    case 'breadcrumb':
      return getBreadcrumbSchema(data);
    
    case 'organization':
      return getOrganizationSchema(data);
    
    case 'person':
      return getPersonSchema(data);
    
    case 'faq':
      return getFAQSchema(data);
    
    case 'howTo':
      return getHowToSchema(data);
    
    case 'video':
      return getVideoSchema(data);
    
    case 'course':
      return getCourseSchema(data);
    
    default:
      return data;
  }
}

/**
 * Generate Article schema
 */
function getArticleSchema(data: SchemaOptions): any {
  return {
    headline: data.headline,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: data.author,
    publisher: data.publisher,
    mainEntityOfPage: data.mainEntityOfPage,
    articleSection: data.articleSection,
    keywords: data.keywords,
    wordCount: data.wordCount,
    timeRequired: data.timeRequired,
    articleBody: data.articleBody
  };
}

/**
 * Generate BreadcrumbList schema
 */
function getBreadcrumbSchema(data: SchemaOptions): any {
  return {
    itemListElement: data.itemListElement.map((item: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
}

/**
 * Generate Organization schema
 */
function getOrganizationSchema(data: SchemaOptions): any {
  return {
    name: data.name,
    description: data.description,
    url: data.url,
    logo: data.logo,
    sameAs: data.sameAs,
    contactPoint: data.contactPoint ? {
      '@type': 'ContactPoint',
      telephone: data.contactPoint.telephone,
      contactType: data.contactPoint.contactType,
      areaServed: data.contactPoint.areaServed,
      availableLanguage: data.contactPoint.availableLanguage
    } : undefined,
    address: data.address ? {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry
    } : undefined
  };
}

/**
 * Generate Person schema
 */
function getPersonSchema(data: SchemaOptions): any {
  return {
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    sameAs: data.sameAs,
    jobTitle: data.jobTitle,
    worksFor: data.worksFor,
    alumniOf: data.alumniOf,
    birthDate: data.birthDate,
    birthPlace: data.birthPlace,
    knowsAbout: data.knowsAbout
  };
}

/**
 * Generate FAQ schema
 */
function getFAQSchema(data: SchemaOptions): any {
  return {
    mainEntity: data.mainEntity.map((faq: any) => ({
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
 * Generate HowTo schema
 */
function getHowToSchema(data: SchemaOptions): any {
  return {
    name: data.name,
    description: data.description,
    image: data.image,
    estimatedCost: data.estimatedCost,
    supply: data.supply,
    tool: data.tool,
    step: data.steps.map((step: any, index: number) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
      url: step.url
    })),
    totalTime: data.totalTime,
    yield: data.yield
  };
}

/**
 * Generate Video schema
 */
function getVideoSchema(data: SchemaOptions): any {
  return {
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate,
    duration: data.duration,
    contentUrl: data.contentUrl,
    embedUrl: data.embedUrl,
    interactionStatistic: data.interactionStatistic ? {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/WatchAction',
      userInteractionCount: data.interactionStatistic.views
    } : undefined,
    regionAllowed: data.regionAllowed
  };
}

/**
 * Generate Course schema
 */
function getCourseSchema(data: SchemaOptions): any {
  return {
    name: data.name,
    description: data.description,
    provider: data.provider,
    courseCode: data.courseCode,
    numberOfCredits: data.numberOfCredits,
    educationalCredentialAwarded: data.educationalCredentialAwarded,
    competencyRequired: data.competencyRequired,
    coursePrerequisites: data.coursePrerequisites,
    hasCourseInstance: data.hasCourseInstance ? {
      '@type': 'CourseInstance',
      courseMode: data.hasCourseInstance.courseMode,
      startDate: data.hasCourseInstance.startDate,
      endDate: data.hasCourseInstance.endDate,
      location: data.hasCourseInstance.location
    } : undefined
  };
}

/**
 * Generate FAQ schema from question-answer pairs
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): any {
  return generateStructuredData('faq', {
    mainEntity: faqs.map(faq => ({
      question: faq.question,
      answer: faq.answer
    }))
  });
}

/**
 * Generate HowTo schema for step-by-step instructions
 */
export function generateHowToSchema(steps: Array<{
  name: string;
  text: string;
  image?: string;
  url?: string;
}>, options?: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  estimatedCost?: string;
  yield?: string;
}): any {
  return generateStructuredData('howTo', {
    name: options?.name || 'How-to Guide',
    description: options?.description || 'Step-by-step instructions',
    image: options?.image,
    totalTime: options?.totalTime,
    estimatedCost: options?.estimatedCost,
    yield: options?.yield,
    steps: steps
  });
}

/**
 * Generate Review schema
 */
export function generateReviewSchema(review: {
  itemReviewed: any;
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  author: {
    name: string;
    url?: string;
  };
  datePublished: string;
  reviewBody: string;
}): any {
  return generateStructuredData('review', {
    itemReviewed: review.itemReviewed,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.reviewRating.ratingValue,
      bestRating: review.reviewRating.bestRating || 5,
      worstRating: review.reviewRating.worstRating || 1
    },
    author: {
      '@type': 'Person',
      name: review.author.name,
      url: review.author.url
    },
    datePublished: review.datePublished,
    reviewBody: review.reviewBody
  });
}

/**
 * Generate Event schema
 */
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address?: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  image?: string;
  organizer?: {
    name: string;
    url?: string;
  };
  eventStatus?: string;
  eventAttendanceMode?: string;
}): any {
  return generateStructuredData('event', {
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: event.location.address ? {
        '@type': 'PostalAddress',
        streetAddress: event.location.address.streetAddress,
        addressLocality: event.location.address.addressLocality,
        addressRegion: event.location.address.addressRegion,
        postalCode: event.location.address.postalCode,
        addressCountry: event.location.address.addressCountry
      } : undefined
    },
    image: event.image,
    organizer: event.organizer ? {
      '@type': 'Organization',
      name: event.organizer.name,
      url: event.organizer.url
    } : undefined,
    eventStatus: event.eventStatus || 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.eventAttendanceMode || 'https://schema.org/OfflineEventAttendanceMode'
  });
}

/**
 * Generate LocalBusiness schema
 */
export function generateLocalBusinessSchema(business: {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  openingHours?: string[];
  priceRange?: string;
  image?: string;
  url?: string;
  sameAs?: string[];
}): any {
  return generateStructuredData('localBusiness', {
    name: business.name,
    description: business.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry
    },
    telephone: business.telephone,
    openingHoursSpecification: business.openingHours?.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0],
      opens: hours.split(' ')[1]?.split('-')[0],
      closes: hours.split(' ')[1]?.split('-')[1]
    })),
    priceRange: business.priceRange,
    image: business.image,
    url: business.url,
    sameAs: business.sameAs
  });
}

/**
 * Merge multiple schemas into one script
 */
export function mergeSchemas(schemas: any[]): any {
  if (schemas.length === 1) {
    return schemas[0];
  }
  
  return schemas;
}

/**
 * Validate schema structure
 */
export function validateSchema(schema: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!schema['@context'] || schema['@context'] !== 'https://schema.org') {
    errors.push('Missing or invalid @context');
  }
  
  if (!schema['@type']) {
    errors.push('Missing @type');
  }
  
  // Type-specific validations
  switch (schema['@type']) {
    case 'Article':
      if (!schema.headline) errors.push('Article missing headline');
      if (!schema.datePublished) errors.push('Article missing datePublished');
      if (!schema.author) errors.push('Article missing author');
      if (!schema.publisher) errors.push('Article missing publisher');
      break;
    
    case 'Organization':
      if (!schema.name) errors.push('Organization missing name');
      if (!schema.url) errors.push('Organization missing url');
      break;
    
    case 'FAQPage':
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity) || schema.mainEntity.length === 0) {
        errors.push('FAQPage missing or empty mainEntity');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate script tag for schema
 */
export function generateSchemaScript(schema: any): string {
  const validation = validateSchema(schema);
  
  if (!validation.isValid) {
    console.warn('Schema validation errors:', validation.errors);
  }
  
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}