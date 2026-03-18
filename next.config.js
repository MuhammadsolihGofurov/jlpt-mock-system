/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: "uz",
    locales: ["ru", "uz", "en", "jp"],
  },
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  images: {
    // like ['domen.uz']
    domains: ["api.mikan.uz", "s3.eu-north-1.amazonaws.com"],
  },
  env: {
    // like base url
    API: "",
  },
  async rewrites() {
    return [{
      source: "/api/v1/:path*",
      destination: "https://api.mikan.uz/api/v1/:path*",
    }, ];
  },
};

module.exports = nextConfig;