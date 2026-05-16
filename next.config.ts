import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ['192.168.2.86'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tiinckbwtmwrmmpuhfsy.supabase.co',
      },
    ],
  },
};

export default nextConfig;
