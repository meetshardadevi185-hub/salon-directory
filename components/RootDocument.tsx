import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { READY, DEFAULT_LOCALE, byCode } from '@/i18n/locales.mjs';
import { CONFIG } from '@/data/home.mjs';
import { getT } from '@/lib/i18n';
import '@/styles/fonts.css';

const pageUrl = (code: string) => `${CONFIG.siteUrl}/${code === DEFAULT_LOCALE ? '' : code + '/'}`;

export function buildMetadata(locale: string): Metadata {
  const t = getT(locale);
  const L = byCode(locale);
  return {
    metadataBase: new URL(CONFIG.siteUrl),
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: pageUrl(locale),
      languages: { ...Object.fromEntries(READY.map(l => [l.hreflang, pageUrl(l.code)])), 'x-default': pageUrl(DEFAULT_LOCALE) },
    },
    openGraph: { title: t('meta.title'), description: t('meta.description'), locale: L.hreflang.replace('-', '_') },
    icons: { icon: { url: '/assets/img/trimcircle-app-icon.svg', type: 'image/svg+xml' }, apple: '/assets/img/trimcircle-app-icon.png' },
  };
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0A0A0A' };

// Hidden start states are only applied when JS (and motion) can actually run.
// The theme is applied here too, before first paint: the saved choice, else dark (the site's home look).
const bootScript = `(function(d){var h=d.documentElement;h.classList.remove('no-js');h.classList.add('js');
var th;try{th=localStorage.getItem('tc-theme')}catch(e){}
if(th!=='light'&&th!=='dark')th='dark';
h.setAttribute('data-theme',th);h.style.colorScheme=th;
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!rm){h.classList.add('motion');try{if(!sessionStorage.getItem('tc-intro'))h.classList.add('intro-on')}catch(e){h.classList.add('intro-on')}}
setTimeout(function(){if(!h.classList.contains('ready'))h.classList.remove('motion','intro-on')},4500);})(document);`;

export default function RootDocument({ locale, children }: { locale: string; children: ReactNode }) {
  const L = byCode(locale);
  return (
    // The boot script swaps classes on <html> before hydration, so React must not compare them.
    <html lang={L.hreflang} dir={L.dir} data-locale={locale} className="no-js" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/assets/fonts/outfit-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        {L.script === 'Devanagari' && <link rel="preload" href="/assets/fonts/tiro-devanagari-hindi-devanagari-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
