'use client';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

// Motive: reveal a new editorial chapter at the moment it enters the reading path.
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduce ? {} : { opacity: [0.6, 1], y: [18, 0] }} viewport={{ once: true, amount: .12 }} transition={{ duration: .55, ease: [.16, 1, .3, 1] }}>{children}</motion.div>;
}
