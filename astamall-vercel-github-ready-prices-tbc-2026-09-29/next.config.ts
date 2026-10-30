import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // the brand story became the journey on the About page
      { source: '/brand-story', destination: '/about#journey', permanent: true },
      // the old placeholder pages moved to the bilingual policies
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/shipping', destination: '/shipping-returns', permanent: true },
      { source: '/returns', destination: '/shipping-returns', permanent: true },
    ];
  },
};

export default nextConfig;
