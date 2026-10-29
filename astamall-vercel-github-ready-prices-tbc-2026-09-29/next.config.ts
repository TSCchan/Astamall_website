import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // the privacy page moved to the bilingual Privacy Policy
    return [{ source: '/privacy', destination: '/privacy-policy', permanent: true }];
  },
};

export default nextConfig;
