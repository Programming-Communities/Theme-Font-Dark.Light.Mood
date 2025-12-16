// Navigation configuration for the header components
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  hasDropdown: boolean;
  hasMegaMenu?: boolean;
  subItems?: SubItem[];
  description?: string;
}

export interface SubItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}

export const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: '🏠',
    hasDropdown: false
  },
  {
    id: 'blog',
    label: 'Blog',
    href: '/blog',
    icon: '📝',
    hasDropdown: true,
    subItems: [
      {
        label: 'All Posts',
        href: '/blog',
        icon: '📰',
        description: 'Browse all articles'
      },
      {
        label: 'Categories',
        href: '/categories',
        icon: '📂',
        description: 'Posts by category'
      },
      {
        label: 'Tags',
        href: '/tags',
        icon: '🏷️',
        description: 'Posts by tags'
      },
      {
        label: 'Popular',
        href: '/blog?sort=popular',
        icon: '🔥',
        description: 'Most read articles'
      },
      {
        label: 'Latest',
        href: '/blog?sort=latest',
        icon: '🆕',
        description: 'Recently published'
      }
    ]
  },
  {
    id: 'learning',
    label: 'Learning',
    href: '/learning',
    icon: '📚',
    hasDropdown: true,
    hasMegaMenu: true,
    description: 'English learning resources'
  },
  {
    id: 'resources',
    label: 'Resources',
    href: '/resources',
    icon: '📦',
    hasDropdown: true,
    hasMegaMenu: true,
    description: 'Tools and materials'
  },
  {
    id: 'community',
    label: 'Community',
    href: '/community',
    icon: '👥',
    hasDropdown: true,
    hasMegaMenu: true,
    description: 'Connect with learners'
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    icon: 'ℹ️',
    hasDropdown: true,
    subItems: [
      {
        label: 'Our Mission',
        href: '/about/mission',
        icon: '🎯',
        description: 'What we aim to achieve'
      },
      {
        label: 'Team',
        href: '/about/team',
        icon: '👨‍👩‍👧‍👦',
        description: 'Meet our team'
      },
      {
        label: 'Contact',
        href: '/contact',
        icon: '📞',
        description: 'Get in touch'
      },
      {
        label: 'FAQ',
        href: '/faq',
        icon: '❓',
        description: 'Frequently asked questions'
      }
    ]
  }
];

// Quick links for footer/mobile menu
export const quickLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Sitemap', href: '/sitemap' }
];

// Social media links
export const socialLinks = [
  { platform: 'facebook', label: 'Facebook', icon: '📘', href: '#' },
  { platform: 'twitter', label: 'Twitter', icon: '🐦', href: '#' },
  { platform: 'instagram', label: 'Instagram', icon: '📷', href: '#' },
  { platform: 'youtube', label: 'YouTube', icon: '📺', href: '#' },
  { platform: 'linkedin', label: 'LinkedIn', icon: '💼', href: '#' }
];

// Language options
export const languageOptions = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ur', label: 'اردو', flag: '🇵🇰' }
];

export default navItems;