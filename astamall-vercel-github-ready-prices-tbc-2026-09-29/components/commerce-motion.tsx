'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Check, Plus } from '@phosphor-icons/react';
import { useStore } from '@/components/store-context';

export function AnimatedNumber({ value }: { value: number }) {
  const reduce = useReducedMotion();
  return <span className="number-window" aria-label={String(value)}><AnimatePresence initial={false} mode="popLayout"><motion.span key={value} aria-hidden="true" initial={reduce ? false : { y: 9, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? {} : { y: -9, opacity: 0 }} transition={{ duration: .18 }}>{value}</motion.span></AnimatePresence></span>;
}

export function AddButton({ slug, quantity = 1, quick = false, variant, label, onAdded }: { slug: string; quantity?: number; quick?: boolean; variant?: string; label?: string; onAdded?: () => void }) {
  const { add, loaded } = useStore();
  const reduce = useReducedMotion();
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  const locked = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); }; }, []);
  const text = state === 'added' ? 'Added to bag' : state === 'adding' ? 'Adding' : label ?? (quick ? 'Quick add' : 'Add to bag');
  return <button className={quick ? 'quick-add' : 'button add-button'} data-state={state} disabled={!loaded || state === 'adding'} aria-label={quick ? `${state === 'added' ? 'Added' : 'Quick add'} ${slug.replaceAll('-', ' ')}` : undefined} onClick={async event => {
    if (locked.current) return;
    locked.current = true;
    setState('adding');
    if (timer.current) clearTimeout(timer.current);
    await add(slug, quantity, { origin: event.currentTarget, variant });
    locked.current = false;
    if (!mounted.current) return;
    setState('added');
    onAdded?.();
    timer.current = setTimeout(() => setState('idle'), 1800);
  }}>
    <span className="add-button-fill" aria-hidden="true" />
    <span className="add-button-icon" aria-hidden="true"><AnimatePresence initial={false} mode="popLayout"><motion.span key={state === 'added' ? 'check' : 'plus'} initial={reduce ? false : { scale: .4, rotate: -45, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={reduce ? {} : { scale: .4, rotate: 45, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 24 }}>{state === 'added' ? <Check size={16} weight="bold" /> : <Plus size={16} />}</motion.span></AnimatePresence></span>
    <span className="add-button-label" aria-live="polite"><AnimatePresence initial={false} mode="popLayout"><motion.span key={text} initial={reduce ? false : { y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? {} : { y: -14, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>{text}</motion.span></AnimatePresence></span>
  </button>;
}

// A single material moves toward its destination; cart data updates immediately.
export function flyToCart(origin: HTMLElement | undefined, target: HTMLElement | null): { done: Promise<void>; cancel: () => void } {
  const source = origin?.closest('.product-card, .pdp-hero, .quick-shop, .buy-bar')?.querySelector<HTMLElement>('[data-product-art]');
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
