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
