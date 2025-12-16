'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BreadcrumbItem } from '@/types/components';
import { generateBreadcrumbSchema } from '@/lib/seo/schemas';

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  homeLabel?: string;
  showCurrentPage?: boolean;
  className?: string;
}

export default function Breadcrumb({
  items = [],
  homeLabel = 'Home',
  showCurrentPage = true,
  className = '',
}: BreadcrumbProps) {
  const pathname = usePathname();
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbFromPath(pathname, homeLabel);
  
  if (breadcrumbItems.length === 0) {
    return null;
  }

  const schemaData = generateBreadcrumbSchema(breadcrumbItems);
  const visibleItems = showCurrentPage 
    ? breadcrumbItems 
    : breadcrumbItems.slice(0, -1);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* Visual Breadcrumb */}
      <nav 
        aria-label="Breadcrumb" 
        className={`breadcrumb ${className}`}
        style={{
          '--breadcrumb-color': 'var(--text-secondary)',
          '--breadcrumb-hover-color': 'var(--primary)',
          '--breadcrumb-separator-color': 'var(--border)',
        } as React.CSSProperties}
      >
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            const isHome = item.href === '/';
            
            return (
              <li key={item.href} className="flex items-center">
                {!isLast ? (
                  <>
                    <Link
                      href={item.href}
                      className={`transition-colors duration-200 hover:text-[var(--breadcrumb-hover-color)] ${
                        isHome ? 'font-semibold' : ''
                      }`}
                      aria-label={isHome ? `Go to ${homeLabel}` : undefined}
                    >
                      {item.label}
                    </Link>
                    <span 
                      className="mx-2 text-[var(--breadcrumb-separator-color)]" 
                      aria-hidden="true"
                    >
                      /
                    </span>
                  </>
                ) : (
                  <span 
                    className="font-semibold text-[var(--primary)]" 
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

function generateBreadcrumbFromPath(pathname: string, homeLabel: string): BreadcrumbItem[] {
  if (!pathname || pathname === '/') {
    return [
      { href: '/', label: homeLabel, isCurrentPage: true }
    ];
  }

  const pathSegments = pathname.split('/').filter(segment => segment);
  const items: BreadcrumbItem[] = [
    { href: '/', label: homeLabel }
  ];

  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Decode and format the segment for display
    const decodedSegment = decodeURIComponent(segment);
    const formattedLabel = formatBreadcrumbLabel(decodedSegment);
    
    items.push({
      href: currentPath,
      label: formattedLabel,
      isCurrentPage: isLast,
    });
  });

  return items;
}

function formatBreadcrumbLabel(label: string): string {
  // Convert kebab-case, snake_case, or camelCase to Title Case
  return label
    .replace(/[-_]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim();
}

// Compact version for mobile
export function CompactBreadcrumb({
  items,
  homeLabel = 'Home',
  className = '',
}: BreadcrumbProps) {
  const pathname = usePathname();
  const breadcrumbItems = items?.length > 0 ? items : generateBreadcrumbFromPath(pathname, homeLabel);
  
  if (breadcrumbItems.length <= 2) {
    return <Breadcrumb items={breadcrumbItems} homeLabel={homeLabel} className={className} />;
  }

  const firstItem = breadcrumbItems[0];
  const lastItem = breadcrumbItems[breadcrumbItems.length - 1];
  const middleCount = breadcrumbItems.length - 2;

  return (
    <nav aria-label="Breadcrumb" className={`compact-breadcrumb ${className}`}>
      <ol className="flex items-center gap-2 text-sm">
        <li className="flex items-center">
          <Link
            href={firstItem.href}
            className="transition-colors duration-200 hover:text-[var(--primary)] font-semibold"
            aria-label={`Go to ${firstItem.label}`}
          >
            {firstItem.label}
          </Link>
          <span className="mx-2 text-[var(--border)]" aria-hidden="true">/</span>
        </li>
        
        <li className="flex items-center" aria-label={`${middleCount} more items`}>
          <span className="text-[var(--text-secondary)]">...</span>
          <span className="mx-2 text-[var(--border)]" aria-hidden="true">/</span>
        </li>
        
        <li>
          <span className="font-semibold text-[var(--primary)]" aria-current="page">
            {lastItem.label}
          </span>
        </li>
      </ol>
    </nav>
  );
}

// Breadcrumb with icons
export function IconBreadcrumb({
  items,
  homeLabel = 'Home',
  showIcons = true,
  className = '',
}: BreadcrumbProps & { showIcons?: boolean }) {
  const pathname = usePathname();
  const breadcrumbItems = items?.length > 0 ? items : generateBreadcrumbFromPath(pathname, homeLabel);

  const getIcon = (href: string, index: number) => {
    if (href === '/') {
      return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      );
    }
    
    // Add more icon mappings based on path segments
    const segment = href.split('/').pop();
    if (segment === 'blog') {
      return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      );
    }
    
    return null;
  };

  return (
    <nav aria-label="Breadcrumb" className={`icon-breadcrumb ${className}`}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.href} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    href={item.href}
                    className="flex items-center transition-colors duration-200 hover:text-[var(--primary)]"
                  >
                    {showIcons && getIcon(item.href, index)}
                    <span className={item.href === '/' ? 'font-semibold' : ''}>
                      {item.label}
                    </span>
                  </Link>
                  <span className="mx-2 text-[var(--border)]" aria-hidden="true">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </>
              ) : (
                <span className="flex items-center font-semibold text-[var(--primary)]">
                  {showIcons && getIcon(item.href, index)}
                  <span aria-current="page">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}