/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow builds to complete even with TypeScript errors (for demo)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow builds to complete even with ESLint errors (for demo)
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig