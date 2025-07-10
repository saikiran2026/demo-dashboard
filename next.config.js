/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages serves from a subdirectory
  basePath: process.env.NODE_ENV === 'production' ? '/demo-dashboard' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/demo-dashboard/' : '',
}

module.exports = nextConfig 