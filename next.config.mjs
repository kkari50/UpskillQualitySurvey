/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Fix for @react-pdf/renderer module resolution (used for PDF generation)
    config.resolve.alias = {
      ...config.resolve.alias,
      "pako/lib/zlib/zstream.js": "pako",
      canvas: false,
    };

    return config;
  },
};

export default nextConfig;
