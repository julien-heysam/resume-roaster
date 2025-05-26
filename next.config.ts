import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build for now
    ignoreBuildErrors: false,
  },
  serverExternalPackages: ['@prisma/client'],
  // Optimize for production
  experimental: {
    // Enable optimizations
    optimizePackageImports: ['@anthropic-ai/sdk', '@supabase/supabase-js'],
  },
  // Configure headers for better performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
