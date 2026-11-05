import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/unbounded';
import '@fontsource-variable/onest';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';
import { content } from '@/content';
import Metrika from '@/components/Metrika';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newnarrative.ru';
const { seo } = content;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: seo.title,
  description: seo.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: seo.siteName,
    title: seo.title,
    description: seo.description,
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.ogImageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: '#08080C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body
        style={
          {
            '--font-display': "'Unbounded Variable'",
            '--font-body': "'Onest Variable'",
            '--font-mono': "'IBM Plex Mono'",
          } as React.CSSProperties
        }
      >
        {children}
        <Metrika />
      </body>
    </html>
  );
}
