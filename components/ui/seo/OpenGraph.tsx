'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Head from 'next/head';
import { OpenGraphData } from '@/types/components';
import { defaultSiteConfig } from '@/config/site.config';

interface OpenGraphProps {
  data?: Partial<OpenGraphData>;
}

export default function OpenGraph({ data }: OpenGraphProps) {
  const pathname = usePathname();
  const siteConfig = defaultSiteConfig;
  
  // Merge provided data with defaults
  const ogData: OpenGraphData = {
    title: data?.title || siteConfig.name,
    description: data?.description || siteConfig.description,
    url: `${siteConfig.url}${pathname}`,
    type: data?.type || 'website',
    siteName: siteConfig.name,
    locale: data?.locale || 'en_US',
    images: data?.images || [{
      url: `${siteConfig.url}/og-default.png`,
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    }],
    ...data,
  };

  // Generate image URLs with proper dimensions
  const getImageUrl = (image: OpenGraphData['images'][0]): string => {
    if (typeof image.url === 'string') {
      return image.url.startsWith('http') ? image.url : `${siteConfig.url}${image.url}`;
    }
    return `${siteConfig.url}/og-default.png`;
  };

  // Twitter Card data
  const twitterCard = data?.twitterCard || 'summary_large_image';
  const twitterSite = data?.twitterSite || siteConfig.social.twitter;
  const twitterCreator = data?.twitterCreator || siteConfig.social.twitter;

  return (
    <Head>
      {/* Basic Open Graph Tags */}
      <meta property="og:title" content={ogData.title} />
      <meta property="og:description" content={ogData.description} />
      <meta property="og:url" content={ogData.url} />
      <meta property="og:type" content={ogData.type} />
      <meta property="og:site_name" content={ogData.siteName} />
      <meta property="og:locale" content={ogData.locale} />

      {/* Open Graph Images */}
      {ogData.images.map((image, index) => (
        <React.Fragment key={index}>
          <meta property="og:image" content={getImageUrl(image)} />
          <meta property="og:image:url" content={getImageUrl(image)} />
          <meta property="og:image:secure_url" content={getImageUrl(image).replace('http://', 'https://')} />
          {image.width && <meta property="og:image:width" content={image.width.toString()} />}
          {image.height && <meta property="og:image:height" content={image.height.toString()} />}
          {image.alt && <meta property="og:image:alt" content={image.alt} />}
          {image.type && <meta property="og:image:type" content={image.type} />}
        </React.Fragment>
      ))}

      {/* Additional Open Graph Properties */}
      {ogData.article && (
        <>
          {ogData.article.publishedTime && (
            <meta property="article:published_time" content={ogData.article.publishedTime} />
          )}
          {ogData.article.modifiedTime && (
            <meta property="article:modified_time" content={ogData.article.modifiedTime} />
          )}
          {ogData.article.expirationTime && (
            <meta property="article:expiration_time" content={ogData.article.expirationTime} />
          )}
          {ogData.article.authors?.map((author, index) => (
            <meta key={index} property="article:author" content={author} />
          ))}
          {ogData.article.section && (
            <meta property="article:section" content={ogData.article.section} />
          )}
          {ogData.article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={`@${twitterSite}`} />
      <meta name="twitter:creator" content={`@${twitterCreator}`} />
      <meta name="twitter:title" content={ogData.title} />
      <meta name="twitter:description" content={ogData.description} />
      {ogData.images[0] && (
        <meta name="twitter:image" content={getImageUrl(ogData.images[0])} />
      )}
      {ogData.images[0]?.alt && (
        <meta name="twitter:image:alt" content={ogData.images[0].alt} />
      )}

      {/* Additional Twitter Properties */}
      {ogData.twitterPlayer && (
        <>
          <meta name="twitter:player" content={ogData.twitterPlayer.url} />
          <meta name="twitter:player:width" content={ogData.twitterPlayer.width.toString()} />
          <meta name="twitter:player:height" content={ogData.twitterPlayer.height.toString()} />
          {ogData.twitterPlayer.stream && (
            <meta name="twitter:player:stream" content={ogData.twitterPlayer.stream} />
          )}
        </>
      )}

      {/* Facebook App ID (if available) */}
      {siteConfig.social.facebookAppId && (
        <meta property="fb:app_id" content={siteConfig.social.facebookAppId} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={ogData.url} />

      {/* Alternate languages (if available) */}
      {siteConfig.alternateLanguages?.map((lang) => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={`${siteConfig.url}/${lang.code}${pathname}`}
        />
      ))}
    </Head>
  );
}

// Helper component for article Open Graph
export function ArticleOpenGraph({
  title,
  description,
  publishedTime,
  modifiedTime,
  authors = [],
  section,
  tags = [],
  images = [],
  url,
}: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  images?: OpenGraphData['images'];
  url?: string;
}) {
  const pathname = usePathname();
  const siteConfig = defaultSiteConfig;

  const ogData: OpenGraphData = {
    title,
    description,
    url: url || `${siteConfig.url}${pathname}`,
    type: 'article',
    siteName: siteConfig.name,
    images: images.length > 0 ? images : [{
      url: `${siteConfig.url}/og-article.png`,
      width: 1200,
      height: 630,
      alt: title,
    }],
    article: {
      publishedTime,
      modifiedTime,
      authors,
      section,
      tags,
    },
  };

  return <OpenGraph data={ogData} />;
}

// Helper component for profile Open Graph
export function ProfileOpenGraph({
  firstName,
  lastName,
  username,
  gender,
  images = [],
}: {
  firstName: string;
  lastName: string;
  username: string;
  gender?: 'male' | 'female';
  images?: OpenGraphData['images'];
}) {
  const pathname = usePathname();
  const siteConfig = defaultSiteConfig;

  const ogData: OpenGraphData = {
    title: `${firstName} ${lastName}`,
    description: `Profile of ${firstName} ${lastName} on ${siteConfig.name}`,
    url: `${siteConfig.url}${pathname}`,
    type: 'profile',
    siteName: siteConfig.name,
    images,
    profile: {
      firstName,
      lastName,
      username,
      gender,
    },
  };

  return <OpenGraph data={ogData} />;
}

// Helper component for video Open Graph
export function VideoOpenGraph({
  title,
  description,
  videoUrl,
  videoWidth,
  videoHeight,
  videoType = 'video/mp4',
  images = [],
  url,
}: {
  title: string;
  description: string;
  videoUrl: string;
  videoWidth: number;
  videoHeight: number;
  videoType?: string;
  images?: OpenGraphData['images'];
  url?: string;
}) {
  const pathname = usePathname();
  const siteConfig = defaultSiteConfig;

  const ogData: OpenGraphData = {
    title,
    description,
    url: url || `${siteConfig.url}${pathname}`,
    type: 'video.movie',
    siteName: siteConfig.name,
    images,
    video: {
      url: videoUrl,
      width: videoWidth,
      height: videoHeight,
      type: videoType,
    },
  };

  return <OpenGraph data={ogData} />;
}

// Helper to extract Open Graph data from WordPress post
export function extractOpenGraphFromPost(post: any): Partial<OpenGraphData> {
  if (!post) return {};

  const featuredImage = post.featuredImage?.node;
  const author = post.author?.node;
  const categories = post.categories?.nodes || [];

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.metaDesc || post.excerpt,
    type: 'article',
    images: featuredImage ? [{
      url: featuredImage.sourceUrl,
      width: featuredImage.mediaDetails?.width || 1200,
      height: featuredImage.mediaDetails?.height || 630,
      alt: featuredImage.altText || post.title,
    }] : undefined,
    article: {
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: author ? [author.name] : [],
      section: categories[0]?.name,
      tags: (post.tags?.nodes || []).map((tag: any) => tag.name),
    },
  };
}