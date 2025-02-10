/** @type {import('next').NextConfig} */
const nextConfig = {
  runtime: 'nodejs',
  experimental: {
    serverActions: false
  },
  images: {
    domains: [
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig
