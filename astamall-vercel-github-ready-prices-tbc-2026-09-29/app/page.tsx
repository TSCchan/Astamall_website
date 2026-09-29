import Link from 'next/link';
import Reveal from '@/components/reveal';
import { ProductArt, ProductCard } from '@/components/brand';
import { FaqList } from '@/components/forms';
import { products, articles } from '@/lib/catalog';

const categories = [
  { name: 'Skincare', product: products.find(p => p.slug === 'asta-s-rejuvenating-serum')! },
  { name: 'Health Foods', product: products.find(p => p.slug === 'astamall-collagen')! },
  { name: 'Health Supplements', product: products.find(p => p.slug === 'uc-flex-plus-capsules')! },
];

export default function Home() {
  return <main id="main-content" className="premium-home">
    <div id="top" />
    <section className="static-landing" aria-labelledby="static-landing-title">
      <h1 id="static-landing-title" className="sr-only">Malaysia&apos;s home of astaxanthin beauty and wellness.</h1>
      <p className="sr-only">Discover beauty and wellness products from Taiwan, selected with ingredient understanding at their heart.</p>
      <img className="static-landing-desktop" src="/assets/astamall-static-landing-v1.png" alt="ASTAMALL beauty and wellness collection featuring skincare, lip care and beauty nutrition products" width="1840" height="907" fetchPriority="high" />
      <Link className="static-landing-shop-link static-landing-shop-link-desktop" href="/shop"><span className="sr-only">Shop ASTAMALL</span></Link>
      <div className="static-landing-mobile" aria-hidden="true"><div className="static-landing-mobile-copy" /><div className="static-landing-mobile-products" /></div>
      <Link className="static-landing-shop-link static-landing-shop-link-mobile" href="/shop"><span className="sr-only">Shop ASTAMALL</span></Link>
    </section>
    <section className="brand-intro section-pad" id="about"><Reveal>
      <div className="brand-intro-copy"><h2>Malaysia&apos;s Home of Astaxanthin Beauty &amp; Wellness.</h2><p>Beauty, wellness and meaningful ingredients, thoughtfully brought from Taiwan to Malaysia.</p></div>
      <div className="pillar-editorial"><article><span>SCIENCE</span><h3>Understand what goes into the products.</h3></article><article><span>BEAUTY</span><h3>Discover products designed for everyday beauty routines.</h3></article><article><span>WELLNESS</span><h3>Explore beauty and nourishment from within.</h3></article></div>
    </Reveal></section>
    <section className="section-pad featured-section" id="collection"><Reveal>
      <div className="section-heading"><h2>Products with purpose.</h2><p>Skincare, health foods and health supplements for everyday rituals.</p></div>
      <div className="featured-grid">{products.slice(0, 3).map(product => <ProductCard key={product.slug} product={product} minimal />)}</div>
      <Link className="button" href="/shop">Shop ASTAMALL <span aria-hidden="true">↗</span></Link>
    </Reveal></section>
    <section className="ingredient-feature" id="astaxanthin"><div className="ingredient-photo"><img src="/assets/astaxanthin-droplet-v1.webp" alt="Astaxanthin-inspired red liquid with suspended particles" width="1024" height="1536" loading="lazy" /></div><Reveal className="ingredient-feature-copy"><h2>Meet Astaxanthin.</h2><p className="ingredient-lead">The ingredient that started ASTAMALL.</p><p>Our collection began with one vivid red ingredient and a desire to understand beauty products more clearly.</p><Link href="/astaxanthin" className="text-link">Discover Astaxanthin <span aria-hidden="true">↗</span></Link></Reveal></section>
    <section className="technology-feature section-pad"><Reveal><div className="technology-composition"><div className="technology-copy"><h2>Powered by Asta-S® Free-Form Astaxanthin</h2><p>A Taiwan-developed ingredient technology featured within selected ASTAMALL formulas.</p><Link href="/ingredients/asta-s" className="text-link">Explore the Ingredient <span aria-hidden="true">↗</span></Link></div><div className="technology-product"><ProductArt product={products.find(p => p.slug === 'asta-s-rejuvenating-serum')!} /><img src="/assets/astaxanthin-powder-cutout-v2.webp" alt="Astaxanthin-inspired ingredient texture" width="1024" height="1024" loading="lazy" /></div></div></Reveal></section>
    <section className="awards-section section-pad"><Reveal><h2>Recognition, presented simply.</h2><div className="award-list"><div><strong>2022</strong><p>Asta-S Rejuvenating Serum</p><span>Monde Selection, Grand Gold Award<br />National Yushan Award, Best Product Category</span></div><div><strong>2022</strong><p>Asta-S Glow Lipstick</p><span>Taiwan Top10 Skincare Product</span></div></div><p className="small-text">Awards are listed in available product materials. Supporting documents are awaiting review.</p></Reveal></section>
    <section id="categories" className="section-pad category-section"><h2>Shop by category.</h2><div className="category-gallery">{categories.map(({ name, product }, index) => <Link className={`category-tile category-tile-${index}`} href={`/shop?category=${encodeURIComponent(name)}`} key={name}><ProductArt product={product} /><span>{name}<span aria-hidden="true">↗</span></span></Link>)}</div></section>
    <section className="journal-section section-pad"><h2>ASTAMALL Journal</h2><div className="journal-list">{articles.slice(0, 3).map((article, index) => <Link href={`/journal/${article.slug}`} key={article.slug} className="journal-item"><div className={`journal-art journal-art-${index}`}><img src={index === 2 ? '/assets/astaxanthin-powder-cutout-v2.webp' : '/assets/astaxanthin-droplet-v1.webp'} alt="" loading="lazy" /></div><span>{article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p></Link>)}</div></section>
    <section className="faq-section section-pad"><div><h2>Questions, answered clearly.</h2><Link className="text-link" href="/faq">View all questions <span aria-hidden="true">↗</span></Link></div><FaqList compact /></section>
    <section className="prefooter-product section-pad"><div className="prefooter-copy"><h2>Beauty worth understanding.</h2><p>Explore science-led beauty and wellness products selected with purpose.</p><Link href="/shop" className="button button-light">Shop ASTAMALL <span aria-hidden="true">↗</span></Link></div><div className="prefooter-art"><ProductArt product={products.find(p => p.slug === 'asta-s-rejuvenating-serum')!} /></div></section>
  </main>;
}
