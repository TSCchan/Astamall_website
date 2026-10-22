'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

// A draggable, snap-scrolling product rail. Native scrolling keeps touch and trackpads natural.
export function ProductRail({ children, label }: { children: ReactNode; label: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    const update = () => setEdges({ start: node.scrollLeft < 8, end: node.scrollLeft + node.clientWidth > node.scrollWidth - 8 });
    update();
    node.addEventListener('scroll', update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(node);
    return () => { node.removeEventListener('scroll', update); resize.disconnect(); };
  }, []);
  const page = (direction: number) => {
    const node = rail.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * .8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return <div className="product-rail-wrap">
    <div className="product-rail-controls">
      <button className="icon-button rail-button" onClick={() => page(-1)} disabled={edges.start} aria-label={`Previous ${label}`}><ArrowLeft size={18} /></button>
      <button className="icon-button rail-button" onClick={() => page(1)} disabled={edges.end} aria-label={`Next ${label}`}><ArrowRight size={18} /></button>
    </div>
    <div ref={rail} className="product-rail" role="region" aria-label={label} tabIndex={0}>{children}</div>
  </div>;
}

// The category row reveals a stack of product photographs that drifts with the pointer.
export function CategoryRow({ children, images, href }: { children: ReactNode; images: string[]; href: string }) {
  const row = useRef<HTMLAnchorElement>(null);
  return <Link ref={row} href={href} className="category-row" onPointerMove={event => {
    if (event.pointerType !== 'mouse' || !row.current) return;
    const box = row.current.getBoundingClientRect();
    row.current.style.setProperty('--cx', `${event.clientX - box.left}px`);
  }}>
    {children}
    <span className="category-row-stack" aria-hidden="true">{images.map((src, i) => <img key={src} src={src} alt="" width="240" height="240" loading="lazy" style={{ ['--i' as string]: i }} />)}</span>
  </Link>;
}
