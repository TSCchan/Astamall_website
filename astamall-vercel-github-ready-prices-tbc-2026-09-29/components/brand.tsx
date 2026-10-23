export { Logo, ProductArt } from '@/components/brand-assets';
export { ProductCard } from '@/components/product-card';
export { default as Footer } from '@/components/ui/footer-section-1';

export function PageHeading({ title, text, label }: { title: string; text?: string; label?: string }) {
  return <div className="page-heading">{label && <p className="eyebrow">{label}</p>}<h1>{title}</h1>{text && <p className="intro-text">{text}</p>}</div>;
}

// Typographic ingredient mark: a slowly turning caption ring around the ingredient's initials.
export function IngredientMark({ name, ring }: { name: string; ring: string }) {
  const initials = name.replace(/[^A-Za-z\s-]/g, '').split(/[\s-]+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('');
  return <div className="ingredient-mark" aria-hidden="true">
    <svg viewBox="0 0 300 300" className="ingredient-mark-ring"><defs><path id={`ring-${initials}`} d="M150,150 m-122,0 a122,122 0 1,1 244,0 a122,122 0 1,1 -244,0" /></defs><text><textPath href={`#ring-${initials}`} textLength="760" lengthAdjust="spacing">{`${ring} · ${ring} · `}</textPath></text></svg>
    <span className="ingredient-mark-core"><em>{initials.length > 1 ? initials[0] + initials[1].toLowerCase() : initials}</em></span>
  </div>;
}
