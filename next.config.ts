import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      // Product images. Missing here, every product detail page 500s during SSR.
      { protocol: 'https', hostname: 'todaywegrind.com' },
    ],
  },
};

export default nextConfig;
