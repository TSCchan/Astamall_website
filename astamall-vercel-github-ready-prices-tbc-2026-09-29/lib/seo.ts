/**
 * Search metadata for ASTAMALL's pages: titles, descriptions and canonical paths. Static pages are edited here;
 * product, ingredient and article metadata is generated from the catalogue, so a newly published item gets
 * sensible metadata without any edit here. A product can override its generated description with `seoDescription`.
 *
 * Keyword intent for each page is documented in docs/seo-keyword-map.md.
 */

import { articles, categories, ingredients, productOptions, productBrandOf, type Product } from '@/lib/catalog';

type Seo = { title: string; description: string };

/** Search results show roughly this many characters of a title. */
const TITLE_LIMIT = 60;
/** Descriptions aim for about this length; longer ones are cut by search engines. */
const DESCRIPTION_LIMIT = 160;

/** `name | suffix`, falling back to the shorter suffix when the title would run past what search results show. */
export const titled = (name: string, suffix: string, short = 'ASTAMALL') =>
  `${name} | ${suffix}`.length <= TITLE_LIMIT ? `${name} | ${suffix}` : `${name} | ${short}`;

export const homeSeo: Seo = {
  title: 'ASTAMALL Malaysia | Taiwanese Skincare, Lipstick & Beauty',
  description: 'Discover curated Taiwanese skincare, lipstick, lip care and wellness products at ASTAMALL Malaysia, including beauty formulas featuring Asta-S astaxanthin.',
};

/** Static sections of the site, keyed by their first path segment. */
export const sectionSeo: Record<string, Seo> = {
  shop: {
    title: 'Shop Skincare, Beauty & Wellness Malaysia | ASTAMALL',
    description: 'Shop the ASTAMALL collection in Malaysia: Taiwanese skincare, lipstick, tinted lip balm, health foods and health supplements, selected with care.',
  },
  about: {
    title: 'About ASTAMALL | Our Brand & Beauty Philosophy',
    description: 'ASTAMALL brings carefully selected beauty and wellness products from Taiwan to Malaysia. Discover our story, our astaxanthin focus and our collection.',
  },
  faq: {
    title: 'Frequently Asked Questions | ASTAMALL',
    description: "Answers to common questions about ASTAMALL's products, ingredient information, orders, payments, delivery, returns and how to contact our team.",
  },
  contact: {
    title: 'Contact ASTAMALL Malaysia',
    description: 'Contact ASTAMALL with product questions, ingredient information requests or business enquiries. Send us a message or email astamall92@gmail.com.',
  },
  journal: {
    title: 'ASTAMALL Journal | Ingredient & Beauty Stories',
    description: 'The ASTAMALL Journal: ingredient understanding, everyday beauty routines and the story behind bringing Taiwanese beauty and wellness to Malaysia.',
  },
  ingredients: {
    title: 'Ingredient Library | ASTAMALL',
    description: 'Explore the ASTAMALL ingredient library: astaxanthin, Asta-S free-form astaxanthin, fermented yeast, collagen, hexapeptide and sea fennel.',
  },
  astaxanthin: {
    title: 'Discover Astaxanthin | ASTAMALL',
    description: 'Discover astaxanthin, the red ingredient behind ASTAMALL, and Asta-S, a Taiwan-developed free-form astaxanthin technology in selected formulas.',
  },
  terms: {
    title: 'Terms | ASTAMALL',
    description: 'Terms information for the ASTAMALL storefront preview. Purchase terms, business details and customer service procedures will be published before orders open.',
  },
};

/** Shop category views (/shop?category=…). Each is its own collection page with its own canonical URL. */
export const categorySeo: Record<string, Seo> = {
  Skincare: {
    title: 'Skincare & Beauty Products Malaysia | ASTAMALL',
    description: 'Taiwanese skincare and beauty at ASTAMALL Malaysia: Asta-S Rejuvenating Serum, Glow Lipstick, Tinted Lip Balm, eye mask, toner and face cream.',
  },
  'Health Foods': {
    title: 'Health Foods Malaysia | ASTAMALL',
    description: 'Taiwanese health foods at ASTAMALL Malaysia, including NAFU Collagen PLUS collagen drink, probiotic drip coffee and LEAN LIFE Coffee.',
  },
  'Health Supplements': {
    title: 'Health Supplements Malaysia | ASTAMALL',
    description: 'Taiwanese health supplements at ASTAMALL Malaysia: vegan algal astaxanthin complex, UC-Flex PLUS and Quick-Charge Blueberry Night capsules.',
  },
};

/** Hand-written descriptions for journal articles, whose own excerpts are too short to stand alone. */
const articleDescriptions: Record<string, string> = {
  'why-we-started-with-astaxanthin': 'Why ASTAMALL began with astaxanthin, and how we aim to make ingredient information easier to understand for everyday beauty and wellness.',
  'from-taiwan-to-malaysia': 'How ASTAMALL sources beauty and wellness products from Taiwan and brings carefully selected skincare, health foods and supplements to Malaysia.',
  'understanding-your-beauty-routine': "Start with understanding: a product's place in your routine, reading labels and precautions, and asking ASTAMALL when something is unclear.",
};

/** How each product type reads in a sentence; anything unlisted uses its type in lower case. */
const typePhrases: Record<string, string> = {
  Toner: 'facial toner',
  Serum: 'facial serum',
  'Protective cream': 'face cream',
  'Lip balm': 'tinted lip balm',
  Capsules: 'health supplement',
  Coffee: 'coffee',
};

const fit = (candidates: string[]) => candidates.find(text => text.length <= DESCRIPTION_LIMIT) ?? candidates[candidates.length - 1];

/** A product's search description, built from its name, shade or size, benefit, type and brand. */
export function productDescription(p: Product) {
  if (p.seoDescription) return p.seoDescription;
  const options = productOptions(p);
  const shades = options.label === 'Shade' ? options.options.map(o => o.label.split(' ')[0]) : [];
  const size = p.size?.replace(/ bottle$/, '');
  const head = shades.length ? `${p.name} in ${shades.length} shades (${shades.join(', ')})` : size ? `${p.name}, ${size}` : p.name;
  const brand = productBrandOf(p);
  const phrase = typePhrases[p.type] ?? p.type.toLowerCase();
  // name an outside brand; ASTAMALL's own products already end with ASTAMALL
  const by = brand === 'ASTAMALL' || p.name.includes(brand) ? '' : ` by ${brand}`;
  return fit([
    `${head}: ${p.benefit} Taiwanese ${phrase}${by}, available at ASTAMALL Malaysia.`,
    `${head}: ${p.benefit} Taiwanese ${phrase}${by} at ASTAMALL Malaysia.`,
    `${head}: ${p.benefit} Taiwanese ${phrase} at ASTAMALL Malaysia.`,
    `${p.name}: ${p.benefit} Taiwanese ${phrase} at ASTAMALL Malaysia.`,
    `${p.name}: ${p.benefit} At ASTAMALL Malaysia.`,
  ]);
}

export function productSeo(p: Product): Seo {
  return { title: titled(p.name, 'ASTAMALL Malaysia'), description: productDescription(p) };
}

export function ingredientSeo(slug: string): Seo | undefined {
  const i = ingredients.find(item => item.slug === slug);
  if (!i) return undefined;
  return {
    title: titled(i.name, 'Ingredient Library | ASTAMALL'),
    description: fit([`${i.text} Learn where it appears in the ASTAMALL collection.`, `${i.text} From the ASTAMALL ingredient library.`, i.text]),
  };
}

export function articleSeo(slug: string): Seo | undefined {
  const a = articles.find(item => item.slug === slug);
  if (!a) return undefined;
  return { title: titled(a.title, 'ASTAMALL Journal'), description: articleDescriptions[a.slug] ?? a.excerpt };
}

/** The shop category named in a query string, if it is a real category. */
export const shopCategory = (value: unknown) =>
  typeof value === 'string' && value !== 'All' && categories.includes(value) ? value : undefined;

/** The canonical path of a page: its own path, keeping only a valid shop category and dropping any other query. */
export function canonicalPath(path: string[], category?: string) {
  const base = '/' + path.join('/');
  return path.length === 1 && path[0] === 'shop' && category ? `${base}?category=${encodeURIComponent(category)}` : base;
}
