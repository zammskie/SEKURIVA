import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  agentRules: false,
  experimental: {
    // OneDrive cloud files can time out while Turbopack restores its persisted dev cache.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
