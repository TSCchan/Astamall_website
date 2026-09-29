'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '@/lib/catalog';
import { Logo, ProductArt } from '@/components/brand';

export default function CinematicHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const scenes = gsap.utils.toArray<HTMLElement>('.cinema-copy');
        const objects = gsap.utils.toArray<HTMLElement>('.cinema-product');
        gsap.set(scenes.slice(1), { autoAlpha: 0, y: 28 });
        gsap.set('.cinema-products', { autoAlpha: 0 });
        gsap.set('.science-material', { autoAlpha: 0, scale: 1.25 });
        gsap.set('.release-surface', { opacity: 0 });
        gsap.set('.cinema-droplet', { xPercent: 0, scale: 1 });
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 5.3}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          // Visibility is a discrete boundary, never React state on every frame.
          onUpdate: self => document.documentElement.toggleAttribute('data-story-complete', self.progress >= 1),
          onLeave: () => document.documentElement.setAttribute('data-story-complete', ''),
          onEnterBack: () => document.documentElement.removeAttribute('data-story-complete'),
          onLeaveBack: () => document.documentElement.removeAttribute('data-story-complete'),
        }});
        // Motive: a slow camera push turns an attractive surface into an ingredient question.
        tl.to(scenes[0], { autoAlpha: 0, y: -24, duration: .5 }, .45)
          .to('.cinema-droplet', { scale: 1.3, xPercent: -6, duration: 1.1 }, .3)
          .to(scenes[1], { autoAlpha: 1, y: 0, duration: .45 }, .95)
          .to(scenes[1], { autoAlpha: 0, y: -24, duration: .4 }, 1.7)
          .to('.cinema-droplet', { scale: 2.4, xPercent: -20, yPercent: 15, duration: 1.3 }, 1.5)
          .to(scenes[2], { autoAlpha: 1, y: 0, duration: .5 }, 2.1)
          .to(scenes[2], { autoAlpha: 0, y: -24, duration: .4 }, 2.95)
          // Motive: layered material shifts attention from the ingredient to formulation.
          .to('.science-material', { autoAlpha: .75, scale: 1, duration: .8 }, 3)
          .to('.cinema-droplet', { autoAlpha: .28, scale: 2, duration: .8 }, 3)
          .to(scenes[3], { autoAlpha: 1, y: 0, duration: .5 }, 3.4)
          .to(scenes[3], { autoAlpha: 0, y: -24, duration: .4 }, 4.2)
          .to('.science-material', { autoAlpha: 0, scale: .7, duration: .7 }, 4.25)
          .to('.cinema-droplet', { autoAlpha: 0, scale: .65, duration: .8 }, 4.25)
          // Motive: six independent silhouettes become a product family, never one product morphing into another.
          .to('.cinema-products', { autoAlpha: 1, duration: .7 }, 4.4)
          .fromTo(objects, { x: 0, y: 70, scale: .48, rotation: i => i % 2 ? 14 : -14 }, { x: 0, y: 0, scale: 1, rotation: 0, duration: 1, stagger: .07 }, 4.45)
          .to(scenes[4], { autoAlpha: 1, y: 0, duration: .5 }, 4.6)
          .to(scenes[4], { autoAlpha: 0, y: -20, duration: .4 }, 5.45)
          // Motive: the pale commerce surface signals a release back to normal shopping.
          .to('.release-surface', { opacity: 1, duration: .9 }, 5.55)
          .to('.cinema-products', { scale: .85, xPercent: 8, duration: .9 }, 5.55)
          .to(scenes[5], { autoAlpha: 1, y: 0, duration: .55 }, 6)
          .to({}, { duration: .35 });
      }, root);
      return () => { ctx.revert(); document.documentElement.removeAttribute('data-story-complete'); };
    });
    media.add('(prefers-reduced-motion: reduce)', () => {
      // The static chapters preserve the same navigation boundary without pinning.
      const updateHeader = () => document.documentElement.toggleAttribute('data-story-complete', Boolean(root.current && root.current.getBoundingClientRect().bottom <= window.innerHeight));
      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
      window.addEventListener('resize', updateHeader);
      return () => {
        window.removeEventListener('scroll', updateHeader);
        window.removeEventListener('resize', updateHeader);
        document.documentElement.removeAttribute('data-story-complete');
      };
    });
    return () => media.revert();
  }, []);

  return <section ref={root} id="ingredient" className="cinema" aria-label="The ASTAMALL ingredient story">
    <div className="cinema-stage">
      <div className="release-surface" />
      <Logo className="campaign-logo" />
      <div className="cinema-droplet" aria-hidden="true"><img src="/assets/astaxanthin-droplet-v1.webp" width="1024" height="1536" fetchPriority="high" alt="" /></div>
      <div className="science-material" aria-hidden="true"><img src="/assets/astaxanthin-droplet-v1.webp" alt="" /><img src="/assets/astaxanthin-droplet-v1.webp" alt="" /></div>
      <div className="cinema-products" aria-hidden="true">{products.map((p, i) => <div className={`cinema-product object-${i}`} key={p.slug}><ProductArt product={p} /></div>)}</div>
      <div className="cinema-copy opening-copy">
        <h1>Beauty, powered<br />by Astaxanthin.</h1>
        <p>Malaysia&apos;s home of astaxanthin beauty and wellness, with science-led formulas from Taiwan.</p>
        <div className="button-row"><Link href="/shop" className="button button-light">Shop ASTAMALL <span aria-hidden="true">↗</span></Link><Link href="/astaxanthin" className="text-link">Discover Astaxanthin</Link></div>
      </div>
      <div className="cinema-copy beauty-copy"><h2>Beauty begins<br />deeper.</h2></div>
      <div className="cinema-copy ingredient-copy"><h2>Look closer.</h2><p>At the heart of our story is Astaxanthin.</p></div>
      <div className="cinema-copy science-copy"><h2>Beauty has<br />a science.</h2><p>Ingredients matter. So does the technology behind them.</p><span className="technology-name">Asta-S Free-Form Astaxanthin</span></div>
      <div className="cinema-copy product-copy"><h2>Science,<br />made beautiful.</h2><p>Skincare. Health foods. Health supplements.</p><small>Visual concept. Final product photography to follow.</small></div>
      <div className="cinema-copy release-copy"><h2>Malaysia&apos;s home of<br />astaxanthin beauty<br />& wellness.</h2><p>Discover beauty and wellness products from Taiwan, selected with ingredient understanding at their heart.</p><Link className="button" href="/shop">Shop ASTAMALL <span aria-hidden="true">↗</span></Link></div>
    </div>
  </section>;
}
