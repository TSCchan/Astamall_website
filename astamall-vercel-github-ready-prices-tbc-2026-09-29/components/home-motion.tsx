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
export function CategoryRow({ children, images, href, category }: { children: ReactNode; images: string[]; href: string; category: string }) {
  const row = useRef<HTMLAnchorElement>(null);
  return <Link ref={row} href={href} className="category-row" data-category={category} onPointerMove={event => {
    if (event.pointerType !== 'mouse' || !row.current) return;
    const box = row.current.getBoundingClientRect();
    row.current.style.setProperty('--cx', `${event.clientX - box.left}px`);
  }}>
    {children}
    <span className="category-row-stack" aria-hidden="true">{images.map((src, i) => <img key={src} src={src} alt="" width="240" height="240" loading="lazy" style={{ ['--i' as string]: i }} />)}</span>
  </Link>;
}

// The ingredient marquee. Hovering eases it to a stop (and back); on touch screens a tap pauses or resumes it.
export function Marquee({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current;
    const animation = node?.querySelector('.lux-marquee-track')?.getAnimations()[0];
    if (!node || !animation) return;
    node.dataset.js = '';
    let rate = 1, aim = 1, frame = 0, held = false;
    const ease = () => {
      rate += (aim - rate) * 0.12;
      if (Math.abs(aim - rate) < 0.004) rate = aim;
      animation.playbackRate = rate;
      frame = rate === aim ? 0 : requestAnimationFrame(ease);
    };
    const to = (value: number) => { aim = value; if (!frame) frame = requestAnimationFrame(ease); };
    const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') to(0); };
    const leave = (e: PointerEvent) => { if (e.pointerType === 'mouse' && !held) to(1); };
    const tap = (e: PointerEvent) => { if (e.pointerType !== 'mouse') { held = !held; to(held ? 0 : 1); } };
    node.addEventListener('pointerenter', enter);
    node.addEventListener('pointerleave', leave);
    node.addEventListener('pointerdown', tap);
    // a page that glides under a resting cursor never fires pointerenter
    if (node.matches(':hover')) to(0);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener('pointerenter', enter);
      node.removeEventListener('pointerleave', leave);
      node.removeEventListener('pointerdown', tap);
      animation.playbackRate = 1;
    };
  }, []);
  return <div ref={root} className="lux-marquee" aria-hidden="true"><div className="lux-marquee-track">{[0, 1].map(copy =>
    <div className="lux-marquee-group" key={copy}>{items.map(item => <span key={item}>{item}<i>✦</i></span>)}</div>)}</div></div>;
}
