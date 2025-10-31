import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimasi untuk production
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Build optimizations
  typescript: {
    ignoreBuildErrors: false, // Perbaiki untuk production
  },
  
  eslint: {
    ignoreDuringBuilds: false, // Perbaiki untuk production
  },
};

export default nextConfig;
