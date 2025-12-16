// File 48: config/theme.config.ts
/**
 * Theme configuration for English Communities PK
 * Supports 14 themes with light/dark modes
 */

export interface ThemeColor {
  light: string;
  dark: string;
}

export interface ThemeConfig {
  // Theme Settings
  defaultTheme: string;
  defaultMode: 'light' | 'dark' | 'system';
  themes: Array<{
    id: string;
    name: string;
    description: string;
    colors: {
      primary: ThemeColor;
      secondary: ThemeColor;
      accent: ThemeColor;
      background: ThemeColor;
      foreground: ThemeColor;
      card: ThemeColor;
      cardForeground: ThemeColor;
      popover: ThemeColor;
      popoverForeground: ThemeColor;
      muted: ThemeColor;
      mutedForeground: ThemeColor;
      border: ThemeColor;
      input: ThemeColor;
      ring: ThemeColor;
    };
    category: 'professional' | 'creative' | 'minimal' | 'vibrant' | 'nature';
    tags: string[];
  }>;
  
  // Color System
  colors: {
    // Brand Colors
    brand: {
      primary: ThemeColor;
      secondary: ThemeColor;
      accent: ThemeColor;
    };
    
    // Semantic Colors
    semantic: {
      success: ThemeColor;
      warning: ThemeColor;
      error: ThemeColor;
      info: ThemeColor;
    };
    
    // Grayscale
    gray: {
      50: ThemeColor;
      100: ThemeColor;
      200: ThemeColor;
      300: ThemeColor;
      400: ThemeColor;
      500: ThemeColor;
      600: ThemeColor;
      700: ThemeColor;
      800: ThemeColor;
      900: ThemeColor;
    };
  };
  
  // Typography
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
      display: string[];
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
      loose: string;
    };
  };
  
  // Spacing
  spacing: {
    unit: number;
    scale: number[];
  };
  
  // Border Radius
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  
  // Shadows
  shadows: {
    sm: ThemeColor;
    md: ThemeColor;
    lg: ThemeColor;
    xl: ThemeColor;
    '2xl': ThemeColor;
    inner: ThemeColor;
  };
  
  // Animations
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    timing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
  
  // Breakpoints
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

const themeConfig: ThemeConfig = {
  defaultTheme: 'professional-blue',
  defaultMode: 'system',
  
  themes: [
    {
      id: 'professional-blue',
      name: 'Professional Blue',
      description: 'Clean and professional blue theme for business websites',
      colors: {
        primary: { light: '#3b82f6', dark: '#60a5fa' },
        secondary: { light: '#10b981', dark: '#34d399' },
        accent: { light: '#8b5cf6', dark: '#a78bfa' },
        background: { light: '#ffffff', dark: '#0f172a' },
        foreground: { light: '#1f2937', dark: '#f8fafc' },
        card: { light: '#f9fafb', dark: '#1e293b' },
        cardForeground: { light: '#1f2937', dark: '#f1f5f9' },
        popover: { light: '#ffffff', dark: '#1e293b' },
        popoverForeground: { light: '#1f2937', dark: '#f1f5f9' },
        muted: { light: '#f3f4f6', dark: '#334155' },
        mutedForeground: { light: '#6b7280', dark: '#94a3b8' },
        border: { light: '#e5e7eb', dark: '#475569' },
        input: { light: '#ffffff', dark: '#1e293b' },
        ring: { light: '#3b82f6', dark: '#60a5fa' },
      },
      category: 'professional',
      tags: ['business', 'corporate', 'modern'],
    },
    {
      id: 'corporate-green',
      name: 'Corporate Green',
      description: 'Elegant green theme for corporate websites',
      colors: {
        primary: { light: '#059669', dark: '#34d399' },
        secondary: { light: '#3b82f6', dark: '#60a5fa' },
        accent: { light: '#d97706', dark: '#fbbf24' },
        background: { light: '#f8fafc', dark: '#0f172a' },
        foreground: { light: '#1e293b', dark: '#f1f5f9' },
        card: { light: '#ffffff', dark: '#1e293b' },
        cardForeground: { light: '#1e293b', dark: '#f1f5f9' },
        popover: { light: '#ffffff', dark: '#1e293b' },
        popoverForeground: { light: '#1e293b', dark: '#f1f5f9' },
        muted: { light: '#f1f5f9', dark: '#334155' },
        mutedForeground: { light: '#64748b', dark: '#94a3b8' },
        border: { light: '#e2e8f0', dark: '#475569' },
        input: { light: '#ffffff', dark: '#1e293b' },
        ring: { light: '#059669', dark: '#34d399' },
      },
      category: 'professional',
      tags: ['corporate', 'business', 'finance'],
    },
    {
      id: 'premium-purple',
      name: 'Premium Purple',
      description: 'Luxurious purple theme for premium products',
      colors: {
        primary: { light: '#7c3aed', dark: '#a78bfa' },
        secondary: { light: '#db2777', dark: '#f472b6' },
        accent: { light: '#f59e0b', dark: '#fbbf24' },
        background: { light: '#faf5ff', dark: '#1e1b4b' },
        foreground: { light: '#1e1b4b', dark: '#e9d5ff' },
        card: { light: '#ffffff', dark: '#312e81' },
        cardForeground: { light: '#1e1b4b', dark: '#e9d5ff' },
        popover: { light: '#ffffff', dark: '#312e81' },
        popoverForeground: { light: '#1e1b4b', dark: '#e9d5ff' },
        muted: { light: '#f3e8ff', dark: '#4c1d95' },
        mutedForeground: { light: '#7c3aed', dark: '#c4b5fd' },
        border: { light: '#e9d5ff', dark: '#5b21b6' },
        input: { light: '#ffffff', dark: '#312e81' },
        ring: { light: '#7c3aed', dark: '#a78bfa' },
      },
      category: 'vibrant',
      tags: ['premium', 'luxury', 'creative'],
    },
    // Additional themes will be defined in the theme.css file
  ],
  
  colors: {
    brand: {
      primary: { light: '#3b82f6', dark: '#60a5fa' },
      secondary: { light: '#10b981', dark: '#34d399' },
      accent: { light: '#8b5cf6', dark: '#a78bfa' },
    },
    
    semantic: {
      success: { light: '#10b981', dark: '#34d399' },
      warning: { light: '#f59e0b', dark: '#fbbf24' },
      error: { light: '#ef4444', dark: '#f87171' },
      info: { light: '#3b82f6', dark: '#60a5fa' },
    },
    
    gray: {
      50: { light: '#f9fafb', dark: '#111827' },
      100: { light: '#f3f4f6', dark: '#1f2937' },
      200: { light: '#e5e7eb', dark: '#374151' },
      300: { light: '#d1d5db', dark: '#4b5563' },
      400: { light: '#9ca3af', dark: '#6b7280' },
      500: { light: '#6b7280', dark: '#9ca3af' },
      600: { light: '#4b5563', dark: '#d1d5db' },
      700: { light: '#374151', dark: '#e5e7eb' },
      800: { light: '#1f2937', dark: '#f3f4f6' },
      900: { light: '#111827', dark: '#f9fafb' },
    },
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'Cambria', 'serif'],
      mono: ['Monaco', 'Cascadia Code', 'monospace'],
      display: ['Poppins', 'Inter', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
  },
  
  spacing: {
    unit: 4,
    scale: [0, 0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: { light: '0 1px 2px 0 rgb(0 0 0 / 0.05)', dark: '0 1px 2px 0 rgb(0 0 0 / 0.3)' },
    md: { light: '0 4px 6px -1px rgb(0 0 0 / 0.1)', dark: '0 4px 6px -1px rgb(0 0 0 / 0.3)' },
    lg: { light: '0 10px 15px -3px rgb(0 0 0 / 0.1)', dark: '0 10px 15px -3px rgb(0 0 0 / 0.3)' },
    xl: { light: '0 20px 25px -5px rgb(0 0 0 / 0.1)', dark: '0 20px 25px -5px rgb(0 0 0 / 0.3)' },
    '2xl': { light: '0 25px 50px -12px rgb(0 0 0 / 0.25)', dark: '0 25px 50px -12px rgb(0 0 0 / 0.4)' },
    inner: { light: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)', dark: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)' },
  },
  
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    timing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default themeConfig;