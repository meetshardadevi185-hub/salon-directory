// All salons in one place: search, filters and cards. The interactive list is a client component; the rest renders on the server.
import type { Metadata } from 'next';
import { LOCALES, byCode, READY } from '@/i18n/locales.mjs';
import { money } from '@/i18n/t.mjs';
import { CONFIG, SALONS, AREA_CITY, CATEGORIES } from '@/data/home.mjs';
import { getT, localeHref } from '@/lib/i18n';
import { I } from './icons';
import { Logo } from './Logo';
import { ThemeToggle, themeToggleScript } from './ThemeToggle';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';
import SalonsDirectory, { type DirSalon } from './SalonsDirectory';
import '@/styles/home.css';
import '@/styles/directory.css';

const salonsHref = (code: string) => `${localeHref(code)}salons/`;
const ready = `(function(h){h.classList.add('ready');h.classList.remove('motion','intro-on');})(document.documentElement);`;

export function salonsMetadata(locale: string): Metadata {
  const t = getT(locale);
  const path = salonsHref(locale);
  return {
    metadataBase: new URL(CONFIG.siteUrl),
    title: t('dir.metaTitle'),
    description: t('dir.metaDescription'),
    alternates: {
      canonical: CONFIG.siteUrl + path,
      languages: Object.fromEntries(READY.map(l => [l.hreflang, CONFIG.siteUrl + salonsHref(l.code)])),
    },
  };
}

export default function SalonsPage({ locale }: { locale: string }) {
  const t = getT(locale);
  const L = byCode(locale);
  const home = localeHref(locale);
  const areas: string[] = t.raw('areas');
  const areasEn: string[] = getT('en').raw('areas');
  const cityNames: string[] = t.raw('citySec.list');
  const cityNamesEn: string[] = getT('en').raw('citySec.list');
  const waHref = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t('owners.waText'))}`;
  const year = new Date().getFullYear();

  const salons: DirSalon[] = SALONS.map(s => ({
    slug: s.slug, name: s.name, area: areas[s.areaIndex], areaEn: areasEn[s.areaIndex], city: AREA_CITY[s.areaIndex], tags: s.tags,
    open: s.open, opensAt: s.opensAt, from: s.from, priceText: money(s.from, locale), rating: s.rating, reviews: s.reviews,
    deal: s.deal ? t('salons.deals.' + s.deal) : null, photo: s.photo, phone: s.phone, href: `${home}salon/${s.slug}/`,
  }));
  const usedCities = [...new Set(salons.map(s => s.city))].sort((a, b) => a - b);
  const cities = usedCities.map(i => ({ index: i, name: cityNames[i] ?? '', nameEn: cityNamesEn[i] ?? '' }));
  const categories = CATEGORIES.map(c => ({ key: c.key, label: t('salons.filters.' + c.key) }));
  const stats: [string, string][] = [
    [String(SALONS.length), t('dir.stat1')], [String(usedCities.length), t('dir.stat2')], [money(0, locale), t('dir.stat3')], [String(READY.length), t('dir.stat4')],
  ];

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ready }} />
      <script dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
      <a className="skip" href="#main">{t('common.skip')}</a>

      <SiteHeader locale={locale} active="salons" waHref={waHref} langHref={salonsHref} />

      <main id="main" className="dr">
        <SalonsDirectory locale={locale} dir={t.raw('dir')} salons={salons} categories={categories} cities={cities} waHref={waHref} />

        <section className="dr-stats dr-wrap" aria-label="TrimCircle">
          <ul role="list">
            {stats.map(([v, l]) => <li key={l}><strong>{v}</strong><span>{l}</span></li>)}
          </ul>
        </section>
      </main>

      <SiteFooter locale={locale} nav={[['salons', salonsHref(locale)], ['cities', `${home}#cities`]]} waHref={waHref} base={home} />
    </>
  );
}
