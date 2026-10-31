/**
 * Renders schema.org JSON-LD in the server HTML. `<` is escaped so text from the catalogue can never close the
 * script element early.
 */
export function JsonLd({ value }: { value: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, '\\u003c') }} />;
}
