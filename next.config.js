/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
    ],
  },
  // Compression and caching
  compress: true,
  // Optimize production builds
  optimizeFonts: true,
  productionBrowserSourceMaps: false,
  // Response headers for better caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, max-age=300" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/support", destination: "/contact?intent=support", permanent: true },
      { source: "/help", destination: "/contact?intent=support", permanent: true },
      { source: "/partners", destination: "/get-started", permanent: true },
      { source: "/request-demo", destination: "/demo", permanent: true },
      { source: "/pricing-contact", destination: "/contact?intent=pricing", permanent: true },
      { source: "/request-pricing", destination: "/contact?intent=pricing", permanent: true },
    ];
  },
};

module.exports = nextConfig;
