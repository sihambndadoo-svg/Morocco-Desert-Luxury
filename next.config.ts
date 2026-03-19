import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'player.vimeo.com' },
      { protocol: 'https', hostname: 'videos.pexels.com' },
    ],
  },
};

export default nextConfig;
