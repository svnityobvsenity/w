/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  output: 'standalone',
  poweredByHeader: false,
  
  // Disable telemetry
  telemetry: false,
  
  // Optimize images
  images: {
    unoptimized: true,
    domains: ['supabase.co']
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack optimizations
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
}

module.exports = nextConfig
