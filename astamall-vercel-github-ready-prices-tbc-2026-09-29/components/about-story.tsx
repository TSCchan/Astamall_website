'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ProductArt } from '@/components/brand-assets';
import { products } from '@/lib/catalog';

export default function AboutStory() {
  const journey=useRef<HTMLElement>(null); const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:journey,offset:['start 80%','end 40%']});
  const routeScale=useTransform(scrollYProgress,[0,1],[0,1]);
  const routeY=useTransform(scrollYProgress,[0,1],[18,-18]);
  return <article className="about-film">
    <section className="about-opening"><div><h1>Beauty, powered by Astaxanthin.</h1><p>ASTAMALL is a beauty and wellness destination bringing thoughtfully selected products from Taiwan to Malaysia, beginning with skincare, health foods and health supplements.</p></div><div className="about-opening-product"><ProductArt product={products.find(p => p.slug === 'asta-s-rejuvenating-serum')!} /></div></section>
    <section className="about-understanding"><div className="about-understanding-image"><img src="/assets/astaxanthin-droplet-v1.webp" alt="Astaxanthin-inspired red liquid and suspended particles" width="1024" height="1536" /></div><div><h2>We want you to understand what you use.</h2><p>ASTAMALL makes ingredient stories and product purposes easier to understand, so every choice begins with clearer information.</p><Link href="/ingredients" className="text-link">Explore ingredients <span aria-hidden="true">↗</span></Link></div></section>
    <section className="about-route" id="journey" ref={journey}><div className="about-route-heading"><h2>From Taiwan to Malaysia.</h2><p>We travelled to understand the ingredient technology, formulations and people behind the collection before bringing it home.</p></div><div className="route-track"><motion.div className="route-progress" style={reduce?{scaleX:1}:{scaleX:routeScale}}/><div className="route-stops">{['Malaysia','Taiwan','Ingredients','Formulation','ASTAMALL'].map(stop=><span key={stop}>{stop}</span>)}</div></div><div className="about-route-media"><motion.img src="/assets/astaxanthin-powder-cutout-v2.webp" alt="Astaxanthin-inspired ingredient composition" width="1024" height="1024" style={reduce?undefined:{y:routeY}}/><div><h3>A journey with purpose.</h3><p>Our selection connects science, beauty and wellness through products developed in Taiwan and introduced thoughtfully for Malaysia.</p></div></div></section>
    <section className="about-closing"><h2>Better understanding.<br />Better choices.<br />Better care.</h2><Link href="/shop" className="button">Explore the Collection</Link></section>
  </article>;
}
