/**
 * ASTAMALL's public identity, in one place: the site URL used for canonical links, the sitemap and structured
 * data, and the business details shown on the site. Change a detail here and every use follows.
 */

/** The production origin. Canonical URLs, the sitemap and structured data are always absolute against it. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.astamall.com.my').replace(/\/$/, '');

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const business = {
  brand: 'ASTAMALL',
  legalName: 'ASTA MALL PLT',
  registration: '202604002255',
  email: 'astamall92@gmail.com',
  logo: '/assets/astamall-logo-transparent-v1.webp',
  address: {
    street: 'No. 16-17, Jalan Taming P/1 off Lebuh Taming, Taman Taming Jaya',
    postcode: '43300',
    locality: 'Balakong',
    region: 'Selangor',
    country: 'MY',
  },
};

/** Official social profiles: the footer icons and the structured-data `sameAs` links. */
export const socialProfiles = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@astamall_' },
  { label: 'Instagram', href: 'https://www.instagram.com/astamall92/' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1HWHkT7DHX/?mibextid=wwXIfr' },
] as const;
