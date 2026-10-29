'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { LegalLocale } from '@/lib/legal';

type Language = { locale: LegalLocale; lang: string; path: string; name: string };

/**
 * English / Bahasa Melayu segmented control. Each option is a real link to that language's URL, so it works without
 * JavaScript, can be opened in a new tab and shared. While reading, the links carry the section in view (#section-n),
 * so switching language lands on the same section.
 */
export default function LanguageSwitch({ locale, label, languages }: { locale: LegalLocale; label: string; languages: Language[] }) {
  const [anchor, setAnchor] = useState('');

  useEffect(() => {
    const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1)); if (id && document.getElementById(id)) setAnchor(id); };
    fromHash();
    // the section being read is the first one crossing the band just below the site header
    const sections = [...document.querySelectorAll<HTMLElement>('.pp-body > section[id^="section-"]')];
    const visible = new Set<HTMLElement>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
        else visible.delete(entry.target as HTMLElement);
      }
      const current = sections.find(section => visible.has(section));
      if (current) setAnchor(current.id);
      else if (scrollY < 200) setAnchor('');
    }, { rootMargin: '-120px 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
    window.addEventListener('hashchange', fromHash);
    return () => { observer.disconnect(); window.removeEventListener('hashchange', fromHash); };
  }, []);

  return <nav className="pp-lang" aria-label={label}>
    {languages.map(language => {
      const current = language.locale === locale;
      return <Link key={language.locale} href={anchor ? `${language.path}#${anchor}` : language.path} hrefLang={language.lang} lang={language.lang}
        aria-current={current ? 'page' : undefined} onClick={event => { if (current) event.preventDefault(); }}>
        {language.name}
      </Link>;
    })}
  </nav>;
}
