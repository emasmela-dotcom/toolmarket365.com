/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  webpack: (config, { isServer }) => {
    // Fix for @xenova/transformers
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    
    // Ignore node modules that aren't needed
    config.externals = config.externals || []
    config.externals.push({
      'sharp': 'commonjs sharp',
      'canvas': 'commonjs canvas',
    })

    return config
  },
}

module.exports = nextConfig


