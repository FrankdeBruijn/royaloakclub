import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
