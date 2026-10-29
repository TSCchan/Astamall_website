import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { company, privacyPolicy, sectionId, type PolicyBlock, type PolicyLocale } from '@/lib/privacy-policy';
import LanguageSwitch from '@/components/privacy/language-switch';
import DocumentLang from '@/components/privacy/document-lang';

/** **bold** and the contact email (as a mailto link) inside a line of policy text. */
function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = new RegExp(`\\*\\*(.+?)\\*\\*|(${company.email.replace(/[.]/g, '\\.')})`, 'g');
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const key = `${match.index}`;
    if (match[1] !== undefined) parts.push(<strong key={key}><Inline text={match[1]} /></strong>);
    else parts.push(<a key={key} href={`mailto:${company.email}`}>{company.email}</a>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Blocks({ blocks }: { blocks: PolicyBlock[] }) {
  return blocks.map((block, i) => {
    if (typeof block === 'string') return <p key={i}><Inline text={block} /></p>;
    const items = block.list.map((item, j) => <li key={j}><Inline text={item} /></li>);
    return block.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
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
    </header>

    {policy.sections.length > 0 && <nav className="pp-contents" aria-labelledby="pp-contents-title">
      <h2 id="pp-contents-title">{policy.contentsLabel}</h2>
      <ol>{policy.sections.map(section => <li key={section.number}>
        <a href={`#${sectionId(section.number)}`}><span>{section.number}.</span>{section.title}</a>
      </li>)}</ol>
    </nav>}

    <div className="pp-body">
      {policy.sections.map(section => <section key={section.number} id={sectionId(section.number)} aria-labelledby={`${sectionId(section.number)}-title`}>
        <h2 id={`${sectionId(section.number)}-title`}><span className="pp-number">{section.number}.</span> {section.title}</h2>
        <Blocks blocks={section.blocks} />
        {section.subsections?.map(sub => <section key={sub.number} id={sectionId(sub.number)} aria-labelledby={`${sectionId(sub.number)}-title`}>
          <h3 id={`${sectionId(sub.number)}-title`}><span className="pp-number">{sub.number}</span> {sub.title}</h3>
          <Blocks blocks={sub.blocks} />
        </section>)}
      </section>)}

      <section className="pp-enquiries" id="enquiries" aria-labelledby="enquiries-title">
        <h2 id="enquiries-title">{policy.enquiries.title}</h2>
        <dl>{policy.enquiries.facts.map(([term, value]) => <div key={term}>
          <dt>{term}</dt>
          <dd>{value === company.email ? <a href={`mailto:${company.email}`}>{value}</a> : value === company.website ? <a href={company.website}>{value}</a> : value}</dd>
        </div>)}</dl>
        <Blocks blocks={policy.enquiries.blocks} />
      </section>
    </div>
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
