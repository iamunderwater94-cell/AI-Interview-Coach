/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: 'https://ai-interview-coach-22ab0.firebaseapp.com/__/auth/:path*',
      },
    ]
  },
}

module.exports = nextConfig
