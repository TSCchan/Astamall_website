import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // the old placeholder pages moved to the bilingual policies
    return [
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/shipping', destination: '/shipping-returns', permanent: true },
      { source: '/returns', destination: '/shipping-returns', permanent: true },
    ];
  },
};

export default nextConfig;
