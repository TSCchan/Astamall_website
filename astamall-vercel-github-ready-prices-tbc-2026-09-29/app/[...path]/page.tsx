import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PageHeading, ProductCard } from '@/components/brand';
import { Shop, ProductPurchase, ProductGallery } from '@/components/shop';
import { CartContents } from '@/components/store-shell';
import { FaqList, ContactForm } from '@/components/forms';
import AboutStory from '@/components/about-story';
import { Checkout, OrderConfirmation } from '@/components/checkout';
import ProductReviews from '@/components/product-reviews';
import { products, ingredients, articles, faqs, productBrand } from '@/lib/catalog';

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
    const related = products.filter(other => other.slug !== p.slug && (other.category === p.category || other.ingredients.some(i => p.ingredients.includes(i)))).slice(0, 3);
    return <main id="main-content" className="inner-page premium-detail">
      <div className="breadcrumbs"><Link href="/shop">Shop</Link><span>/</span><span>{p.short}</span></div>
      <section className="pdp-hero"><ProductGallery product={p}/><div className="pdp-copy"><h1>{p.name}</h1><p className="product-type">{p.category} / {p.type}</p><ProductPurchase product={p}/><p className="intro-text">{p.description}</p></div></section>
      <div className="pdp-information">
        <section className="pdp-information-block pdp-attributes">
          <header><p>Product information</p><h2>Product attributes</h2></header>
          <dl>
            <div><dt>Brand</dt><dd>{p.sourceUrl ? 'NAFU LIFE' : productBrand}</dd></div>
            <div><dt>Origin</dt><dd>Taiwan</dd></div>
            <div><dt>Category</dt><dd>{p.category}</dd></div>
            <div><dt>Featured ingredient</dt><dd>{p.ingredient}</dd></div>
            <div><dt>Size</dt><dd>{p.size || 'Refer to product packaging'}</dd></div>
            {p.purpose&&<div><dt>Purpose</dt><dd>{p.purpose}</dd></div>}
            {p.shelfLife&&<div><dt>Shelf life</dt><dd>{p.shelfLife}</dd></div>}
            {p.storage&&<div><dt>Storage</dt><dd>{p.storage}</dd></div>}
            {p.slug==='asta-s-rejuvenating-serum'&&<div><dt>Texture</dt><dd>Fresh, lightweight oil serum</dd></div>}
          </dl>
        </section>

        <section className="pdp-information-block pdp-description-block">
          <header><p>Full guide</p><h2>Product description</h2></header>
          <div className="pdp-description-content">
            <section className="pdp-description-section">
              <h3>Benefits &amp; features</h3>
              <h4>{p.benefit}</h4>
              {p.functions?<ul>{p.functions.map(item=><li key={item}>{item}</li>)}</ul>:<ul><li>Thoughtfully developed for ASTAMALL</li><li>Designed for an everyday beauty or wellness routine</li><li>Clear product guidance before launch</li></ul>}
              {p.official&&<p className="product-claim">These cosmetic functions refer to appearance and skin feel.</p>}
            </section>

            <section className="pdp-description-section">
              <h3>How to use</h3>
              <h4>A simple place in your routine.</h4>
              {p.howToUse?<ol className="usage-steps">{p.howToUse.map((step,index)=><li key={step}><span>{String(index+1).padStart(2,'0')}</span><p>{step}</p></li>)}</ol>:<p>{p.routine}</p>}
            </section>

            <section className="pdp-description-section">
              <h3>Key ingredients</h3>
              <h4>Understand what goes in.</h4>
              {p.keyIngredients?<div className="key-ingredient-list">{p.keyIngredients.map(item=><div key={item.name}><h5>{item.name}</h5><p>{item.description}</p></div>)}</div>:<><p>Featured ingredient: {p.ingredient}. The complete ingredient list will be published when the final product label is confirmed.</p><Link href="/ingredients" className="text-link">Explore the ingredient library <span aria-hidden="true">↗</span></Link></>}
            </section>

            {p.sourceUrl&&<p className="small-text">Product information translated from <a href={p.sourceUrl} target="_blank" rel="noreferrer">NAFU LIFE</a>. Refer to the product packaging for complete ingredients and directions.</p>}
            {p.cautions&&<section className="pdp-description-section"><h3>Care and storage</h3><h4>Use with care.</h4><ul>{p.cautions.map(item=><li key={item}>{item}</li>)}</ul></section>}
          </div>
        </section>

        {p.usageGuideImage&&<section className="pdp-usage-guide" aria-label="Product application guide"><img src={p.usageGuideImage} alt={p.usageGuideImageAlt || ''} width="537" height="2170" loading="lazy" /></section>}
        {p.longFormImages&&<section className="pdp-longform" aria-label="Translated product visual guides"><header><p>Explore the product</p><h2>More about {p.short.toLowerCase()}</h2></header>{p.longFormImages.map(item=><figure key={item.src}><img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" /><figcaption>{item.caption}</figcaption></figure>)}</section>}
        {p.award&&<section className={`pdp-recognition ${p.recognitionImage?'pdp-recognition-with-image':''}`}>{p.recognitionImage&&<div className="pdp-recognition-media"><img src={p.recognitionImage} alt={p.recognitionImageAlt || ''} width="1254" height="1254" loading="lazy" /></div>}<div className="pdp-recognition-copy"><p>Recognition</p><h2>{p.award.split(';').map(award=><span key={award}>{award.trim()}</span>)}</h2></div></section>}
        <ProductReviews productName={p.name} reviews={p.reviews??[]}/>
      </div>
      {related.length>0&&<section className="related-section"><div className="section-heading"><h2>Related products</h2><p>Continue discovering the collection.</p></div><div className="product-grid editorial-grid">{related.map(p=><ProductCard key={p.slug} product={p}/>)}</div></section>}
    </main>;
  }
  if (section === 'ingredients' && slug) {
    const ingredient = ingredients.find(i => i.slug === slug);
    if (!ingredient) notFound();
    const containing = products.filter(p => p.ingredients.includes(slug) || (slug === 'astaxanthin' && p.ingredients.includes('asta-s')));
    return <main id="main-content" className="inner-page"><div className="breadcrumbs"><Link href="/ingredients">Ingredient Library</Link><span>/</span><span>{ingredient.name}</span></div><PageHeading title={ingredient.name} text={ingredient.caption} /><div className="ingredient-detail"><div className="ingredient-detail-art"><img src="/assets/astaxanthin-droplet-v1.webp" alt="Illustrative red liquid, part of ASTAMALL's ingredient visual identity" width="1024" height="1536" /></div><div className="prose"><section><h2>What is it?</h2><p>{ingredient.text}</p></section><section><h2>Why is it used?</h2><p>{ingredient.use}</p></section><section><h2>Within the formula.</h2><p>{ingredient.formula}</p></section></div></div><section className="related-section"><h2>Find it in the collection.</h2>{containing.length ? <div className="product-grid">{containing.map(p => <ProductCard key={p.slug} product={p} />)}</div> : <p>Product formulation details are being confirmed.</p>}</section></main>;
  }
  if (!pageMeta[section]) notFound();
  const [title, description] = pageMeta[section];
  return <main id="main-content" className={`inner-page ${section}-page`}>
    {section === 'shop' && <><PageHeading title="Shop the collection" text="Skincare, health foods and health supplements." /><Shop /></>}
    {section === 'astaxanthin' && <><PageHeading title="An ingredient. A new perspective." text="Astaxanthin brought us to the meeting point of science, beauty and everyday wellness." /><div className="ingredient-detail"><div className="ingredient-detail-art"><img src="/assets/astaxanthin-droplet-v1.webp" alt="Conceptual astaxanthin-inspired liquid with red particles" width="1024" height="1536" /></div><div className="prose"><h2>It starts with understanding.</h2><p>We began with Astaxanthin, an ingredient that opened our eyes to the connection between science, beauty and wellness.</p><p>Our collection brings that interest into skincare, health foods and health supplements. Every product has its own formulation, directions and role.</p><h2>The Asta-S story.</h2><p>The ingredient developer describes Asta-S as a patented, Taiwan-developed free-form astaxanthin technology, designed for improved stability and bioavailability in skincare applications.</p><p className="small-text">This is a manufacturer description, not an independent ASTAMALL clinical claim. Substantiating documents are awaiting review.</p><Link href="/ingredients/asta-s" className="text-link">Asta-S ingredient profile ↗</Link></div></div><section className="education-note"><h2>One name doesn&apos;t tell the whole story.</h2><p>An ingredient is only part of a formula. Read the finished product&apos;s ingredients, directions and precautions before deciding whether it belongs in your routine.</p><Link href="/ingredients" className="button">Ingredient Library</Link></section><div className="product-grid">{products.filter(p => p.ingredients.includes('asta-s')).map(p => <ProductCard key={p.slug} product={p} />)}</div></>}
    {section === 'ingredients' && <><PageHeading title="Know what goes in." text="An introduction to the ingredients and technologies behind the ASTAMALL collection, with clear distinctions between confirmed information and details still awaiting documentation." label="Ingredient Library" /><div className="ingredient-index">{ingredients.map((i, n) => <Link href={`/ingredients/${i.slug}`} key={i.slug}><span className={`ingredient-index-visual visual-${n % 3}`} aria-hidden="true" /><div><h2>{i.name}</h2><p>{i.caption}</p></div><span aria-hidden="true">↗</span></Link>)}</div></>}
    {section === 'about' && <AboutStory />}
    {section === 'journal' && !slug && <><PageHeading title="ASTAMALL Journal" text="Ingredient stories, beauty routines, skin education and wellness, edited with clarity." label="Read and discover" /><div className="journal-index">{articles.map((article, index) => <Link href={`/journal/${article.slug}`} key={article.slug} className="journal-index-item"><div className={`journal-art journal-art-${index}`}><img src={index === 2 ? '/assets/astaxanthin-powder-cutout-v2.webp' : '/assets/astaxanthin-droplet-v1.webp'} alt="" /></div><div><span>{article.category}</span><h2>{article.title}</h2><p>{article.excerpt}</p><span className="text-link">Read article <span aria-hidden="true">↗</span></span></div></Link>)}</div></>}
    {section === 'journal' && slug && (() => { const article=articles.find(item=>item.slug===slug); if(!article) notFound(); return <article className="journal-article"><div className="breadcrumbs"><Link href="/journal">Journal</Link><span>/</span><span>{article.category}</span></div><header><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p>{article.excerpt}</p></header><div className="journal-article-visual"><img src={article.slug==='understanding-your-beauty-routine'?'/assets/astaxanthin-powder-cutout-v2.webp':'/assets/astaxanthin-droplet-v1.webp'} alt="Astaxanthin-inspired editorial composition" /></div><div className="journal-body">{article.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div><Link href="/shop" className="button">Explore the Collection</Link></article>; })()}
    {section === 'faq' && <><JsonLd value={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} /><PageHeading title="Help & FAQ" text="Products, payment and delivery information." /><FaqList /><div className="education-note"><h2>Still curious?</h2><Link href="/contact" className="button">Contact Us</Link></div></>}
    {section === 'contact' && <><PageHeading title="Contact us" text="Product questions, ingredient information or business enquiries." /><div className="contact-layout"><aside><h2>Let’s talk.</h2><a href="mailto:astamall92@gmail.com" className="text-link">astamall92@gmail.com</a><div className="contact-social"><a href="https://instagram.com/astamall92" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://tiktok.com/@astamall92" target="_blank" rel="noreferrer">TikTok ↗</a></div></aside><ContactForm /></div></>}
    {section === 'cart' && <><PageHeading title="Your cart" text="Review your items and selected options." /><div className="cart-page-content"><CartContents fullPage /></div></>}
    {section === 'order-confirmation' && <OrderConfirmation />}
    {section === 'checkout' && <><PageHeading title="Checkout" /><Checkout /></>}
    {['privacy', 'terms', 'shipping', 'returns'].includes(section) && <><PageHeading title={title} text={description} /><div className="prose policy-content"><div className="notice">This information is being prepared for launch. The storefront is a preview and is not accepting orders.</div>{section === 'privacy' ? <><h2>In this preview</h2><p>The cart is saved in your browser on this device. Contact and launch-update forms open your email app; they do not submit data to an ASTAMALL website database. Checkout details remain in memory for the demo confirmation only. They are not sent to a server or saved in browser storage, and disappear when you refresh.</p><h2>Policy awaiting approval</h2><p>The full privacy policy, data controller details, retention periods and rights request process will be published before live accounts, subscriptions or orders are enabled.</p></> : section === 'terms' ? <><h2>Before live shopping opens</h2><p>Malaysian prices for all products are to be confirmed. Local availability is being finalised. Additional product photographs and translated details are sourced from NAFU LIFE. Preview checkout does not form an order or take payment.</p><h2>Terms awaiting approval</h2><p>Purchase terms, business details and customer service procedures will be published before orders open.</p></> : section === 'shipping' ? <><h2>Our initial market is Malaysia.</h2><p>Confirmed delivery coverage, charges, dispatch times and delivery estimates will be published before sales open.</p><h2>Details to be confirmed</h2><p>East and West Malaysia coverage, tracking, fulfilment timelines and handling of delivery issues are awaiting approval.</p></> : <><h2>Returns and refunds</h2><p>Eligibility, request timeframes, product condition requirements and refund processing details are awaiting approval.</p><h2>Before your first order</h2><p>The final returns policy and instructions for damaged or incorrect items will be available before we accept purchases.</p></>}<Link href="/contact" className="button">Contact Us</Link></div></>}
  </main>;
}
