/**
 * SocialIcons Component
 * Displays social media links with platform-specific icons
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SocialPlatform {
  id: number;
  name: string;
  url: string;
  icon: string;
  color: string;
  followerCount?: number;
}

const SocialIcons: React.FC = () => {
  const [socialPlatforms] = useState<SocialPlatform[]>([
    {
      id: 1,
      name: 'Facebook',
      url: 'https://facebook.com/englishcommunitiespk',
      icon: 'Facebook',
      color: '#1877F2',
      followerCount: 12500,
    },
    {
      id: 2,
      name: 'Twitter',
      url: 'https://twitter.com/engcommunities',
      icon: 'Twitter',
      color: '#1DA1F2',
      followerCount: 8900,
    },
    {
      id: 3,
      name: 'Instagram',
      url: 'https://instagram.com/englishcommunities.pk',
      icon: 'Instagram',
      color: '#E4405F',
      followerCount: 15600,
    },
    {
      id: 4,
      name: 'YouTube',
      url: 'https://youtube.com/c/EnglishCommunitiesPK',
      icon: 'YouTube',
      color: '#FF0000',
      followerCount: 23400,
    },
    {
      id: 5,
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/englishcommunitiespk',
      icon: 'LinkedIn',
      color: '#0A66C2',
      followerCount: 5600,
    },
    {
      id: 6,
      name: 'WhatsApp',
      url: 'https://wa.me/923001234567',
      icon: 'WhatsApp',
      color: '#25D366',
    },
    {
      id: 7,
      name: 'Telegram',
      url: 'https://t.me/englishcommunities',
      icon: 'Telegram',
      color: '#26A5E4',
    },
    {
      id: 8,
      name: 'TikTok',
      url: 'https://tiktok.com/@englishcommunities.pk',
      icon: 'TikTok',
      color: '#000000',
    },
  ]);

  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  // SVG Icons for each platform
  const getIconSVG = (platform: SocialPlatform) => {
    const iconProps = {
      width: "24",
      height: "24",
      fill: hoveredIcon === platform.id ? platform.color : 'currentColor',
      className: "transition-all duration-300",
    };

    switch (platform.icon) {
      case 'Facebook':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'Twitter':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      case 'Instagram':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'YouTube':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'LinkedIn':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'WhatsApp':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M20.52 3.449C18.24 1.245 15.24 0 12 0A12 12 0 0 0 0 12c0 2.104.534 4.138 1.547 5.938L0 24l6.335-1.652A11.96 11.96 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.24-1.245-6.24-3.48-8.551zM12 22.2a10.2 10.2 0 0 1-5.188-1.427l-.361-.214-3.75.975.998-3.645-.235-.375A10.2 10.2 0 0 1 1.8 12c0-5.634 4.566-10.2 10.2-10.2 2.724 0 5.283 1.063 7.207 2.993S22.2 9.276 22.2 12s-1.063 5.283-2.993 7.207S14.724 22.2 12 22.2zm5.784-7.845c-.297-.149-1.758-.867-2.031-.966-.273-.099-.472-.149-.672.149-.199.297-.771.966-.945 1.164-.174.199-.347.224-.645.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.174-.297-.018-.458.131-.606.134-.133.297-.347.446-.521.149-.174.198-.297.297-.496.099-.198.05-.371-.025-.521-.074-.149-.672-1.617-.92-2.206-.24-.579-.485-.5-.672-.51-.174-.008-.371-.011-.568-.011-.198 0-.521.074-.794.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.574-.084 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.273-.198-.57-.347z"/>
          </svg>
        );
      case 'Telegram':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.155c-.172-.722-.687-.996-1.404-1.052-.597-.047-1.186.044-1.77.26-1.031.38-2.086.672-3.152.875-.83.158-1.662.282-2.496.376-.428.049-.86.085-1.287.143-.378.051-.461.188-.461.541v.377c0 .327.018.654.051.98.045.449.276.678.73.738.683.089 1.369.137 2.056.175.85.047 1.7.078 2.549.13.327.02.654.052.98.073.418.027.52.157.52.573v1.355c0 .26.062.443.275.568.356.209.796.076 1.082-.17.24-.209.432-.462.614-.723.307-.444.572-.916.836-1.388.339-.604.679-1.209 1.012-1.817.307-.564.314-.933.018-1.464-.093-.167-.21-.322-.315-.482z"/>
          </svg>
        );
      case 'TikTok':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      default:
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  return (
    <div className="social-icons">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-center md:text-left mb-4" style={{ color: 'var(--primary)' }}>
          Follow Us
        </h3>
        <p className="text-sm opacity-80 text-center md:text-left mb-6" style={{ color: 'var(--text-secondary)' }}>
          Stay updated with the latest English learning resources and community updates
        </p>
      </div>

      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        {socialPlatforms.map((platform) => (
          <Link
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${platform.name}`}
            className="social-icon relative group"
            onMouseEnter={() => setHoveredIcon(platform.id)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <div
              className="icon-container p-3 rounded-full transition-all duration-300 group-hover:scale-110"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: hoveredIcon === platform.id ? platform.color : 'var(--text-primary)',
              }}
            >
              {getIconSVG(platform)}
            </div>
            
            {/* Tooltip */}
            <div className="tooltip absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                {platform.name}
                {platform.followerCount && (
                  <span className="ml-1 text-gray-300">
                    ({platform.followerCount.toLocaleString()})
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .social-icons :global(.social-icon) {
          position: relative;
        }
        
        .social-icons :global(.icon-container:hover) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .social-icons :global(.tooltip::after) {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: var(--tooltip-bg) transparent transparent transparent;
        }
        
        @media (max-width: 640px) {
          .social-icons :global(.social-icon) {
            margin: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SocialIcons;