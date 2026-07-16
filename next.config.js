const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 180,
  images: {
    domains: [],
  },
  async rewrites() {
    return [{ source: '/home', destination: '/' }]
  },
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
    ]
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


