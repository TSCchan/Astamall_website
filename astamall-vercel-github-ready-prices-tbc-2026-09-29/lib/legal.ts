/**
 * Shared shape of ASTAMALL's legal documents (Privacy Policy; Shipping, Returns & Refund Policy), each published
 * in English and Bahasa Malaysia. The text of each document lives in its own file; one page component lays them out.
 *
 * Text conventions: **bold** marks emphasis or a label, and the contact email address and website address become
 * links wherever they appear.
 */

export type LegalLocale = 'en' | 'ms';

/** A paragraph, a list of points, a short table of labelled details, or a table. */
export type LegalBlock =
  | string
  | { list: string[]; ordered?: boolean }
  | { title: string; facts: [string, string][] }
  | { table: { head: string[]; rows: string[][] } };

export type LegalSubsection = { number: string; title: string; blocks: LegalBlock[] };

/** `closing` holds text that follows a section's subsections. */
export type LegalSection = { number: number; title: string; blocks: LegalBlock[]; subsections?: LegalSubsection[]; closing?: LegalBlock[] };

/** One language of a legal document. */
export type LegalDocument = {
  /** BCP 47 language tag, used for the lang attribute. */
  lang: string;
  /** Open Graph locale. */
  ogLocale: string;
  path: string;
  title: string;
  description: string;
  updatedLabel: string;
  updated: string;
  /** ISO date of the last update, for machine-readable metadata. */
  updatedDate: string;
  /** Operator and contact details shown under the heading. */
  meta: [string, string][];
  contentsLabel: string;
  languageLabel: string;
  languageName: string;
  sections: LegalSection[];
  /** Closing lines after the last section. */
  colophon?: string[];
};

export type LegalDocuments = Record<LegalLocale, LegalDocument>;

export const company = {
  legalName: 'ASTA MALL PLT',
  registration: '202604002255',
  website: 'https://www.astamall.com.my',
  email: 'astamall92@gmail.com',
};

export const sectionId = (number: number | string) => `section-${String(number).replace(/\./g, '-')}`;

export const localeForPath = (pathname: string): LegalLocale => (pathname === '/ms' || pathname.startsWith('/ms/') ? 'ms' : 'en');

const blocksText = (blocks: LegalBlock[] = []) => blocks.map(b =>
  typeof b === 'string' ? b : 'list' in b ? b.list.join(' ') : 'facts' in b ? b.facts.flat().join(' ') : [...b.table.head, ...b.table.rows.flat()].join(' '),
).join(' ');

/**
 * Stops the build unless both languages carry every section (numbered 1 to `count`, subsections numbered alike)
 * and no drafting placeholder such as "[Add …]", "[Masukkan …]", "Not yet available" or "Belum tersedia" remains.
 */
export function checkLegalDocument(name: string, docs: LegalDocuments, count: number) {
  const outline = (doc: LegalDocument) => doc.sections.map(s => [s.number, ...(s.subsections ?? []).map(sub => sub.number)].join(',')).join(' | ');
  for (const locale of ['en', 'ms'] as const) {
    const { sections, meta, colophon = [] } = docs[locale];
    if (sections.length !== count || sections.some((s, i) => s.number !== i + 1))
      throw new Error(`${name} (${locale}): expected sections 1 to ${count}, found ${sections.length}.`);
    const text = [meta.flat().join(' '), ...colophon, ...sections.map(s => [s.title, blocksText(s.blocks), ...(s.subsections ?? []).map(sub => sub.title + ' ' + blocksText(sub.blocks)), blocksText(s.closing)].join(' '))].join(' ');
    const placeholder = text.match(/\[(?:Add|Masukkan)[^\]]*\]|Not yet available|Belum tersedia/i);
    if (placeholder) throw new Error(`${name} (${locale}): unfilled placeholder "${placeholder[0]}".`);
  }
  if (outline(docs.en) !== outline(docs.ms)) throw new Error(`${name}: the English and Bahasa Malaysia section and subsection numbers differ.`);
}

/** Footer links to the legal pages, in the language of the page being read. Paths match each document's `path`. */
export const legalLinks: Record<LegalLocale, { label: string; href: string }[]> = {
  en: [
    { label: 'Shipping & Returns', href: '/shipping-returns' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ],
  ms: [
    { label: 'Penghantaran & Pemulangan', href: '/ms/shipping-returns' },
    { label: 'Polisi Privasi', href: '/ms/privacy-policy' },
  ],
};
