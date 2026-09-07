/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: { allowedOrigins: ["*"] } }
};
module.exports = nextConfig; // Dev server refreshed

