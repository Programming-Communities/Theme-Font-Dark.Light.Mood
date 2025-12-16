'use client';

import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  separator?: React.ReactNode;
  className?: string;
}

export default function Breadcrumbs({
  items,
  showHome = true,
  separator = <ChevronRight className="h-3 w-3" />,
  className = '',
}: BreadcrumbsProps) {
  const { themeColors } = useTheme();

  const allItems = showHome
    ? [
        { label: 'Home', href: '/', active: false },
        ...items.map((item, index) => ({
          ...item,
          active: index === items.length - 1,
        })),
      ]
    : items.map((item, index) => ({
        ...item,
        active: index === items.length - 1,
      }));

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}
         aria-label="Breadcrumb">
      {allItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {index > 0 && (
            <span className="opacity-50" style={{ color: themeColors.text.secondary }}>
              {separator}
            </span>
          )}
          
          {item.active ? (
            <span className="font-medium" style={{ color: themeColors.text.primary }}>
              {item.label === 'Home' && showHome ? (
                <Home className="h-3 w-3 inline-block mr-1" />
              ) : null}
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors"
              style={{ color: themeColors.text.secondary }}
            >
              {item.label === 'Home' && showHome ? (
                <Home className="h-3 w-3 inline-block mr-1" />
              ) : null}
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}