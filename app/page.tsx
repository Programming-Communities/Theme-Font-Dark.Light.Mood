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
  Star
} from 'lucide-react';

export default function HomePage() {
  const { theme, themeColors, fontFamily, isDarkMode, availableThemes } = useTheme();
  const [currentTime, setCurrentTime] = useState<string>('');

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

  const currentTheme = availableThemes.find(t => t.value === theme);

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background, color: themeColors.text.primary }}>
      {/* Hero Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: themeColors.primary }}>
              English Communities PK
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-2" style={{ color: themeColors.text.secondary }}>
              Dynamic & Hybrid Theme System Demo
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" 
                 style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}` }}>
              <span className="opacity-75">Current Time:</span>
              <span className="font-mono font-medium">{currentTime}</span>
            </div>
          </div>

          {/* Theme Info Card */}
          <div className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl" 
               style={{ 
                 backgroundColor: themeColors.surface, 
                 border: `1px solid ${themeColors.border}`,
                 boxShadow: themeColors.shadow
               }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}>
                <Palette className="h-6 w-6" />
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
                  <span className="font-medium capitalize">{theme.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Category:</span>
                  <span className="font-medium">{currentTheme?.category || 'Professional'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Mode:</span>
                  <div className="flex items-center gap-2">
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: themeColors.primary, borderColor: themeColors.border }} />
                    <span className="font-medium">{themeColors.primary}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium" 
                        style={{ 
                          backgroundColor: `${themeColors.success}20`, 
                          color: themeColors.success 
                        }}>
                    Live & Dynamic
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <Globe className="h-8 w-8" />, title: 'Dynamic Themes', desc: '14+ fully dynamic themes', color: 'primary' },
              { icon: <Users className="h-8 w-8" />, title: 'Community', desc: 'Active user community', color: 'secondary' },
              { icon: <BookOpen className="h-8 w-8" />, title: 'Learning', desc: 'Educational resources', color: 'success' },
              { icon: <MessageSquare className="h-8 w-8" />, title: 'Discussions', desc: 'Interactive forums', color: 'warning' },
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl transition-transform hover:scale-105" 
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
                 border: `1px solid ${themeColors.border}`
               }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              How to Use Theme System
            </h3>
            <div className="space-y-3">
              {[
                'Click the floating button (bottom right) to open theme settings',
                'Switch between dark/light mode from the main menu',
                'Browse through 14+ themes in the Themes section',
                'Change fonts from the Fonts section',
                'All changes are saved automatically and persist across sessions'
              ].map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full" style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}>
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
      <footer className="py-6 px-4 border-t" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm opacity-75" style={{ color: themeColors.text.secondary }}>
            English Communities PK • Phase 1: Theme System • {new Date().getFullYear()}
          </p>
          <p className="text-xs mt-2 opacity-50" style={{ color: themeColors.text.secondary }}>
            Next.js 16.0.10 • TypeScript • Fully Dynamic & Hybrid
          </p>
        </div>
      </footer>
    </div>
  );
}
