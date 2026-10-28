'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowUUpLeft, Check, EnvelopeSimple, Globe, Medal, Translate, Truck } from '@phosphor-icons/react';
import { productBrand, type Product } from '@/lib/catalog';

type Group = { id: string; label: string };

/**
 * Everything about a product in one place: an index down the side (desktop) and every group visible below,
 * in the order a shopper asks: what it is, what it does, how to use it, what is in it, care, then delivery and support.
 */
export function ProductInformation({ product, usageGuide, references }: { product: Product; usageGuide?: ReactNode; references?: ReactNode }) {
  const groups: Group[] = [
    { id: 'info-overview', label: 'Overview' },
    { id: 'info-benefits', label: 'Benefits' },
    { id: 'info-use', label: 'How to use' },
    { id: 'info-ingredients', label: 'Ingredients' },
    ...(product.cautions ? [{ id: 'info-care', label: 'Care & storage' }] : []),
    { id: 'info-support', label: 'Delivery & support' },
    ...(references ? [{ id: 'info-guides', label: 'Guides & references' }] : []),
  ];
  const [active, setActive] = useState(groups[0].id);

  // The index follows the group being read.
  useEffect(() => {
    const seen = new IntersectionObserver(entries => {
      const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.pi-group').forEach(el => seen.observe(el));
    return () => seen.disconnect();
  }, []);

  const facts: Array<[string, string]> = [
    ['Brand', product.sourceUrl ? 'NAFU LIFE' : productBrand],
    ['Origin', 'Taiwan'],
    ['Category', product.category],
    ['Size', product.size || 'Refer to product packaging'],
    ['Featured ingredient', product.ingredient],
    ...(product.purpose ? [['Purpose', product.purpose] as [string, string]] : []),
    ...(product.slug === 'asta-s-rejuvenating-serum' ? [['Texture', 'Fresh, lightweight oil serum'] as [string, string]] : []),
    ...(product.shelfLife ? [['Shelf life', product.shelfLife] as [string, string]] : []),
    ...(product.storage ? [['Storage', product.storage] as [string, string]] : []),
  ];
  const benefits = product.functions ?? ['Thoughtfully developed for ASTAMALL', 'Designed for an everyday beauty or wellness routine', 'Clear product guidance before launch'];
  const award = product.award?.split(';')[0].trim().replace(/\.$/, '');

  return <section className="pi" id="product-details" aria-labelledby="pi-title">
    <h2 id="pi-title" className="pi-title">Product information</h2>
    <div className="pi-layout">
      <nav className="pi-index" aria-label="Product information sections">
        <ol>{groups.map(g => <li key={g.id}><a href={`#${g.id}`} aria-current={active === g.id ? 'true' : undefined}>{g.label}</a></li>)}</ol>
      </nav>

      <div className="pi-groups">
        <section className="pi-group" id="info-overview" aria-labelledby="info-overview-title">
          <h3 id="info-overview-title">Overview</h3>
          <dl className="pi-facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>

        <section className="pi-group" id="info-benefits" aria-labelledby="info-benefits-title">
          <h3 id="info-benefits-title">Benefits</h3>
          <p className="pi-lead">{product.benefit}</p>
          <ul className="pi-checks">{benefits.map(item => <li key={item}><Check size={16} weight="bold" aria-hidden="true" />{item}</li>)}</ul>
          {product.official && <p className="pi-note">These cosmetic functions refer to appearance and skin feel.</p>}
        </section>

        <section className="pi-group" id="info-use" aria-labelledby="info-use-title">
          <h3 id="info-use-title">How to use</h3>
          {product.howToUse
            ? <ol className="pi-steps">{product.howToUse.map((step, i) => <li key={step}><span aria-hidden="true">{i + 1}</span><p>{step}</p></li>)}</ol>
            : <p className="pi-text">{product.routine}</p>}
          {usageGuide}
        </section>

        <section className="pi-group" id="info-ingredients" aria-labelledby="info-ingredients-title">
          <h3 id="info-ingredients-title">Ingredients</h3>
          {product.keyIngredients
            ? <dl className="pi-ingredients">{product.keyIngredients.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.description}</dd></div>)}</dl>
            : <p className="pi-text">Featured ingredient: {product.ingredient}.</p>}
          <p className="pi-note">{product.sourceUrl
            ? 'Key ingredients are shown here. Refer to the product packaging for the complete ingredient list.'
            : 'The complete ingredient list will be published when the final product label is confirmed.'}</p>
          <Link href="/ingredients" className="pi-link">Explore the ingredient library <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </section>

        {product.cautions && <section className="pi-group" id="info-care" aria-labelledby="info-care-title">
          <h3 id="info-care-title">Care &amp; storage</h3>
          <ul className="pi-bullets">{product.cautions.map(item => <li key={item}>{item}</li>)}</ul>
        </section>}

        <section className="pi-group" id="info-support" aria-labelledby="info-support-title">
          <h3 id="info-support-title">Delivery &amp; support</h3>
          <ul className="pi-support">
            <li><Globe size={22} weight="light" aria-hidden="true" /><div><strong>Developed in Taiwan</strong><span>Sourced from Taiwan and brought to Malaysia by ASTAMALL.</span></div></li>
            {award && <li><Medal size={22} weight="light" aria-hidden="true" /><div><strong>Award-recognised formula</strong><span>{award}.</span></div></li>}
            {product.sourceUrl && <li><Translate size={22} weight="light" aria-hidden="true" /><div><strong>Translated product details</strong><span>Translated from <a href={product.sourceUrl} target="_blank" rel="noreferrer">NAFU LIFE</a>. The packaging has the complete ingredients and directions.</span></div></li>}
            <li><Truck size={22} weight="light" aria-hidden="true" /><div><strong>Delivery</strong><span>Malaysia first. Coverage, charges and timings are published before orders open.</span><Link href="/shipping" className="pi-link">Delivery information <ArrowUpRight size={14} aria-hidden="true" /></Link></div></li>
            <li><ArrowUUpLeft size={22} weight="light" aria-hidden="true" /><div><strong>Returns</strong><span>Eligibility, timeframes and instructions are published before orders open.</span><Link href="/returns" className="pi-link">Returns &amp; care <ArrowUpRight size={14} aria-hidden="true" /></Link></div></li>
            <li><EnvelopeSimple size={22} weight="light" aria-hidden="true" /><div><strong>Questions</strong><span>Answered by email at astamall92@gmail.com.</span><Link href="/contact" className="pi-link">Contact us <ArrowUpRight size={14} aria-hidden="true" /></Link></div></li>
          </ul>
        </section>

        {references && <section className="pi-group" id="info-guides" aria-labelledby="info-guides-title">
          <h3 id="info-guides-title">Guides &amp; references</h3>
          <p className="pi-text">Translated source material, kept together for a closer look.</p>
          <div className="pi-references">{references}</div>
        </section>}
      </div>
    </div>
  </section>;
}
