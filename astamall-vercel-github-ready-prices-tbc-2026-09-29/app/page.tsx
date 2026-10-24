import Link from 'next/link';
import Reveal from '@/components/reveal';
import { ProductCard } from '@/components/brand';
import { FaqList } from '@/components/forms';
import { ProductRail, CategoryRow, Marquee } from '@/components/home-motion';
import { products, articles } from '@/lib/catalog';
import AstamallLiquidJourney from '@/components/ui/astamall-liquid-journey';

const categories = [
  { name: 'Skincare', label: 'Skincare & beauty', note: 'Your daily ritual, thoughtfully considered.' },
  { name: 'Health Foods', label: 'Health foods', note: 'Everyday nourishment, from within.' },
  { name: 'Health Supplements', label: 'Health supplements', note: 'Find the right addition to your routine.' },
];
const marquee = ['Skincare & beauty', 'Health foods', 'Health supplements', 'Asta-S® free-form astaxanthin', 'From Taiwan to Malaysia'];
const serum = products.find(p => p.slug === 'asta-s-rejuvenating-serum')!;

export default function Home() {
  return <main id="main-content" className="premium-home refined-home lux-home">
    <div id="top" />
    <AstamallLiquidJourney />

    <Marquee items={marquee} />

    <section className="home-introduction section-pad" id="about"><Reveal stagger>
      <h2>From Taiwan.<br /><em>Thoughtfully brought home.</em></h2>
      <div><p>Malaysia&apos;s home of astaxanthin beauty and wellness. Meaningful ingredients, thoughtfully selected for your everyday rituals.</p><Link href="/about" className="text-link">The ASTAMALL story <span aria-hidden="true">↗</span></Link></div>
    </Reveal></section>

    <section className="section-pad home-spotlight" aria-labelledby="spotlight-title"><Reveal className="spotlight-grid" stagger>
      <Link href={`/shop/${serum.slug}`} className="spotlight-media" aria-label={`View ${serum.name}`}>
        <img src="/assets/astamall-asta-s-serum-v3.webp" alt="Asta-S Rejuvenating Serum bottle on a deep red surface" width="800" height="800" loading="lazy" />
        <span className="spotlight-orbit" aria-hidden="true"><svg viewBox="0 0 200 200"><defs><path id="orbit-path" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" /></defs><text><textPath href="#orbit-path">GRAND GOLD QUALITY AWARD · MONDE SELECTION 2022 · </textPath></text></svg></span>
      </Link>
      <div className="spotlight-copy">
        <p className="eyebrow">Signature formula</p>
        <h2 id="spotlight-title">{serum.name}</h2>
        <p>{serum.benefit} A lightweight oil serum with Asta-S astaxanthin, hexapeptide and sea fennel extract.</p>
        <ul className="spotlight-awards">{serum.award!.split(';').map(award => <li key={award}>{award.trim().replace(/\.$/, '')}</li>)}</ul>
        <div className="button-row"><Link href={`/shop/${serum.slug}`} className="button">Discover the serum <span aria-hidden="true">↗</span></Link><span className="spotlight-size">{serum.size}</span></div>
      </div>
    </Reveal></section>

    <section className="section-pad home-collection" id="collection">
      <Reveal className="section-heading"><h2>A considered collection.</h2><Link className="text-link" href="/shop">Explore all products <span aria-hidden="true">↗</span></Link></Reveal>
      <ProductRail label="featured products">{products.filter(p => p.slug !== serum.slug).map((product, index) => <div className="product-rail-item" key={product.slug}><ProductCard product={product} presentation="shop" index={index} minimal /></div>)}</ProductRail>
    </section>

    <section className="section-pad home-categories" id="categories" aria-label="Shop by category">
      <nav className="category-rows" aria-label="Shop by category">{categories.map((c, i) => {
        const items = products.filter(p => p.category === c.name);
        return <CategoryRow key={c.name} href={`/shop?category=${encodeURIComponent(c.name)}`} images={items.slice(0, 3).map(p => p.image!).filter(Boolean)}>
          <span className="category-row-index">{String(i + 1).padStart(2, '0')}</span>
          <span className="category-row-copy"><h3>{c.label}</h3><p>{c.note}</p></span>
          <span className="category-row-count">{items.length} products</span>
          <span className="category-row-arrow" aria-hidden="true">↗</span>
        </CategoryRow>;
      })}</nav>
    </section>

    <section className="home-ingredient section-pad" id="astaxanthin"><Reveal stagger>
      <div><h2>One ingredient.<br /><em>A deeper understanding.</em></h2><p>Astaxanthin is where our story began. A vivid red ingredient, and a desire to understand beauty products more clearly.</p><Link href="/astaxanthin" className="text-link">Meet Astaxanthin <span aria-hidden="true">↗</span></Link></div>
      <div className="ingredient-editorial">
        <h3>Asta-S®<br />Free-Form Astaxanthin</h3><p>A Taiwan-developed ingredient technology featured within selected ASTAMALL formulas.</p><Link href="/ingredients/asta-s" className="text-link">Explore the ingredient <span aria-hidden="true">↗</span></Link>
        <details className="editorial-disclosure"><summary>Science, beauty &amp; wellness<span aria-hidden="true">+</span></summary><div><p>Understand what goes into the products. Discover products designed for everyday beauty routines, and explore beauty and nourishment from within.</p></div></details>
        <details className="editorial-disclosure"><summary>Product recognition<span aria-hidden="true">+</span></summary><div><p><strong>Asta-S Rejuvenating Serum · 2022</strong><br />Monde Selection, Grand Gold Award<br />National Yushan Award, Best Product Category</p><p><strong>Asta-S Glow Lipstick · 2022</strong><br />Taiwan Top10 Skincare Product</p><p className="small-text">Awards are listed in available product materials. Supporting documents are awaiting review.</p></div></details>
      </div>
    </Reveal></section>

    <section className="home-journal section-pad"><Reveal className="section-heading"><h2>Stories behind the selection.</h2><Link href="/journal" className="text-link">The journal <span aria-hidden="true">↗</span></Link></Reveal><Reveal className="editorial-stories" stagger>{articles.slice(0, 3).map((article, i) => <Link href={`/journal/${article.slug}`} key={article.slug}><span className="story-index">{String(i + 1).padStart(2, '0')}</span><span>{article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p><span className="story-read">Read story <span aria-hidden="true">↗</span></span></Link>)}</Reveal></section>

    <section className="faq-section section-pad"><div><h2>A little clarity.</h2><Link className="text-link" href="/faq">All questions <span aria-hidden="true">↗</span></Link></div><FaqList compact /></section>

    <section className="home-closing section-pad"><Reveal><h2>Find your everyday ritual.</h2><div><Link href="/shop" className="button button-light">Explore the collection <span aria-hidden="true">↗</span></Link><Link href="/contact" className="text-link">Talk to us</Link></div></Reveal></section>
  </main>;
}
