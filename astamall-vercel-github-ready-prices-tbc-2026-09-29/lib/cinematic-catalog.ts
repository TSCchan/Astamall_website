import { products, type Product } from './catalog';

// These optional merchandising fields can also come from a CMS.
type MerchandisedProduct = Product & { active?: boolean; featured?: boolean; heroImage?: string };

export type HeroProduct = { id: string; name: string; imageUrl: string; href: string; category: string };

export const heroCategories = [
  { name: 'Skincare', label: 'Skincare & Beauty', title: 'Beauty, thoughtfully formulated.', description: 'From your first layer of hydration to a finishing touch of colour. Discover a ritual that feels like you.', cta: 'Explore Skincare & Beauty' },
  { name: 'Health Foods', label: 'Health Foods', title: 'Nourish your everyday.', description: 'Collagen drinks and probiotic coffees. Thoughtfully selected additions to your daily rituals.', cta: 'Explore Health Foods' },
  { name: 'Health Supplements', label: 'Health Supplements', title: 'Care that goes further.', description: 'Discover nutritional capsules with clear ingredients, considered formulas and a place in your everyday routine.', cta: 'Explore Health Supplements' },
].map(category => ({ ...category, href: `/shop?category=${encodeURIComponent(category.name)}` }));

export const heroStages = [
  { label: 'Origin', eyebrow: 'The essence of ASTAMALL', title: 'One Powerful Ingredient.', accent: 'A World of Possibilities.', description: 'Discover beauty and wellness through thoughtfully selected products, inspired by astaxanthin.', href: '/shop', cta: 'Explore the Collection' },
  ...heroCategories.map(c => ({ label: c.label, eyebrow: c.label, title: c.title, accent: '', description: c.description, href: c.href, cta: c.cta })),
  { label: 'Collection', eyebrow: 'Beauty. Nourishment. Everyday care.', title: 'A world of possibilities.', accent: 'Yours to discover.', description: 'Three collections. Many ways to care for yourself. Find your next everyday ritual at ASTAMALL.', href: '/shop', cta: 'Explore All Products' },
];

// Cleaner photography for the hero where the catalog image is a text-heavy promotional graphic.
const heroImageOverrides: Record<string, string> = {
  'asta-s-rejuvenating-serum': '/assets/astamall-asta-s-serum-v3.webp',
};

const toHero = (slug: string): HeroProduct => {
  const p = (products as MerchandisedProduct[]).find(item => item.slug === slug)!;
  return { id: p.slug, name: p.name, category: p.category, href: `/shop/${p.slug}`, imageUrl: p.heroImage || heroImageOverrides[p.slug] || p.image! };
};
const available = (slugs: string[]) => slugs.filter(slug => (products as MerchandisedProduct[]).some(p => p.slug === slug && p.active !== false && p.featured !== false && (p.heroImage || p.image)));

/** Product arrangement revealed by the sculpture at each stage. The first product of each group is the lead. */
export const heroStageProducts: HeroProduct[][] = [
  [],
  available(['asta-s-rejuvenating-serum', 'asta-s-glow-lipstick', 'tibi-yeast-skin-balance-toner']).map(toHero),
  available(['astamall-collagen', 'probiotic-drip-coffee-morning-fruit', 'lean-life-coffee']).map(toHero),
  available(['vegan-algal-astaxanthin-complex-capsules', 'quick-charge-blueberry-night-capsules', 'uc-flex-plus-capsules']).map(toHero),
  available(['asta-s-rejuvenating-serum', 'asta-s-glow-lipstick', 'astamall-collagen', 'lean-life-coffee', 'vegan-algal-astaxanthin-complex-capsules']).map(toHero),
];
