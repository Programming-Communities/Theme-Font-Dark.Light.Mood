'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import { useDevice } from '@/hooks/useDevice';
import { siteConfig } from '@/config/site.config';
import { navItems } from '@/config/navigation.config';
import ThemeToggle from './ThemeToggle';
import FontSelector from './FontSelector';
import SearchBar from './SearchBar';
import styles from './MobileHeader.module.css';

interface MobileHeaderProps {
  isScrolled?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
  onSearchClick?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  isScrolled = false,
  onMenuToggle,
  onSearchClick
}) => {
  const { theme, isDarkMode } = useTheme();
  const { isMobile, isTablet } = useDevice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Toggle mobile menu
  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    setIsSearchOpen(false);
    onMenuToggle?.(newState);
    
    // Prevent body scroll when menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Toggle search
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
    onSearchClick?.();
  };

  // Toggle submenu
  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMenuOpen) {
          toggleMenu();
        }
        if (isSearchOpen) {
          setIsSearchOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isMenuOpen, isSearchOpen]);

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && !target.closest(`.${styles.mobileMenu}`)) {
        toggleMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Get mega menu items for mobile
  const getMobileMegaItems = (menuId: string) => {
    const megaMenus = {
      learning: [
        { title: 'Grammar Lessons', href: '/category/grammar', icon: '📚' },
        { title: 'Vocabulary Builder', href: '/category/vocabulary', icon: '📖' },
        { title: 'Speaking Practice', href: '/category/speaking', icon: '🎤' },
        { title: 'Listening Exercises', href: '/category/listening', icon: '🎧' },
        { title: 'Writing Tips', href: '/category/writing', icon: '✍️' },
        { title: 'Pronunciation Guide', href: '/category/pronunciation', icon: '🗣️' }
      ],
      resources: [
        { title: 'E-Books', href: '/resources/ebooks', icon: '📘' },
        { title: 'Worksheets', href: '/resources/worksheets', icon: '📝' },
        { title: 'Templates', href: '/resources/templates', icon: '📄' },
        { title: 'Tools', href: '/resources/tools', icon: '🛠️' },
        { title: 'Downloads', href: '/resources/downloads', icon: '⬇️' },
        { title: 'Premium Content', href: '/premium', icon: '⭐' }
      ],
      community: [
        { title: 'Discussions', href: '/community/discussions', icon: '💬' },
        { title: 'Study Groups', href: '/community/groups', icon: '👥' },
        { title: 'Events', href: '/community/events', icon: '📅' },
        { title: 'Members', href: '/community/members', icon: '👤' },
        { title: 'Q&A Forum', href: '/community/questions', icon: '❓' },
        { title: 'Success Stories', href: '/community/stories', icon: '🏆' }
      ]
    };

    return megaMenus[menuId as keyof typeof megaMenus] || [];
  };

  return (
    <>
      {/* Mobile Header */}
      <header 
        className={`${styles.mobileHeader} theme-${theme} ${isDarkMode ? 'dark' : 'light'} ${isScrolled ? styles.scrolled : ''}`}
      >
        <div className={styles.headerContainer}>
          {/* Menu Toggle Button */}
          <button 
            className={styles.menuToggle}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <div className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoContainer}>
              <Image
                src={siteConfig.logo || '/logo.png'}
                alt={siteConfig.name}
                width={isMobile ? 120 : 140}
                height={40}
                className={styles.logo}
                priority
              />
              <div className={styles.logoText}>
                <h1 className={styles.siteName}>{siteConfig.name}</h1>
                {!isMobile && (
                  <p className={styles.siteTagline}>{siteConfig.tagline}</p>
                )}
              </div>
            </div>
          </Link>

          {/* Header Actions */}
          <div className={styles.headerActions}>
            <button 
              className={styles.searchToggle}
              onClick={toggleSearch}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              <span className={styles.searchIcon}>🔍</span>
            </button>
            
            <button className={styles.notificationButton} aria-label="Notifications">
              <span className={styles.notificationIcon}>🔔</span>
              <span className={styles.notificationBadge}>3</span>
            </button>
            
            <Link href="/login" className={styles.authButton}>
              <span className={styles.authIcon}>👤</span>
            </Link>
          </div>
        </div>

        {/* Search Bar (when open) */}
        {isSearchOpen && (
          <div className={styles.searchContainer}>
            <SearchBar 
              onSearchClick={onSearchClick}
              placeholder="Search articles, lessons..."
              autoFocus
            />
            <button 
              className={styles.searchClose}
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              ✕
            </button>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`${styles.menuOverlay} ${isMenuOpen ? styles.active : ''}`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
        {/* Menu Header */}
        <div className={styles.menuHeader}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <span className={styles.avatarIcon}>👤</span>
            </div>
            <div className={styles.userDetails}>
              <h4 className={styles.userName}>Welcome!</h4>
              <p className={styles.userStatus}>Sign in to continue</p>
            </div>
          </div>
          
          <div className={styles.menuActions}>
            <ThemeToggle />
            <FontSelector />
            <button 
              className={styles.closeButton}
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Menu Content */}
        <div className={styles.menuContent}>
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <Link href="/premium" className={styles.premiumAction}>
              <span className={styles.actionIcon}>⭐</span>
              <span className={styles.actionText}>Premium</span>
            </Link>
            
            <Link href="/join" className={styles.joinAction}>
              <span className={styles.actionIcon}>🎉</span>
              <span className={styles.actionText}>Join Free</span>
            </Link>
            
            <button className={styles.bookmarkAction}>
              <span className={styles.actionIcon}>🔖</span>
              <span className={styles.actionText}>Bookmarks</span>
              <span className={styles.actionBadge}>12</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className={styles.menuNavigation}>
            <ul className={styles.menuList}>
              {navItems.map((item) => (
                <li key={item.id} className={styles.menuItem}>
                  <div 
                    className={styles.menuLink}
                    onClick={() => {
                      if (item.hasDropdown || item.hasMegaMenu) {
                        toggleSubmenu(item.id);
                      } else {
                        toggleMenu();
                      }
                    }}
                  >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    <span className={styles.menuText}>{item.label}</span>
                    {(item.hasDropdown || item.hasMegaMenu) && (
                      <span 
                        className={`${styles.menuArrow} ${
                          expandedMenus.includes(item.id) ? styles.expanded : ''
                        }`}
                      >
                        ▼
                      </span>
                    )}
                  </div>

                  {/* Submenu */}
                  {(item.hasDropdown || item.hasMegaMenu) && expandedMenus.includes(item.id) && (
                    <div className={styles.submenu}>
                      {/* Regular dropdown items */}
                      {item.subItems?.map((subItem) => (
                        <Link 
                          key={subItem.label}
                          href={subItem.href}
                          className={styles.submenuLink}
                          onClick={toggleMenu}
                        >
                          <span className={styles.submenuIcon}>{subItem.icon}</span>
                          {subItem.label}
                        </Link>
                      ))}

                      {/* Mega menu items */}
                      {item.hasMegaMenu && (
                        <div className={styles.megaMenuMobile}>
                          {getMobileMegaItems(item.id).map((megaItem) => (
                            <Link
                              key={megaItem.title}
                              href={megaItem.href}
                              className={styles.megaMenuLink}
                              onClick={toggleMenu}
                            >
                              <span className={styles.megaMenuIcon}>{megaItem.icon}</span>
                              {megaItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Menu Footer */}
          <div className={styles.menuFooter}>
            <div className={styles.languageSelector}>
              <button className={styles.languageButton}>
                <span className={styles.languageIcon}>🌐</span>
                English (EN)
                <span className={styles.languageArrow}>▼</span>
              </button>
            </div>
            
            <div className={styles.menuLinks}>
              <Link href="/about" onClick={toggleMenu}>About Us</Link>
              <Link href="/contact" onClick={toggleMenu}>Contact</Link>
              <Link href="/privacy" onClick={toggleMenu}>Privacy Policy</Link>
              <Link href="/terms" onClick={toggleMenu}>Terms of Service</Link>
              <Link href="/help" onClick={toggleMenu}>Help Center</Link>
            </div>
            
            <div className={styles.copyright}>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;