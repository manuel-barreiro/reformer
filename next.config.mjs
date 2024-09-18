/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Existing configurations (if any) go here

    // Add SVGR configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })

    return config
  },
  // Other Next.js configurations (if any) go here
}

export default nextConfig
