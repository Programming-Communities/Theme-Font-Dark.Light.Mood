#!/bin/bash
# phase.sh - Complete Next.js Project Generator
# Phase 1: Theme System Only

echo "========================================"
echo "   Next.js 16.0.10 Project Generator    "
echo "========================================"
echo "Phase 1: Theme System Implementation"
echo "----------------------------------------"

# Project root
PROJECT_ROOT="/c/Users/AamirAli/Desktop/english.muniteies.pk"

# Create directory structure for theme system only
echo "Creating theme system directories..."

# Theme directories
mkdir -p "$PROJECT_ROOT/components/theme/providers"
mkdir -p "$PROJECT_ROOT/components/theme/contexts"
mkdir -p "$PROJECT_ROOT/components/theme/config"
mkdir -p "$PROJECT_ROOT/components/theme/types"
mkdir -p "$PROJECT_ROOT/components/theme/ui"
mkdir -p "$PROJECT_ROOT/components/theme/hooks"
mkdir -p "$PROJECT_ROOT/components/theme/css"
mkdir -p "$PROJECT_ROOT/styles"
mkdir -p "$PROJECT_ROOT/types"
mkdir -p "$PROJECT_ROOT/lib/theme"
mkdir -p "$PROJECT_ROOT/hooks"

echo "✓ Directory structure created"
echo ""
echo "Generating theme system files..."
echo "----------------------------------------"

# ========================================
# 1. Theme Type Definitions
# ========================================

cat > "$PROJECT_ROOT/types/theme.d.ts" << 'EOF'
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
  | 'cool-teal';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

export interface ThemeWithMetadata extends ThemeColors {
  name: string;
  category: string;
  icon: string;
  description: string;
  dark?: Partial<ThemeColors>;
}

export interface ThemeConfigWithoutMetadata {
  [key: string]: ThemeColors;
}

export interface ThemeConfigWithMetadata {
  [key: string]: ThemeWithMetadata;
}

export interface ThemeOption {
  value: Theme;
  label: string;
  category: string;
  icon: string;
  description: string;
}

export interface FontOption {
  value: string;
  label: string;
}
EOF

echo "✓ Created types/theme.d.ts"

# ========================================
# 2. Theme Configuration
# ========================================

cat > "$PROJECT_ROOT/components/theme/config/themeConfig.ts" << 'EOF'
import { 
  ThemeConfigWithMetadata, 
  FontOption, 
  ThemeOption, 
  Theme, 
  ThemeWithMetadata,
  ThemeColors 
} from '@/types/theme';

// ========== FONT CONFIGURATION ==========
export const FONT_OPTIONS: FontOption[] = [
  { value: 'system-ui', label: 'System Font' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Merriweather', label: 'Merriweather' }
];

// ========== ALL THEMES CONFIG ==========
export const THEMES_CONFIG: ThemeConfigWithMetadata = {
  // Professional Themes
  'professional-blue': {
    name: 'Professional Blue',
    category: 'professional',
    icon: '💼',
    description: 'Corporate blue theme for professional websites',
    primary: '#2563EB',
    secondary: '#1E40AF',
    background: '#FFFFFF',
    surface: '#F0F7FF',
    text: {
      primary: '#1E293B',
      secondary: '#475569',
      accent: '#FFFFFF'
    },
    border: '#CBD5E1',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    shadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
    dark: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      background: '#0F172A',
      surface: '#1E293B',
      text: {
        primary: '#F1F5F9',
        secondary: '#CBD5E1',
        accent: '#FFFFFF'
      },
      border: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
    }
  },
  'corporate-green': {
    name: 'Corporate Green',
    category: 'professional',
    icon: '🏢',
    description: 'Green theme for corporate websites',
    primary: '#059669',
    secondary: '#047857',
    background: '#FFFFFF',
    surface: '#F0FDF4',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      accent: '#FFFFFF'
    },
    border: '#D1D5DB',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    shadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
    dark: {
      primary: '#10B981',
      secondary: '#34D399',
      background: '#0F172A',
      surface: '#1E293B',
      text: {
        primary: '#F1F5F9',
        secondary: '#CBD5E1',
        accent: '#FFFFFF'
      },
      border: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
    }
  },
  'premium-purple': {
    name: 'Premium Purple',
    category: 'premium',
    icon: '🎯',
    description: 'Luxury purple theme',
    primary: '#7C3AED',
    secondary: '#6D28D9',
    background: '#FFFFFF',
    surface: '#FAF5FF',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      accent: '#FFFFFF'
    },
    border: '#E5E7EB',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    shadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
    dark: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      background: '#0F172A',
      surface: '#1E293B',
      text: {
        primary: '#F1F5F9',
        secondary: '#CBD5E1',
        accent: '#FFFFFF'
      },
      border: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
    }
  },
  'luxury-gold': {
    name: 'Luxury Gold',
    category: 'premium',
    icon: '⭐',
    description: 'Premium gold theme for luxury brands',
    primary: '#D97706',
    secondary: '#B45309',
    background: '#1F2937',
    surface: '#374151',
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      accent: '#1F2937'
    },
    border: '#4B5563',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '0 4px 12px rgba(217, 119, 6, 0.2)',
    dark: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      background: '#111827',
      surface: '#1F2937',
      text: {
        primary: '#F9FAFB',
        secondary: '#E5E7EB',
        accent: '#111827'
      },
      border: '#374151',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
    }
  },
  'minimal-gray': {
    name: 'Minimal Gray',
    category: 'minimal',
    icon: '⚫',
    description: 'Minimal and clean gray theme',
    primary: '#4B5563',
    secondary: '#374151',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      accent: '#FFFFFF'
    },
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    dark: {
      primary: '#9CA3AF',
      secondary: '#D1D5DB',
      background: '#111827',
      surface: '#1F2937',
      text: {
        primary: '#F9FAFB',
        secondary: '#E5E7EB',
        accent: '#FFFFFF'
      },
      border: '#374151',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    }
  },
  'tech-cyan': {
    name: 'Tech Cyan',
    category: 'tech',
    icon: '🔷',
    description: 'Modern tech theme with cyan colors',
    primary: '#06B6D4',
    secondary: '#0891B2',
    background: '#0F172A',
    surface: '#1E293B',
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      accent: '#0F172A'
    },
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '0 4px 12px rgba(6, 182, 212, 0.2)',
    dark: {
      primary: '#22D3EE',
      secondary: '#67E8F9',
      background: '#020617',
      surface: '#0F172A',
      text: {
        primary: '#F8FAFC',
        secondary: '#E2E8F0',
        accent: '#020617'
      },
      border: '#1E293B',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(34, 211, 238, 0.2)'
    }
  },
  'nature-green': {
    name: 'Nature Green',
    category: 'nature',
    icon: '🌿',
    description: 'Fresh nature inspired theme',
    primary: '#10B981',
    secondary: '#059669',
    background: '#FFFFFF',
    surface: '#F0FDF4',
    text: {
      primary: '#064E3B',
      secondary: '#047857',
      accent: '#FFFFFF'
    },
    border: '#A7F3D0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
    dark: {
      primary: '#10B981',
      secondary: '#34D399',
      background: '#022C22',
      surface: '#064E3B',
      text: {
        primary: '#D1FAE5',
        secondary: '#A7F3D0',
        accent: '#022C22'
      },
      border: '#047857',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
    }
  },
  'ocean-blue': {
    name: 'Ocean Blue',
    category: 'nature',
    icon: '🌊',
    description: 'Deep ocean blue theme',
    primary: '#0EA5E9',
    secondary: '#0284C7',
    background: '#F0F9FF',
    surface: '#E0F2FE',
    text: {
      primary: '#0C4A6E',
      secondary: '#0369A1',
      accent: '#FFFFFF'
    },
    border: '#BAE6FD',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
    dark: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      background: '#082F49',
      surface: '#0C4A6E',
      text: {
        primary: '#E0F2FE',
        secondary: '#BAE6FD',
        accent: '#082F49'
      },
      border: '#0369A1',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(14, 165, 233, 0.2)'
    }
  },
  'sunset-orange': {
    name: 'Sunset Orange',
    category: 'creative',
    icon: '🌅',
    description: 'Warm sunset colors',
    primary: '#F97316',
    secondary: '#EA580C',
    background: '#FFF7ED',
    surface: '#FFEDD5',
    text: {
      primary: '#7C2D12',
      secondary: '#9A3412',
      accent: '#FFFFFF'
    },
    border: '#FDBA74',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
    dark: {
      primary: '#F97316',
      secondary: '#EA580C',
      background: '#431407',
      surface: '#7C2D12',
      text: {
        primary: '#FFEDD5',
        secondary: '#FDBA74',
        accent: '#431407'
      },
      border: '#9A3412',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(249, 115, 22, 0.2)'
    }
  },
  'midnight-purple': {
    name: 'Midnight Purple',
    category: 'creative',
    icon: '🌙',
    description: 'Dark purple theme',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    background: '#1E1B4B',
    surface: '#2E2B57',
    text: {
      primary: '#E0E7FF',
      secondary: '#C7D2FE',
      accent: '#1E1B4B'
    },
    border: '#4F46E5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
    dark: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      background: '#0F0F23',
      surface: '#1E1B4B',
      text: {
        primary: '#E0E7FF',
        secondary: '#C7D2FE',
        accent: '#0F0F23'
      },
      border: '#4F46E5',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
    }
  },
  'rose-pink': {
    name: 'Rose Pink',
    category: 'creative',
    icon: '🌹',
    description: 'Soft pink theme',
    primary: '#F472B6',
    secondary: '#EC4899',
    background: '#FFF1F2',
    surface: '#FCE7F3',
    text: {
      primary: '#881337',
      secondary: '#9F1239',
      accent: '#FFFFFF'
    },
    border: '#FBCFE8',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '0 4px 12px rgba(244, 114, 182, 0.15)',
    dark: {
      primary: '#F472B6',
      secondary: '#EC4899',
      background: '#4C0519',
      surface: '#831843',
      text: {
        primary: '#FCE7F3',
        secondary: '#FBCFE8',
        accent: '#4C0519'
      },
      border: '#BE185D',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(244, 114, 182, 0.2)'
    }
  },
  'vibrant-red': {
    name: 'Vibrant Red',
    category: 'creative',
    icon: '❤️',
    description: 'Bold and energetic red theme',
    primary: '#DC2626',
    secondary: '#B91C1C',
    background: '#FFFFFF',
    surface: '#FEF2F2',
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      accent: '#FFFFFF'
    },
    border: '#FCA5A5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#DC2626',
    shadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
    dark: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      background: '#1C1917',
      surface: '#292524',
      text: {
        primary: '#F9FAFB',
        secondary: '#E5E7EB',
        accent: '#1C1917'
      },
      border: '#7F1D1D',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
    }
  },
  'cool-teal': {
    name: 'Cool Teal',
    category: 'tech',
    icon: '💎',
    description: 'Modern teal theme for tech websites',
    primary: '#0D9488',
    secondary: '#0F766E',
    background: '#FFFFFF',
    surface: '#F0FDFA',
    text: {
      primary: '#134E4A',
      secondary: '#0F766E',
      accent: '#FFFFFF'
    },
    border: '#99F6E4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#DC2626',
    shadow: '0 4px 12px rgba(13, 148, 136, 0.15)',
    dark: {
      primary: '#0D9488',
      secondary: '#0F766E',
      background: '#042F2E',
      surface: '#0D4C48',
      text: {
        primary: '#CCFBF1',
        secondary: '#99F6E4',
        accent: '#042F2E'
      },
      border: '#115E59',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
    }
  }
};

// ========== THEME CATEGORIES ==========
export const THEME_CATEGORIES = {
  professional: 'Professional Themes',
  premium: 'Premium Themes',
  minimal: 'Minimal Themes',
  tech: 'Tech Themes',
  nature: 'Nature Themes',
  creative: 'Creative Themes'
};

// ========== UTILITY FUNCTIONS ==========
export const getThemeList = (): ThemeOption[] => {
  return Object.entries(THEMES_CONFIG).map(([key, config]) => ({
    value: key as Theme,
    label: config.name,
    category: config.category,
    icon: config.icon,
    description: config.description
  }));
};

export const getThemeColors = (theme: Theme, isDarkMode: boolean): ThemeWithMetadata => {
  const themeConfig = THEMES_CONFIG[theme];
  if (!themeConfig) return THEMES_CONFIG['professional-blue'];
  
  if (isDarkMode && themeConfig.dark) {
    return {
      ...themeConfig,
      ...themeConfig.dark
    };
  }
  
  return themeConfig;
};

export const getAvailableThemes = (): ThemeOption[] => {
  return getThemeList();
};

export const getThemeCategories = () => {
  const categories = new Set<string>();
  getThemeList().forEach(theme => categories.add(theme.category));
  return Array.from(categories).map(category => ({
    id: category,
    name: THEME_CATEGORIES[category as keyof typeof THEME_CATEGORIES] || category
  }));
};

// ========== LEGACY SUPPORT ==========
const getLegacyThemes = () => {
  const legacyThemes: Record<string, ThemeColors> = {};
  const legacyDarkThemes: Record<string, Partial<ThemeColors>> = {};
  
  Object.entries(THEMES_CONFIG).forEach(([key, config]) => {
    const { name, category, icon, description, dark, ...lightColors } = config;
    legacyThemes[key] = lightColors;
    
    if (dark) {
      legacyDarkThemes[key] = dark;
    }
  });
  
  return { themes: legacyThemes, darkThemes: legacyDarkThemes };
};

export const { themes, darkThemes } = getLegacyThemes();
EOF

echo "✓ Created components/theme/config/themeConfig.ts"

# ========================================
# 3. Theme Context
# ========================================

cat > "$PROJECT_ROOT/components/theme/contexts/ThemeContext.tsx" << 'EOF'
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

// Default theme
const defaultTheme: Theme = 'professional-blue';

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
EOF

echo "✓ Created components/theme/contexts/ThemeContext.tsx"

# ========================================
# 4. Theme Provider Wrapper
# ========================================

cat > "$PROJECT_ROOT/components/theme/providers/ThemeProviderWrapper.tsx" << 'EOF'
'use client';

import React from 'react';
import { ThemeProvider } from '@/components/theme/contexts/ThemeContext';

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
EOF

echo "✓ Created components/theme/providers/ThemeProviderWrapper.tsx"

# ========================================
# 5. Theme Settings Button (Main Component)
# ========================================

cat > "$PROJECT_ROOT/components/theme/ui/ThemeSettingsButton.tsx" << 'EOF'
'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { 
  Palette, 
  Type, 
  Moon, 
  Sun,
  X,
  Settings,
  ChevronRight,
  Check
} from 'lucide-react';

const ThemeSettingsButton = () => {
  const { 
    theme, 
    setTheme, 
    availableThemes, 
    availableFonts, 
    fontFamily, 
    setFontFamily,
    isDarkMode,
    toggleDarkMode
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<'main' | 'themes' | 'fonts'>('main');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Main Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        title="Theme Settings"
        style={{
          background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
          color: 'var(--text-accent)',
          border: '2px solid var(--border)'
        }}
      >
        <Settings className="h-6 w-6" />
      </button>

      {/* Side Menu Modal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-1000"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Side Menu */}
          <div 
            className="fixed top-0 right-0 h-full w-80 z-1001 transform transition-transform duration-300 ease-out"
            style={{ 
              transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
              backgroundColor: 'var(--background)',
              borderLeft: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Theme Settings
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ 
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface)'
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
              {/* Main Menu */}
              {activeSection === 'main' && (
                <div className="space-y-3">
                  {/* Dark/Light Mode Toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className="w-full p-4 rounded-lg flex items-center justify-between transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text-accent)' }}>
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm opacity-75">
                          {isDarkMode ? 'Currently on' : 'Currently off'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-10 h-6 rounded-full flex items-center p-1 ${isDarkMode ? 'justify-end' : 'justify-start'}`}
                        style={{ backgroundColor: isDarkMode ? 'var(--primary)' : 'var(--border)' }}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--background)' }}></div>
                      </div>
                    </div>
                  </button>

                  {/* Themes Option */}
                  <button
                    onClick={() => setActiveSection('themes')}
                    className="w-full p-4 rounded-lg flex items-center justify-between transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text-accent)' }}>
                        <Palette className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Themes</div>
                        <div className="text-sm opacity-75">
                          {availableThemes.find(t => t.value === theme)?.label || 'Select theme'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-75" />
                  </button>

                  {/* Fonts Option */}
                  <button
                    onClick={() => setActiveSection('fonts')}
                    className="w-full p-4 rounded-lg flex items-center justify-between transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--success)', color: 'var(--text-accent)' }}>
                        <Type className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Fonts</div>
                        <div className="text-sm opacity-75">
                          {availableFonts.find(f => f.value === fontFamily)?.label || 'Select font'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-75" />
                  </button>
                </div>
              )}

              {/* Themes Section */}
              {activeSection === 'themes' && (
                <div>
                  {/* Back Button */}
                  <button
                    onClick={() => setActiveSection('main')}
                    className="mb-4 flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                  >
                    ← Back to Settings
                  </button>

                  <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Select Theme
                  </h4>

                  <div className="space-y-3">
                    {availableThemes.map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => {
                          setTheme(themeOption.value);
                          setActiveSection('main');
                        }}
                        className={`w-full p-4 rounded-lg flex items-center justify-between transition-all ${theme === themeOption.value ? 'border-2' : 'border hover:border-2'}`}
                        style={{ 
                          backgroundColor: theme === themeOption.value ? 'var(--surface)' : 'var(--background)',
                          borderColor: theme === themeOption.value ? 'var(--primary)' : 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full border-2"
                            style={{ 
                              borderColor: 'var(--background)',
                              background: `linear-gradient(135deg, ${
                                themeOption.value.includes('blue') ? '#2563EB' : 
                                themeOption.value.includes('green') ? '#059669' : 
                                themeOption.value.includes('purple') ? '#7C3AED' : 
                                themeOption.value.includes('gold') ? '#D97706' : 
                                themeOption.value.includes('gray') ? '#4B5563' : '#06B6D4'
                              }, ${
                                themeOption.value.includes('blue') ? '#1E40AF' : 
                                themeOption.value.includes('green') ? '#047857' : 
                                themeOption.value.includes('purple') ? '#6D28D9' : 
                                themeOption.value.includes('gold') ? '#B45309' : 
                                themeOption.value.includes('gray') ? '#374151' : '#0891B2'
                              })` 
                            }}
                          />
                          <div className="text-left">
                            <div className="font-medium">
                              {themeOption.label}
                            </div>
                            <div className="text-xs opacity-75">
                              {themeOption.category === 'professional' ? 'Professional' : 
                               themeOption.category === 'premium' ? 'Premium' : 
                               themeOption.category === 'minimal' ? 'Minimal' : 
                               themeOption.category === 'tech' ? 'Tech' :
                               themeOption.category === 'nature' ? 'Nature' : 'Creative'}
                            </div>
                          </div>
                        </div>
                        {theme === themeOption.value && (
                          <Check className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fonts Section */}
              {activeSection === 'fonts' && (
                <div>
                  {/* Back Button */}
                  <button
                    onClick={() => setActiveSection('main')}
                    className="mb-4 flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                  >
                    ← Back to Settings
                  </button>

                  <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Select Font Family
                  </h4>

                  <div className="space-y-3">
                    {availableFonts.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => {
                          setFontFamily(font.value);
                          setActiveSection('main');
                        }}
                        className={`w-full p-4 rounded-lg flex items-center justify-between transition-all ${fontFamily === font.value ? 'border-2' : 'border hover:border-2'}`}
                        style={{ 
                          fontFamily: font.value,
                          backgroundColor: fontFamily === font.value ? 'var(--surface)' : 'var(--background)',
                          borderColor: fontFamily === font.value ? 'var(--primary)' : 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <div className="text-left flex-1">
                          <div className="font-medium">
                            {font.label}
                          </div>
                          <div 
                            className="text-xs mt-1 opacity-75" 
                            style={{ 
                              fontFamily: font.value
                            }}
                          >
                            The quick brown fox jumps over the lazy dog
                          </div>
                        </div>
                        {fontFamily === font.value && (
                          <Check className="h-5 w-5 ml-2" style={{ color: 'var(--primary)' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ThemeSettingsButton;
EOF

echo "✓ Created components/theme/ui/ThemeSettingsButton.tsx"

# ========================================
# 6. Dark Mode Toggle
# ========================================

cat > "$PROJECT_ROOT/components/theme/ui/DarkModeToggle.tsx" << 'EOF'
'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)'
      }}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default DarkModeToggle;
EOF

echo "✓ Created components/theme/ui/DarkModeToggle.tsx"

# ========================================
# 7. Theme Info Component
# ========================================

cat > "$PROJECT_ROOT/components/theme/ui/ThemeInfo.tsx" << 'EOF'
'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function ThemeInfo() {
  const { theme, isDarkMode, fontFamily } = useTheme();

  return (
    <div className="fixed top-4 left-4 z-50 px-3 py-2 rounded-lg text-sm shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <span className="font-medium">Theme:</span>
        <span className="capitalize">{theme.replace('-', ' ')}</span>
        <span className="mx-1 opacity-50">|</span>
        <span className="font-medium">Mode:</span>
        <span>{isDarkMode ? 'Dark' : 'Light'}</span>
        <span className="mx-1 opacity-50">|</span>
        <span className="font-medium">Font:</span>
        <span style={{ fontFamily }}>{fontFamily}</span>
      </div>
    </div>
  );
}
EOF

echo "✓ Created components/theme/ui/ThemeInfo.tsx"

# ========================================
# 8. Theme Utilities CSS
# ========================================

cat > "$PROJECT_ROOT/components/theme/css/theme-utilities.css" << 'EOF'
/* Theme CSS Variables */
:root {
  /* Default light theme variables */
  --primary: #2563EB;
  --secondary: #1E40AF;
  --background: #FFFFFF;
  --surface: #F0F7FF;
  --text-primary: #1E293B;
  --text-secondary: #475569;
  --text-accent: #FFFFFF;
  --border: #CBD5E1;
  --success: #059669;
  --warning: #D97706;
  --error: #DC2626;
  --shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  --font-family: system-ui;
}

/* Dark mode variables */
.dark {
  --primary: #3B82F6;
  --secondary: #60A5FA;
  --background: #0F172A;
  --surface: #1E293B;
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;
  --text-accent: #FFFFFF;
  --border: #334155;
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* Theme utilities */
.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Modal styles */
.theme-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.theme-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  z-index: 1001;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow);
}

.font-modal {
  min-width: 400px;
}

.theme-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.theme-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: var(--surface);
}

/* Font options */
.font-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.font-option {
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--background);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.font-option:hover {
  border-color: var(--primary);
  background: var(--surface);
}

.font-option.active {
  border-color: var(--primary);
  background: var(--surface);
}

.font-preview {
  font-size: 0.75rem;
  margin-top: 8px;
  opacity: 0.7;
  line-height: 1.2;
}

/* Floating buttons */
.floating-theme-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.font-selector-btn {
  bottom: 88px;
}

.dark-mode-toggle {
  bottom: 152px;
}

.floating-theme-btn:hover {
  transform: scale(1.1);
}

.floating-theme-btn:active {
  transform: scale(0.95);
}

/* Prevent dark reader interference */
[data-darkreader-inline-bgcolor],
[data-darkreader-inline-bgimage],
[data-darkreader-inline-color],
[data-darkreader-inline-stroke],
[data-darkreader-inline-fill] {
  all: unset !important;
}

html[data-darkreader-mode],
html[data-darkreader-scheme] {
  --darkreader-bg--surface: unset !important;
  --darkreader-text--primary: unset !important;
  --darkreader-text--secondary: unset !important;
}
EOF

echo "✓ Created components/theme/css/theme-utilities.css"

# ========================================
# 9. Theme Index Export
# ========================================

cat > "$PROJECT_ROOT/components/theme/index.ts" << 'EOF'
// Theme Context
export { ThemeProvider, useTheme } from './contexts/ThemeContext';
export { default as ThemeProviderWrapper } from './providers/ThemeProviderWrapper';

// Theme Config
export { THEMES_CONFIG, FONT_OPTIONS, getAvailableThemes } from './config/themeConfig';

// UI Components
export { default as ThemeSettingsButton } from './ui/ThemeSettingsButton';
export { default as DarkModeToggle } from './ui/DarkModeToggle';
export { default as FontSelector } from './ui/FontSelector';
export { default as ThemeSelector } from './ui/ThemeSelector';
export { default as ThemeInfo } from './ui/ThemeInfo';

// CSS
import './css/theme-utilities.css';
EOF

echo "✓ Created components/theme/index.ts"

# ========================================
# 10. Font Selector Component
# ========================================

cat > "$PROJECT_ROOT/components/theme/ui/FontSelector.tsx" << 'EOF'
'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Type } from 'lucide-react';

const IconClose = () => <span>✕</span>;

const FontSelector = () => {
  const { fontFamily, setFontFamily, availableFonts } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Font Selector Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        title="Change Font"
        style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)'
        }}
      >
        <Type className="h-5 w-5" />
      </button>

      {/* Font Modal */}
      {isOpen && (
        <div className="theme-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="theme-modal font-modal" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <h3>Select Font Family</h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <IconClose />
              </button>
            </div>

            <div className="font-options">
              {availableFonts.map((font) => (
                <button
                  key={font.value}
                  onClick={() => {
                    setFontFamily(font.value);
                    setIsOpen(false);
                  }}
                  className={`font-option ${fontFamily === font.value ? 'active' : ''}`}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                  <div className="font-preview" style={{ fontFamily: font.value }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FontSelector;
EOF

echo "✓ Created components/theme/ui/FontSelector.tsx"

# ========================================
# 11. Theme Selector Component
# ========================================

cat > "$PROJECT_ROOT/components/theme/ui/ThemeSelector.tsx" << 'EOF'
'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

const IconClose = () => <span>✕</span>;

const ThemeSelector = () => {
  const { theme, setTheme, availableThemes, availableFonts, fontFamily, setFontFamily } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'themes' | 'fonts'>('themes');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Theme Selector Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        title="Change Theme & Font"
        style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)'
        }}
      >
        <Palette className="h-5 w-5" />
      </button>

      {/* Theme Modal */}
      {isOpen && (
        <div className="theme-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="theme-modal font-modal" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <h3>Theme Settings</h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <IconClose />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setSelectedTab('themes')}
                className={`flex-1 py-3 font-medium text-sm ${selectedTab === 'themes' ? 'border-b-2' : 'opacity-70'}`}
                style={{ 
                  color: selectedTab === 'themes' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderColor: selectedTab === 'themes' ? 'var(--primary)' : 'transparent'
                }}
              >
                Themes
              </button>
              <button
                onClick={() => setSelectedTab('fonts')}
                className={`flex-1 py-3 font-medium text-sm ${selectedTab === 'fonts' ? 'border-b-2' : 'opacity-70'}`}
                style={{ 
                  color: selectedTab === 'fonts' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderColor: selectedTab === 'fonts' ? 'var(--primary)' : 'transparent'
                }}
              >
                Fonts
              </button>
            </div>

            {/* Themes Tab Content */}
            {selectedTab === 'themes' && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Select a color theme for your interface
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableThemes.map((themeOption) => (
                    <button
                      key={themeOption.value}
                      onClick={() => {
                        setTheme(themeOption.value);
                        setIsOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        theme === themeOption.value 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary'
                      }`}
                      style={{
                        backgroundColor: theme === themeOption.value ? 'var(--surface)' : 'var(--background)',
                        borderColor: theme === themeOption.value ? 'var(--primary)' : 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full mb-2 border"
                        style={{ 
                          borderColor: 'var(--border)',
                          background: `linear-gradient(135deg, ${themeOption.value.includes('blue') ? '#2563EB' : 
                            themeOption.value.includes('green') ? '#059669' : 
                            themeOption.value.includes('purple') ? '#7C3AED' : 
                            themeOption.value.includes('gold') ? '#D97706' : 
                            themeOption.value.includes('gray') ? '#4B5563' : '#06B6D4'}, ${
                            themeOption.value.includes('blue') ? '#1E40AF' : 
                            themeOption.value.includes('green') ? '#047857' : 
                            themeOption.value.includes('purple') ? '#6D28D9' : 
                            themeOption.value.includes('gold') ? '#B45309' : 
                            themeOption.value.includes('gray') ? '#374151' : '#0891B2'
                          })` 
                        }}
                      />
                      <span className="text-xs font-medium mt-1">
                        {themeOption.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fonts Tab Content */}
            {selectedTab === 'fonts' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Choose a font family for better readability
                  </p>
                </div>
                
                <div className="font-options">
                  {availableFonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => {
                        setFontFamily(font.value);
                        setIsOpen(false);
                      }}
                      className={`font-option ${fontFamily === font.value ? 'active' : ''}`}
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                      <div className="font-preview" style={{ fontFamily: font.value }}>
                        The quick brown fox jumps over the lazy dog
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeSelector;
EOF

echo "✓ Created components/theme/ui/ThemeSelector.tsx"

# ========================================
# 12. Global Styles
# ========================================

cat > "$PROJECT_ROOT/styles/globals.css" << 'EOF'
@import "tailwindcss";
@import "../components/theme/css/theme-utilities.css";

/* Base styles with theme variables */
body {
  background: var(--background);
  color: var(--text-primary);
  font-family: var(--font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Selection color */
::selection {
  background-color: var(--primary);
  color: var(--text-accent);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--surface);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}

/* Smooth transitions for theme changes */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Utility classes */
.theme-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  color: var(--text-primary);
}

.theme-button {
  background: var(--primary);
  color: var(--text-accent);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.theme-button:hover {
  opacity: 0.9;
}

.theme-button:active {
  opacity: 0.8;
}

/* Loading animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
EOF

echo "✓ Created styles/globals.css"

# ========================================
# 13. Main Layout Component
# ========================================

cat > "$PROJECT_ROOT/app/layout.tsx" << 'EOF'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import ThemeProviderWrapper from '@/components/theme/providers/ThemeProviderWrapper';
import ThemeSettingsButton from '@/components/theme/ui/ThemeSettingsButton';
import DarkModeToggle from '@/components/theme/ui/DarkModeToggle';
import FontSelector from '@/components/theme/ui/FontSelector';
import ThemeInfo from '@/components/theme/ui/ThemeInfo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'English Communities PK',
  description: 'A dynamic community platform for English speakers in Pakistan',
  keywords: ['english', 'community', 'pakistan', 'learning', 'education'],
  authors: [{ name: 'English Communities PK' }],
  creator: 'English Communities PK',
  publisher: 'English Communities PK',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563EB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563EB" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} theme-transition`}>
        <ThemeProviderWrapper>
          {children}
          <ThemeSettingsButton />
          <DarkModeToggle />
          <FontSelector />
          <ThemeInfo />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
EOF

echo "✓ Created app/layout.tsx"

# ========================================
# 14. Home Page
# ========================================

cat > "$PROJECT_ROOT/app/page.tsx" << 'EOF'
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
EOF

echo "✓ Created app/page.tsx"

# ========================================
# 15. Package.json Update (Add Dependencies)
# ========================================

cat > "$PROJECT_ROOT/package-update.json" << 'EOF'
{
  "name": "english.communities.pk",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  },
  "dependencies": {
    "next": "16.0.10",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.10",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
EOF

echo "✓ Created package-update.json with lucide-react"

# ========================================
# 16. TypeScript Config
# ========================================

cat > "$PROJECT_ROOT/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

echo "✓ Created tsconfig.json"

# ========================================
# 17. Next.js Config
# ========================================

cat > "$PROJECT_ROOT/next.config.ts" << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
EOF

echo "✓ Created next.config.ts"

# ========================================
# 18. Tailwind Config
# ========================================

cat > "$PROJECT_ROOT/tailwind.config.ts" << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-accent': 'var(--text-accent)',
      },
      boxShadow: {
        'theme': 'var(--shadow)',
      },
      fontFamily: {
        'theme': 'var(--font-family)',
      },
      animation: {
        'theme-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      zIndex: {
        '1000': '1000',
        '1001': '1001',
        '1002': '1002',
      },
    },
  },
  plugins: [],
}
export default config
EOF

echo "✓ Created tailwind.config.ts"

# ========================================
# 19. PostCSS Config
# ========================================

cat > "$PROJECT_ROOT/postcss.config.ts" << 'EOF'
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
EOF

echo "✓ Created postcss.config.ts"

# ========================================
# 20. Instructions File
# ========================================

cat > "$PROJECT_ROOT/PHASE1_INSTRUCTIONS.md" << 'EOF'
# Phase 1: Theme System Implementation ✅

## What's Been Created
1. **Complete Theme System** with 14+ dynamic themes
2. **Hybrid Architecture** (Client & Server components)
3. **Fully Responsive** design
4. **Persistent Storage** (localStorage)
5. **Dark/Light Mode** toggle
6. **Font Selector** with 10+ font options
7. **Theme Selector** with categorized themes
8. **Dynamic CSS Variables** system
9. **TypeScript** support with full type safety
10. **SEO Optimized** structure

## Files Structure