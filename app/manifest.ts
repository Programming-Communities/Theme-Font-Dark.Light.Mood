import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'English Communities PK',
    short_name: 'EC PK',
    description: 'Dynamic community platform for English speakers in Pakistan',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#2563EB',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'social', 'news'],
    shortcuts: [
      {
        name: 'Latest Articles',
        short_name: 'Blog',
        description: 'Browse latest articles',
        url: '/blog',
        icons: [{ src: '/icons/blog-icon.png', sizes: '96x96' }],
      },
      {
        name: 'Categories',
        short_name: 'Categories',
        description: 'Explore categories',
        url: '/categories',
        icons: [{ src: '/icons/category-icon.png', sizes: '96x96' }],
      },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Desktop screenshot',
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile screenshot',
      },
    ],
  }
}
