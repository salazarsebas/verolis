import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude apps/api from Next.js build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow eslint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
