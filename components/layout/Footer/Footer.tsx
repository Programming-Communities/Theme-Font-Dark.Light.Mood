'use client';

import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Globe, 
  Mail, 
  Phone,
  Heart
} from 'lucide-react';

export default function Footer() {
  const { themeColors } = useTheme();

  const footerLinks = {
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
    Resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Documentation', href: '/docs' },
      { label: 'API', href: '/api' },
      { label: 'Community', href: '/community' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
      { label: 'Code of Conduct', href: '/conduct' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Report Issue', href: '/report' },
      { label: 'Status', href: '/status' },
      { label: 'Feedback', href: '/feedback' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  ];

  return (
    <footer className="mt-auto border-t"
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border
            }}>
      {/* Main Footer */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
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
                  <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                    Pakistan
                  </div>
                </div>
              </Link>
              
              <p className="mb-6 text-sm" style={{ color: themeColors.text.secondary }}>
                Connecting English learners and enthusiasts across Pakistan. 
                Join our vibrant community for resources, discussions, and networking.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:scale-110 transition-all"
                    style={{ 
                      backgroundColor: themeColors.surface,
                      color: themeColors.text.secondary
                    }}
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.text.secondary }}>
                  <Mail className="h-4 w-4" />
                  <span>hello@englishcommunities.pk</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.text.secondary }}>
                  <Phone className="h-4 w-4" />
                  <span>+92 300 1234567</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.text.secondary }}>
                  <Globe className="h-4 w-4" />
                  <span>Lahore, Pakistan</span>
                </div>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-bold text-lg mb-4" style={{ color: themeColors.text.primary }}>
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-primary transition-colors"
                        style={{ color: themeColors.text.secondary }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 border-t"
           style={{ 
             backgroundColor: themeColors.surface,
             borderColor: themeColors.border
           }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm" style={{ color: themeColors.text.secondary }}>
              © {new Date().getFullYear()} English Communities PK. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/sitemap" style={{ color: themeColors.text.secondary }}>
                Sitemap
              </Link>
              <Link href="/accessibility" style={{ color: themeColors.text.secondary }}>
                Accessibility
              </Link>
              <Link href="/security" style={{ color: themeColors.text.secondary }}>
                Security
              </Link>
              <div className="flex items-center gap-1" style={{ color: themeColors.text.secondary }}>
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-500" />
                <span>in Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}