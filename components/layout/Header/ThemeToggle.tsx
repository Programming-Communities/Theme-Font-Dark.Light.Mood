/**
 * ThemeToggle Component
 * Toggles between light and dark modes for the current theme
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, darkMode, toggleDarkMode, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setIsAnimating(true);
    toggleDarkMode();
    
    // Reset animation after 600ms
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const handleThemeSelect = (themeName: string) => {
    setTheme(themeName);
  };

  // All available themes
  const themes = [
    'professional-blue',
    'corporate-green',
    'premium-purple',
    'luxury-gold',
    'minimal-gray',
    'tech-cyan',
    'nature-green',
    'ocean-blue',
    'sunset-orange',
    'midnight-purple',
    'rose-pink',
    'vibrant-red',
    'cool-teal',
    'classic-white',
  ];

  // Theme color samples
  const themeColors: Record<string, { light: string; dark: string }> = {
    'professional-blue': { light: '#3b82f6', dark: '#60a5fa' },
    'corporate-green': { light: '#059669', dark: '#34d399' },
    'premium-purple': { light: '#7c3aed', dark: '#a78bfa' },
    'luxury-gold': { light: '#d97706', dark: '#fbbf24' },
    'minimal-gray': { light: '#4b5563', dark: '#9ca3af' },
    'tech-cyan': { light: '#0891b2', dark: '#22d3ee' },
    'nature-green': { light: '#16a34a', dark: '#4ade80' },
    'ocean-blue': { light: '#0284c7', dark: '#38bdf8' },
    'sunset-orange': { light: '#ea580c', dark: '#fb923c' },
    'midnight-purple': { light: '#5b21b6', dark: '#8b5cf6' },
    'rose-pink': { light: '#be123c', dark: '#fb7185' },
    'vibrant-red': { light: '#dc2626', dark: '#f87171' },
    'cool-teal': { light: '#0d9488', dark: '#2dd4bf' },
    'classic-white': { light: '#1f2937', dark: '#f3f4f6' },
  };

  if (!mounted) {
    return (
      <div className="theme-toggle">
        <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="theme-toggle">
      <div className="flex items-center space-x-4">
        {/* Theme Selector Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110"
            style={{ 
              backgroundColor: darkMode 
                ? themeColors[theme]?.dark || '#3b82f6'
                : themeColors[theme]?.light || '#3b82f6',
              color: 'white',
            }}
            title={`Current theme: ${theme}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Theme Selection Dropdown */}
          <div className="absolute right-0 mt-2 w-64 p-4 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
               style={{ 
                 backgroundColor: 'var(--bg-primary)',
                 border: '1px solid var(--border)',
               }}>
            <div className="mb-3">
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Select Theme
              </h4>
              <p className="text-xs opacity-70" style={{ color: 'var(--text-secondary)' }}>
                Current: {theme.replace('-', ' ')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {themes.map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => handleThemeSelect(themeName)}
                  className={`flex items-center space-x-2 p-2 rounded text-xs transition-all duration-200 ${
                    theme === themeName ? 'ring-2 ring-opacity-50' : ''
                  }`}
                  style={{ 
                    backgroundColor: theme === themeName 
                      ? darkMode 
                        ? `${themeColors[themeName]?.dark}20`
                        : `${themeColors[themeName]?.light}20`
                      : 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: darkMode 
                        ? themeColors[themeName]?.dark
                        : themeColors[themeName]?.light 
                    }}
                  />
                  <span className="capitalize">
                    {themeName.replace('-', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dark/Light Mode Toggle */}
        <div className="relative">
          <button
            onClick={handleThemeToggle}
            className={`relative w-14 h-8 rounded-full transition-all duration-600 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              isAnimating ? 'scale-105' : ''
            }`}
            style={{ 
              backgroundColor: darkMode ? '#4b5563' : '#d1d5db',
              border: '1px solid var(--border)',
            }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {/* Sun Icon */}
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-yellow-400 transition-all duration-600 flex items-center justify-center ${
                darkMode ? 'transform translate-x-6' : ''
              }`}
            >
              {darkMode ? (
                // Moon Icon
                <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                // Sun Icon
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>

          {/* Animation effect */}
          {isAnimating && (
            <div className="absolute -inset-2 rounded-full animate-ping opacity-20"
                 style={{ backgroundColor: darkMode ? '#9ca3af' : '#fbbf24' }} />
          )}
        </div>

        {/* Current Mode Indicator */}
        <div className="text-xs font-medium hidden sm:block">
          <span style={{ color: 'var(--text-secondary)' }}>
            {darkMode ? 'Dark' : 'Light'} Mode
          </span>
        </div>
      </div>

      <style jsx>{`
        .theme-toggle :global(.group:hover .absolute) {
          transform: translateY(0);
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle;