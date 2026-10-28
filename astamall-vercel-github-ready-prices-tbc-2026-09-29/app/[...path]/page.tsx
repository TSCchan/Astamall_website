import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PageHeading, ProductCard, IngredientMark } from '@/components/brand';
import { Shop, ProductPurchase, ProductGallery, ProductSelectionProvider } from '@/components/shop';
import { ProductInformation } from '@/components/product-information';
import Reveal from '@/components/reveal';
import { CartContents } from '@/components/store-shell';
import { FaqList, ContactForm } from '@/components/forms';
import AboutStory from '@/components/about-story';
import { Checkout, OrderConfirmation } from '@/components/checkout';
import ProductReviews from '@/components/product-reviews';
import { products, ingredients, articles, faqs } from '@/lib/catalog';

type Props = { params: Promise<{ path: string[] }> };
const pageMeta: Record<string, [string, string]> = {
  shop: ['The Collection', 'Discover ASTAMALL skincare, health foods and health supplements from Taiwan.'],
  astaxanthin: ['Discover Astaxanthin', 'The ingredient that began the ASTAMALL story, and the technology behind Asta-S.'],
  ingredients: ['Ingredient Library', 'Get to know the ingredients and technologies behind our beauty and wellness collection.'],
  'brand-story': ['Brand Story', 'The journey behind ASTAMALL, from ingredient discovery to Taiwan and Malaysia.'],
  about: ['About Us', 'From Taiwan, thoughtfully brought to Malaysia. The ASTAMALL story.'],
  journal: ['Journal', 'Ingredient understanding, everyday beauty and the ASTAMALL journey.'],
  faq: ['Frequently Asked Questions', 'Answers about the ASTAMALL collection, ingredients and upcoming launch.'],
  contact: ['Contact Us', 'Talk to ASTAMALL about products, ingredients and business enquiries.'],
  cart: ['Your Cart', 'Review your ASTAMALL preview cart.'], checkout: ['Checkout Preview', 'Try the ASTAMALL checkout. No orders or payments are taken.'],
  'order-confirmation': ['Demo Confirmation', 'Your ASTAMALL demo checkout preview. No order or payment has been created.'],
  privacy: ['Privacy', 'Privacy information and the current storefront preview.'], terms: ['Terms', 'Terms information for the ASTAMALL storefront preview.'], shipping: ['Shipping', 'Delivery information for the forthcoming ASTAMALL launch in Malaysia.'], returns: ['Returns', 'Returns and refund information ahead of the ASTAMALL launch.'],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const [section, slug] = path;
  let meta = pageMeta[section];
  if (section === 'shop' && slug) { const p = products.find(p => p.slug === slug); if (p) meta = [p.name, p.description]; }
  if (section === 'ingredients' && slug) { const i = ingredients.find(i => i.slug === slug); if (i) meta = [i.name, i.caption]; }
  if (section === 'journal' && slug) { const a = articles.find(a => a.slug === slug); if (a) meta = [a.title, a.excerpt]; }
  return { title: meta?.[0] || 'Page not found', description: meta?.[1], robots: ['cart', 'checkout', 'order-confirmation'].includes(section) ? { index: false, follow: false } : undefined };
}

function JsonLd({ value }: { value: unknown }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, '\\u003c') }} />; }

export default async function ContentPage({ params }: Props) {
  const { path } = await params;
  if (path.length > 2) notFound();
  const [section, slug] = path;
  if (slug && !['shop', 'ingredients', 'journal'].includes(section)) notFound();
  if (section === 'brand-story') redirect('/about#journey');
  if (section === 'shop' && slug) {
    const p = products.find(p => p.slug === slug);
    if (!p) notFound();
    const relatedScore = (other: typeof p) =>
      (other.category === p.category ? 4 : 0) +
      (other.type === p.type ? 2 : 0) +
      other.ingredients.filter(ingredient => p.ingredients.includes(ingredient)).length;
    const related = products
      .filter(other => other.slug !== p.slug)
      .sort((a, b) => relatedScore(b) - relatedScore(a))
      .slice(0, 4);
    return <main id="main-content" className="inner-page premium-detail lux-detail">
      <div className="breadcrumbs"><Link href="/shop">Shop</Link><span>/</span><Link href={`/shop?category=${encodeURIComponent(p.category)}`}>{p.category}</Link><span>/</span><span>{p.short}</span></div>
      <ProductSelectionProvider key={p.slug}><section className="pdp-hero" id="overview"><ProductGallery product={p}/><div className="pdp-copy"><p className="product-category-label">{p.category}</p><h1>{p.name}</h1><p className="intro-text">{p.description}</p><ProductPurchase product={p}/></div></section></ProductSelectionProvider>
      <div className="pdp-information">
        <ProductInformation product={p}
          usageGuide={p.usageGuideImage&&<details className="pdp-usage-guide"><summary>Application guide <span aria-hidden="true">+</span></summary><img src={p.usageGuideImage} alt={p.usageGuideImageAlt || ''} width="537" height="2170" loading="lazy" /></details>}
          references={p.longFormImages&&<>{p.longFormImages.map(item=><details className="reference-item" key={item.src}><summary>{item.caption}<span aria-hidden="true">+</span></summary><figure><img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" /><figcaption>{item.caption} · <a href={item.src} target="_blank" rel="noreferrer">Open full size ↗</a></figcaption></figure></details>)}</>} />
        {p.award&&<Reveal><section className={`pdp-recognition ${p.recognitionImage?'pdp-recognition-with-image':''}`}>{p.recognitionImage&&<div className="pdp-recognition-media"><img src={p.recognitionImage} alt={p.recognitionImageAlt || ''} width="1254" height="1254" loading="lazy" /></div>}<div className="pdp-recognition-copy"><p>Recognition</p><h2>{p.award.split(';').map(award=><span key={award}>{award.trim()}</span>)}</h2></div></section></Reveal>}
        <div id="product-reviews"><ProductReviews productName={p.name} reviews={p.reviews??[]}/></div>
      </div>
      {related.length>0&&<section className="related-section"><div className="section-heading"><h2>Related products</h2><Link href="/shop" className="text-link">Continue discovering the collection <span aria-hidden="true">↗</span></Link></div><div className="product-grid related-product-grid">{related.map((p,index)=><ProductCard key={p.slug} product={p} presentation="shop" index={index} minimal />)}</div></section>}
    </main>;
  }
  if (section === 'ingredients' && slug) {
    const ingredient = ingredients.find(i => i.slug === slug);
    if (!ingredient) notFound();
    const containing = products.filter(p => p.ingredients.includes(slug) || (slug === 'astaxanthin' && p.ingredients.includes('asta-s')));
    return <main id="main-content" className="inner-page"><div className="breadcrumbs"><Link href="/ingredients">Ingredient Library</Link><span>/</span><span>{ingredient.name}</span></div><PageHeading title={ingredient.name} text={ingredient.caption} /><div className="ingredient-detail"><div className="ingredient-detail-art"><IngredientMark name={ingredient.name} ring={ingredient.caption.replace(/\.$/, '').toUpperCase()} /></div><div className="prose"><section><h2>What is it?</h2><p>{ingredient.text}</p></section><section><h2>Why is it used?</h2><p>{ingredient.use}</p></section><section><h2>Within the formula.</h2><p>{ingredient.formula}</p></section></div></div><section className="related-section"><h2>Find it in the collection.</h2>{containing.length ? <div className="product-grid">{containing.map(p => <ProductCard key={p.slug} product={p} />)}</div> : <p>Product formulation details are being confirmed.</p>}</section></main>;
  }
  if (!pageMeta[section]) notFound();
  const [title, description] = pageMeta[section];
  return <main id="main-content" className={`inner-page ${section}-page`}>
    {section === 'shop' && <><PageHeading title="Shop the collection" text="Skincare, health foods and health supplements." /><Shop /></>}
    {section === 'astaxanthin' && <><PageHeading title="An ingredient. A new perspective." text="Astaxanthin brought us to the meeting point of science, beauty and everyday wellness." /><div className="ingredient-detail"><div className="ingredient-detail-art"><IngredientMark name="Astaxanthin" ring="SCIENCE · BEAUTY · EVERYDAY WELLNESS" /></div><div className="prose"><h2>It starts with understanding.</h2><p>We began with Astaxanthin, an ingredient that opened our eyes to the connection between science, beauty and wellness.</p><p>Our collection brings that interest into skincare, health foods and health supplements. Every product has its own formulation, directions and role.</p><h2>The Asta-S story.</h2><p>The ingredient developer describes Asta-S as a patented, Taiwan-developed free-form astaxanthin technology, designed for improved stability and bioavailability in skincare applications.</p><p className="small-text">This is a manufacturer description, not an independent ASTAMALL clinical claim. Substantiating documents are awaiting review.</p><Link href="/ingredients/asta-s" className="text-link">Asta-S ingredient profile ↗</Link></div></div><section className="education-note"><h2>One name doesn&apos;t tell the whole story.</h2><p>An ingredient is only part of a formula. Read the finished product&apos;s ingredients, directions and precautions before deciding whether it belongs in your routine.</p><Link href="/ingredients" className="button">Ingredient Library</Link></section><div className="product-grid">{products.filter(p => p.ingredients.includes('asta-s')).map(p => <ProductCard key={p.slug} product={p} />)}</div></>}
    {section === 'ingredients' && <><PageHeading title="Know what goes in." text="An introduction to the ingredients and technologies behind the ASTAMALL collection, with clear distinctions between confirmed information and details still awaiting documentation." label="Ingredient Library" /><div className="ingredient-index">{ingredients.map((i, n) => <Link href={`/ingredients/${i.slug}`} key={i.slug}><span className="ingredient-index-number" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span><div><h2>{i.name}</h2><p>{i.caption}</p></div><span aria-hidden="true">↗</span></Link>)}</div></>}
    {section === 'about' && <AboutStory />}
    {section === 'journal' && !slug && <><PageHeading title="ASTAMALL Journal" text="Ingredient stories, beauty routines, skin education and wellness, edited with clarity." label="Read and discover" /><div className="journal-index">{articles.map((article, index) => <Link href={`/journal/${article.slug}`} key={article.slug} className="journal-index-item"><div><span>{article.category}</span><h2>{article.title}</h2><p>{article.excerpt}</p><span className="text-link">Read article <span aria-hidden="true">↗</span></span></div></Link>)}</div></>}
    {section === 'journal' && slug && (() => { const article=articles.find(item=>item.slug===slug); if(!article) notFound(); return <article className="journal-article"><div className="breadcrumbs"><Link href="/journal">Journal</Link><span>/</span><span>{article.category}</span></div><header><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p>{article.excerpt}</p></header><div className="journal-body">{article.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div><Link href="/shop" className="button">Explore the Collection</Link></article>; })()}
    {section === 'faq' && <><JsonLd value={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} /><PageHeading title="Help & FAQ" text="Products, payment and delivery information." /><FaqList /><div className="education-note"><h2>Still curious?</h2><Link href="/contact" className="button">Contact Us</Link></div></>}
    {section === 'contact' && <><PageHeading title="Contact us" text="Product questions, ingredient information or business enquiries." /><div className="contact-layout"><aside><h2>Let’s talk.</h2></aside><ContactForm /></div></>}
    {section === 'cart' && <><PageHeading title="Your cart" text="Review your items and selected options." /><div className="cart-page-content"><CartContents fullPage /></div></>}
    {section === 'order-confirmation' && <OrderConfirmation />}
    {section === 'checkout' && <><PageHeading title="Checkout" /><Checkout /></>}
    {['privacy', 'terms', 'shipping', 'returns'].includes(section) && <><PageHeading title={title} text={description} /><div className="prose policy-content"><div className="notice">This information is being prepared for launch. The storefront is a preview and is not accepting orders.</div>{section === 'privacy' ? <><h2>In this preview</h2><p>The cart is saved in your browser on this device. Contact and launch-update forms open your email app; they do not submit data to an ASTAMALL website database. Checkout details remain in memory for the demo confirmation only. They are not sent to a server or saved in browser storage, and disappear when you refresh.</p><h2>Policy awaiting approval</h2><p>The full privacy policy, data controller details, retention periods and rights request process will be published before live accounts, subscriptions or orders are enabled.</p></> : section === 'terms' ? <><h2>Before live shopping opens</h2><p>Malaysian prices for all products are to be confirmed. Local availability is being finalised. Additional product photographs and translated details are sourced from NAFU LIFE. Preview checkout does not form an order or take payment.</p><h2>Terms awaiting approval</h2><p>Purchase terms, business details and customer service procedures will be published before orders open.</p></> : section === 'shipping' ? <><h2>Our initial market is Malaysia.</h2><p>Confirmed delivery coverage, charges, dispatch times and delivery estimates will be published before sales open.</p><h2>Details to be confirmed</h2><p>East and West Malaysia coverage, tracking, fulfilment timelines and handling of delivery issues are awaiting approval.</p></> : <><h2>Returns and refunds</h2><p>Eligibility, request timeframes, product condition requirements and refund processing details are awaiting approval.</p><h2>Before your first order</h2><p>The final returns policy and instructions for damaged or incorrect items will be available before we accept purchases.</p></>}<Link href="/contact" className="button">Contact Us</Link></div></>}
  </main>;
}
