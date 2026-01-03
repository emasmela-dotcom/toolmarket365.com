/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  webpack: (config, { isServer }) => {
    // Explicitly exclude problematic packages from bundling
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@xenova/transformers': false,
        'onnxruntime-node': false,
      }
    }

    // Exclude .node files from processing
    config.module.rules.push({
      test: /\.node$/,
      use: 'null-loader',
    })

    return config
  },
}

module.exports = nextConfig


