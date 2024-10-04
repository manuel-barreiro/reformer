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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
    ],
  },
}

export default nextConfig
