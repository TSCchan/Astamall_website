'use client';

import Link from 'next/link';
import { ArrowUpRight, X } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProductArt } from '@/components/brand-assets';
import { money, type Product } from '@/lib/catalog';

export default function ProductQuickView({ product }: { product: Product }) {
  return <Dialog><DialogTrigger className="quick-view-trigger" aria-label={`Quick view ${product.name}`}>Quick view <span aria-hidden="true">+</span></DialogTrigger>
    <DialogContent className="product-quick-dialog" showCloseButton={false}>
      <DialogClose className="icon-button panel-close" aria-label="Close quick view"><X size={22} /></DialogClose>
      <div className="quick-view-image"><ProductArt product={product} /></div>
      <div className="quick-view-copy"><span className="product-category-label">{product.category}</span><DialogTitle>{product.name}</DialogTitle><DialogDescription>{product.description}</DialogDescription>
        <dl className="quick-view-facts"><div><dt>Size</dt><dd>{product.size || 'Refer to packaging'}</dd></div><div><dt>Featured ingredient</dt><dd>{product.ingredient}</dd></div></dl>
        <p className="quick-view-price">{money(product.price)}</p>
        <DialogClose asChild><Link className="button" href={`/shop/${product.slug}`}>Explore product <ArrowUpRight size={18} /></Link></DialogClose>
        <p className="small-text">Full ingredients, directions and product references inside.</p>
      </div>
    </DialogContent>
  </Dialog>;
}
