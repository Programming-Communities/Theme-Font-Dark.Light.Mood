/**
 * FooterLinks Component
 * Displays footer navigation links with WordPress dynamic categories
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWordPress } from '@/hooks/useWordPress';

interface FooterLink {
  id: number;
  title: string;
  url: string;
  external?: boolean;
}

interface FooterLinksProps {
  className?: string;
  maxCategories?: number;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ 
  className = '', 
  maxCategories = 5 
}) => {
  const { data: categories, isLoading, error } = useWordPress('categories', {
    per_page: maxCategories,
    orderby: 'count',
    order: 'desc',
  });

  const [staticLinks] = useState<FooterLink[]>([
    { id: 1, title: 'Home', url: '/' },
    { id: 2, title: 'About Us', url: '/about' },
    { id: 3, title: 'Community', url: '/community' },
    { id: 4, title: 'Resources', url: '/resources' },
    { id: 5, title: 'Contact', url: '/contact' },
    { id: 6, title: 'Privacy Policy', url: '/privacy' },
    { id: 7, title: 'Terms of Service', url: '/terms' },
    { id: 8, title: 'Sitemap', url: '/sitemap' },
  ]);

  const [quickLinks] = useState<FooterLink[]>([
    { id: 9, title: 'Latest Posts', url: '/latest' },
    { id: 10, title: 'Popular Articles', url: '/popular' },
    { id: 11, title: 'Trending Topics', url: '/trending' },
    { id: 12, title: 'Newsletter', url: '/newsletter' },
    { id: 13, title: 'FAQ', url: '/faq' },
    { id: 14, title: 'Support', url: '/support' },
    { id: 15, title: 'Contribute', url: '/contribute' },
    { id: 16, title: 'Authors', url: '/authors' },
  ]);

  if (error) {
    return (
      <div className={`footer-links ${className}`}>
        <p className="text-red-500">Failed to load categories</p>
      </div>
    );
  }

  return (
    <div className={`footer-links ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
            Company
          </h3>
          <ul className="space-y-2">
            {staticLinks.slice(0, 4).map((link) => (
              <li key={link.id}>
                <Link
                  href={link.url}
                  className="hover:underline transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
            Quick Links
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.url}
                  className="hover:underline transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* WordPress Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
            Top Categories
          </h3>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  style={{ width: `${Math.random() * 40 + 40}%` }}
                />
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {categories?.map((category: any) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="hover:underline transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {category.name}
                    <span className="ml-2 text-xs opacity-70">
                      ({category.count})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Legal Links */}
      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          {staticLinks.slice(4).map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className="hover:underline transition-colors duration-200 opacity-80 hover:opacity-100"
              style={{ color: 'var(--text-secondary)' }}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .footer-links :global(a:hover) {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default FooterLinks;