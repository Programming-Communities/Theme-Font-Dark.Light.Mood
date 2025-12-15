'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeColors, FontOption, ThemeOption } from '@/types/theme';
import { 
  THEMES_CONFIG, 
  FONT_OPTIONS, 
  getThemeColors, 
  getAvailableThemes,
  getThemeCategories 
} from '@/components/theme/config/themeConfig';

interface ThemeContextType {
  theme: Theme;
  themeColors: ThemeColors;
  fontFamily: string;
  setTheme: (theme: Theme) => void;
  setFontFamily: (font: string) => void;
  availableThemes: ThemeOption[];
  themeCategories: { id: string; name: string }[];
  availableFonts: FontOption[];
  isInitialized: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme - UPDATED to Primary Dark Blue
const defaultTheme: Theme = 'primary-dark-blue';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [themeColors, setThemeColors] = useState<ThemeColors>(getThemeColors(defaultTheme, false));
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontFamily, setFontFamilyState] = useState<string>('system-ui');

  const availableThemes = getAvailableThemes();
  const themeCategories = getThemeCategories();
  const availableFonts = FONT_OPTIONS;

  // Function to apply theme to entire document
  const applyThemeStyles = (colors: ThemeColors, darkMode: boolean, font: string) => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    const body = document.body;
    
    // Clear all previous theme classes
    body.classList.remove('light', 'dark');
    root.classList.remove('light', 'dark');
    
    // Apply CSS Variables
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--surface', colors.surface);
    root.style.setProperty('--text-primary', colors.text.primary);
    root.style.setProperty('--text-secondary', colors.text.secondary);
    root.style.setProperty('--text-accent', colors.text.accent);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--error', colors.error);
    root.style.setProperty('--shadow', colors.shadow);
    root.style.setProperty('--font-family', font);

    // Apply font family
    body.style.fontFamily = font;

    // Apply dark/light mode classes
    if (darkMode) {
      body.classList.add('dark');
      root.classList.add('dark');
      body.style.backgroundColor = colors.background;
      root.style.backgroundColor = colors.background;
    } else {
      body.classList.add('light');
      root.classList.add('light');
      body.style.backgroundColor = colors.background;
      root.style.backgroundColor = colors.background;
    }

    // Update meta theme color
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", colors.primary);
    }

    // Force reflow to ensure styles are applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  };

  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedFontFamily = localStorage.getItem('fontFamily');

    const initialTheme = savedTheme && THEMES_CONFIG[savedTheme] ? savedTheme : defaultTheme;
    const initialDarkMode = savedDarkMode || false;
    const initialFontFamily = savedFontFamily || 'system-ui';
    
    const colors = getThemeColors(initialTheme, initialDarkMode);
    
    setThemeState(initialTheme);
    setThemeColors(colors);
    setIsDarkMode(initialDarkMode);
    setFontFamilyState(initialFontFamily);
    
    // Apply initial styles
    setTimeout(() => {
      applyThemeStyles(colors, initialDarkMode, initialFontFamily);
      setIsInitialized(true);
    }, 10);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (!isInitialized) return;

    const colors = getThemeColors(theme, isDarkMode);
    setThemeColors(colors);
    
    localStorage.setItem('theme', theme);
    localStorage.setItem('darkMode', isDarkMode.toString());
    localStorage.setItem('fontFamily', fontFamily);
    
    applyThemeStyles(colors, isDarkMode, fontFamily);
  }, [theme, isDarkMode, fontFamily, isInitialized]);

  const toggleDarkMode = () => {
    console.log('Toggling dark mode from', isDarkMode, 'to', !isDarkMode);
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (newTheme: Theme) => {
    console.log('Setting theme to:', newTheme);
    setThemeState(newTheme);
  };

  const setFontFamily = (font: string) => {
    console.log('Setting font to:', font);
    setFontFamilyState(font);
  };

  const value: ThemeContextType = {
    theme,
    themeColors,
    fontFamily,
    setTheme,
    setFontFamily,
    availableThemes,
    themeCategories,
    availableFonts,
    isInitialized,
    isDarkMode,
    toggleDarkMode
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};