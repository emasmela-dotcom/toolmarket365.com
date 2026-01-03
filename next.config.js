const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  webpack: (config, { isServer }) => {
    // Use IgnorePlugin to completely ignore these packages
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@xenova\/transformers$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^onnxruntime-node$/,
      })
    )

    // Ignore .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    })

    return config
  },
}

module.exports = nextConfig


