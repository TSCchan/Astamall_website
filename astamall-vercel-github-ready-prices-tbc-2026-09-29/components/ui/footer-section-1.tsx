'use client';

import Link from 'next/link';
import { FacebookLogo, InstagramLogo, TiktokLogo, ArrowUp } from '@phosphor-icons/react';
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

const social = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@astamall92', Icon: TiktokLogo },
  { label: 'Instagram', href: 'https://www.instagram.com/astamall92/', Icon: InstagramLogo },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1HWHkT7DHX/?mibextid=wwXIfr', Icon: FacebookLogo },
];

export default function Footer1() {
  const reducedMotion = useReducedMotion();
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <footer className="footer astamall-footer lux-footer">
      <motion.div
        className="lux-footer-main"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.08 } } }}
      >
        <motion.div variants={itemVariants} className="lux-footer-brand">
          <Logo />
          <p>Beauty, powered by Astaxanthin.</p>
          <div className="lux-footer-social" aria-label="Social media">
            {social.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`ASTAMALL on ${label}`}><Icon size={20} weight="regular" aria-hidden="true" /></a>)}
          </div>
        </motion.div>

        <motion.nav variants={itemVariants} className="lux-footer-column" aria-label="Footer navigation">
          <h2>Explore</h2>
          {navigation.map(({ label, href }) => <Link key={href} href={href}>{label}</Link>)}
        </motion.nav>

        <motion.nav variants={itemVariants} className="lux-footer-column" aria-label="Policies and support">
          <h2>Support</h2>
          {legal.map(({ label, href }) => <Link key={href} href={href}>{label}</Link>)}
          <a href="mailto:astamall92@gmail.com">astamall92@gmail.com</a>
        </motion.nav>
      </motion.div>

      <div className="lux-footer-wordmark" aria-hidden="true">ASTAMALL</div>

      <div className="astamall-footer-bottom">
        <p>© {new Date().getFullYear()} ASTAMALL, Malaysia. All rights reserved.</p>
        <a href="#top" className="lux-footer-top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); }}>Back to top <ArrowUp size={14} aria-hidden="true" /></a>
      </div>
    </footer>
  );
}
