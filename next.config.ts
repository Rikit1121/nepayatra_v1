import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['maplibre-gl'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    typedRoutes: false,
  },
}

export default nextConfig
