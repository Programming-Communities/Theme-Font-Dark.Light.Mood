'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Theme, ThemePreferences, FontFamily } from '@/types/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  themePreferences: ThemePreferences;
  updateThemePreferences: (prefs: Partial<ThemePreferences>) => void;
  resetToDefaults: () => void;
  exportThemeSettings: () => string;
  importThemeSettings: (settings: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Available themes from styles/theme.css
export const AVAILABLE_THEMES: Theme[] = [
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
  'classic-white'
] as const;

// Available fonts
export const AVAILABLE_FONTS: FontFamily[] = [
  'Inter',
  'Poppins',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Nunito',
  'Source Sans Pro'
] as const;

// Default theme preferences
const DEFAULT_PREFERENCES: ThemePreferences = {
  theme: 'professional-blue',
  darkMode: false,
  fontFamily: 'Inter',
  fontSize: 16,
  reducedMotion: false,
  highContrast: false,
  themeAuto: true
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themePreferences, setThemePreferences] = useState<ThemePreferences>(DEFAULT_PREFERENCES);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage and system preferences
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Load saved preferences
        const saved = localStorage.getItem('themePreferences');
        const preferences: ThemePreferences = saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;

        // Check system preferences
        const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Apply auto theme detection
        if (preferences.themeAuto) {
          preferences.darkMode = systemDarkMode;
        }

        // Apply reduced motion preference
        if (prefersReducedMotion) {
          preferences.reducedMotion = true;
        }

        setThemePreferences(preferences);
        applyTheme(preferences);
      } catch (error) {
        console.error('Error loading theme preferences:', error);
        applyTheme(DEFAULT_PREFERENCES);
      } finally {
        setIsInitialized(true);
      }
    };

    if (typeof window !== 'undefined') {
      initializeTheme();
    }
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((prefs: ThemePreferences) => {
    const root = document.documentElement;
    const body = document.body;

    // Apply theme class
    root.className = '';
    body.className = '';
    
    // Add theme class
    root.classList.add(`theme-${prefs.theme}`);
    body.classList.add(`theme-${prefs.theme}`);
    
    // Add dark/light mode
    if (prefs.darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.add('light');
      body.classList.add('light');
    }

    // Apply font family
    root.style.setProperty('--font-family', prefs.fontFamily);
    root.style.setProperty('--font-family-sans', `${prefs.fontFamily}, system-ui, -apple-system, sans-serif`);
    
    // Apply font size
    root.style.setProperty('--font-size-base', `${prefs.fontSize}px`);
    
    // Apply reduced motion
    if (prefs.reducedMotion) {
      root.style.setProperty('--transition-fast', '0s');
      root.style.setProperty('--transition-normal', '0s');
      root.style.setProperty('--transition-slow', '0s');
    }

    // Apply high contrast
    if (prefs.highContrast) {
      root.classList.add('high-contrast');
      body.classList.add('high-contrast');
    }

    // Save to localStorage
    localStorage.setItem('themePreferences', JSON.stringify(prefs));
  }, []);

  // Update theme preferences
  const updateThemePreferences = useCallback((updates: Partial<ThemePreferences>) => {
    setThemePreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      applyTheme(newPrefs);
      return newPrefs;
    });
  }, [applyTheme]);

  // Set theme
  const setTheme = useCallback((newTheme: Theme) => {
    updateThemePreferences({ theme: newTheme });
  }, [updateThemePreferences]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    updateThemePreferences({ darkMode: !themePreferences.darkMode });
  }, [themePreferences.darkMode, updateThemePreferences]);

  // Set font family
  const setFontFamily = useCallback((font: FontFamily) => {
    updateThemePreferences({ fontFamily: font });
  }, [updateThemePreferences]);

  // Set font size
  const setFontSize = useCallback((size: number) => {
    updateThemePreferences({ fontSize: Math.max(12, Math.min(24, size)) });
  }, [updateThemePreferences]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    updateThemePreferences(DEFAULT_PREFERENCES);
  }, [updateThemePreferences]);

  // Export theme settings
  const exportThemeSettings = useCallback(() => {
    return JSON.stringify(themePreferences, null, 2);
  }, [themePreferences]);

  // Import theme settings
  const importThemeSettings = useCallback((settings: string): boolean => {
    try {
      const parsed = JSON.parse(settings);
      
      // Validate imported settings
      if (
        typeof parsed.theme === 'string' &&
        typeof parsed.darkMode === 'boolean' &&
        typeof parsed.fontFamily === 'string' &&
        typeof parsed.fontSize === 'number'
      ) {
        updateThemePreferences(parsed);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing theme settings:', error);
      return false;
    }
  }, [updateThemePreferences]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (themePreferences.themeAuto) {
        updateThemePreferences({ darkMode: e.matches });
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themePreferences.themeAuto, updateThemePreferences]);

  // Provide theme context
  const contextValue: ThemeContextType = {
    theme: themePreferences.theme,
    setTheme,
    isDarkMode: themePreferences.darkMode,
    toggleDarkMode,
    fontFamily: themePreferences.fontFamily,
    setFontFamily,
    fontSize: themePreferences.fontSize,
    setFontSize,
    themePreferences,
    updateThemePreferences,
    resetToDefaults,
    exportThemeSettings,
    importThemeSettings
  };

  if (!isInitialized) {
    return <div className="theme-loading">Loading theme...</div>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme toggle hook for individual components
export const useThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return { isDarkMode, toggleDarkMode };
};

// Theme selector hook
export const useThemeSelection = () => {
  const { theme, setTheme } = useTheme();
  return { theme, setTheme, availableThemes: AVAILABLE_THEMES };
};

// Font selection hook
export const useFontSelection = () => {
  const { fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();
  return { 
    fontFamily, 
    setFontFamily, 
    fontSize, 
    setFontSize, 
    availableFonts: AVAILABLE_FONTS 
  };
};