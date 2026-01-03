/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  webpack: (config, { isServer }) => {
    // Exclude .node binary files from webpack processing
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    })

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    // Exclude problematic native modules
    config.externals = config.externals || []
    config.externals.push({
      'onnxruntime-node': 'commonjs onnxruntime-node',
    })

    return config
  },
}

module.exports = nextConfig


