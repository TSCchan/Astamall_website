import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { company, sectionId, type LegalBlock, type LegalDocuments, type LegalLocale } from '@/lib/legal';
import LanguageSwitch from '@/components/legal/language-switch';
import DocumentLang from '@/components/legal/document-lang';

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

function Blocks({ blocks = [] }: { blocks?: LegalBlock[] }) {
  return blocks.map((block, i) => {
    if (typeof block === 'string') return <p key={i}><Inline text={block} /></p>;
    if ('list' in block) {
      const items = block.list.map((item, j) => <li key={j}><Inline text={item} /></li>);
      return block.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
    }
    if ('table' in block) return <div key={i} className="pp-table"><table>
      <thead><tr>{block.table.head.map(cell => <th key={cell} scope="col"><Inline text={cell} /></th>)}</tr></thead>
      <tbody>{block.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => c === 0 ? <th key={c} scope="row"><Inline text={cell} /></th> : <td key={c}><Inline text={cell} /></td>)}</tr>)}</tbody>
    </table></div>;
    return <div key={i} className="pp-panel"><h3>{block.title}</h3><Facts facts={block.facts} /></div>;
  });
}

/**
 * One language of a legal document (the Privacy Policy; the Shipping, Returns & Refund Policy). Each document's
 * English and Bahasa Malaysia routes both render this.
 */
export default function LegalPage({ docs, locale }: { docs: LegalDocuments; locale: LegalLocale }) {
  const doc = docs[locale];
  const languages = (['en', 'ms'] as const).map(option => ({ locale: option, lang: docs[option].lang, path: docs[option].path, name: docs[option].languageName }));
  return <main id="main-content" className="inner-page legal-page"><article className="pp" lang={doc.lang} aria-labelledby="pp-title">
    <DocumentLang lang={doc.lang} />
    <header className="pp-header">
      <LanguageSwitch locale={locale} label={doc.languageLabel} languages={languages} />
      <h1 id="pp-title">{doc.title}</h1>
      <p className="pp-updated">{doc.updatedLabel}: <time dateTime={doc.updatedDate}>{doc.updated}</time></p>
      <Facts facts={doc.meta} />
    </header>

    <nav className="pp-contents" aria-labelledby="pp-contents-title">
      <h2 id="pp-contents-title">{doc.contentsLabel}</h2>
      <ol>{doc.sections.map(section => <li key={section.number}>
        <a href={`#${sectionId(section.number)}`}><span>{section.number}.</span>{section.title}</a>
      </li>)}</ol>
    </nav>

    <div className="pp-body">
      {doc.sections.map(section => <section key={section.number} id={sectionId(section.number)} aria-labelledby={`${sectionId(section.number)}-title`}>
        <h2 id={`${sectionId(section.number)}-title`}><span className="pp-number">{section.number}.</span> {section.title}</h2>
        <Blocks blocks={section.blocks} />
        {section.subsections?.map(sub => <section key={sub.number} id={sectionId(sub.number)} aria-labelledby={`${sectionId(sub.number)}-title`}>
          <h3 id={`${sectionId(sub.number)}-title`}><span className="pp-number">{sub.number}</span> {sub.title}</h3>
          <Blocks blocks={sub.blocks} />
        </section>)}
        <Blocks blocks={section.closing} />
      </section>)}
    </div>

    {doc.colophon && <footer className="pp-colophon">{doc.colophon.map(line => <p key={line}><Inline text={line} /></p>)}</footer>}
  </article></main>;
}

/** Title, description, canonical URL and hreflang alternates for one language of a legal document. */
export function legalMetadata(docs: LegalDocuments, locale: LegalLocale): Metadata {
  const doc = docs[locale];
  const languages = Object.fromEntries(Object.values(docs).map(d => [d.lang, d.path]));
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.path, languages: { ...languages, 'x-default': docs.en.path } },
    openGraph: {
      title: `${doc.title} | ASTAMALL`, description: doc.description, url: doc.path, siteName: 'ASTAMALL', type: 'article',
      locale: doc.ogLocale, alternateLocale: Object.values(docs).filter(d => d !== doc).map(d => d.ogLocale),
    },
  };
}
