import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  runtime: 'nodejs',
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;

