/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev, isServer }) {
    // Existing SVGR configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })

    // New configuration for ScrollArea optimization
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        "@radix-ui/react-scroll-area":
          "@radix-ui/react-scroll-area/dist/index.js",
      })
    }

    return config
  },
  compiler: {
    removeConsole: false,
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
