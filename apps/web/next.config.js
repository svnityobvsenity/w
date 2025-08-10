/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable strict mode for easier development
  reactStrictMode: false,
  // Enable experimental features
  experimental: {
    appDir: true,
  },
  // Configure webpack to handle missing modules
  webpack: (config, { isServer }) => {
    // Handle missing modules gracefully
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }
    
    // Ignore specific module errors
    config.externals = config.externals || []
    if (!isServer) {
      config.externals.push({
        'ws': 'ws',
        'fs': 'fs',
        'net': 'net',
        'tls': 'tls',
      })
    }
    
    return config
  },
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Disable image optimization for faster builds
  images: {
    unoptimized: true,
  },
  // Output configuration
  output: 'standalone',
  // Disable telemetry
  telemetry: false,
}

module.exports = nextConfig
