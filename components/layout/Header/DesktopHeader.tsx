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
import styles from './DesktopHeader.module.css';

interface DesktopHeaderProps {
  isScrolled?: boolean;
  onSearchClick?: () => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  isScrolled = false,
  onSearchClick
}) => {
  const { theme, isDarkMode } = useTheme();
  const { isDesktop } = useDevice();
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // You can add scroll-based effects here
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mega menu hover
  const handleMegaMenuHover = (menuId: string) => {
    if (isDesktop) {
      setMegaMenuOpen(menuId);
    }
  };

  const handleMegaMenuLeave = () => {
    if (isDesktop) {
      setMegaMenuOpen(null);
    }
  };

  // Handle menu click
  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId === activeMenu ? '' : menuId);
  };

  // Get mega menu items
  const getMegaMenuItems = () => {
    return [
      {
        id: 'learning',
        title: 'English Learning',
        items: [
          { title: 'Grammar Lessons', href: '/category/grammar', icon: '📚' },
          { title: 'Vocabulary Builder', href: '/category/vocabulary', icon: '📖' },
          { title: 'Speaking Practice', href: '/category/speaking', icon: '🎤' },
          { title: 'Listening Exercises', href: '/category/listening', icon: '🎧' },
          { title: 'Writing Tips', href: '/category/writing', icon: '✍️' },
          { title: 'Pronunciation Guide', href: '/category/pronunciation', icon: '🗣️' }
        ]
      },
      {
        id: 'resources',
        title: 'Resources',
        items: [
          { title: 'E-Books', href: '/resources/ebooks', icon: '📘' },
          { title: 'Worksheets', href: '/resources/worksheets', icon: '📝' },
          { title: 'Templates', href: '/resources/templates', icon: '📄' },
          { title: 'Tools', href: '/resources/tools', icon: '🛠️' },
          { title: 'Downloads', href: '/resources/downloads', icon: '⬇️' },
          { title: 'Premium Content', href: '/premium', icon: '⭐' }
        ]
      },
      {
        id: 'community',
        title: 'Community',
        items: [
          { title: 'Discussions', href: '/community/discussions', icon: '💬' },
          { title: 'Study Groups', href: '/community/groups', icon: '👥' },
          { title: 'Events', href: '/community/events', icon: '📅' },
          { title: 'Members', href: '/community/members', icon: '👤' },
          { title: 'Q&A Forum', href: '/community/questions', icon: '❓' },
          { title: 'Success Stories', href: '/community/stories', icon: '🏆' }
        ]
      }
    ];
  };

  return (
    <header 
      className={`${styles.desktopHeader} theme-${theme} ${isDarkMode ? 'dark' : 'light'} ${isScrolled ? styles.scrolled : ''}`}
    >
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          {/* Announcement */}
          <div className={styles.announcement}>
            <span className={styles.announcementIcon}>🎉</span>
            <span className={styles.announcementText}>
              Join our English learning community! Free resources available.
            </span>
            <Link href="/join" className={styles.announcementLink}>
              Join Now →
            </Link>
          </div>

          {/* Top Bar Actions */}
          <div className={styles.topBarActions}>
            <ThemeToggle />
            <FontSelector />
            <button className={styles.notificationButton} aria-label="Notifications">
              <span className={styles.notificationIcon}>🔔</span>
              <span className={styles.notificationBadge}>3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <div className={styles.headerContainer}>
          {/* Logo and Brand */}
          <div className={styles.brandSection}>
            <Link href="/" className={styles.logoLink}>
              <div className={styles.logoContainer}>
                <Image
                  src={siteConfig.logo || '/logo.png'}
                  alt={siteConfig.name}
                  width={160}
                  height={50}
                  className={styles.logo}
                  priority
                />
                <div className={styles.logoText}>
                  <h1 className={styles.siteName}>{siteConfig.name}</h1>
                  <p className={styles.siteTagline}>{siteConfig.tagline}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className={styles.searchSection}>
            <SearchBar 
              onSearchClick={onSearchClick}
              placeholder="Search articles, lessons, resources..."
            />
          </div>

          {/* Header Actions */}
          <div className={styles.actionsSection}>
            <Link href="/premium" className={styles.premiumButton}>
              <span className={styles.premiumIcon}>⭐</span>
              Premium
            </Link>
            
            <Link href="/login" className={styles.authButton}>
              <span className={styles.authIcon}>👤</span>
              Login
            </Link>
            
            <Link href="/join" className={styles.joinButton}>
              Join Free
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li 
                key={item.id}
                className={`${styles.navItem} ${activeMenu === item.id ? styles.active : ''}`}
                onMouseEnter={() => item.hasMegaMenu && handleMegaMenuHover(item.id)}
                onMouseLeave={() => item.hasMegaMenu && handleMegaMenuLeave()}
              >
                <Link 
                  href={item.href}
                  className={styles.navLink}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navText}>{item.label}</span>
                  {item.hasDropdown && (
                    <span className={styles.dropdownArrow}>▼</span>
                  )}
                </Link>

                {/* Mega Menu */}
                {item.hasMegaMenu && megaMenuOpen === item.id && (
                  <div 
                    className={styles.megaMenu}
                    onMouseEnter={() => handleMegaMenuHover(item.id)}
                    onMouseLeave={handleMegaMenuLeave}
                  >
                    <div className={styles.megaMenuContent}>
                      {getMegaMenuItems().map((megaSection) => (
                        <div key={megaSection.id} className={styles.megaSection}>
                          <h4 className={styles.megaSectionTitle}>
                            {megaSection.title}
                          </h4>
                          <ul className={styles.megaSectionList}>
                            {megaSection.items.map((subItem) => (
                              <li key={subItem.title} className={styles.megaItem}>
                                <Link href={subItem.href} className={styles.megaLink}>
                                  <span className={styles.megaIcon}>{subItem.icon}</span>
                                  <span className={styles.megaText}>{subItem.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    
                    {/* Mega Menu CTA */}
                    <div className={styles.megaMenuCta}>
                      <div className={styles.ctaContent}>
                        <h5 className={styles.ctaTitle}>Start Learning Today!</h5>
                        <p className={styles.ctaText}>
                          Access all premium features and accelerate your English learning journey.
                        </p>
                        <Link href="/premium" className={styles.ctaButton}>
                          Upgrade to Premium
                        </Link>
                      </div>
                      <div className={styles.ctaImage}>
                        <Image
                          src="/images/mega-menu-cta.jpg"
                          alt="Premium Learning"
                          width={200}
                          height={120}
                          className={styles.image}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Dropdown */}
                {item.hasDropdown && !item.hasMegaMenu && activeMenu === item.id && (
                  <div className={styles.dropdownMenu}>
                    {item.subItems?.map((subItem) => (
                      <Link 
                        key={subItem.label}
                        href={subItem.href}
                        className={styles.dropdownLink}
                      >
                        <span className={styles.dropdownIcon}>{subItem.icon}</span>
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Navigation Actions */}
          <div className={styles.navActions}>
            <button className={styles.bookmarkButton} aria-label="Bookmarks">
              <span className={styles.bookmarkIcon}>🔖</span>
              <span className={styles.bookmarkCount}>12</span>
            </button>
            
            <button className={styles.languageButton} aria-label="Language">
              <span className={styles.languageIcon}>🌐</span>
              EN
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DesktopHeader;