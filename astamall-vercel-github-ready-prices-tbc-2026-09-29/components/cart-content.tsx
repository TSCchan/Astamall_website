'use client';

import Link from 'next/link';
import { cartLineKey } from '@/lib/cart-store';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Minus, Plus, Trash, ShoppingBag, ArrowUpRight } from '@phosphor-icons/react';
import { useStore } from '@/components/store-context';
import { ProductArt } from '@/components/brand-assets';
import { AnimatedNumber } from '@/components/commerce-motion';
import { products, money, productOptions } from '@/lib/catalog';

export function CartContents({ onNavigate, fullPage = false }: { onNavigate?: () => void; fullPage?: boolean }) {
  const { lines, loaded, update } = useStore();
  const reduce = useReducedMotion();
  if (!loaded) return <p role="status">Loading your cart…</p>;
  const totalKnown = lines.every(l => products.find(p => p.slug === l.slug)?.price != null);
  const subtotal = totalKnown ? lines.reduce((sum, l) => sum + (products.find(p => p.slug === l.slug)?.price || 0) * l.quantity, 0) : null;
  return <div className={fullPage ? 'full-cart-layout' : 'drawer-cart-layout'}>
    <div className="cart-items-region">
      {fullPage && lines.length > 0 && <div className="cart-column-heading"><span>Product</span><span>Quantity · Price · Subtotal</span></div>}
      <motion.div layout={!reduce} className="cart-lines"><AnimatePresence initial={false}>
        {lines.map(line => {
          const p = products.find(p => p.slug === line.slug)!;
          return <motion.div layout={!reduce ? 'position' : false} className="cart-line" key={cartLineKey(line)} initial={reduce ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: .95, height: 0, paddingTop: 0, paddingBottom: 0, margin: 0 }} transition={{ duration: .24, ease: [.22, 1, .36, 1] }}>
            <ProductArt product={p} /><div className="cart-line-details"><Link href={`/shop/${p.slug}`} onClick={onNavigate}>{p.name}</Link><p className="small-text">{line.variant || productOptions(p).options[0].label}</p><p className="small-text">{money(p.price)}</p><div className="quantity"><button disabled={line.quantity <= 1} onClick={() => update(cartLineKey(line), line.quantity - 1)} aria-label={`Decrease ${p.short} quantity`}><Minus size={14} /></button><AnimatedNumber value={line.quantity} /><button disabled={line.quantity >= 99} onClick={() => update(cartLineKey(line), line.quantity + 1)} aria-label={`Increase ${p.short} quantity`}><Plus size={14} /></button></div><p className="line-subtotal">Subtotal: {p.price === null ? 'To Be Confirmed' : money(p.price * line.quantity)}</p></div>
            <button className="icon-button" onClick={() => update(cartLineKey(line), 0)} aria-label={`Remove ${p.name}`}><Trash size={18} weight="light" /></button>
          </motion.div>;
        })}
      </AnimatePresence></motion.div>
      {!lines.length && <div className="empty-state branded-empty"><ShoppingBag size={48} weight="thin" /><span className="empty-rule" /><h2>Your ASTAMALL ritual starts here.</h2><p>A little beauty. A little understanding.<br />Find the first piece of your daily ritual.</p><Link href="/shop" onClick={onNavigate} className="button">Explore the Collection <ArrowUpRight size={18} /></Link></div>}
      {fullPage && lines.length > 0 && <Link href="/shop" className="text-link continue-shopping">Continue Shopping <ArrowUpRight size={16} /></Link>}
    </div>
    {lines.length > 0 && <motion.aside initial={reduce ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .3 }} className="cart-summary">{fullPage && <h2>Order summary</h2>}<div><span>Subtotal</span><strong aria-live="polite">{money(subtotal)}</strong></div><div className="summary-delivery"><span>Delivery</span><span>Confirmed before launch</span></div><p>Prices and delivery charges are to be confirmed before ordering opens.</p><Link href="/checkout" onClick={onNavigate} className="button">{fullPage ? 'Proceed to Checkout' : 'Checkout'} <ArrowUpRight size={18} /></Link>{!fullPage && <Link href="/cart" onClick={onNavigate} className="text-link">View Cart</Link>}</motion.aside>}
  </div>;
}
