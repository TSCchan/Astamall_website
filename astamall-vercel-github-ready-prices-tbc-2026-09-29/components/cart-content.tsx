'use client';

import Link from 'next/link';
import { cartLineKey, type CartLine } from '@/lib/cart-store';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Minus, Plus, Trash, ShoppingBag, ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react';
import { useStore } from '@/components/store-context';
import { ProductArt } from '@/components/brand-assets';
import { AnimatedNumber } from '@/components/commerce-motion';
import { products, money, productOptions } from '@/lib/catalog';

// The order request carries every bag line into the contact form, so pricing can be confirmed by reply.
export function orderRequestHref(lines: CartLine[]) {
  const items = lines.map(line => {
    const p = products.find(p => p.slug === line.slug)!;
    return `${line.quantity} × ${p.name} (${line.variant || productOptions(p).options[0].label})`;
  }).join('\n');
  return '/contact?' + new URLSearchParams({ topic: 'Orders', items }).toString();
}

export function CartContents({ onNavigate, fullPage = false }: { onNavigate?: () => void; fullPage?: boolean }) {
  const { lines, loaded, update } = useStore();
  const reduce = useReducedMotion();
  if (!loaded) return <div className="cart-skeleton" role="status" aria-label="Loading your bag"><span /><span /><span /></div>;
  const totalKnown = lines.every(l => products.find(p => p.slug === l.slug)?.price != null);
  const subtotal = totalKnown ? lines.reduce((sum, l) => sum + (products.find(p => p.slug === l.slug)?.price || 0) * l.quantity, 0) : null;
  const units = lines.reduce((n, l) => n + l.quantity, 0);
  return <div className={fullPage ? 'full-cart-layout' : 'drawer-cart-layout'}>
    <div className="cart-items-region">
      {fullPage && lines.length > 0 && <div className="cart-column-heading"><span>Product</span><span>Quantity · Subtotal</span></div>}
      <motion.div layout={!reduce} className="cart-lines"><AnimatePresence initial={false}>
        {lines.map((line, index) => {
          const p = products.find(p => p.slug === line.slug)!;
          return <motion.div layout={!reduce ? 'position' : false} className="cart-line bag-line" key={cartLineKey(line)} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: reduce ? 0 : Math.min(index, 6) * .04 } }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: 24, height: 0, paddingTop: 0, paddingBottom: 0, margin: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
            <Link href={`/shop/${p.slug}`} onClick={onNavigate} className="bag-line-art" tabIndex={-1} aria-hidden="true"><ProductArt product={p} /></Link>
            <div className="cart-line-details">
              <Link href={`/shop/${p.slug}`} onClick={onNavigate} className="bag-line-name">{p.name}</Link>
              <p className="bag-line-meta">{line.variant || productOptions(p).options[0].label}{fullPage && <> · {money(p.price)} each</>}</p>
              <div className="bag-line-row">
                <div className="quantity"><button disabled={line.quantity <= 1} onClick={() => update(cartLineKey(line), line.quantity - 1)} aria-label={`Decrease ${p.short} quantity`}><Minus size={14} /></button><AnimatedNumber value={line.quantity} /><button disabled={line.quantity >= 99} onClick={() => update(cartLineKey(line), line.quantity + 1)} aria-label={`Increase ${p.short} quantity`}><Plus size={14} /></button></div>
                <p className="line-subtotal"><span className="sr-only">Subtotal: </span>{p.price === null ? <span className="price-tbc">Price to be confirmed</span> : money(p.price * line.quantity)}</p>
              </div>
            </div>
            <button className="icon-button bag-remove" onClick={() => update(cartLineKey(line), 0)} aria-label={`Remove ${p.name}`}><Trash size={18} weight="light" /></button>
          </motion.div>;
        })}
      </AnimatePresence></motion.div>
      {!lines.length && <motion.div className="empty-state branded-empty" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><span className="empty-bag-icon"><ShoppingBag size={34} weight="thin" /></span><h2>Your ASTAMALL ritual starts here.</h2><p>A little beauty. A little understanding.<br />Find the first piece of your daily ritual.</p><Link href="/shop" onClick={onNavigate} className="button">Explore the Collection <ArrowUpRight size={18} /></Link></motion.div>}
      {fullPage && lines.length > 0 && <Link href="/shop" className="text-link continue-shopping">Continue Shopping <ArrowUpRight size={16} /></Link>}
    </div>
    {lines.length > 0 && <motion.aside initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} className="cart-summary bag-summary">
      {fullPage && <h2>Order summary</h2>}
      <div><span>Items</span><strong><AnimatedNumber value={units} /></strong></div>
      <div><span>Subtotal</span><strong aria-live="polite">{money(subtotal)}</strong></div>
      <div className="summary-delivery"><span>Delivery</span><span>Confirmed before launch</span></div>
      <p>Prices and delivery charges are to be confirmed before ordering opens. Send your bag as an order request and we will reply with pricing and availability.</p>
      <Link href={orderRequestHref(lines)} onClick={onNavigate} className="button bag-request">Send order request <EnvelopeSimple size={18} /></Link>
      <div className="bag-secondary">
        <Link href="/checkout" onClick={onNavigate} className="text-link">Checkout preview</Link>
        {!fullPage && <Link href="/cart" onClick={onNavigate} className="text-link">View bag</Link>}
      </div>
      <p className="small-text">Storefront preview. No orders or payments are taken online.</p>
    </motion.aside>}
  </div>;
}
