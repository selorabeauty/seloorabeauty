/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',   // required for Docker deployment
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
