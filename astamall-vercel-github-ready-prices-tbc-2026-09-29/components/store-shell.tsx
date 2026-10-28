'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { ShoppingBag, List, X } from '@phosphor-icons/react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Logo } from '@/components/brand-assets';
import { products, productOptions } from '@/lib/catalog';
import { cartLineKey, changeCart, getCartSnapshot, getServerCartSnapshot, subscribeCart } from '@/lib/cart-store';

import { StoreContext, type Store } from '@/components/store-context';
import { AnimatedNumber, flyToCart } from '@/components/commerce-motion';
import { CartContents } from '@/components/cart-content';
import PageTransitions from '@/components/page-transitions';
export { CartContents } from '@/components/cart-content';

const navigation = [['/', 'Home'], ['/shop', 'Shop'], ['/about', 'Our story'], ['/journal', 'Journal'], ['/contact', 'Contact']];

export default function StoreShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const headerNavigation = navigation;
  const cart = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);
  const { loaded, storageError } = cart;
  // Products awaiting Malaysian pricing can still be collected; prices are confirmed with the order request.
  const lines = useMemo(() => cart.lines.filter(line => products.some(p => p.slug === line.slug)), [cart.lines]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState(path);
  // Reset route-local overlays before the new route commits, not in a cascading effect.
  if (path !== previousPath) {
    setPreviousPath(path);
    setCartOpen(false); setMenuOpen(false);
  }
  const feedback = useRef<{ cancel: () => void } | null>(null);
  const cartOrigin = useRef<HTMLElement | null>(null);
  const routeRef = useRef(path);
  const sentinel = useRef<HTMLDivElement>(null);
  // The header condenses once the page leaves its first screen; no scroll listener runs.
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => document.documentElement.toggleAttribute('data-scrolled', !entry.isIntersecting));
    observer.observe(node);
    return () => { observer.disconnect(); document.documentElement.removeAttribute('data-scrolled'); };
  }, []);
  useEffect(() => { routeRef.current = path; return () => { feedback.current?.cancel(); feedback.current = null; }; }, [path]);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const value = useMemo<Store>(() => ({
    lines, loaded,
    add: async (slug, quantity = 1, options = {}) => {
      if (!products.some(p => p.slug === slug)) return;
      const product = products.find(p => p.slug === slug)!;
      const available = productOptions(product).options;
      const variant = available.some(o => o.label === options.variant) ? options.variant : available[0].label;
      const line = { slug, variant, quantity: Math.max(1, Math.min(99, quantity)) };
      const id = cartLineKey(line);
      changeCart(previous => { const prev = previous.map(l => l.slug === slug && !l.variant ? { ...l, variant: available[0].label } : l); return prev.some(l => cartLineKey(l) === id) ? prev.map(l => cartLineKey(l) === id ? { ...l, quantity: Math.min(99, l.quantity + line.quantity) } : l) : [...prev, line]; });
      if (options.drawer === false) return;
      cartOrigin.current = options.origin || (document.activeElement as HTMLElement);
      feedback.current?.cancel();
      const route = routeRef.current;
      const target = document.getElementById('cart-trigger');
      const flight = flyToCart(options.origin, target);
      feedback.current = flight;
      await flight.done;
      if (routeRef.current !== route || feedback.current !== flight) return;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) target?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }], { duration: 280, easing: 'cubic-bezier(.2,.8,.2,1)' });
      setCartOpen(true);
    },
    update: (slug, quantity) => changeCart(prev => quantity < 1 ? prev.filter(l => cartLineKey(l) !== slug) : prev.map(l => cartLineKey(l) === slug ? { ...l, quantity: Math.min(99, quantity) } : l)),
    openCart: () => { cartOrigin.current = document.getElementById('cart-trigger'); setCartOpen(true); },
  }), [lines, loaded]);

  return <StoreContext.Provider value={value}><PageTransitions><div className={path === '/' ? 'home-shell cinematic-home-shell' : 'inner-shell'}>
    <div ref={sentinel} className="scroll-sentinel" aria-hidden="true" />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <Logo />
      <nav className="desktop-nav" aria-label="Main navigation">{headerNavigation.map(([href, label]) => <Link href={href} key={href} aria-current={path === href || (href !== '/' && path.startsWith(href + '/')) ? 'page' : undefined}>{label}</Link>)}</nav>
      <div className="header-actions">
        <button id="cart-trigger" className="icon-button cart-action" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}><ShoppingBag size={22} weight="light" />{count > 0 && <span className="cart-count"><AnimatedNumber value={count} /></span>}</button>
        <button id="menu-trigger" className="icon-button mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><List size={24} weight="light" /></button>
      </div>
    </header>
    {children}
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetContent className="brand-sheet" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); document.getElementById("menu-trigger")?.focus(); }}><SheetTitle className="panel-title">ASTAMALL</SheetTitle><SheetDescription>Beauty, powered by Astaxanthin.</SheetDescription><SheetClose className="icon-button panel-close" aria-label="Close navigation"><X size={22} /></SheetClose><nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map(([href, label]) => <Link href={href} onClick={() => setMenuOpen(false)} key={href}>{label}</Link>)}</nav></SheetContent></Sheet>
    <Sheet open={cartOpen} onOpenChange={setCartOpen}><SheetContent className="brand-sheet cart-sheet" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); (cartOrigin.current?.isConnected ? cartOrigin.current : document.getElementById("cart-trigger"))?.focus(); }}><SheetTitle className="panel-title">Your bag{count > 0 && <span className="panel-count">{count}</span>}</SheetTitle><SheetDescription>Prices are confirmed with your order request.</SheetDescription><SheetClose className="icon-button panel-close" aria-label="Close cart"><X size={22} /></SheetClose><CartContents onNavigate={() => setCartOpen(false)} />{storageError && <p role="status" className="notice">Your browser could not save this cart. It is available only for this visit.</p>}</SheetContent></Sheet>
  </div></PageTransitions></StoreContext.Provider>;
}
