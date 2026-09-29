'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Minus, Plus } from '@phosphor-icons/react';
import { AddButton, AnimatedNumber } from '@/components/commerce-motion';
import { products, categories, money, productOptions, type Product } from '@/lib/catalog';
import { ProductCard, ProductArt } from '@/components/brand';
import { useStore } from '@/components/store-context';
export function Shop() {
 const params = useSearchParams(); const initial = params.get('category');
 return <ShopFilters key={initial} initial={initial && categories.includes(initial) ? initial : 'All'} />;
}
function ShopFilters({ initial }: { initial: string }) {
 const [category,setCategory]=useState(initial); const [query,setQuery]=useState(''); const [sort,setSort]=useState('featured'); const reduce=useReducedMotion();
 const shown=products.filter(p=>(category==='All'||p.category===category)&&`${p.name} ${p.sourceName ?? ''}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):0);
 return <section className="shop-editorial" aria-label="Products">
  <motion.div className="shop-toolbar" initial={reduce?false:{opacity:.5,clipPath:'inset(0 0 35% 0)'}} animate={{opacity:1,clipPath:'inset(0 0 0% 0)'}} transition={{duration:.5,ease:[.16,1,.3,1]}}>
   <div className="category-filters motion-filters" aria-label="Product categories">{categories.map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)}>{c===category&&<motion.span className="filter-selection" layoutId="active-category" transition={{type:'spring',stiffness:380,damping:32}}/>}<span>{c}</span></button>)}</div>
   <div className="shop-utilities">
    <label><span>Search</span><input type="search" placeholder="Product name" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <label><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="name">Name: A-Z</option></select></label>
   </div>
  </motion.div>
  <div className="shop-status shop-status-compact"><p aria-live="polite">{shown.length} {shown.length===1?'product':'products'}</p></div>
  <motion.div layout={!reduce} className="product-grid shop-grid"><AnimatePresence initial={false}>{shown.map((p,index)=><ProductCard key={p.slug} product={p} presentation="shop" index={index}/>)}</AnimatePresence></motion.div>
  {!shown.length&&<div className="empty-state shop-empty-state"><h2>No products found</h2><p>Try another category or clear your search.</p><button className="button" onClick={()=>{setCategory('All');setQuery('');}}>Clear filters</button></div>}
 </section>;
}
export function ProductPurchase({product}:{product:Product}) {
 const options=productOptions(product); const [variant,setVariant]=useState(options.options[0].label); const [quantity,setQuantity]=useState(1); const {add,loaded}=useStore(); const router=useRouter(); const [buying,setBuying]=useState(false);
 if(product.price === null) return <div className="purchase simple-purchase"><p className="product-price">To Be Confirmed</p><p className="small-text">{product.size || 'Pack details on product packaging.'}</p>{product.options&&<div className="catalog-variants"><strong>{options.label}</strong><p>{options.options.map(o=>o.label).join(' · ')}</p></div>}<p>Malaysian pricing and availability are being finalised.</p><Link href="/contact" className="button button-outline">Enquire about this product</Link></div>;
 return <div className="purchase simple-purchase">
  <p className="product-price">{money(product.price)} {!product.official&&<span>Sample price</span>}</p>
  <fieldset className="product-options">
   <legend>{options.label}: <strong>{variant}</strong></legend>
   <div>{options.options.map(option=><label key={option.label} className={variant===option.label?'selected':''}><input type="radio" name={`variant-${product.slug}`} value={option.label} checked={variant===option.label} onChange={()=>setVariant(option.label)}/>{option.color&&<span className="shade-swatch" style={{background:option.color}} aria-hidden="true"/>}<span>{option.label}</span></label>)}</div>
  </fieldset>
  {!product.official&&<p className="small-text">Sample options and imagery; final specifications may differ.</p>}
  <div className="purchase-controls"><div className="quantity"><button disabled={quantity<=1} onClick={()=>setQuantity(q=>q-1)} aria-label="Decrease quantity"><Minus size={16}/></button><AnimatedNumber value={quantity}/><button disabled={quantity>=99} onClick={()=>setQuantity(q=>q+1)} aria-label="Increase quantity"><Plus size={16}/></button></div><AddButton key={variant} slug={product.slug} quantity={quantity} variant={variant}/></div>
  <button className="button button-outline buy-now" disabled={!loaded||buying} onClick={async()=>{if(buying)return;setBuying(true);await add(product.slug,quantity,{drawer:false,variant});router.push('/checkout');}}>Buy Now</button>
  <p className="small-text">Demo shopping only. No payment will be taken.</p>
 </div>;
}
export function ProductGallery({product}:{product:Product}) {
 const [view,setView]=useState('product'); const reduce=useReducedMotion(); const gallery=product.galleryImages??[]; const galleryIndex=view.startsWith('gallery-')?Number(view.slice(8)):-1; const selected=gallery[galleryIndex];
 return <div className="product-gallery"><div className="gallery-stage"><div className="gallery-thumbnails" aria-label="Product gallery"><button className="gallery-thumbnail" aria-label="View product image" title="Product" aria-pressed={view==='product'} onClick={()=>setView('product')}><ProductArt product={product}/></button>{gallery.map((item,index)=><button className="gallery-thumbnail" key={item.src} aria-label={`View ${item.label} image`} title={item.label} aria-pressed={view===`gallery-${index}`} onClick={()=>setView(`gallery-${index}`)}><img src={item.src} alt="" width="1254" height="1254"/></button>)}</div><div className={`gallery-main ${view==='product'?'':'ingredient-view'}`}><AnimatePresence mode="wait" initial={false}>{view==='product'?<motion.div key="product" className="gallery-layer" initial={reduce?false:{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} exit={reduce?{}:{opacity:0,scale:1.02}} transition={{duration:.38,ease:[.22,1,.36,1]}}><ProductArt product={product} priority/></motion.div>:<motion.img key={view} src={selected.src} alt={selected.alt} width="1254" height="1254" initial={reduce?false:{opacity:0,scale:1.04}} animate={{opacity:1,scale:1}} exit={reduce?{}:{opacity:0}} transition={{duration:.38,ease:[.22,1,.36,1]}}/>}</AnimatePresence></div></div>{product.sourceUrl&&<p className="small-text">Product photography from NAFU LIFE.{product.longFormImages?.length&&' English visual guides appear below.'}</p>}</div>;
}
