'use client';

import Link from 'next/link';
import { useState, type RefObject } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Minus, Plus, X } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProductArt } from '@/components/brand-assets';
import { AddButton, AnimatedNumber } from '@/components/commerce-motion';
import { OptionPicker } from '@/components/product-option-picker';
import { money, productOptions, type Product } from '@/lib/catalog';

// Quick shop: choose an option and quantity without leaving the collection.
export default function ProductQuickView({ product, open, onOpenChange, returnFocus }: { product: Product; open: boolean; onOpenChange: (open: boolean) => void; returnFocus: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const options = productOptions(product);
  const [variant, setVariant] = useState(options.options[0].label);
  const [quantity, setQuantity] = useState(1);
  const shade = product.galleryImages?.find(image => image.label === variant);
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="product-quick-dialog quick-shop" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); if (!document.querySelector('.cart-sheet[data-state=open]')) returnFocus.current?.focus(); }}>
      <DialogClose className="icon-button panel-close" aria-label="Close quick view"><X size={22} /></DialogClose>
      <div className="quick-view-image">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={shade?.src ?? 'product'} className="quick-view-layer" initial={reduce ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? {} : { opacity: 0, scale: .98 }} transition={{ duration: .45, ease: [.16, 1, .3, 1] }}>
            {shade ? <div className="product-visual official-product-art" data-product-art={product.slug}><img src={shade.src} alt={shade.alt} width="1254" height="1254" /></div> : <ProductArt product={product} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="quick-view-copy">
        <span className="product-category-label">{product.category}</span>
        <DialogTitle>{product.name}</DialogTitle>
        <p className="quick-view-price">{money(product.price)}</p>
        <DialogDescription>{product.description}</DialogDescription>
        <dl className="quick-view-facts"><div><dt>Size</dt><dd>{product.size || 'Refer to packaging'}</dd></div><div><dt>Featured ingredient</dt><dd>{product.ingredient}</dd></div></dl>
        {options.options.length > 1 && <OptionPicker name={`quick-${product.slug}`} label={options.label} options={options.options} value={variant} onChange={setVariant} compact />}
        <div className="purchase-controls">
          <div className="quantity" aria-label="Quantity"><button disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)} aria-label="Decrease quantity"><Minus size={16} /></button><AnimatedNumber value={quantity} /><button disabled={quantity >= 99} onClick={() => setQuantity(q => q + 1)} aria-label="Increase quantity"><Plus size={16} /></button></div>
          <AddButton key={variant} slug={product.slug} quantity={quantity} variant={variant} onAdded={() => onOpenChange(false)} />
        </div>
        <DialogClose asChild><Link className="text-link quick-view-more" href={`/shop/${product.slug}`}>Full ingredients, directions and product references <ArrowUpRight size={16} /></Link></DialogClose>
      </div>
    </DialogContent>
  </Dialog>;
}
