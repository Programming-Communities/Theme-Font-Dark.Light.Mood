'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { 
  Palette, 
  Moon, 
  Sun, 
  Type, 
  Settings,
  ChevronRight,
  Globe,
  Users,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Star,
  Zap,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const { theme, themeColors, fontFamily, isDarkMode, availableThemes } = useTheme();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeThemeColor, setActiveThemeColor] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-PK', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Set active theme color for visual indicator
    if (theme === 'primary-dark-blue') {
      setActiveThemeColor('linear-gradient(135deg, #194375, #1f7190, #f5be2e)');
    } else if (theme.includes('blue')) {
      setActiveThemeColor('linear-gradient(135deg, #2563EB, #1E40AF)');
    } else if (theme.includes('green')) {
      setActiveThemeColor('linear-gradient(135deg, #059669, #047857)');
    } else if (theme.includes('purple')) {
      setActiveThemeColor('linear-gradient(135deg, #7C3AED, #6D28D9)');
    } else if (theme.includes('gold')) {
      setActiveThemeColor('linear-gradient(135deg, #D97706, #B45309)');
    } else if (theme.includes('gray')) {
      setActiveThemeColor('linear-gradient(135deg, #4B5563, #374151)');
    } else {
      setActiveThemeColor('linear-gradient(135deg, #06B6D4, #0891B2)');
    }
  }, [theme]);

  const currentTheme = availableThemes.find(t => t.value === theme);

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background, color: themeColors.text.primary }}>
      {/* Hero Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ 
                backgroundImage: activeThemeColor, 
                color: themeColors.text.accent 
              }}>
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold relative">
                {/* Text with gradient background */}
                <span className="relative z-10" style={{ 
                  backgroundImage: activeThemeColor,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block'
                }}>
                  English Communities PK
                </span>
              </h1>
            </div>
            
            <p className="text-lg md:text-xl opacity-90 mb-2" style={{ color: themeColors.text.secondary }}>
              Dynamic & Hybrid Theme System Demo
            </p>
            
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full text-sm" 
                 style={{ 
                   backgroundColor: themeColors.surface, 
                   border: `1px solid ${themeColors.border}`,
                   boxShadow: themeColors.shadow
                 }}>
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-full ${isDarkMode ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                  {isDarkMode ? (
                    <Moon className="h-3 w-3" style={{ color: themeColors.text.accent }} />
                  ) : (
                    <Sun className="h-3 w-3" style={{ color: themeColors.text.accent }} />
                  )}
                </div>
                <span className="opacity-75">Mode:</span>
                <span className="font-medium">{isDarkMode ? 'Night 🌙' : 'Day ☀️'}</span>
              </div>
              
              <div className="h-4 w-px" style={{ backgroundColor: themeColors.border }} />
              
              <div className="flex items-center gap-2">
                <span className="opacity-75">Time:</span>
                <span className="font-mono font-medium">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Theme Info Card */}
          <div className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl relative overflow-hidden" 
               style={{ 
                 backgroundColor: themeColors.surface, 
                 border: `1px solid ${themeColors.border}`,
                 boxShadow: themeColors.shadow
               }}>
            {/* Accent stripe for primary-dark-blue theme */}
            {theme === 'primary-dark-blue' && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#f5be2e] via-[#1f7190] to-[#194375]" />
            )}
            
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl relative overflow-hidden" style={{ 
                backgroundImage: activeThemeColor,
                color: themeColors.text.accent 
              }}>
                <Palette className="h-6 w-6 relative z-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Active Theme</h2>
                <p className="opacity-75">All theme changes are applied dynamically</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Theme Name:</span>
                  <span className="font-medium capitalize">{theme.replace(/-/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Category:</span>
                  <span className="font-medium">{currentTheme?.category || 'Professional'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Mode:</span>
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${isDarkMode ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
                      {isDarkMode ? <Moon className="h-4 w-4 text-yellow-500" /> : <Sun className="h-4 w-4 text-blue-500" />}
                    </div>
                    <span className="font-medium">{isDarkMode ? 'Dark' : 'Light'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Font Family:</span>
                  <span className="font-medium" style={{ fontFamily }}>{fontFamily}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Primary Color:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border" style={{ 
                      backgroundColor: themeColors.primary,
                      borderColor: themeColors.border 
                    }} />
                    <span className="font-medium">{themeColors.primary}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1" 
                        style={{ 
                          backgroundColor: `${themeColors.success}20`, 
                          color: themeColors.success 
                        }}>
                    <Zap className="h-3 w-3" />
                    Live & Dynamic
                  </span>
                </div>
              </div>
            </div>
            
            {/* Color Palette Preview for Primary Dark Blue */}
            {theme === 'primary-dark-blue' && (
              <div className="mt-6 pt-4 border-t" style={{ borderColor: themeColors.border }}>
                <p className="text-sm opacity-75 mb-2">Theme Color Palette:</p>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 rounded" style={{ backgroundColor: '#194375' }} title="Primary: #194375" />
                  <div className="flex-1 h-8 rounded" style={{ backgroundColor: '#1f7190' }} title="Secondary: #1f7190" />
                  <div className="flex-1 h-8 rounded" style={{ backgroundColor: '#f5be2e' }} title="Accent: #f5be2e" />
                  <div className="flex-1 h-8 rounded" style={{ backgroundColor: '#0a1929' }} title="Background: #0a1929" />
                </div>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                icon: <Palette className="h-8 w-8" />, 
                title: 'Dynamic Themes', 
                desc: '15+ fully dynamic themes with new Primary Dark Blue',
                color: 'primary'
              },
              { 
                icon: <Moon className="h-8 w-8" />, 
                title: 'Dark/Light Mode', 
                desc: 'Sun/Moon toggle integrated in settings',
                color: 'secondary'
              },
              { 
                icon: <Type className="h-8 w-8" />, 
                title: 'Font Selection', 
                desc: '10+ font families with live preview',
                color: 'success'
              },
              { 
                icon: <Zap className="h-8 w-8" />, 
                title: 'Real-time Updates', 
                desc: 'All changes apply instantly',
                color: 'warning'
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg" 
                   style={{ 
                     backgroundColor: themeColors.surface, 
                     border: `1px solid ${themeColors.border}`,
                     boxShadow: themeColors.shadow
                   }}>
                <div className="mb-4" style={{ color: themeColors[feature.color as keyof typeof themeColors] as string }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-75" style={{ color: themeColors.text.secondary }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="max-w-3xl mx-auto p-6 rounded-xl" 
               style={{ 
                 backgroundColor: themeColors.surface, 
                 border: `1px solid ${themeColors.border}`,
                 boxShadow: themeColors.shadow
               }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              How to Use Theme System
            </h3>
            <div className="space-y-3">
              {[
                '3 floating buttons at bottom right corner:',
                '1. Top: Sun/Moon button for dark/light mode toggle',
                '2. Middle: Type button for font selection',
                '3. Bottom: Settings button for full theme settings',
                'Browse through 15+ themes including the new Primary Dark Blue',
                'All changes are saved automatically'
              ].map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full shrink-0" 
                       style={{ 
                         backgroundColor: themeColors.primary, 
                         color: themeColors.text.accent 
                       }}>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                  <p className="flex-1" style={{ color: themeColors.text.secondary }}>{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t" style={{ 
        borderColor: themeColors.border, 
        backgroundColor: themeColors.background 
      }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm opacity-75 mb-2" style={{ color: themeColors.text.secondary }}>
            English Communities PK • Phase 1: Theme System • {new Date().getFullYear()}
          </p>
          <p className="text-xs opacity-50 flex items-center justify-center gap-2" style={{ color: themeColors.text.secondary }}>
            <span>Next.js 16.0.10</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>15 Dynamic Themes</span>
            <span>•</span>
            <span>3 Floating Buttons</span>
          </p>
        </div>
      </footer>
    </div>
  );
}