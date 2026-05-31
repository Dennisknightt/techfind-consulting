import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow the local public/ folder logo to be served by next/image
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
