'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FacebookLogo, InstagramLogo, TiktokLogo } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { Logo } from '@/components/brand-assets';
import { localeForPath, privacyPolicy } from '@/lib/privacy-policy';

const links = [
  { label: 'Astaxanthin', href: '/astaxanthin' },
  { label: 'About', href: '/about' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'Terms', href: '/terms' },
];

const social = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@astamall92', Icon: TiktokLogo },
  { label: 'Instagram', href: 'https://www.instagram.com/astamall92/', Icon: InstagramLogo },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1HWHkT7DHX/?mibextid=wwXIfr', Icon: FacebookLogo },
];

/** A quiet, centred footer: logo, one row of links, social icons, the copyright line, then the large wordmark. */
export default function Footer1() {
  const reducedMotion = useReducedMotion();
  // the Privacy Policy link follows the language of the page being read
  const policy = privacyPolicy[localeForPath(usePathname())];
  const footerLinks = [...links.slice(0, 4), { label: policy.title, href: policy.path }, ...links.slice(4)];
  return (
    <footer className="ft">
      <motion.div
        className="ft-inner"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Logo className="ft-logo" />
        <nav className="ft-links" aria-label="Footer">
          {footerLinks.map(({ label, href }) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="ft-social" aria-label="Social media">
          {social.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`ASTAMALL on ${label}`}><Icon size={20} aria-hidden="true" /></a>)}
        </div>
        <p className="ft-copy">© {new Date().getFullYear()} ASTAMALL, Malaysia. Beauty, powered by astaxanthin.</p>
      </motion.div>
      <div className="ft-wordmark" aria-hidden="true">ASTAMALL</div>
    </footer>
  );
}
