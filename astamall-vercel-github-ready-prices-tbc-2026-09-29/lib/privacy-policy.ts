/**
 * The ASTAMALL Privacy Policy, in English and Bahasa Malaysia.
 *
 * The legal text lives here and nowhere else: the page component only lays it out. Keep both languages in step.
 * Section and subsection numbers drive the anchor IDs (#section-3, #section-3-2), so a reader who switches
 * language lands on the matching section; the same number must mean the same section in both languages.
 *
 * Text conventions: **bold** marks emphasis, and the contact email address becomes a mailto link wherever it
 * appears.
 */

export type PolicyLocale = 'en' | 'ms';

/** A paragraph, or a list of points. */
export type PolicyBlock = string | { list: string[]; ordered?: boolean };

export type PolicySubsection = { number: string; title: string; blocks: PolicyBlock[] };

export type PolicySection = { number: number; title: string; blocks: PolicyBlock[]; subsections?: PolicySubsection[] };

export type PrivacyPolicy = {
  /** BCP 47 language tag, used for the lang attribute. */
  lang: string;
  /** Open Graph locale. */
  ogLocale: string;
  path: string;
  title: string;
  description: string;
  updatedLabel: string;
  updated: string;
  contentsLabel: string;
  languageLabel: string;
  languageName: string;
  sections: PolicySection[];
  enquiries: { title: string; facts: [string, string][]; blocks: PolicyBlock[] };
};

export const company = {
  legalName: 'ASTA MALL PLT',
  registration: '202604002255',
  website: 'https://www.astamall.com.my',
  email: 'astamall92@gmail.com',
  /** ISO date of the last update, for machine-readable metadata. */
  updated: '2026-10-01',
};

export const POLICY_SECTION_COUNT = 21;

export const privacyPolicy: Record<PolicyLocale, PrivacyPolicy> = {
  en: {
    lang: 'en-MY',
    ogLocale: 'en_MY',
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'How ASTA MALL PLT collects, uses, discloses and protects personal data when you use ASTAMALL.',
    updatedLabel: 'Last updated',
    updated: '1 October 2026',
    contentsLabel: 'Contents',
    languageLabel: 'Language',
    languageName: 'English',
    // The 21 sections of the approved English draft go here, in order and unabridged.
    sections: [],
    enquiries: {
      title: 'ASTAMALL – Privacy Enquiries',
      facts: [
        ['Legal Entity', company.legalName],
        ['Business Registration Number', company.registration],
        ['Website', company.website],
        ['Contact Email', company.email],
        ['Last Updated', '1 October 2026'],
      ],
      blocks: [
        `For questions, requests, complaints, or concerns relating to this Privacy Policy or the processing of your personal data, please contact us at **${company.email}**.`,
        'When submitting a personal data request, please use the subject line:',
        '**Personal Data Request – ASTAMALL**',
        'We may request reasonable information to verify your identity before processing your request. All requests will be handled in accordance with applicable Malaysian law.',
      ],
    },
  },
  ms: {
    lang: 'ms-MY',
    ogLocale: 'ms_MY',
    path: '/ms/privacy-policy',
    title: 'Polisi Privasi',
    description: 'Bagaimana ASTA MALL PLT mengumpul, menggunakan, mendedahkan dan melindungi data peribadi apabila anda menggunakan ASTAMALL.',
    updatedLabel: 'Tarikh kemas kini terakhir',
    updated: '1 Oktober 2026',
    contentsLabel: 'Kandungan',
    languageLabel: 'Bahasa',
    languageName: 'Bahasa Melayu',
    // The 21 sections of the approved Bahasa Malaysia draft go here, numbered exactly as in English.
    sections: [],
    enquiries: {
      title: 'ASTAMALL – Pertanyaan Privasi',
      facts: [
        ['Entiti Undang-Undang', company.legalName],
        ['Nombor Pendaftaran Perniagaan', company.registration],
        ['Laman Web', company.website],
        ['E-mel Perhubungan', company.email],
        ['Tarikh Kemas Kini Terakhir', '1 Oktober 2026'],
      ],
      blocks: [
        `Untuk sebarang pertanyaan, permintaan, aduan atau kebimbangan berkaitan Polisi Privasi ini atau pemprosesan data peribadi anda, sila hubungi kami melalui **${company.email}**.`,
        'Semasa mengemukakan permintaan berkaitan data peribadi, sila gunakan tajuk e-mel berikut:',
        '**Permintaan Data Peribadi – ASTAMALL**',
        'Kami mungkin memerlukan maklumat yang munasabah untuk mengesahkan identiti anda sebelum memproses permintaan tersebut. Semua permintaan akan dikendalikan mengikut undang-undang Malaysia yang terpakai.',
      ],
    },
  },
};

export const sectionId = (number: number | string) => `section-${String(number).replace(/\./g, '-')}`;

export const localeForPath = (pathname: string): PolicyLocale => (pathname === '/ms' || pathname.startsWith('/ms/') ? 'ms' : 'en');

// Once the policy text is in, both languages must carry all sections, numbered alike, or the build stops.
{
  const outline = (locale: PolicyLocale) => privacyPolicy[locale].sections.map(s => [s.number, ...(s.subsections ?? []).map(sub => sub.number)].join(',')).join(' | ');
  const { en, ms } = privacyPolicy;
  if (en.sections.length || ms.sections.length) {
    if (en.sections.length !== POLICY_SECTION_COUNT || ms.sections.length !== POLICY_SECTION_COUNT)
      throw new Error(`Privacy Policy: expected ${POLICY_SECTION_COUNT} sections in each language, found ${en.sections.length} (en) and ${ms.sections.length} (ms).`);
    if (outline('en') !== outline('ms'))
      throw new Error('Privacy Policy: the English and Bahasa Malaysia section and subsection numbers differ.');
  }
}
