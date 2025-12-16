'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useDevice } from '@/hooks/useDevice';
import { navItems } from '@/config/navigation.config';
import styles from './NavMenu.module.css';

interface NavMenuProps {
  variant?: 'desktop' | 'mobile';
  onItemClick?: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({
  variant = 'desktop',
  onItemClick
}) => {
  const { theme, isDarkMode } = useTheme();
  const { isDesktop } = useDevice();
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Reset menus on variant change
  useEffect(() => {
    setActiveMenu('');
    setExpandedMenus([]);
  }, [variant]);

  // Handle menu item click
  const handleMenuItemClick = (itemId: string, hasDropdown: boolean) => {
    if (variant === 'mobile') {
      if (hasDropdown) {
        setExpandedMenus(prev =>
          prev.includes(itemId)
            ? prev.filter(id => id !== itemId)
            : [...prev, itemId]
        );
      } else {
        onItemClick?.();
      }
    } else {
      setActiveMenu(activeMenu === itemId ? '' : itemId);
    }
  };

  // Handle submenu mouse events for desktop
  const handleMouseEnter = (itemId: string) => {
    if (variant === 'desktop' && isDesktop) {
      setActiveMenu(itemId);
    }
  };

  const handleMouseLeave = () => {
    if (variant === 'desktop' && isDesktop) {
      setActiveMenu('');
    }
  };

  // Get submenu items for a specific menu
  const getSubmenuItems = (itemId: string) => {
    // This would typically come from a config or API
    const submenus: Record<string, Array<{ label: string; href: string; icon: string }>> = {
      learning: [
        { label: 'Grammar Lessons', href: '/category/grammar', icon: '📚' },
        { label: 'Vocabulary Builder', href: '/category/vocabulary', icon: '📖' },
        { label: 'Speaking Practice', href: '/category/speaking', icon: '🎤' },
        { label: 'Listening Exercises', href: '/category/listening', icon: '🎧' },
        { label: 'Writing Tips', href: '/category/writing', icon: '✍️' },
        { label: 'Pronunciation Guide', href: '/category/pronunciation', icon: '🗣️' }
      ],
      resources: [
        { label: 'E-Books', href: '/resources/ebooks', icon: '📘' },
        { label: 'Worksheets', href: '/resources/worksheets', icon: '📝' },
        { label: 'Templates', href: '/resources/templates', icon: '📄' },
        { label: 'Tools', href: '/resources/tools', icon: '🛠️' },
        { label: 'Downloads', href: '/resources/downloads', icon: '⬇️' },
        { label: 'Premium Content', href: '/premium', icon: '⭐' }
      ],
      community: [
        { label: 'Discussions', href: '/community/discussions', icon: '💬' },
        { label: 'Study Groups', href: '/community/groups', icon: '👥' },
        { label: 'Events', href: '/community/events', icon: '📅' },
        { label: 'Members', href: '/community/members', icon: '👤' },
        { label: 'Q&A Forum', href: '/community/questions', icon: '❓' },
        { label: 'Success Stories', href: '/community/stories', icon: '🏆' }
      ]
    };

    return submenus[itemId] || [];
  };

  // Render desktop navigation
  const renderDesktopNav = () => (
    <nav 
      className={`${styles.navMenu} ${styles.desktop} theme-${theme} ${isDarkMode ? 'dark' : 'light'}`}
      onMouseLeave={handleMouseLeave}
    >
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li 
            key={item.id}
            className={`${styles.navItem} ${activeMenu === item.id ? styles.active : ''}`}
            onMouseEnter={() => handleMouseEnter(item.id)}
          >
            <Link 
              href={item.href}
              className={styles.navLink}
              onClick={() => handleMenuItemClick(item.id, item.hasDropdown)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.label}</span>
              {item.hasDropdown && (
                <span className={styles.dropdownArrow}>▼</span>
              )}
            </Link>

            {/* Desktop Submenu */}
            {item.hasDropdown && activeMenu === item.id && (
              <div className={styles.submenu}>
                <div className={styles.submenuContent}>
                  {/* Default subitems */}
                  {item.subItems?.map((subItem) => (
                    <Link 
                      key={subItem.label}
                      href={subItem.href}
                      className={styles.submenuLink}
                      onClick={onItemClick}
                    >
                      <span className={styles.submenuIcon}>{subItem.icon}</span>
                      <div className={styles.submenuText}>
                        <div className={styles.submenuTitle}>{subItem.label}</div>
                        {subItem.description && (
                          <div className={styles.submenuDescription}>
                            {subItem.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}

                  {/* Additional submenu items */}
                  {getSubmenuItems(item.id).map((subItem) => (
                    <Link 
                      key={subItem.label}
                      href={subItem.href}
                      className={styles.submenuLink}
                      onClick={onItemClick}
                    >
                      <span className={styles.submenuIcon}>{subItem.icon}</span>
                      <div className={styles.submenuText}>
                        <div className={styles.submenuTitle}>{subItem.label}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Submenu CTA */}
                {item.hasMegaMenu && (
                  <div className={styles.submenuCta}>
                    <div className={styles.ctaContent}>
                      <h4 className={styles.ctaTitle}>Explore More</h4>
                      <p className={styles.ctaText}>
                        Discover all resources and features in this category.
                      </p>
                      <Link 
                        href={item.href} 
                        className={styles.ctaButton}
                        onClick={onItemClick}
                      >
                        View All
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );

  // Render mobile navigation
  const renderMobileNav = () => (
    <nav className={`${styles.navMenu} ${styles.mobile} theme-${theme} ${isDarkMode ? 'dark' : 'light'}`}>
      <ul className={styles.mobileNavList}>
        {navItems.map((item) => (
          <li key={item.id} className={styles.mobileNavItem}>
            <div 
              className={styles.mobileNavLink}
              onClick={() => handleMenuItemClick(item.id, item.hasDropdown || item.hasMegaMenu)}
            >
              <span className={styles.mobileNavIcon}>{item.icon}</span>
              <span className={styles.mobileNavText}>{item.label}</span>
              {(item.hasDropdown || item.hasMegaMenu) && (
                <span 
                  className={`${styles.mobileDropdownArrow} ${
                    expandedMenus.includes(item.id) ? styles.expanded : ''
                  }`}
                >
                  ▼
                </span>
              )}
            </div>

            {/* Mobile Submenu */}
            {(item.hasDropdown || item.hasMegaMenu) && expandedMenus.includes(item.id) && (
              <div className={styles.mobileSubmenu}>
                {/* Default subitems */}
                {item.subItems?.map((subItem) => (
                  <Link 
                    key={subItem.label}
                    href={subItem.href}
                    className={styles.mobileSubmenuLink}
                    onClick={onItemClick}
                  >
                    <span className={styles.mobileSubmenuIcon}>{subItem.icon}</span>
                    {subItem.label}
                  </Link>
                ))}

                {/* Additional submenu items */}
                {getSubmenuItems(item.id).map((subItem) => (
                  <Link 
                    key={subItem.label}
                    href={subItem.href}
                    className={styles.mobileSubmenuLink}
                    onClick={onItemClick}
                  >
                    <span className={styles.mobileSubmenuIcon}>{subItem.icon}</span>
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );

  return variant === 'desktop' ? renderDesktopNav() : renderMobileNav();
};

export default NavMenu;