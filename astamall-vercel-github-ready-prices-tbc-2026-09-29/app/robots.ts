import type { MetadataRoute } from 'next';

/**
 * /robots.txt. Production allows the whole storefront: pages, scripts, styles and images. The cart, checkout and
 * order confirmation are not blocked here: they carry their own noindex, which crawlers can only see if they may
 * fetch the page. Vercel preview and development builds ask crawlers to stay out entirely.
 *
 * Add `sitemap` here once /sitemap.xml exists.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return { rules: { userAgent: '*', allow: '/' } };
}
