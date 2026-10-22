import Link from 'next/link';
import Reveal from '@/components/reveal';
import { ProductCard } from '@/components/brand';
import { FaqList } from '@/components/forms';
import { products, articles } from '@/lib/catalog';
import AstamallScrollHero from '@/components/ui/astamall-scroll-hero';

const categories = [
  { name: 'Skincare', label: 'Skincare & beauty', note: 'Your daily ritual, thoughtfully considered.' },
  { name: 'Health Foods', label: 'Health foods', note: 'Everyday nourishment, from within.' },
  { name: 'Health Supplements', label: 'Health supplements', note: 'Find the right addition to your routine.' },
];

export default function Home() {
  return <main id="main-content" className="premium-home refined-home">
    <div id="top" />
    <AstamallScrollHero />
    <section className="home-introduction section-pad" id="about"><Reveal>
      <h2>From Taiwan.<br /><em>Thoughtfully brought home.</em></h2>
      <div><p>Malaysia&apos;s home of astaxanthin beauty and wellness. Meaningful ingredients, thoughtfully selected for your everyday rituals.</p><Link href="/about" className="text-link">The ASTAMALL story <span aria-hidden="true">↗</span></Link></div>
    </Reveal></section>
    <section className="section-pad home-collection" id="collection"><Reveal>
      <div className="section-heading"><h2>A considered collection.</h2><Link className="text-link" href="/shop">Explore all products <span aria-hidden="true">↗</span></Link></div>
      <div className="featured-grid">{products.slice(0, 3).map(product => <ProductCard key={product.slug} product={product} presentation="shop" minimal />)}</div>
      <nav className="home-category-links" aria-label="Shop by category" id="categories">{categories.map(c => <Link href={`/shop?category=${encodeURIComponent(c.name)}`} key={c.name}><div><h3>{c.label}</h3><p>{c.note}</p></div><span aria-hidden="true">↗</span></Link>)}</nav>
    </Reveal></section>
    <section className="home-ingredient section-pad" id="astaxanthin"><Reveal>
      <div><h2>One ingredient.<br /><em>A deeper understanding.</em></h2><p>Astaxanthin is where our story began. A vivid red ingredient, and a desire to understand beauty products more clearly.</p><Link href="/astaxanthin" className="text-link">Meet Astaxanthin <span aria-hidden="true">↗</span></Link></div>
      <div className="ingredient-editorial">
        <h3>Asta-S®<br />Free-Form Astaxanthin</h3><p>A Taiwan-developed ingredient technology featured within selected ASTAMALL formulas.</p><Link href="/ingredients/asta-s" className="text-link">Explore the ingredient <span aria-hidden="true">↗</span></Link>
        <details className="editorial-disclosure"><summary>Science, beauty &amp; wellness</summary><div><p>Understand what goes into the products. Discover products designed for everyday beauty routines, and explore beauty and nourishment from within.</p></div></details>
        <details className="editorial-disclosure"><summary>Product recognition</summary><div><p><strong>Asta-S Rejuvenating Serum · 2022</strong><br />Monde Selection, Grand Gold Award<br />National Yushan Award, Best Product Category</p><p><strong>Asta-S Glow Lipstick · 2022</strong><br />Taiwan Top10 Skincare Product</p><p className="small-text">Awards are listed in available product materials. Supporting documents are awaiting review.</p></div></details>
      </div>
    </Reveal></section>
    <section className="home-journal section-pad"><div className="section-heading"><h2>Stories behind the selection.</h2><Link href="/journal" className="text-link">The journal <span aria-hidden="true">↗</span></Link></div><div className="editorial-stories">{articles.slice(0,3).map(article => <Link href={`/journal/${article.slug}`} key={article.slug}><span>{article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p><span className="story-read">Read story <span aria-hidden="true">↗</span></span></Link>)}</div></section>
    <section className="faq-section section-pad"><div><h2>A little clarity.</h2><Link className="text-link" href="/faq">All questions <span aria-hidden="true">↗</span></Link></div><FaqList compact /></section>
    <section className="home-closing section-pad"><h2>Find your everyday ritual.</h2><div><Link href="/shop" className="button button-light">Explore the collection <span aria-hidden="true">↗</span></Link><Link href="/contact" className="text-link">Talk to us</Link></div></section>
  </main>;
}
