// contexts/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 
  | 'professional-blue'
  | 'corporate-green'
  | 'premium-purple'
  | 'luxury-gold'
  | 'minimal-gray'
  | 'tech-cyan'
  | 'nature-green'
  | 'ocean-blue'
  | 'sunset-orange'
  | 'midnight-purple'
  | 'rose-pink'
  | 'vibrant-red'
  | 'cool-teal'
  | 'classic-white';

export type ThemeMode = 'light' | 'dark';
export type FontFamily = 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'system';

export interface ThemeSettings {
  theme: Theme;
  mode: ThemeMode;
  fontFamily: FontFamily;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
  animations: boolean;
}

interface ThemeContextType {
  themeSettings: ThemeSettings;
  setTheme: (theme: Theme) => void;
  setMode: (mode: ThemeMode) => void;
  setFontFamily: (fontFamily: FontFamily) => void;
  setFontSize: (fontSize: 'small' | 'medium' | 'large') => void;
  setBorderRadius: (borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full') => void;
  toggleAnimations: () => void;
  toggleMode: () => void;
}

const defaultThemeSettings: ThemeSettings = {
  theme: 'professional-blue',
  mode: 'light',
  fontFamily: 'inter',
  fontSize: 'medium',
  borderRadius: 'medium',
  animations: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('theme-settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setThemeSettings(parsed);
        } catch (error) {
          console.error('Error parsing theme settings:', error);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('theme-settings', JSON.stringify(themeSettings));
      
      // Apply theme classes to document
      document.documentElement.setAttribute('data-theme', themeSettings.theme);
      document.documentElement.setAttribute('data-mode', themeSettings.mode);
      document.documentElement.setAttribute('data-font', themeSettings.fontFamily);
      document.documentElement.setAttribute('data-font-size', themeSettings.fontSize);
      document.documentElement.setAttribute('data-border-radius', themeSettings.borderRadius);
      
      if (themeSettings.animations) {
        document.documentElement.classList.add('animations-enabled');
      } else {
        document.documentElement.classList.remove('animations-enabled');
      }
    }
  }, [themeSettings, isInitialized]);

  const updateSettings = (updates: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({ ...prev, ...updates }));
  };

  const value: ThemeContextType = {
    themeSettings,
    setTheme: (theme) => updateSettings({ theme }),
    setMode: (mode) => updateSettings({ mode }),
    setFontFamily: (fontFamily) => updateSettings({ fontFamily }),
    setFontSize: (fontSize) => updateSettings({ fontSize }),
    setBorderRadius: (borderRadius) => updateSettings({ borderRadius }),
    toggleAnimations: () => updateSettings({ animations: !themeSettings.animations }),
    toggleMode: () => updateSettings({ mode: themeSettings.mode === 'light' ? 'dark' : 'light' }),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};