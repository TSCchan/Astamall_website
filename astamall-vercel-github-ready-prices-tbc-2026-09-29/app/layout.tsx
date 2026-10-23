import type { Metadata } from "next";
import "./globals.css";
import "./refinement.css";
import "./premium.css";
import StoreShell from '@/components/store-shell';
import { Footer } from '@/components/brand';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/600.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.astamall.com.my'),
  title: { default: 'ASTAMALL | Beauty, powered by Astaxanthin', template: '%s | ASTAMALL' },
  description: "Malaysia's home of astaxanthin beauty and wellness, with science-led formulas from Taiwan.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} /></head>
      <body><StoreShell>{children}<Footer /></StoreShell></body>
    </html>
  );
}
