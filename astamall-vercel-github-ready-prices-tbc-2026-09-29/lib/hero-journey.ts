export type JourneyImage = { src: string; alt: string; aspect: number };

export type JourneyStage = {
  label: string;
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  href: string;
  cta: string;
  /** Background-free product composition; the first stage is the sculpture alone. */
  image?: JourneyImage;
};

export const journeySculpture: JourneyImage = {
  src: '/assets/astamall-sculpture-cutout-v1.webp',
  alt: 'Glossy crimson astaxanthin liquid sculpture',
  aspect: 1429 / 987,
};

const category = (name: string) => `/shop?category=${encodeURIComponent(name)}`;

export const journeyStages: JourneyStage[] = [
  {
    label: 'Origin', eyebrow: 'The essence of ASTAMALL',
    title: 'One Powerful Ingredient.', accent: 'A World of Possibilities.',
    description: 'Discover beauty and wellness through thoughtfully selected products, inspired by astaxanthin.',
    href: '/shop', cta: 'Explore the Collection',
  },
  {
    label: 'Beauty', eyebrow: 'Skincare & Beauty', title: 'Beauty, thoughtfully formulated.',
    description: 'From your first layer of hydration to a finishing touch of colour. Discover a ritual that feels like you.',
    href: category('Skincare'), cta: 'Explore Skincare & Beauty',
    image: { src: '/assets/journey-skincare-cutout-v1.webp', alt: 'Serum, compact and lipstick arranged with petals', aspect: 1354 / 778 },
  },
  {
    label: 'Nourishment', eyebrow: 'Health Foods', title: 'Nourish your everyday.',
    description: 'Collagen drinks and probiotic coffees. Thoughtfully selected additions to your daily rituals.',
    href: category('Health Foods'), cta: 'Explore Health Foods',
    image: { src: '/assets/journey-foods-cutout-v1.webp', alt: 'Box of collagen drink pouches on a stone slab beside lemons', aspect: 1234 / 973 },
  },
  {
    label: 'Wellness', eyebrow: 'Health Supplements', title: 'Care that goes further.',
    description: 'Discover nutritional capsules with clear ingredients, considered formulas and a place in your everyday routine.',
    href: category('Health Supplements'), cta: 'Explore Health Supplements',
    image: { src: '/assets/journey-supplements-cutout-v1.webp', alt: 'Astaxanthin capsule jar and box balanced on stones', aspect: 843 / 1215 },
  },
  {
    label: 'Collection', eyebrow: 'Beauty. Nourishment. Everyday care.',
    title: 'A world of possibilities.', accent: 'Yours to discover.',
    description: 'Three collections. Many ways to care for yourself. Find your next everyday ritual at ASTAMALL.',
    href: '/shop', cta: 'Explore All Products',
    image: { src: '/assets/journey-collection-cutout-v1.webp', alt: 'Serums, cream and supplement jars arranged on plinths', aspect: 975 / 1093 },
  },
];
