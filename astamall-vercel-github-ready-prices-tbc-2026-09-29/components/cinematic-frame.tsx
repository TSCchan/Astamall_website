"use client";

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

// The image moves with the reading position. Copy remains visible and scrolling stays native.
export default function CinematicFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1.06]);
  return <section ref={ref} className={`quiet-film ${className}`}>
    <motion.div className="quiet-film-material" aria-hidden="true" style={reduced ? undefined : { y, scale }}><img src="/assets/astaxanthin-droplet-v1.webp" alt="" width="1024" height="1536" loading="lazy" /></motion.div>
    <div className="quiet-film-copy">{children}</div>
  </section>;
}
