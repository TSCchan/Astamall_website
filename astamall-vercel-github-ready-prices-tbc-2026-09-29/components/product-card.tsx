'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ProductArt } from '@/components/brand-assets';
import { AddButton } from '@/components/commerce-motion';
import { money, productOptions, type Product } from '@/lib/catalog';
export function ProductCard({product,presentation='default',minimal=false}:{product:Product;presentation?:'default'|'shop';index?:number;minimal?:boolean}) {
 const reduce=useReducedMotion();
 const options=productOptions(product).options;
 const shop=presentation==='shop';
 return <motion.article layout={reduce?false:'position'} className={`product-card premium-product-card ${shop?'shop-product-card':''}`} initial={false} exit={{opacity:0,y:reduce?0:8}} whileHover={!shop&&!reduce?{y:-5}:undefined} transition={{duration:reduce?0:.3,ease:[.16,1,.3,1],layout:{type:'spring',stiffness:320,damping:34}}}>
  <div className="product-image-frame"><Link href={`/shop/${product.slug}`} className="product-image-link" aria-label={`View ${product.name}`}>{!shop&&<div className="product-texture" aria-hidden="true"/>}<ProductArt product={product}/>{!shop&&<span className="product-reflection" aria-hidden="true"/>}</Link>{product.price !== null&&(options.length>1?<Link href={`/shop/${product.slug}`} className="quick-add choose-option">Choose {product.options?.label.toLowerCase() || 'option'}</Link>:<AddButton slug={product.slug} quick variant={options[0].label}/>)}</div>
  <div className="product-caption"><span>{product.category}</span><span>{product.type}</span></div>
  <h3><Link href={`/shop/${product.slug}`}>{product.name}</Link></h3>
  <div className="product-bottom"><span className={`card-price ${product.price===null?'card-price-pending':''}`}>{money(product.price)}</span></div>
  {!minimal&&<p className="product-card-description">{shop?product.benefit:product.description}</p>}
 </motion.article>;
}
