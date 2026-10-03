/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',   // required for Docker deployment
  poweredByHeader: false,
  experimental: {
    // lucide-react barrel imports pull the whole icon set — this rewrites them per-icon
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
