import type { MetadataRoute } from 'next';
import { articles, categories, ingredients, products } from '@/lib/catalog';
import { privacyPolicy } from '@/lib/privacy-policy';
import { shippingReturns } from '@/lib/shipping-returns';
import { canonicalPath } from '@/lib/seo';
import { SITE_URL, absoluteUrl } from '@/lib/site';

/**
 * /sitemap.xml: every indexable page, at its canonical URL, generated from the catalogue at build time, so a
 * product, article or ingredient added to the catalogue appears with the next deploy. Cart, checkout, order
 * confirmation, pre-filled enquiry forms and redirected URLs are left out. `lastModified` is given only where the
 * page carries a real date (the policies); no change frequency or priority is claimed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // the home page's canonical is the bare origin, so it is listed that way
  const url = (path: string) => (path === '/' ? SITE_URL : absoluteUrl(path));
  const page = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] =>
    lastModified ? { url: url(path), lastModified } : { url: url(path) };
  return [
    page('/'),
    page('/shop'),
    ...categories.filter(c => c !== 'All').map(c => page(canonicalPath(['shop'], c))),
    ...products.map(p => page(`/shop/${p.slug}`)),
    page('/about'),
    page('/astaxanthin'),
    page('/ingredients'),
    ...ingredients.map(i => page(`/ingredients/${i.slug}`)),
    page('/journal'),
    ...articles.map(a => page(`/journal/${a.slug}`)),
    page('/faq'),
    page('/contact'),
    page('/terms'),
    ...[privacyPolicy, shippingReturns].flatMap(doc => [page(doc.en.path, doc.en.updatedDate), page(doc.ms.path, doc.ms.updatedDate)]),
  ];
}
