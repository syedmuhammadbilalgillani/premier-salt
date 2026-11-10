import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // proxy.ts buffers request bodies on gated routes (default 10MB); backup
  // restore and file uploads need more.
  experimental: { proxyClientMaxBodySize: "512mb" },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
