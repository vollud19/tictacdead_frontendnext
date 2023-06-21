/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    appDir: true,
    generateStaticParams: true
  },
};
