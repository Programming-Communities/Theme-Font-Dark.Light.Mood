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
  themeColor: '#194375',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#194375" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} theme-transition`}>
        <ThemeProviderWrapper>
          {children}
          
          {/* 3 FLOATING BUTTONS (Bottom Right Corner) */}
          {/* 1. Theme Settings Button (Bottom) */}
          <ThemeSettingsButton />
          
          {/* 2. Font Selector Button (Middle) */}
          <FontSelector />
          
          {/* 3. Dark/Light Mode Toggle (Top) */}
          <DarkModeToggle />
          
          {/* Theme Info Display (Top Left) */}
          <ThemeInfo />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}