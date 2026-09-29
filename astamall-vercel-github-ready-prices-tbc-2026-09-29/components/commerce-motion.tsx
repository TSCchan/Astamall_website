'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Check, Plus } from '@phosphor-icons/react';
import { useStore } from '@/components/store-context';

export function AnimatedNumber({ value }: { value: number }) {
  const reduce = useReducedMotion();
  return <span className="number-window" aria-label={String(value)}><AnimatePresence initial={false} mode="popLayout"><motion.span key={value} aria-hidden="true" initial={reduce ? false : { y: 9, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? {} : { y: -9, opacity: 0 }} transition={{ duration: .18 }}>{value}</motion.span></AnimatePresence></span>;
}

export function AddButton({ slug, quantity = 1, quick = false, variant }: { slug: string; quantity?: number; quick?: boolean; variant?: string }) {
  const { add, loaded } = useStore();
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  const locked = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); }; }, []);
  return <button className={quick ? 'quick-add' : 'button add-button'} disabled={!loaded || state === 'adding'} aria-label={quick ? `${state === 'added' ? 'Added' : 'Quick Add'} ${slug.replaceAll('-', ' ')}` : undefined} onClick={async event => {
    if (locked.current) return;
    locked.current = true;
    setState('adding');
    if (timer.current) clearTimeout(timer.current);
    await add(slug, quantity, { origin: event.currentTarget, variant });
    locked.current = false;
    if (!mounted.current) return;
    setState('added');
    timer.current = setTimeout(() => setState('idle'), 1600);
  }}><span aria-hidden="true">{state === 'added' ? <Check size={16} /> : quick ? <Plus size={16} /> : null}</span><span aria-live="polite">{state === 'added' ? 'Added' : state === 'adding' ? 'Adding' : quick ? 'Quick Add' : 'Add to Cart'}</span></button>;
}

// A single material moves toward its destination; cart data updates immediately.
export function flyToCart(origin: HTMLElement | undefined, target: HTMLElement | null): { done: Promise<void>; cancel: () => void } {
  const source = origin?.closest('.product-card, .pdp-hero')?.querySelector<HTMLElement>('[data-product-art]');
  if (!source || !target || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !target.getBoundingClientRect().width || getComputedStyle(target).visibility === 'hidden') return { done: Promise.resolve(), cancel: () => {} };
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute('role'); clone.setAttribute('aria-hidden', 'true'); clone.removeAttribute('data-product-art');
  clone.classList.add('cart-flight');
  Object.assign(clone.style, { position: 'fixed', left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, margin: '0', zIndex: '60', pointerEvents: 'none' });
  document.body.appendChild(clone);
  const animation = clone.animate([{ transform: 'translate(0,0) scale(1)', opacity: .85 }, { transform: `translate(${to.left + to.width / 2 - from.left - from.width / 2}px,${to.top + to.height / 2 - from.top - from.height / 2}px) scale(.08)`, opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.32,.05,.24,1)', fill: 'forwards' });
  const done = animation.finished.then(() => {}, () => {}).finally(() => clone.remove());
  return { done, cancel: () => { animation.cancel(); clone.remove(); } };
}
