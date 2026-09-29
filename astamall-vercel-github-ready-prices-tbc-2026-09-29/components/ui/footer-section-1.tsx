'use client';

import Link from 'next/link';
import { FacebookLogo, InstagramLogo, TiktokLogo } from '@phosphor-icons/react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Logo } from '@/components/brand-assets';

const navigation = [
  { label: 'Shop', href: '/shop' },
  { label: 'Astaxanthin', href: '/astaxanthin' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const legal = [
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export default function Footer1() {
  const reducedMotion = useReducedMotion();
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.55, ease: 'easeOut' } },
  };

  return (
    <footer className="footer astamall-footer">
      <motion.div
        className="astamall-footer-main"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.1 } } }}
      >
        <motion.div variants={itemVariants} className="astamall-footer-brand">
          <Logo />
          <p>Beauty, powered by Astaxanthin.</p>
        </motion.div>

        <motion.nav variants={itemVariants} className="astamall-footer-nav" aria-label="Footer navigation">
          {navigation.map(({ label, href }) => <Link key={href} href={href}>{label}</Link>)}
        </motion.nav>

        <motion.div variants={itemVariants} className="astamall-footer-social" aria-label="Social media">
          <a href="https://www.tiktok.com/@astamall92" target="_blank" rel="noopener noreferrer" aria-label="ASTAMALL on TikTok"><TiktokLogo size={24} weight="regular" aria-hidden="true" /></a>
          <a href="https://www.instagram.com/astamall92/" target="_blank" rel="noopener noreferrer" aria-label="ASTAMALL on Instagram"><InstagramLogo size={24} weight="regular" aria-hidden="true" /></a>
          <a href="https://www.facebook.com/share/1HWHkT7DHX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="ASTAMALL on Facebook"><FacebookLogo size={24} weight="regular" aria-hidden="true" /></a>
        </motion.div>
      </motion.div>

      <div className="astamall-footer-divider" aria-hidden="true" />

      <div className="astamall-footer-bottom">
        <p>© {new Date().getFullYear()} ASTAMALL, Malaysia. All rights reserved.</p>
        <nav aria-label="Policies and support">
          {legal.map(({ label, href }) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
