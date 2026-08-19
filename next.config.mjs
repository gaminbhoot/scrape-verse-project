/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // better-sqlite3 is a native addon — must not be bundled, and must be external on server
  serverExternalPackages: ['better-sqlite3'],
  // Ensure API routes that use sqlite are not statically optimized
  experimental: {
    // keep for Next 15 compatibility
  },
};

export default nextConfig;
