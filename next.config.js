/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    defaultLocale: "uz",
    locales: ["ru", "uz", "en"],
  },
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  images: {
    // like ['domen.uz']
    domains: [],
  },
  env: {
    // like base url
    API: "",
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.mikan.uz/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
