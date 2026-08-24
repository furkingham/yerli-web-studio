/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.milwaukee.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.milwaukeetool.eu', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i.imgur.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
    ],
    unoptimized: false,
  },
};

module.exports = nextConfig;
