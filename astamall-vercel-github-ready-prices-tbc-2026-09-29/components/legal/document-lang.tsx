'use client';

import { useEffect } from 'react';

/**
 * Sets the document (<html>) language for the page it is on, and restores English when the reader moves on.
 * The page's own content already carries the right lang attribute from the server.
 */
export default function DocumentLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.lang;
    root.lang = lang;
    return () => { root.lang = previous === lang ? 'en' : previous; };
  }, [lang]);
  return null;
}
