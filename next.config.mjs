/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.magnific.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  experimental: {
    // Tree-shake heavy icon / component libraries at build time.
    // Reduces JS bundle size without any code changes.
    optimizePackageImports: ["react-icons", "swiper", "@reduxjs/toolkit"],
  },
};

export default nextConfig;
