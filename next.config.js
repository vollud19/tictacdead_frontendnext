/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    appDir: true,
    generateStaticParams: true
  },
  generateStaticParams: async function () {
    // Exclude specific pages from being exported
    const staticParams = {
      '/playerselect': { page: '/playerselect' },
      '/playgame': { page: '/playgame' },
    };

    return staticParams;
  },
};
