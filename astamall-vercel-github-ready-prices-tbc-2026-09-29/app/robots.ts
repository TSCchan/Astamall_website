import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

/**
 * /robots.txt. Production allows the whole storefront: pages, scripts, styles and images. The cart, checkout and
 * order confirmation are not blocked here: they carry their own noindex, which crawlers can only see if they may
 * fetch the page. Vercel preview and development builds ask crawlers to stay out entirely.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') };
}
