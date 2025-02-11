/** @type {import('next').NextConfig} */
const nextConfig = {
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
