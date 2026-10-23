import { products, type Product } from './catalog';

export type HeroProduct = {
  id: string; name: string; imageUrl: string; href: string;
  category: string; benefit: string; firstInCategory: boolean;
};

// These optional merchandising fields can also come from a CMS.
type MerchandisedProduct = Product & {
  active?: boolean; featured?: boolean; heroImage?: string;
};

export const heroCategories = [
  { name: 'Skincare', label: 'Skincare & Beauty', title: 'Beauty, thoughtfully formulated.', description: 'From your first layer of hydration to a finishing touch of colour. Discover a ritual that feels like you.' },
  { name: 'Health Foods', label: 'Health Foods', title: 'Nourish your everyday.', description: 'Collagen drinks and probiotic coffees. Thoughtfully selected additions to your daily rituals.' },
  { name: 'Health Supplements', label: 'Health Supplements', title: 'Care that goes further.', description: 'Discover nutritional capsules with clear ingredients, considered formulas and a place in your everyday routine.' },
].map(category => ({ ...category, href: `/shop?category=${encodeURIComponent(category.name)}` }));

// Every product in catalog order, so the spiral walks the collection category by category.
export const spiralProducts: HeroProduct[] = (products as MerchandisedProduct[])
  .filter(p => p.active !== false && p.featured !== false && (p.heroImage || p.image))
  .map((p, index, list) => ({
    id: p.slug, name: p.name, category: p.category, benefit: p.benefit,
    imageUrl: p.heroImage || p.image!, href: `/shop/${p.slug}`,
    firstInCategory: index === 0 || list[index - 1].category !== p.category,
  }));

export const heroIntro = { eyebrow: 'The essence of ASTAMALL', title: 'One Powerful Ingredient.', accent: 'A World of Possibilities.', description: 'Discover beauty and wellness through thoughtfully selected products, inspired by astaxanthin.' };
export const heroOutro = { title: 'A world of possibilities.', accent: 'Yours to discover.', description: 'Three collections. Many ways to care for yourself. Find your next everyday ritual at ASTAMALL.' };
