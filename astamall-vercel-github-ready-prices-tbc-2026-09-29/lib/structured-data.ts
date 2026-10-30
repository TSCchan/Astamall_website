/**
 * Schema.org JSON-LD for ASTAMALL, built from the same data the pages render, so the markup always matches what
 * visitors see. Nothing here is invented: fields without a verified source (SKU, GTIN, ratings, publish dates,
 * return windows) are left out rather than guessed.
 */

import { productOptions, productBrandOf, type Product } from '@/lib/catalog';
import { productDescription } from '@/lib/seo';
import { SITE_URL, absoluteUrl, business, socialProfiles } from '@/lib/site';

type Json = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** ASTAMALL as a company: the retailer and seller. Brands of the products it sells are named on each product. */
export function organization(): Json {
  const { address } = business;
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: business.brand,
    legalName: business.legalName,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: absoluteUrl(business.logo), width: 1120, height: 912 },
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      postalCode: address.postcode,
      addressLocality: address.locality,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    identifier: { '@type': 'PropertyValue', propertyID: 'Malaysian business registration number', value: business.registration },
    sameAs: socialProfiles.map(profile => profile.href),
  };
}

/** The website itself. No SearchAction: the site has no search results page. */
export function website(): Json {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE_URL}/`, name: business.brand, inLanguage: 'en-MY', publisher: { '@id': ORGANIZATION_ID } };
}

export const graph = (...nodes: Json[]): Json => ({ '@context': 'https://schema.org', '@graph': nodes });

/** Breadcrumbs from the home page down to the current page; paths are site-relative. */
export function breadcrumbs(trail: Array<{ name: string; path: string }>): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((crumb, i) => ({
      '@type': 'ListItem', position: i + 1, name: crumb.name, item: absoluteUrl(crumb.path),
    })),
  };
}

/** A journal article. Only facts the article itself carries; it has no publish date, so none is given. */
export function blogPosting(a: { slug: string; title: string; category: string }, description: string): Json {
  const url = absoluteUrl(`/journal/${a.slug}`);
  const seller = { '@type': 'Organization', name: business.brand, url: `${SITE_URL}/` };
  return {
    '@type': 'BlogPosting', headline: a.title, description, articleSection: a.category, inLanguage: 'en-MY',
    url, mainEntityOfPage: url, author: seller, publisher: seller,
  };
}

/**
 * A product and its offer, or its shades as a ProductGroup. Returns null until the product can actually be
 * bought, that is, until it has both a price and a stock status: an offer is never published for a product whose
 * price is still to be confirmed.
 */
export function productStructuredData(p: Product): Json | null {
  if (p.price === null || !p.availability || !p.image) return null;
  const url = absoluteUrl(`/shop/${p.slug}`);
  const brand = { '@type': 'Brand', name: productBrandOf(p) };
  const offer = {
    '@type': 'Offer', url, price: p.price.toFixed(2), priceCurrency: 'MYR', availability: `https://schema.org/${p.availability}`,
    itemCondition: 'https://schema.org/NewCondition', seller: { '@id': ORGANIZATION_ID, '@type': 'Organization', name: business.brand },
  };
  const options = productOptions(p);
  const shades = options.label === 'Shade' ? options.options : [];
  if (shades.length > 1) {
    // one page, several shades: each shade is a variant of the group, with its own photograph where there is one
    return {
      '@type': 'ProductGroup', name: p.name, description: productDescription(p), url, brand, productGroupID: p.slug,
      variesBy: ['https://schema.org/color'],
      hasVariant: shades.map(shade => {
        const photo = p.galleryImages?.find(image => image.label === shade.label)?.src ?? (shade === shades[0] ? p.image : undefined);
        return {
          '@type': 'Product', name: `${p.name} ${shade.label}`, color: shade.label, brand,
          ...(photo ? { image: absoluteUrl(photo) } : {}), offers: offer,
        };
      }),
    };
  }
  return { '@type': 'Product', name: p.name, description: productDescription(p), url, image: [absoluteUrl(p.image)], brand, offers: offer };
}
