const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Avoid build timeout on static page generation (e.g. _not-found); default is 60s
  staticPageGenerationTimeout: 180,
  images: {
    domains: [],
  },
  webpack: (config) => {
    // Use IgnorePlugin to completely ignore these packages
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@xenova\/transformers$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^onnxruntime-node$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /\.node$/,
      }),
      // Optional AI service packages - ignore if not installed
      new webpack.IgnorePlugin({
        resourceRegExp: /^openai$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^@anthropic-ai\/sdk$/,
      })
    )

    return config
  },
}

module.exports = nextConfig


