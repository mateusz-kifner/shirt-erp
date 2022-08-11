// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  crossOrigin: "anonymous",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tasks",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
