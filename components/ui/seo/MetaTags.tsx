'use client';

import React from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { MetaTagsData, RobotsConfig } from '@/types/components';
import { defaultSiteConfig } from '@/config/site.config';

interface MetaTagsProps {
  data?: Partial<MetaTagsData>;
  robots?: RobotsConfig;
  priority?: number;
}

export default function MetaTags({ data, robots, priority = 0.5 }: MetaTagsProps) {
  const pathname = usePathname();
  const siteConfig = defaultSiteConfig;

  // Merge provided data with defaults
  const metaData: MetaTagsData = {
    title: data?.title || siteConfig.name,
    description: data?.description || siteConfig.description,
    canonical: data?.canonical || `${siteConfig.url}${pathname}`,
    keywords: data?.keywords || siteConfig.keywords,
    author: data?.author || siteConfig.author,
    ...data,
  };

  // Generate robots meta content
  const robotsContent = generateRobotsContent(robots);
  
  // Generate viewport meta
  const viewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{metaData.title}</title>
      <meta name="title" content={metaData.title} />
      <meta name="description" content={metaData.description} />
      <meta name="keywords" content={metaData.keywords?.join(', ')} />
      <meta name="author" content={metaData.author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={metaData.canonical} />

      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      
      {/* Viewport */}
      <meta name="viewport" content={viewportContent} />
      
      {/* Theme Color */}
      <meta name="theme-color" content={metaData.themeColor || '#ffffff'} />
      <meta name="msapplication-TileColor" content={metaData.themeColor || '#ffffff'} />
      
      {/* Language */}
      <meta httpEquiv="content-language" content="en" />
      <meta name="language" content="English" />
      
      {/* Copyright */}
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${siteConfig.name}`} />
      
      {/* Distribution */}
      <meta name="distribution" content="global" />
      
      {/* Rating */}
      <meta name="rating" content="general" />
      
      {/* Revisit After */}
      <meta name="revisit-after" content="7 days" />
      
      {/* Generator */}
      <meta name="generator" content="Next.js 16.0.10" />
      
      {/* Google Site Verification */}
      {siteConfig.verification.google && (
        <meta name="google-site-verification" content={siteConfig.verification.google} />
      )}
      
      {/* Bing Site Verification */}
      {siteConfig.verification.bing && (
        <meta name="msvalidate.01" content={siteConfig.verification.bing} />
      )}
      
      {/* Yandex Site Verification */}
      {siteConfig.verification.yandex && (
        <meta name="yandex-verification" content={siteConfig.verification.yandex} />
      )}
      
      {/* Baidu Site Verification */}
      {siteConfig.verification.baidu && (
        <meta name="baidu-site-verification" content={siteConfig.verification.baidu} />
      )}
      
      {/* Alternate Languages */}
      {siteConfig.alternateLanguages?.map((lang) => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={`${siteConfig.url}/${lang.code}${pathname}`}
        />
      ))}
      
      {/* x-default */}
      <link rel="alternate" hrefLang="x-default" href={`${siteConfig.url}${pathname}`} />
      
      {/* Mobile Alternate (if AMP) */}
      {metaData.amphtml && (
        <link rel="amphtml" href={metaData.amphtml} />
      )}
      
      {/* Pagination */}
      {metaData.pagination && (
        <>
          {metaData.pagination.prev && (
            <link rel="prev" href={metaData.pagination.prev} />
          )}
          {metaData.pagination.next && (
            <link rel="next" href={metaData.pagination.next} />
          )}
        </>
      )}
      
      {/* Article Meta (if article) */}
      {metaData.article && (
        <>
          <meta name="article:published_time" content={metaData.article.publishedTime} />
          {metaData.article.modifiedTime && (
            <meta name="article:modified_time" content={metaData.article.modifiedTime} />
          )}
          {metaData.article.expirationTime && (
            <meta name="article:expiration_time" content={metaData.article.expirationTime} />
          )}
          {metaData.article.authors?.map((author, index) => (
            <meta key={index} name="article:author" content={author} />
          ))}
          {metaData.article.section && (
            <meta name="article:section" content={metaData.article.section} />
          )}
          {metaData.article.tags?.map((tag, index) => (
            <meta key={index} name="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card (fallback if not using OpenGraph) */}
      {metaData.twitter && (
        <>
          <meta name="twitter:card" content={metaData.twitter.card || 'summary_large_image'} />
          <meta name="twitter:site" content={`@${metaData.twitter.site}`} />
          <meta name="twitter:creator" content={`@${metaData.twitter.creator}`} />
          <meta name="twitter:title" content={metaData.twitter.title || metaData.title} />
          <meta name="twitter:description" content={metaData.twitter.description || metaData.description} />
          {metaData.twitter.image && (
            <meta name="twitter:image" content={metaData.twitter.image} />
          )}
        </>
      )}
      
      {/* Facebook App ID */}
      {siteConfig.social.facebookAppId && (
        <meta property="fb:app_id" content={siteConfig.social.facebookAppId} />
      )}
      
      {/* Additional Meta Tags */}
      {metaData.additionalMeta?.map((meta, index) => (
        <meta key={index} name={meta.name} content={meta.content} />
      ))}
    </Head>
  );
}

function generateRobotsContent(robots?: RobotsConfig): string {
  if (!robots) {
    return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  }

  const directives: string[] = [];

  // Indexing directives
  if (robots.index !== undefined) {
    directives.push(robots.index ? 'index' : 'noindex');
  } else {
    directives.push('index');
  }

  // Following directives
  if (robots.follow !== undefined) {
    directives.push(robots.follow ? 'follow' : 'nofollow');
  } else {
    directives.push('follow');
  }

  // Additional directives
  if (robots.archive !== undefined) {
    directives.push(robots.archive ? 'archive' : 'noarchive');
  }
  
  if (robots.imageindex !== undefined) {
    directives.push(robots.imageindex ? 'imageindex' : 'noimageindex');
  }
  
  if (robots.snippet !== undefined) {
    directives.push(robots.snippet ? 'snippet' : 'nosnippet');
  }
  
  if (robots.odp !== undefined) {
    directives.push(robots.odp ? 'odp' : 'noodp');
  }
  
  if (robots.translate !== undefined) {
    directives.push(robots.translate ? 'translate' : 'notranslate');
  }

  // Special directives
  if (robots.maxImagePreview) {
    directives.push(`max-image-preview:${robots.maxImagePreview}`);
  }
  
  if (robots.maxSnippet !== undefined) {
    directives.push(`max-snippet:${robots.maxSnippet}`);
  }
  
  if (robots.maxVideoPreview !== undefined) {
    directives.push(`max-video-preview:${robots.maxVideoPreview}`);
  }

  return directives.join(', ');
}

// Helper component for post meta tags
export function PostMetaTags({
  post,
  robots,
}: {
  post: any;
  robots?: RobotsConfig;
}) {
  if (!post) return null;

  const featuredImage = post.featuredImage?.node;
  const author = post.author?.node;
  const categories = post.categories?.nodes || [];
  const tags = post.tags?.nodes || [];

  const metaData: Partial<MetaTagsData> = {
    title: post.seo?.title || post.title,
    description: post.seo?.metaDesc || post.excerpt,
    canonical: post.seo?.canonical || post.uri,
    keywords: tags.map((tag: any) => tag.name),
    author: author?.name,
    themeColor: '#ffffff',
    article: {
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: author ? [author.name] : [],
      section: categories[0]?.name,
      tags: tags.map((tag: any) => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      site: defaultSiteConfig.social.twitter,
      creator: author?.twitter || defaultSiteConfig.social.twitter,
      title: post.seo?.title || post.title,
      description: post.seo?.metaDesc || post.excerpt,
      image: featuredImage?.sourceUrl,
    },
  };

  return <MetaTags data={metaData} robots={robots} priority={0.9} />;
}

// Helper component for page meta tags
export function PageMetaTags({
  page,
  robots,
}: {
  page: any;
  robots?: RobotsConfig;
}) {
  if (!page) return null;

  const metaData: Partial<MetaTagsData> = {
    title: page.seo?.title || page.title,
    description: page.seo?.metaDesc || page.excerpt,
    canonical: page.seo?.canonical || page.uri,
    keywords: page.seo?.keywords?.split(',') || [],
    author: defaultSiteConfig.author,
    themeColor: '#ffffff',
  };

  return <MetaTags data={metaData} robots={robots} priority={0.7} />;
}

// Helper component for category meta tags
export function CategoryMetaTags({
  category,
  page = 1,
  robots,
}: {
  category: any;
  page?: number;
  robots?: RobotsConfig;
}) {
  if (!category) return null;

  const metaData: Partial<MetaTagsData> = {
    title: page > 1 
      ? `${category.name} - Page ${page} | ${defaultSiteConfig.name}`
      : `${category.name} | ${defaultSiteConfig.name}`,
    description: category.description || `Browse all articles in ${category.name}`,
    canonical: page > 1 
      ? `${defaultSiteConfig.url}${category.uri}page/${page}/`
      : `${defaultSiteConfig.url}${category.uri}`,
    keywords: [category.name, ...(category.seo?.keywords?.split(',') || [])],
    author: defaultSiteConfig.author,
    pagination: page > 1 ? {
      prev: page > 2 
        ? `${defaultSiteConfig.url}${category.uri}page/${page - 1}/`
        : `${defaultSiteConfig.url}${category.uri}`,
      next: `${defaultSiteConfig.url}${category.uri}page/${page + 1}/`,
    } : undefined,
  };

  return <MetaTags data={metaData} robots={robots} priority={0.6} />;
}

// Helper component for tag meta tags
export function TagMetaTags({
  tag,
  page = 1,
  robots,
}: {
  tag: any;
  page?: number;
  robots?: RobotsConfig;
}) {
  if (!tag) return null;

  const metaData: Partial<MetaTagsData> = {
    title: page > 1 
      ? `${tag.name} - Page ${page} | ${defaultSiteConfig.name}`
      : `${tag.name} | ${defaultSiteConfig.name}`,
    description: tag.description || `Browse all articles tagged with ${tag.name}`,
    canonical: page > 1 
      ? `${defaultSiteConfig.url}${tag.uri}page/${page}/`
      : `${defaultSiteConfig.url}${tag.uri}`,
    keywords: [tag.name],
    author: defaultSiteConfig.author,
    pagination: page > 1 ? {
      prev: page > 2 
        ? `${defaultSiteConfig.url}${tag.uri}page/${page - 1}/`
        : `${defaultSiteConfig.url}${tag.uri}`,
      next: `${defaultSiteConfig.url}${tag.uri}page/${page + 1}/`,
    } : undefined,
  };

  return <MetaTags data={metaData} robots={robots} priority={0.5} />;
}

// Helper component for search meta tags
export function SearchMetaTags({
  query,
  page = 1,
  totalResults = 0,
  robots = { index: false, follow: true },
}: {
  query: string;
  page?: number;
  totalResults?: number;
  robots?: RobotsConfig;
}) {
  const metaData: Partial<MetaTagsData> = {
    title: page > 1 
      ? `Search: "${query}" - Page ${page} | ${defaultSiteConfig.name}`
      : `Search: "${query}" | ${defaultSiteConfig.name}`,
    description: totalResults > 0 
      ? `Found ${totalResults} results for "${query}"`
      : `No results found for "${query}"`,
    canonical: page > 1 
      ? `${defaultSiteConfig.url}/search?q=${encodeURIComponent(query)}&page=${page}`
      : `${defaultSiteConfig.url}/search?q=${encodeURIComponent(query)}`,
    keywords: [query],
    author: defaultSiteConfig.author,
    pagination: page > 1 ? {
      prev: `${defaultSiteConfig.url}/search?q=${encodeURIComponent(query)}&page=${page - 1}`,
      next: totalResults > page * 10 
        ? `${defaultSiteConfig.url}/search?q=${encodeURIComponent(query)}&page=${page + 1}`
        : undefined,
    } : undefined,
  };

  return <MetaTags data={metaData} robots={robots} priority={0.3} />;
}