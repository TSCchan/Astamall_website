export { Logo, ProductArt } from '@/components/brand-assets';
export { ProductCard } from '@/components/product-card';
export { default as Footer } from '@/components/ui/footer-section-1';

export function PageHeading({ title, text, label }: { title: string; text?: string; label?: string }) {
  return <div className="page-heading">{label && <p className="eyebrow">{label}</p>}<h1>{title}</h1>{text && <p className="intro-text">{text}</p>}</div>;
}
