import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Providers from '@/components/providers/Providers';
import Header from '@/components/layout/Header/Header';
import ThemeSettingsButton from '@/components/theme/ui/ThemeSettingsButton';
import DarkModeToggle from '@/components/theme/ui/DarkModeToggle';
import FontSelector from '@/components/theme/ui/FontSelector';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'English Communities PK - Dynamic Platform',
  description: 'A dynamic community platform for English speakers in Pakistan with WordPress integration, theme system, and interactive features',
  keywords: ['english', 'community', 'pakistan', 'learning', 'education', 'blog', 'wordpress'],
  authors: [{ name: 'English Communities PK' }],
  creator: 'English Communities PK',
  publisher: 'English Communities PK',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563EB' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://english.communities.pk',
    title: 'English Communities PK',
    description: 'Dynamic community platform for English speakers in Pakistan',
    siteName: 'English Communities PK',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'English Communities PK',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English Communities PK',
    description: 'Dynamic community platform for English speakers in Pakistan',
    images: ['/twitter-image.png'],
    creator: '@englishcommunitiespk',
  },
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} theme-transition`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            {/* Theme Controls */}
            <ThemeSettingsButton />
            <DarkModeToggle />
            <FontSelector />
          </div>
        </Providers>
      </body>
    </html>
  );
}
