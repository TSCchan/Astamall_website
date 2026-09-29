'use client';

import { useLayoutEffect, useEffect, useRef, type ReactNode, type MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function PageTransitions({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const pending = useRef<{ resolve: () => void; timeout: ReturnType<typeof setTimeout>; slug?: string; source?: HTMLElement } | null>(null);
  const transition = useRef<ViewTransition | null>(null);
  useLayoutEffect(() => {
    const current = pending.current;
    if (!current) return;
    clearTimeout(current.timeout);
    current.source?.style.removeProperty('view-transition-name');
    if (current.slug) {
      const destination = document.querySelector<HTMLElement>('.gallery-main [data-product-art]');
      if (destination?.dataset.productArt === current.slug) destination.style.viewTransitionName = 'astamall-product';
    }
    pending.current = null;
    current.resolve();
  }, [path]);
  useEffect(() => () => { if (pending.current) { clearTimeout(pending.current.timeout); pending.current.resolve(); } transition.current?.skipTransition(); }, []);

  function navigate(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname === path || url.hash) return;
    // Checkout stays quiet and inputs never animate while being edited.
    if (path === '/checkout' || url.pathname === '/checkout' || url.pathname === '/order-confirmation') return;
    event.preventDefault(); event.stopPropagation();
    if (pending.current) { clearTimeout(pending.current.timeout); pending.current.resolve(); pending.current = null; }
    transition.current?.skipTransition();
    document.querySelectorAll<HTMLElement>('[data-product-art]').forEach(el => el.style.removeProperty('view-transition-name'));
    const source = link.closest('.product-card')?.querySelector<HTMLElement>('[data-product-art]');
    const slug = source?.dataset.productArt;
    if (source && url.pathname === `/shop/${slug}`) source.style.viewTransitionName = 'astamall-product';
    const current = document.startViewTransition(() => new Promise<void>(resolve => {
      const timeout = setTimeout(() => { pending.current = null; resolve(); }, 1400);
      pending.current = { resolve, timeout, source: source || undefined, slug };
      router.push(url.pathname + url.search);
    }));
    transition.current = current;
    void current.finished.catch(() => {}).finally(() => {
      if (transition.current !== current) return;
      document.querySelectorAll<HTMLElement>('[data-product-art]').forEach(el => el.style.removeProperty('view-transition-name'));
      transition.current = null;
    });
  }
  return <div onClickCapture={navigate}>{children}</div>;
}
