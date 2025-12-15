'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Menu, X, Search, User, Globe, Bell } from 'lucide-react';

export default function Header() {
  const { themeColors } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Categories', href: '/categories' },
    { label: 'Community', href: '/community' },
    { label: 'Resources', href: '/resources' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-3 backdrop-blur-lg' : 'py-4'
        }`}
        style={{
          backgroundColor: isScrolled ? `${themeColors.background}dd` : themeColors.background,
          borderBottom: `1px solid ${themeColors.border}${isScrolled ? '40' : ''}`,
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
                   style={{ 
                     background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                     boxShadow: themeColors.shadow
                   }}>
                EC
              </div>
              <div>
                <div className="font-bold text-lg" style={{ color: themeColors.text.primary }}>
                  English Communities
                </div>
                <div className="text-xs opacity-70" style={{ color: themeColors.text.secondary }}>
                  Pakistan
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  style={{ color: themeColors.text.secondary }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button className="p-2 rounded-lg hover:bg-surface transition-colors"
                      style={{ color: themeColors.text.secondary }}>
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-surface transition-colors relative"
                      style={{ color: themeColors.text.secondary }}>
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              </button>

              {/* Language */}
              <button className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-surface transition-colors"
                      style={{ 
                        color: themeColors.text.secondary,
                        border: `1px solid ${themeColors.border}`
                      }}>
                <Globe className="h-4 w-4" />
                <span className="text-sm">EN</span>
              </button>

              {/* User */}
              <button className="p-2 rounded-lg hover:bg-surface transition-colors"
                      style={{ color: themeColors.text.secondary }}>
                <User className="h-5 w-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
                style={{ color: themeColors.text.secondary }}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 md:hidden"
             style={{ 
               backgroundColor: themeColors.background,
               borderBottom: `1px solid ${themeColors.border}`
             }}>
          <div className="px-4 py-3">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg text-sm font-medium transition-colors hover:bg-surface"
                  style={{ color: themeColors.text.secondary }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile Actions */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: themeColors.border }}>
              <div className="flex items-center gap-3">
                <button className="flex-1 py-2 rounded-lg text-center text-sm font-medium"
                        style={{ 
                          backgroundColor: themeColors.surface,
                          color: themeColors.text.primary
                        }}>
                  Sign In
                </button>
                <button className="flex-1 py-2 rounded-lg text-center text-sm font-medium text-white"
                        style={{ 
                          background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                        }}>
                  Join Free
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
