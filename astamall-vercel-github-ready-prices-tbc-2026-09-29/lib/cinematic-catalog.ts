import { products, type Product } from './catalog';

export type HeroProduct = {
  id: string; name: string; imageUrl: string; href: string;
  category: string; priority: number; modelUrl?: string;
};

// These optional merchandising fields can also come from a CMS.
type MerchandisedProduct = Product & {
  active?: boolean; featured?: boolean; displayPriority?: number;
  heroImage?: string; modelUrl?: string;
};

export const heroCategories = [
  { name: 'Skincare', label: 'Skincare & Beauty', title: 'Beauty, thoughtfully formulated.', description: 'From your first layer of hydration to a finishing touch of colour. Discover a ritual that feels like you.', cta: 'Explore Skincare & Beauty' },
  { name: 'Health Foods', label: 'Health Foods', title: 'Nourish your everyday.', description: 'Collagen drinks and probiotic coffees. Thoughtfully selected additions to your daily rituals.', cta: 'Explore Health Foods' },
  { name: 'Health Supplements', label: 'Health Supplements', title: 'Care that goes further.', description: 'Discover nutritional capsules with clear ingredients, considered formulas and a place in your everyday routine.', cta: 'Explore Health Supplements' },
].map(category => ({ ...category, href: `/shop?category=${encodeURIComponent(category.name)}` }));

export const heroProducts: HeroProduct[] = (products as MerchandisedProduct[])
  .filter(p => p.active !== false && p.featured !== false && (p.heroImage || p.image))
  .map((p, index) => ({
    id: p.slug, name: p.name, category: p.category,
    imageUrl: p.heroImage || p.image!, href: `/shop/${p.slug}`,
    priority: p.displayPriority ?? (p.slug === 'asta-s-rejuvenating-serum' ? -1 : index),
    ...(p.modelUrl ? { modelUrl: p.modelUrl } : {}),
  }))
  .sort((a, b) => a.priority - b.priority);

export const heroStages = [
  { label: 'The Origin', eyebrow: 'THE ESSENCE OF ASTAMALL', title: 'One Powerful Ingredient.', accent: 'A World of Possibilities.', description: 'Discover beauty and wellness through thoughtfully selected products, inspired by astaxanthin.', href: '/shop', cta: 'Explore the Collection' },
  ...heroCategories.map(c => ({ ...c, eyebrow: c.label.toUpperCase(), accent: '' })),
  { label: 'The Collection', eyebrow: 'BEAUTY. NOURISHMENT. EVERYDAY CARE.', title: 'A world of possibilities.', accent: 'Yours to discover.', description: 'Three collections. Many ways to care for yourself. Find your next everyday ritual at ASTAMALL.', href: '/shop', cta: 'Explore All Products' },
];

// User-supplied editorial compositions for the five homepage stages.
// These are separate from catalog product photography and gallery ordering.
export const heroStageArt = [
  { imageUrl: '/assets/journey-origin-cutout-v1.png', alt: 'Glossy red liquid sculpture', size: 5.5 },
  { imageUrl: '/assets/journey-skincare-cutout-v1.png', alt: 'Skincare and beauty composition with serum, compact and lipstick', size: 6.3 },
  { imageUrl: '/assets/journey-foods-cutout-v1.png', alt: 'Collagen sachet display with lemons', size: 5.7 },
  { imageUrl: '/assets/journey-supplements-cutout-v1.png', alt: 'Astaxanthin bottle and carton on a stone arrangement', size: 5.7 },
  { imageUrl: '/assets/journey-collection-cutout-v1.png', alt: 'Beauty and wellness collection on display blocks', size: 5.9 },
];
