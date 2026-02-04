// Next.js configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/support", destination: "/contact?intent=support", permanent: true },
      { source: "/help", destination: "/contact?intent=support", permanent: true },
      { source: "/partners", destination: "/contact?intent=partnerships", permanent: true },
      { source: "/partnerships", destination: "/contact?intent=partnerships", permanent: true },
      { source: "/request-demo", destination: "/contact?intent=demo", permanent: true },
      { source: "/demo", destination: "/contact?intent=demo", permanent: true },
      { source: "/pricing-contact", destination: "/contact?intent=pricing", permanent: true },
      { source: "/request-pricing", destination: "/contact?intent=pricing", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Proxy frontend -> backend (FastAPI)
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
