import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow the local public/ folder logo to be served by next/image
    formats: ["image/webp", "image/avif"],
  },
  // The dev SQLite file (and its WAL/journal siblings) change on every
  // Prisma write. Without excluding them, the dev server's file watcher
  // treats each write as a source change and triggers a Fast Refresh
  // rebuild mid-request — slow, and occasionally aborts an in-flight
  // navigation. None of this affects production (no filesystem watching).
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules/**", "**/prisma/dev.db*"],
    };
    return config;
  },
};

export default nextConfig;
