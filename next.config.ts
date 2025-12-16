// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remove swcMinify as it's deprecated in Next.js 13+
  // swcMinify: true, // REMOVE THIS LINE
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