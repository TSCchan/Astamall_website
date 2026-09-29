import type { Metadata } from "next";
import "./globals.css";
import StoreShell from '@/components/store-shell';
import { Footer } from '@/components/brand';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';

const siteHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (siteHost ? `https://${siteHost}` : undefined);

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: 'ASTAMALL | Beauty, powered by Astaxanthin', template: '%s | ASTAMALL' },
  description: "Malaysia's home of astaxanthin beauty and wellness, with science-led formulas from Taiwan.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><StoreShell>{children}<Footer /></StoreShell></body>
    </html>
  );
}
