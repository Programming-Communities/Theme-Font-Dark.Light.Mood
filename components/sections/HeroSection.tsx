'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Search, ArrowRight, Users, BookOpen, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showStats?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroSection({
  title = "Welcome to English Communities PK",
  subtitle = "Join Pakistan's largest community of English learners, teachers, and enthusiasts. Share knowledge, ask questions, and grow together.",
  showSearch = true,
  showStats = true,
  ctaText = "Explore Community",
  ctaLink = "/community",
}: HeroSectionProps) {
  const { themeColors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Members' },
    { icon: BookOpen, value: '5,000+', label: 'Learning Resources' },
    { icon: Star, value: '98%', label: 'Satisfaction Rate' },
    { icon: TrendingUp, value: '24/7', label: 'Active Community' },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-20"
             style={{ 
               background: `radial-gradient(circle, ${themeColors.primary}40 0%, transparent 70%)`,
               filter: 'blur(60px)'
             }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10"
             style={{ 
               background: `radial-gradient(circle, ${themeColors.secondary}40 0%, transparent 70%)`,
               filter: 'blur(80px)'
             }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
               style={{ 
                 backgroundColor: `${themeColors.primary}15`,
                 color: themeColors.primary,
                 border: `1px solid ${themeColors.primary}30`
               }}>
            <span className="text-sm font-medium">✨ New Features Added!</span>
            <span className="text-xs opacity-75">Comments, Reactions & More</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: themeColors.text.primary }}>
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
             style={{ color: themeColors.text.secondary }}>
            {subtitle}
          </p>

          {/* Search Bar */}
          {showSearch && (
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                        style={{ color: themeColors.text.secondary }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for articles, tutorials, or discussions..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border text-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text.primary,
                    boxShadow: `0 4px 20px ${themeColors.shadow}`
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: themeColors.primary,
                    color: themeColors.text.accent
                  }}
                >
                  Search
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                  Try:
                </span>
                {['Grammar Tips', 'Vocabulary', 'Speaking Practice', 'Writing Skills'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="text-sm px-3 py-1 rounded-full hover:bg-surface transition-colors"
                    style={{ 
                      color: themeColors.text.secondary,
                      backgroundColor: themeColors.surface
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                color: themeColors.text.accent,
                boxShadow: `0 4px 20px ${themeColors.shadow}`
              }}
            >
              {ctaText}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-lg active:scale-95"
              style={{ 
                backgroundColor: themeColors.surface,
                color: themeColors.text.primary,
                border: `2px solid ${themeColors.border}`
              }}
            >
              Read Blog
              <BookOpen className="h-5 w-5" />
            </Link>
          </div>

          {/* Stats */}
          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} 
                     className="p-4 rounded-xl text-center transition-transform hover:scale-105"
                     style={{ 
                       backgroundColor: themeColors.surface,
                       border: `1px solid ${themeColors.border}`,
                       boxShadow: `0 4px 12px ${themeColors.shadow}`
                     }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3"
                       style={{ 
                         backgroundColor: `${themeColors.primary}15`,
                         color: themeColors.primary
                       }}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: themeColors.text.primary }}>
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg 
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25" 
            style={{ fill: themeColors.background }} 
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5" 
            style={{ fill: themeColors.background }} 
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            style={{ fill: themeColors.background }} 
          />
        </svg>
      </div>
    </section>
  );
}