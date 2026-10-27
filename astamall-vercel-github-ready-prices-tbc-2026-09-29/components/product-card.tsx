'use client';
import Link from 'next/link';
import { useRef, useState, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Medal } from '@phosphor-icons/react';
import { ProductArt } from '@/components/brand-assets';
import { AddButton } from '@/components/commerce-motion';
import { money, productOptions, type Product } from '@/lib/catalog';
import ProductQuickView from '@/components/product-quick-view';

// A soft light follows the pointer across the photograph; it is a CSS variable write, never React state.
function trackLight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${((event.clientX - box.left) / box.width) * 100}%`);
  event.currentTarget.style.setProperty('--my', `${((event.clientY - box.top) / box.height) * 100}%`);
}

export function ProductCard({product,presentation='default',index=0}:{product:Product;presentation?:'default'|'shop';index?:number;minimal?:boolean}) {
 const reduce=useReducedMotion();
 const options=productOptions(product);
 const shop=presentation==='shop';
 const [quickOpen,setQuickOpen]=useState(false);
 const opener=useRef<HTMLButtonElement|null>(null);
 const multiple=options.options.length>1;
 const swatches=options.options.filter(option=>option.color);
 return <motion.article layout={reduce?false:'position'} className={`product-card lux-card ${shop?'shop-product-card':''}`} initial={reduce?false:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} exit={{opacity:0,scale:reduce?1:.96}} transition={{duration:reduce?0:.7,delay:reduce?0:(index%3)*.08,ease:[.16,1,.3,1],layout:{type:'spring',stiffness:320,damping:34}}}>
  <div className="product-image-frame lux-card-media" onPointerMove={trackLight}>
   <Link href={`/shop/${product.slug}`} className="product-image-link" aria-label={`View ${product.name}`}><ProductArt product={product}/></Link>
   <span className="lux-card-light" aria-hidden="true"/>
   {product.award&&<span className="lux-card-badge"><Medal size={13} weight="fill" aria-hidden="true"/>Award-winning</span>}
   <div className="lux-card-actions">
    {multiple?<button className="quick-add choose-option" onClick={event=>{opener.current=event.currentTarget;setQuickOpen(true);}}>Choose {options.label.toLowerCase()}</button>:<AddButton slug={product.slug} quick variant={options.options[0].label} label="Add to bag"/>}
   </div>
  </div>
  <div className="lux-card-body">
   <div className="product-caption"><span>{product.category}</span></div>
   <h3><Link href={`/shop/${product.slug}`}>{product.name}</Link></h3>
   {swatches.length>0&&<div className="lux-card-swatches" aria-label={`${swatches.length} ${options.label.toLowerCase()}s available`}>{swatches.map(option=><span key={option.label} style={{background:option.color}} title={option.label}/>)}</div>}
   <div className="product-bottom"><span className={`card-price ${product.price===null?'card-price-pending':''}`}>{money(product.price)}</span></div>
  </div>
  <ProductQuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} returnFocus={opener}/>
 </motion.article>;
}
