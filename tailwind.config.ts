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
        'sun-rise': 'sunRise 0.5s ease-out',
        'moon-rise': 'moonRise 0.5s ease-out',
      },
      keyframes: {
        sunRise: {
          '0%': { transform: 'translateY(100%) rotate(0deg)' },
          '100%': { transform: 'translateY(0) rotate(360deg)' },
        },
        moonRise: {
          '0%': { transform: 'translateY(-100%) rotate(0deg)' },
          '100%': { transform: 'translateY(0) rotate(360deg)' },
        },
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