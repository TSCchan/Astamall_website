'use client';
import { createContext, useContext, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Minus, Plus, Check, ArrowUpRight, ArrowLeft, ArrowRight, MagnifyingGlassPlus, X } from '@phosphor-icons/react';
import { AddButton, AnimatedNumber } from '@/components/commerce-motion';
import { products, categories, money, productOptions, type Product } from '@/lib/catalog';
import { ProductCard, ProductArt } from '@/components/brand';
import { useStore } from '@/components/store-context';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
const GallerySelection = createContext<{index:number;setIndex:Dispatch<SetStateAction<number>>}|null>(null);
export function ProductSelectionProvider({children}:{children:ReactNode}) {
 const [index,setIndex]=useState(0);
 return <GallerySelection.Provider value={{index,setIndex}}>{children}</GallerySelection.Provider>;
}
export function Shop() {
 const params = useSearchParams(); const initial = params.get('category');
 return <ShopFilters key={initial} initial={initial && categories.includes(initial) ? initial : 'All'} />;
}
function ShopFilters({ initial }: { initial: string }) {
 const [category,setCategory]=useState(initial); const [query,setQuery]=useState(''); const [sort,setSort]=useState('featured'); const reduce=useReducedMotion();
 const shown=products.filter(p=>(category==='All'||p.category===category)&&`${p.name} ${p.sourceName ?? ''} ${p.ingredient}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):0);
 return <section className="shop-editorial" aria-label="Products">
  <motion.div className="shop-toolbar" initial={reduce?false:{opacity:.5,clipPath:'inset(0 0 35% 0)'}} animate={{opacity:1,clipPath:'inset(0 0 0% 0)'}} transition={{duration:.5,ease:[.16,1,.3,1]}}>
   <div className="category-filters motion-filters" aria-label="Product categories">{categories.map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)}>{c===category&&<motion.span className="filter-selection" layoutId="active-category" transition={{type:'spring',stiffness:380,damping:32}}/>}<span>{c}</span><small>{c==='All'?products.length:products.filter(p=>p.category===c).length}</small></button>)}</div>
   <div className="shop-utilities">
    <label><span>Search</span><input type="search" placeholder="Search the collection" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <label><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="name">Name: A-Z</option></select></label>
   </div>
  </motion.div>
  <div className="shop-status shop-status-compact"><p aria-live="polite">{shown.length} {shown.length===1?'product':'products'}{category!=='All'&&` in ${category}`}</p>{(category!=='All'||query)&&<button className="text-link" onClick={()=>{setCategory('All');setQuery('');}}>Reset filters</button>}</div>
  <motion.div layout={!reduce} className="product-grid shop-grid"><AnimatePresence initial={false}>{shown.map((p,index)=><ProductCard key={p.slug} product={p} presentation="shop" index={index}/>)}</AnimatePresence></motion.div>
  {!shown.length&&<div className="empty-state shop-empty-state"><h2>No products found</h2><p>Try another category or clear your search.</p><button className="button" onClick={()=>{setCategory('All');setQuery('');}}>Clear filters</button></div>}
 </section>;
}
export function ProductPurchase({product}:{product:Product}) {
 const gallerySelection=useContext(GallerySelection);
 const options=productOptions(product);
 const [variant,setVariant]=useState(options.options[0].label);
 const [quantity,setQuantity]=useState(1);
 const {add,loaded}=useStore(); const router=useRouter(); const [buying,setBuying]=useState(false);
 const pending=product.price===null;
 const selectVariant=(label:string)=>{
  setVariant(label);
  const imageIndex=product.galleryImages?.findIndex(image=>image.label===label)??-1;
  if(imageIndex>=0) gallerySelection?.setIndex(imageIndex+1);
  else if(label===options.options[0].label) gallerySelection?.setIndex(0);
 };
 const enquiry='/contact?'+new URLSearchParams({product:product.name,option:variant,quantity:String(quantity)}).toString();
 return <div className="purchase simple-purchase" id="product-selection">
  <div className="purchase-price-row"><p className="product-price">{money(product.price)}</p><span>{product.size}</span></div>
  <fieldset className="product-options">
   <legend>{options.label}: <strong>{variant}</strong></legend>
   <div>{options.options.map(option=><label key={option.label} className={variant===option.label?'selected':''}><input type="radio" name={`variant-${product.slug}`} value={option.label} checked={variant===option.label} onChange={()=>selectVariant(option.label)}/>{option.color&&<span className="shade-swatch" style={{background:option.color}} aria-hidden="true"/>}<span>{option.label}</span><Check className="option-check" size={15} aria-hidden="true"/></label>)}</div>
  </fieldset>
  {!product.official&&<p className="small-text">Sample options and imagery; final specifications may differ.</p>}
  <div className="purchase-controls"><div className="quantity" aria-label="Quantity"><button disabled={quantity<=1} onClick={()=>setQuantity(q=>q-1)} aria-label="Decrease quantity"><Minus size={16}/></button><AnimatedNumber value={quantity}/><button disabled={quantity>=99} onClick={()=>setQuantity(q=>q+1)} aria-label="Increase quantity"><Plus size={16}/></button></div>{pending?<Link href={enquiry} className="button enquiry-button">Enquire about availability <ArrowUpRight size={18}/></Link>:<AddButton key={variant} slug={product.slug} quantity={quantity} variant={variant}/>}</div>
  {!pending&&<button className="button button-outline buy-now" disabled={!loaded||buying} onClick={async()=>{if(buying)return;setBuying(true);await add(product.slug,quantity,{drawer:false,variant});router.push('/checkout');}}>Buy Now</button>}
  <p className="purchase-status">{pending?'Malaysian pricing and availability are being finalised.':'Demo shopping only. No payment will be taken.'}</p>
  <div className="purchase-help"><Link href="/shipping">Delivery information <ArrowUpRight size={13}/></Link><Link href="/returns">Returns & care <ArrowUpRight size={13}/></Link></div>
  <div className="pdp-mobile-action"><div><strong>{product.short}</strong><span>{variant}</span></div>{pending?<Link href={enquiry} className="button">Enquire <ArrowUpRight size={16}/></Link>:<a href="#product-selection" className="button">Select options</a>}</div>
 </div>;
}

export function ProductGallery({product}:{product:Product}) {
 const selection=useContext(GallerySelection); const [localIndex,setLocalIndex]=useState(0);
 const index=selection?.index??localIndex; const setIndex=selection?.setIndex??setLocalIndex;
 const [open,setOpen]=useState(false); const [zoom,setZoom]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null); const reduce=useReducedMotion();
 const gallery=product.galleryImages??[]; const total=gallery.length+1;
 const selected=index>0?gallery[index-1]:null; const label=selected?.label??'Product';
 const move=(direction:number)=>{setIndex(value=>(value+direction+total)%total);setZoom(false);};
 const picture=(priority=false)=>selected?<img src={selected.src} alt={selected.alt} width="1254" height="1254"/>:<ProductArt product={product} priority={priority}/>;
 return <div className="product-gallery" onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}}}>
  <div className="gallery-stage">
   <div className="gallery-main"><button ref={trigger} className="gallery-open" aria-label={`Enlarge ${label.toLowerCase()} image`} onClick={()=>{setZoom(false);setOpen(true);}}>
    <AnimatePresence mode="wait" initial={false}><motion.div key={index} className="gallery-layer" initial={reduce?false:{opacity:0,x:18,scale:.985}} animate={{opacity:1,x:0,scale:1}} exit={reduce?{}:{opacity:0,x:-12}} transition={{duration:reduce?0:.25,ease:[.22,1,.36,1]}}>{picture(true)}</motion.div></AnimatePresence>
    <span className="gallery-zoom-label"><MagnifyingGlassPlus size={18}/> Explore image</span>
   </button></div>
   <div className="gallery-controls"><span aria-live="polite">{String(index+1).padStart(2,'0')} / {String(total).padStart(2,'0')} <span>{label}</span></span><div><button className="icon-button" aria-label="Previous product image" disabled={total<2} onClick={()=>move(-1)}><ArrowLeft size={20}/></button><button className="icon-button" aria-label="Next product image" disabled={total<2} onClick={()=>move(1)}><ArrowRight size={20}/></button></div></div>
   <div className="gallery-thumbnails" aria-label="Product gallery"><button className="gallery-thumbnail" aria-label="View product image" title="Product" aria-pressed={index===0} onClick={()=>setIndex(0)}><ProductArt product={product}/></button>{gallery.map((item,i)=><button className="gallery-thumbnail" key={item.src} aria-label={`View ${item.label} image`} title={item.label} aria-pressed={index===i+1} onClick={()=>setIndex(i+1)}><img src={item.src} alt="" width="1254" height="1254" loading="lazy"/></button>)}</div>
  </div>
  {product.sourceUrl&&<p className="gallery-credit">Product photography from NAFU LIFE. {product.longFormImages?.length?'English guides and references below.':''}</p>}
  <Dialog open={open} onOpenChange={setOpen}><DialogContent className="gallery-lightbox" showCloseButton={false} onCloseAutoFocus={event=>{event.preventDefault();trigger.current?.focus();}}>
   <DialogTitle>{product.short} · {label}</DialogTitle><DialogDescription>Click the image to zoom. Use the arrow buttons to explore.</DialogDescription><DialogClose className="icon-button panel-close" aria-label="Close image viewer"><X size={22}/></DialogClose>
   <div className="lightbox-canvas"><button className={zoom?'lightbox-picture zoomed':'lightbox-picture'} onClick={()=>setZoom(v=>!v)} aria-label={zoom?'Zoom out':'Zoom in'} aria-pressed={zoom}>{picture()}</button></div>
   <div className="lightbox-controls"><button className="icon-button" aria-label="Previous enlarged image" onClick={()=>move(-1)} disabled={total<2}><ArrowLeft size={20}/></button><span aria-live="polite">{index+1} / {total}</span><button className="icon-button" aria-label="Next enlarged image" onClick={()=>move(1)} disabled={total<2}><ArrowRight size={20}/></button></div>
  </DialogContent></Dialog>
 </div>;
}
