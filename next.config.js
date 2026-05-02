/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
});

const nextConfig = {
  turbopack: {},
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.mikan.uz",
      },
      {
        protocol: "https",
        hostname: "s3.eu-north-1.amazonaws.com",
      },
    ],
  },
  env: {
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

module.exports = withPWA(nextConfig);
