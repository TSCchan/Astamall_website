'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { MagnifyingGlass, ShoppingBag, User, List, X } from '@phosphor-icons/react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Logo, ProductArt } from '@/components/brand-assets';
import { products, productOptions } from '@/lib/catalog';
import { cartLineKey, changeCart, getCartSnapshot, getServerCartSnapshot, subscribeCart } from '@/lib/cart-store';

import { StoreContext, type Store } from '@/components/store-context';
import { AnimatedNumber, flyToCart } from '@/components/commerce-motion';
import { CartContents } from '@/components/cart-content';
import PageTransitions from '@/components/page-transitions';
export { CartContents } from '@/components/cart-content';

const navigation = [['/', 'Home'], ['/shop', 'Shop'], ['/astaxanthin', 'Astaxanthin'], ['/about', 'About'], ['/journal', 'Journal'], ['/faq', 'FAQ']];

export default function StoreShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const cart = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);
  const { loaded, storageError } = cart;
  const lines = useMemo(() => cart.lines.filter(line => products.some(p => p.slug === line.slug && p.price !== null)), [cart.lines]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [previousPath, setPreviousPath] = useState(path);
  // Reset route-local overlays before the new route commits, not in a cascading effect.
  if (path !== previousPath) {
    setPreviousPath(path);
    setCartOpen(false); setMenuOpen(false); setSearchOpen(false); setAccountOpen(false);
  }
  const feedback = useRef<{ cancel: () => void } | null>(null);
  const cartOrigin = useRef<HTMLElement | null>(null);
  const routeRef = useRef(path);
  useEffect(() => { routeRef.current = path; return () => { feedback.current?.cancel(); feedback.current = null; }; }, [path]);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const value = useMemo<Store>(() => ({
    lines, loaded,
    add: async (slug, quantity = 1, options = {}) => {
      if (!products.some(p => p.slug === slug && p.price !== null)) return;
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
  const results = products.filter(p => `${p.name} ${p.category} ${p.ingredient}`.toLowerCase().includes(query.toLowerCase().trim()));

  return <StoreContext.Provider value={value}><PageTransitions><div className={path === '/' ? 'home-shell static-home-shell' : 'inner-shell'}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <Logo />
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([href, label]) => <Link href={href} key={href} aria-current={path === href ? 'page' : undefined}>{label}</Link>)}</nav>
      <div className="header-actions">
        <button id="search-trigger" className="icon-button" onClick={() => setSearchOpen(true)} aria-label="Search products"><MagnifyingGlass size={21} weight="light" /></button>
        <button id="account-trigger" className="icon-button account-action" onClick={() => setAccountOpen(true)} aria-label="Account information"><User size={21} weight="light" /></button>
        <button id="cart-trigger" className="icon-button cart-action" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}><ShoppingBag size={22} weight="light" />{count > 0 && <span className="cart-count"><AnimatedNumber value={count} /></span>}</button>
        <button id="menu-trigger" className="icon-button mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><List size={24} weight="light" /></button>
      </div>
    </header>
    {children}
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetContent className="brand-sheet" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); document.getElementById("menu-trigger")?.focus(); }}><SheetTitle className="panel-title">ASTAMALL</SheetTitle><SheetDescription>Beauty, powered by Astaxanthin.</SheetDescription><SheetClose className="icon-button panel-close" aria-label="Close navigation"><X size={22} /></SheetClose><nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map(([href, label]) => <Link href={href} onClick={() => setMenuOpen(false)} key={href}>{label}</Link>)}</nav></SheetContent></Sheet>
    <Sheet open={cartOpen} onOpenChange={setCartOpen}><SheetContent className="brand-sheet cart-sheet" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); (cartOrigin.current?.isConnected ? cartOrigin.current : document.getElementById("cart-trigger"))?.focus(); }}><SheetTitle className="panel-title">Your collection</SheetTitle><SheetDescription>Storefront preview. No orders or payments are taken.</SheetDescription><SheetClose className="icon-button panel-close" aria-label="Close cart"><X size={22} /></SheetClose><CartContents onNavigate={() => setCartOpen(false)} />{storageError && <p role="status" className="notice">Your browser could not save this cart. It is available only for this visit.</p>}</SheetContent></Sheet>
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}><DialogContent className="brand-dialog" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); document.getElementById("search-trigger")?.focus(); }}><DialogTitle className="panel-title">Find your next ritual.</DialogTitle><DialogDescription>Search by product, category or ingredient.</DialogDescription><DialogClose className="icon-button panel-close" aria-label="Close search"><X size={22} /></DialogClose><label className="field">Search products<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try serum or Asta-S" type="search" /></label><p className="small-text" aria-live="polite">{results.length} products found</p><div className="search-results">{results.map(p => <Link href={`/shop/${p.slug}`} key={p.slug} onClick={() => setSearchOpen(false)}><ProductArt product={p} /><span>{p.name}<small>{p.category}</small></span><span aria-hidden="true">↗</span></Link>)}{results.length === 0 && <p>No products match that search. Try a category such as skincare or health foods.</p>}</div></DialogContent></Dialog>
    <Dialog open={accountOpen} onOpenChange={setAccountOpen}><DialogContent className="brand-dialog" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); document.getElementById("account-trigger")?.focus(); }}><DialogTitle className="panel-title">A little more to come.</DialogTitle><DialogDescription>Customer accounts are not available in this storefront preview. Your cart is saved on this browser only.</DialogDescription><DialogClose className="icon-button panel-close" aria-label="Close account information"><X size={22} /></DialogClose><Link href="/contact" className="button" onClick={() => setAccountOpen(false)}>Contact Us</Link></DialogContent></Dialog>
  </div></PageTransitions></StoreContext.Provider>;
}
