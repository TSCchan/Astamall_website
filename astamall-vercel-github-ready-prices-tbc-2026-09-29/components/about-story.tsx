import Link from 'next/link';
import Reveal from '@/components/reveal';
import AboutJourney from '@/components/about/about-journey';
import { products, categories } from '@/lib/catalog';

const collections = [
  { name: 'Skincare', label: 'Skincare & beauty', note: 'Your daily ritual, thoughtfully considered.' },
  { name: 'Health Foods', label: 'Health foods', note: 'Everyday nourishment, from within.' },
  { name: 'Health Supplements', label: 'Health supplements', note: 'Find the right addition to your routine.' },
].map(c => {
  const items = products.filter(p => p.category === c.name);
  return { ...c, count: items.length, images: items.slice(0, 3).map(p => ({ src: p.image!, alt: p.name })), href: `/shop?category=${encodeURIComponent(c.name)}` };
});

export default function AboutStory() {
  const figures = [
    { value: String(products.length), label: 'products in the collection' },
    { value: String(categories.length - 1), label: 'collections, from skincare to supplements' },
    { value: '3,000+', label: 'kilometres from Taiwan to Malaysia' },
  ];
  return <article className="ab-page">
    <section className="ab-hero">
      <Reveal className="ab-hero-copy" stagger>
        <p className="ab-eyebrow">Our story</p>
        <h1>Beauty, powered by <em>astaxanthin.</em></h1>
        <p>A beauty and wellness destination bringing thoughtfully selected products from Taiwan to Malaysia.</p>
        <a className="ab-link" href="#journey">Follow the journey <span aria-hidden="true">↓</span></a>
      </Reveal>
      <div className="ab-hero-media"><img src="/assets/astamall-asta-s-serum-v3.webp" alt="Asta-S Rejuvenating Serum on a deep red surface" width="800" height="800" /></div>
    </section>

    <section className="ab-mission">
      <Reveal className="ab-mission-copy" stagger>
        <h2>We want you to understand what you use.</h2>
        <p>ASTAMALL makes ingredient stories and product purposes easier to understand, so every choice begins with clearer information.</p>
      </Reveal>
      <Reveal className="ab-figures" stagger>{figures.map(f => <div key={f.label}><strong>{f.value}</strong><span>{f.label}</span></div>)}</Reveal>
    </section>

    <AboutJourney />

    <section className="ab-collections" aria-labelledby="collections-title">
      <h2 id="collections-title">Three collections, one standard.</h2>
      <Reveal className="ab-collection-list" stagger>{collections.map(c => <Link key={c.name} href={c.href} className="ab-collection">
        <span className="ab-collection-name">{c.label}</span>
        <span className="ab-collection-note">{c.note}</span>
        <span className="ab-collection-images" aria-hidden="true">{c.images.map(img => <img key={img.src} src={img.src} alt="" width="120" height="120" loading="lazy" />)}</span>
        <span className="ab-collection-count">{c.count} products <span aria-hidden="true">→</span></span>
      </Link>)}</Reveal>
    </section>

    <section className="ab-closing">
      <Reveal stagger>
        <h2>Better understanding.<br />Better choices.<br /><em>Better care.</em></h2>
        <Link href="/shop" className="ab-btn">Explore the Collection <span aria-hidden="true">→</span></Link>
      </Reveal>
    </section>
  </article>;
}
