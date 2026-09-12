import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow other devices on local networks (phones, tablets over Wi-Fi / LAN) to access dev server and HMR
  allowedDevOrigins: [
    "192.168.0.100",
    "169.254.83.107",
    "192.168.56.1",
    "192.168.*.*",
    "169.254.*.*",
    "10.*.*.*",
    "localhost",
    "127.0.0.1",
    "*.local",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
