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
        destination: "/erp/tasks",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
