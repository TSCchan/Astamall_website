'use client';
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type PointerEvent, type ReactNode, type SetStateAction } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { Minus, Plus, ArrowUpRight, ArrowLeft, ArrowRight, MagnifyingGlassPlus, X, MagnifyingGlass } from '@phosphor-icons/react';
import { AddButton, AnimatedNumber } from '@/components/commerce-motion';
import { OptionPicker } from '@/components/product-option-picker';
import { products, categories, money, productOptions, type Product } from '@/lib/catalog';
import { ProductCard, ProductArt } from '@/components/brand';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

// Gallery index and the chosen purchase option are shared by the gallery, purchase panel and buy bar.
type Selection = { index: number; setIndex: Dispatch<SetStateAction<number>>; variant: string | null; setVariant: Dispatch<SetStateAction<string | null>>; quantity: number; setQuantity: Dispatch<SetStateAction<number>> };
const GallerySelection = createContext<Selection | null>(null);
export function ProductSelectionProvider({children}:{children:ReactNode}) {
 const [index,setIndex]=useState(0); const [variant,setVariant]=useState<string|null>(null); const [quantity,setQuantity]=useState(1);
 return <GallerySelection.Provider value={{index,setIndex,variant,setVariant,quantity,setQuantity}}>{children}</GallerySelection.Provider>;
}

export function Shop() {
 const params = useSearchParams(); const initial = params.get('category');
 return <ShopFilters key={initial} initial={initial && categories.includes(initial) ? initial : 'All'} />;
}
function ShopFilters({ initial }: { initial: string }) {
 const [category,setCategory]=useState(initial); const [query,setQuery]=useState(''); const [sort,setSort]=useState('featured'); const reduce=useReducedMotion();
 const shown=products.filter(p=>(category==='All'||p.category===category)&&`${p.name} ${p.sourceName ?? ''} ${p.ingredient}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='name-desc'?b.name.localeCompare(a.name):0);
 const reset=()=>{setCategory('All');setQuery('');};
 return <section className="shop-editorial" aria-label="Products">
  <motion.div className="shop-toolbar lux-toolbar" initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.6,ease:[.16,1,.3,1]}}>
   <div className="category-filters motion-filters" aria-label="Product categories">{categories.map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)}>{c===category&&<motion.span className="filter-selection" layoutId="active-category" transition={{type:'spring',stiffness:380,damping:32}}/>}<span>{c}</span><small>{c==='All'?products.length:products.filter(p=>p.category===c).length}</small></button>)}</div>
   <div className="shop-utilities">
    <label className="shop-search"><span className="sr-only">Search</span><MagnifyingGlass size={18} aria-hidden="true"/><input type="search" placeholder="Search products or ingredients" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button type="button" className="shop-search-clear" onClick={()=>setQuery('')} aria-label="Clear search"><X size={14}/></button>}</label>
    <label className="shop-sort"><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="name">Name: A-Z</option><option value="name-desc">Name: Z-A</option></select></label>
   </div>
  </motion.div>
  <div className="shop-status shop-status-compact"><p aria-live="polite"><AnimatedNumber value={shown.length}/> {shown.length===1?'product':'products'}{category!=='All'&&` in ${category}`}</p>{(category!=='All'||query)&&<button className="text-link" onClick={reset}>Reset filters</button>}</div>
  <motion.div layout={!reduce} className="product-grid shop-grid"><AnimatePresence initial={false} mode="popLayout">{shown.map((p,index)=><ProductCard key={p.slug} product={p} presentation="shop" index={index}/>)}</AnimatePresence></motion.div>
  <AnimatePresence>{!shown.length&&<motion.div className="empty-state shop-empty-state" initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}><span className="empty-bag-icon"><MagnifyingGlass size={30} weight="thin"/></span><h2>No products found</h2><p>Try another category or clear your search.</p><button className="button" onClick={reset}>Clear filters</button></motion.div>}</AnimatePresence>
 </section>;
}

function useOptionSelection(product:Product){
 const selection=useContext(GallerySelection);
 const options=productOptions(product);
 const [localVariant,setLocalVariant]=useState(options.options[0].label);
 const [localQuantity,setLocalQuantity]=useState(1);
 const variant=selection?.variant??localVariant;
 const quantity=selection?.quantity??localQuantity;
 const setQuantity=selection?.setQuantity??setLocalQuantity;
 // Selecting a shade shows its photograph; browsing the gallery alone never changes the chosen option.
 const selectVariant=(label:string)=>{
  (selection?.setVariant??setLocalVariant)(label);
  const imageIndex=product.galleryImages?.findIndex(image=>image.label===label)??-1;
  if(imageIndex>=0) selection?.setIndex(imageIndex+1);
  else if(label===options.options[0].label) selection?.setIndex(0);
 };
 return {options,variant,quantity,setQuantity,selectVariant};
}

function QuantityStepper({quantity,setQuantity}:{quantity:number;setQuantity:Dispatch<SetStateAction<number>>}){
 return <div className="quantity" aria-label="Quantity"><button disabled={quantity<=1} onClick={()=>setQuantity(q=>q-1)} aria-label="Decrease quantity"><Minus size={16}/></button><AnimatedNumber value={quantity}/><button disabled={quantity>=99} onClick={()=>setQuantity(q=>q+1)} aria-label="Increase quantity"><Plus size={16}/></button></div>;
}

export function ProductPurchase({product}:{product:Product}) {
 const {options,variant,quantity,setQuantity,selectVariant}=useOptionSelection(product);
 const pending=product.price===null;
 const controls=useRef<HTMLDivElement>(null);
 const [barVisible,setBarVisible]=useState(false);
 const reduce=useReducedMotion();
 // The buy bar appears only once the main purchase controls have scrolled above the viewport.
 useEffect(()=>{
  const node=controls.current; if(!node) return;
  const observer=new IntersectionObserver(([entry])=>setBarVisible(!entry.isIntersecting&&entry.boundingClientRect.top<0));
  observer.observe(node); return ()=>observer.disconnect();
 },[]);
 const enquiry='/contact?'+new URLSearchParams({product:product.name,option:variant,quantity:String(quantity)}).toString();
 return <div className="purchase simple-purchase lux-purchase" id="product-selection">
  <div className="purchase-price-row"><p className="product-price">{money(product.price)}</p><span>{product.size}</span></div>
  {options.options.length>1?<OptionPicker name={`variant-${product.slug}`} label={options.label} options={options.options} value={variant} onChange={selectVariant}/>:<OptionPicker name={`variant-${product.slug}`} label={options.label} options={options.options} value={variant} onChange={selectVariant} compact/>}
  {!product.official&&<p className="small-text">Sample options and imagery; final specifications may differ.</p>}
  <div className="purchase-controls" ref={controls}><QuantityStepper quantity={quantity} setQuantity={setQuantity}/><AddButton key={variant} slug={product.slug} quantity={quantity} variant={variant}/></div>
  <Link href={enquiry} className="button button-outline enquiry-button">Enquire about availability <ArrowUpRight size={18}/></Link>
  <p className="purchase-status">{pending?'Malaysian pricing and availability are being finalised. Add to your bag and send an order request to confirm.':'Demo shopping only. No payment will be taken.'}</p>
  <a className="purchase-help" href="#info-support">Delivery, returns &amp; support <ArrowUpRight size={13} aria-hidden="true"/></a>
  <AnimatePresence>{barVisible&&<motion.div className="buy-bar" role="region" aria-label="Quick purchase" initial={reduce?{opacity:0}:{y:'110%'}} animate={reduce?{opacity:1}:{y:0}} exit={reduce?{opacity:0}:{y:'110%'}} transition={{type:'spring',stiffness:260,damping:30}}>
   <div className="buy-bar-product"><ProductArt product={product}/><div><strong>{product.name}</strong><span>{variant} · {money(product.price)}</span></div></div>
   <div className="buy-bar-actions"><QuantityStepper quantity={quantity} setQuantity={setQuantity}/><AddButton key={variant} slug={product.slug} quantity={quantity} variant={variant}/></div>
  </motion.div>}</AnimatePresence>
 </div>;
}

export function ProductGallery({product}:{product:Product}) {
 const selection=useContext(GallerySelection); const [localIndex,setLocalIndex]=useState(0);
 const index=selection?.index??localIndex; const setIndex=selection?.setIndex??setLocalIndex;
 const [open,setOpen]=useState(false); const [zoom,setZoom]=useState(false); const [direction,setDirection]=useState(1);
 const trigger=useRef<HTMLButtonElement>(null); const reduce=useReducedMotion();
 const gallery=product.galleryImages??[]; const total=gallery.length+1;
 const selected=index>0?gallery[index-1]:null; const label=selected?.label??'Product';
 const go=(next:number)=>{setDirection(next>index?1:-1);setIndex(next);setZoom(false);};
 const move=(step:number)=>{setDirection(step);setIndex(value=>(value+step+total)%total);setZoom(false);};
 const picture=(priority=false)=>selected?<img src={selected.src} alt={selected.alt} width="1254" height="1254"/>:<ProductArt product={product} priority={priority}/>;
 // Hover zoom: the image scales from the pointer position, written straight to CSS variables.
 const lens=(event:PointerEvent<HTMLElement>)=>{
  if(event.pointerType!=='mouse') return;
  const box=event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--zx',`${((event.clientX-box.left)/box.width)*100}%`);
  event.currentTarget.style.setProperty('--zy',`${((event.clientY-box.top)/box.height)*100}%`);
 };
 const swipe=(_:unknown,info:PanInfo)=>{if(Math.abs(info.offset.x)>60||Math.abs(info.velocity.x)>400) move(info.offset.x<0?1:-1);};
 return <div className="product-gallery lux-gallery" onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}}}>
  <div className="gallery-stage">
   <div className="gallery-thumbnails" aria-label="Product gallery">
    {[null,...gallery].map((item,i)=><button className="gallery-thumbnail" key={item?.src??'product'} aria-label={item?`View ${item.label} image`:'View product image'} title={item?.label??'Product'} aria-pressed={index===i} onClick={()=>go(i)}>
     {index===i&&<motion.span className="gallery-thumbnail-ring" layoutId={`thumb-ring-${product.slug}`} transition={{type:'spring',stiffness:420,damping:34}}/>}
     {item?<img src={item.src} alt="" width="1254" height="1254" loading="lazy"/>:<ProductArt product={product}/>}
    </button>)}
   </div>
   <div className="gallery-main" onPointerMove={lens}>
    <button ref={trigger} className="gallery-open" aria-label={`Enlarge ${label.toLowerCase()} image`} onClick={()=>{setZoom(false);setOpen(true);}}>
     <AnimatePresence mode="popLayout" initial={false} custom={direction}>
      <motion.div key={index} className="gallery-layer" custom={direction} drag={reduce||total<2?false:'x'} dragConstraints={{left:0,right:0}} dragElastic={.18} onDragEnd={swipe}
       initial={reduce?false:{opacity:0,x:direction*40,scale:.985}} animate={{opacity:1,x:0,scale:1}} exit={reduce?{}:{opacity:0,x:direction*-30}} transition={{duration:reduce?0:.45,ease:[.16,1,.3,1]}}>{picture(true)}</motion.div>
     </AnimatePresence>
     <span className="gallery-zoom-label"><MagnifyingGlassPlus size={16}/> Click to enlarge</span>
    </button>
    <div className="gallery-controls"><span aria-live="polite"><strong>{String(index+1).padStart(2,'0')}</strong> / {String(total).padStart(2,'0')} <span>{label}</span></span><div><button className="icon-button" aria-label="Previous product image" disabled={total<2} onClick={()=>move(-1)}><ArrowLeft size={18}/></button><button className="icon-button" aria-label="Next product image" disabled={total<2} onClick={()=>move(1)}><ArrowRight size={18}/></button></div></div>
    <div className="gallery-progress" aria-hidden="true">{Array.from({length:total},(_,i)=><span key={i} className={i===index?'active':''}/>)}</div>
   </div>
  </div>
  {product.sourceUrl&&<p className="gallery-credit">Product photography from NAFU LIFE. {product.longFormImages?.length?'English guides and references below.':''}</p>}
  <Dialog open={open} onOpenChange={setOpen}><DialogContent className="gallery-lightbox" showCloseButton={false} onCloseAutoFocus={event=>{event.preventDefault();trigger.current?.focus();}}>
   <DialogTitle>{product.short} · {label}</DialogTitle><DialogDescription>Click the image to zoom. Use the arrow buttons to explore.</DialogDescription><DialogClose className="icon-button panel-close" aria-label="Close image viewer"><X size={22}/></DialogClose>
   <div className="lightbox-canvas"><button className={zoom?'lightbox-picture zoomed':'lightbox-picture'} onClick={()=>setZoom(v=>!v)} aria-label={zoom?'Zoom out':'Zoom in'} aria-pressed={zoom}>{picture()}</button></div>
   <div className="lightbox-controls"><button className="icon-button" aria-label="Previous enlarged image" onClick={()=>move(-1)} disabled={total<2}><ArrowLeft size={20}/></button><span aria-live="polite">{index+1} / {total}</span><button className="icon-button" aria-label="Next enlarged image" onClick={()=>move(1)} disabled={total<2}><ArrowRight size={20}/></button></div>
  </DialogContent></Dialog>
 </div>;
}

// Product information as tabs: one subject at a time, with every detail still on the page.

