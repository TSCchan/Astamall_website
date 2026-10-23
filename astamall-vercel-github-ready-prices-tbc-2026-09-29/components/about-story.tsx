'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import Reveal from '@/components/reveal';
import { products, categories } from '@/lib/catalog';

const stops = ['Malaysia', 'Taiwan', 'Ingredients', 'Formulation', 'ASTAMALL'];

export default function AboutStory() {
  const journey=useRef<HTMLElement>(null); const opening=useRef<HTMLElement>(null); const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:journey,offset:['start 80%','end 40%']});
  const routeScale=useTransform(scrollYProgress,[0,1],[0,1]);
  const {scrollYProgress:openingProgress}=useScroll({target:opening,offset:['start start','end start']});
  const archY=useTransform(openingProgress,[0,1],['0%','12%']);
  const facts=[
    {value:String(products.length),label:'Products in the collection'},
    {value:String(categories.length-1),label:'Collections: skincare, health foods and health supplements'},
    {value:'1',label:'Founding ingredient: astaxanthin'},
  ];
  return <article className="about-film lux-about">
    <section className="about-opening" ref={opening}>
      <Reveal stagger><p className="eyebrow">Our story</p><h1>Beauty, powered by Astaxanthin.</h1><p>ASTAMALL is a beauty and wellness destination bringing thoughtfully selected products from Taiwan to Malaysia, beginning with skincare, health foods and health supplements.</p></Reveal>
      <motion.div className="about-arch" style={reduce?undefined:{y:archY}}><img src="/assets/astamall-asta-s-serum-v3.webp" alt="Asta-S Rejuvenating Serum on a deep red surface" width="800" height="800" /></motion.div>
    </section>
    <section className="about-understanding">
      <Reveal className="about-facts" stagger>{facts.map(fact=><div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}</Reveal>
      <Reveal stagger><h2>We want you to understand what you use.</h2><p>ASTAMALL makes ingredient stories and product purposes easier to understand, so every choice begins with clearer information.</p><Link href="/ingredients" className="text-link">Explore ingredients <span aria-hidden="true">↗</span></Link></Reveal>
    </section>
    <section className="about-route" id="journey" ref={journey}><div className="about-route-heading"><h2>From Taiwan to Malaysia.</h2><p>We travelled to understand the ingredient technology, formulations and people behind the collection before bringing it home.</p></div><div className="route-track"><motion.div className="route-progress" style={reduce?{scaleX:1}:{scaleX:routeScale}}/><div className="route-stops">{stops.map((stop,i)=><RouteStop key={stop} label={stop} at={i/(stops.length-1)} progress={routeScale} reduce={!!reduce}/>)}</div></div><div className="about-route-media"><div><h3>A journey with purpose.</h3><p>Our selection connects science, beauty and wellness through products developed in Taiwan and introduced thoughtfully for Malaysia.</p></div></div></section>
    <section className="about-closing"><Reveal stagger><h2>Better understanding.<br />Better choices.<br />Better care.</h2><Link href="/shop" className="button">Explore the Collection</Link></Reveal></section>
  </article>;
}

function RouteStop({label,at,progress,reduce}:{label:string;at:number;progress:MotionValue<number>;reduce:boolean}) {
  const lit=useTransform(progress,value=>value>=at-.02?1:.35);
  return <motion.span style={reduce?undefined:{opacity:lit}}>{label}</motion.span>;
}
