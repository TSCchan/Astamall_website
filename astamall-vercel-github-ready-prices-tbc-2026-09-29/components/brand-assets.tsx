import Link from 'next/link';
import type { Product } from '@/lib/catalog';

export function Logo({ className = '' }: { className?: string }) {
  return <Link href="/" className={`brand-logo ${className}`} aria-label="ASTAMALL home"><img src="/assets/astamall-logo-transparent-v1.webp" alt="ASTAMALL" width="1120" height="912" /></Link>;
}

export function ProductArt({ product, className = '', priority = false }: { product: Product; className?: string; priority?: boolean }) {
  if (product.image) return <div data-product-art={product.slug} className={`product-visual official-product-art ${className}`}>
    <img src={product.image} alt={product.imageAlt || product.name} width="800" height="800" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />
    {priority && <link rel="preload" as="image" href={product.image} />}
  </div>;
  // Remaining products use one six-cell illustrative sprite until their official photography is supplied.
  return <div data-product-art={product.slug} className={`product-visual ${className}`} role="img" aria-label={`Illustrative ${product.short.toLowerCase()} packaging, not the final product photograph`}>
    <div className="product-sprite" style={{ backgroundPosition: product.position }} />
    {priority && <link rel="preload" as="image" href="/assets/astamall-product-sprite-v1.webp" />}
  </div>;
}
