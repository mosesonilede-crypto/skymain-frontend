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
  productionBrowserSourceMaps: false,
  // Response headers for better caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
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
