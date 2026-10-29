import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { company, privacyPolicy, sectionId, type PolicyBlock, type PolicyLocale } from '@/lib/privacy-policy';
import LanguageSwitch from '@/components/privacy/language-switch';
import DocumentLang from '@/components/privacy/document-lang';

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

/** **bold**, and the contact email and website as links, inside a line of policy text. */
function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = new RegExp(`\\*\\*(.+?)\\*\\*|(${escape(company.email)})|(${escape(company.website)})`, 'g');
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const key = `${match.index}`;
    if (match[1] !== undefined) parts.push(<strong key={key}><Inline text={match[1]} /></strong>);
    else if (match[2] !== undefined) parts.push(<a key={key} href={`mailto:${company.email}`}>{company.email}</a>);
    else parts.push(<a key={key} href={company.website}>{company.website}</a>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Facts({ facts }: { facts: [string, string][] }) {
  return <dl className="pp-facts">{facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd><Inline text={value} /></dd></div>)}</dl>;
}

function Blocks({ blocks = [] }: { blocks?: PolicyBlock[] }) {
  return blocks.map((block, i) => {
    if (typeof block === 'string') return <p key={i}><Inline text={block} /></p>;
    if ('list' in block) return <ul key={i}>{block.list.map((item, j) => <li key={j}><Inline text={item} /></li>)}</ul>;
    return <div key={i} className="pp-panel"><h3>{block.title}</h3><Facts facts={block.facts} /></div>;
  });
}

/** The Privacy Policy in one language. Both /privacy-policy and /ms/privacy-policy render this. */
export default function PrivacyPolicyPage({ locale }: { locale: PolicyLocale }) {
  const policy = privacyPolicy[locale];
  return <main id="main-content" className="inner-page privacy-page"><article className="pp" lang={policy.lang} aria-labelledby="pp-title">
    <DocumentLang lang={policy.lang} />
    <header className="pp-header">
      <LanguageSwitch locale={locale} />
      <h1 id="pp-title">{policy.title}</h1>
      <p className="pp-updated">{policy.updatedLabel}: <time dateTime={company.updated}>{policy.updated}</time></p>
      <Facts facts={policy.meta} />
    </header>

    <nav className="pp-contents" aria-labelledby="pp-contents-title">
      <h2 id="pp-contents-title">{policy.contentsLabel}</h2>
      <ol>{policy.sections.map(section => <li key={section.number}>
        <a href={`#${sectionId(section.number)}`}><span>{section.number}.</span>{section.title}</a>
      </li>)}</ol>
    </nav>

    <div className="pp-body">
      {policy.sections.map(section => <section key={section.number} id={sectionId(section.number)} aria-labelledby={`${sectionId(section.number)}-title`}>
        <h2 id={`${sectionId(section.number)}-title`}><span className="pp-number">{section.number}.</span> {section.title}</h2>
        <Blocks blocks={section.blocks} />
        {section.subsections?.map(sub => <section key={sub.number} id={sectionId(sub.number)} aria-labelledby={`${sectionId(sub.number)}-title`}>
          <h3 id={`${sectionId(sub.number)}-title`}><span className="pp-number">{sub.number}</span> {sub.title}</h3>
          <Blocks blocks={sub.blocks} />
        </section>)}
        <Blocks blocks={section.closing} />
      </section>)}
    </div>

    <footer className="pp-colophon">{policy.colophon.map(line => <p key={line}><Inline text={line} /></p>)}</footer>
  </article></main>;
}

/** Title, description, canonical URL and hreflang alternates for one language of the policy. */
export function privacyMetadata(locale: PolicyLocale): Metadata {
  const policy = privacyPolicy[locale];
  const languages = Object.fromEntries(Object.values(privacyPolicy).map(p => [p.lang, p.path]));
  return {
    title: policy.title,
    description: policy.description,
    alternates: { canonical: policy.path, languages: { ...languages, 'x-default': privacyPolicy.en.path } },
    openGraph: {
      title: `${policy.title} | ASTAMALL`, description: policy.description, url: policy.path, siteName: 'ASTAMALL', type: 'article',
      locale: policy.ogLocale, alternateLocale: Object.values(privacyPolicy).filter(p => p !== policy).map(p => p.ogLocale),
    },
  };
}
