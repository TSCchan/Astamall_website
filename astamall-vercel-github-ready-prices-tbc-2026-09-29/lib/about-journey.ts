import { ingredients, products } from './catalog';

export type Chapter = {
  key: 'taiwan' | 'astaxanthin' | 'ingredients' | 'formulation' | 'malaysia' | 'astamall';
  label: string;
  title: string;
  text: string;
};

/** The About journey, in order. Copy is drawn from the ASTAMALL story articles and ingredient library. */
export const chapters: Chapter[] = [
  {
    key: 'taiwan', label: 'Taiwan', title: 'It begins in Taiwan.',
    text: 'Our collection is sourced from Taiwan, where science, biotechnology and beauty innovation come together.',
  },
  {
    key: 'astaxanthin', label: 'Astaxanthin', title: 'One red ingredient.',
    text: 'We began with astaxanthin, the ingredient that opened our eyes to the connection between science, beauty and wellness.',
  },
  {
    key: 'ingredients', label: 'Ingredients', title: 'Every ingredient, understood.',
    text: 'Asta-S, fermented yeast, collagen, hexapeptide and sea fennel feature across the collection. Understanding them comes first.',
  },
  {
    key: 'formulation', label: 'Formulation', title: 'Brought together with purpose.',
    text: 'An ingredient is only part of the story. Every product has its own formulation, directions and role.',
  },
  {
    key: 'malaysia', label: 'Malaysia', title: 'Over 3,000 km, brought home.',
    text: 'We travelled to understand the ingredient technology ourselves, then brought carefully selected products to Malaysia.',
  },
  {
    key: 'astamall', label: 'ASTAMALL', title: `${products.length} products. One destination.`,
    text: 'Skincare, health foods and health supplements, chosen so you can understand what you use.',
  },
];

/** Featured ingredients, shown as crystals in the 3D scene: each has a body colour and a lighter inner glow. */
export const journeyIngredients = [
  { slug: 'asta-s', color: '#c0122f', glow: '#ff6b7f' },
  { slug: 'fermented-yeast', color: '#dc9a14', glow: '#ffd56b' },
  { slug: 'collagen', color: '#e98fa6', glow: '#ffd3de' },
  { slug: 'hexapeptide', color: '#8656c8', glow: '#c9a8ff' },
  { slug: 'sea-fennel', color: '#178f63', glow: '#7ff0c0' },
].map(item => ({ ...item, name: ingredients.find(i => i.slug === item.slug)!.name.replace(' Free-Form Astaxanthin', '') }));

/** Every product in the shop, for the closing chapter. */
export const journeyProducts = products.map(p => ({ slug: p.slug, name: p.name, image: p.image! }));

export const places = {
  taiwan: { lat: 23.7, lon: 121.0 },
  malaysia: { lat: 3.14, lon: 101.69 },
};
