'use client';
import { useEffect, useRef, type ReactNode } from 'react';

// Motive: reveal a new editorial chapter at the moment it enters the reading path.
// CSS owns the motion; content stays visible without JavaScript or with reduced motion.
export default function Reveal({ children, className = '', stagger = false }: { children: ReactNode; className?: string; stagger?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      node.classList.add('is-in');
      observer.disconnect();
    }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={className} data-reveal={stagger ? 'stagger' : ''}>{children}</div>;
}
