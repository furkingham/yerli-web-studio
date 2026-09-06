/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildWorker: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.milwaukee.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.milwaukeetool.eu', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i.imgur.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'cdtmilwaukee.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'www.cdtmilwaukee.com', port: '', pathname: '/**' },
    ],
    unoptimized: false,
  },
};

module.exports = nextConfig;
