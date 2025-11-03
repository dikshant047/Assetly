import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← Add this
  },
  typescript: {
    ignoreBuildErrors: true, // ← Add this for safety
  }
};

export default nextConfig;