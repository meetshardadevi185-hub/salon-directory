// One salon's page: photo, name, area, today's status, its offer (claimed at the salon), services and contact.
import type { Metadata } from 'next';
import { byCode } from '@/i18n/locales.mjs';
import { money } from '@/i18n/t.mjs';
import { CONFIG, SALONS } from '@/data/home.mjs';
import { getT, localeHref } from '@/lib/i18n';
import { I } from './icons';
import '@/styles/site.css';
import { Logo } from './Logo';
import { ThemeToggle, themeToggleScript } from './ThemeToggle';

export const salonSlugs = () => SALONS.map(s => ({ slug: s.slug }));
const find = (slug: string) => SALONS.find(s => s.slug === slug);

export function salonMetadata(locale: string, slug: string): Metadata {
  const s = find(slug), t = getT(locale);
  if (!s) return {};
  const area = (t.raw('areas') as string[])[s.areaIndex];
  const path = `${localeHref(locale)}salon/${slug}/`;
  return {
    metadataBase: new URL(CONFIG.siteUrl),
    title: t('salonPage.metaTitle', { name: s.name, area }),
    description: s.deal ? `${t('salons.deals.' + s.deal)} — ${s.name}, ${area}.` : `${s.name}, ${area}.`,
    alternates: { canonical: CONFIG.siteUrl + path },
  };
}

// The home page's boot script hides content until its animations run; this page has none, so show everything at once.
const ready = `(function(h){h.classList.add('ready');h.classList.remove('motion','intro-on');})(document.documentElement);`;

export default function SalonPage({ locale, slug }: { locale: string; slug: string }) {
  const s = find(slug);
  if (!s) return null;
  const t = getT(locale);
  const L = byCode(locale);
  const area = (t.raw('areas') as string[])[s.areaIndex];
  const home = localeHref(locale);
  const price = (n: number) => money(n, locale);
  const ex = t('common.examplePhoto');
  const status = s.open
    ? <span className="salon__status is-open"><i></i>{t('salons.openNow')}</span>
    : <span className="salon__status">{I.clock}{t('salons.opensAt', { time: s.opensAt })}</span>;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ready }} />
      <a className="skip" href="#main">{t('common.skip')}</a>
      <header className="hdr is-scrolled">
        <div className="hdr__bar">
          <a className="hdr__logo" href={home} aria-label="TrimCircle home"><Logo label="TrimCircle — salons near you" /></a>
          <div className="hdr__right shop__hdr-right">
            <ThemeToggle className="hdr__theme" toDark={t('common.themeDark')} toLight={t('common.themeLight')} />
            <a className="btn btn--ghost btn--sm" href={`${home}#salons`}><span className="flip">{I.arrow}</span>{t('salonPage.back')}</a>
          </div>
        </div>
      </header>

      <main id="main" className="shop">
        <div className="shop__cover">
          <img src={`/assets/photos/${s.photo}.webp`} alt={`${s.name} — ${ex}`} fetchPriority="high" decoding="async" />
          {status}
          <span className="ph__tag">{ex}</span>
        </div>

        <div className="shop__grid">
          <div className="shop__main">
            <div className="shop__head">
              <h1 className="shop__name" lang="en">{s.name}</h1>
              <span className="salon__sample">{t('common.sample')}</span>
            </div>
            <p className="shop__area">{I.pin}<span>{area}</span></p>
            <p className="salon__tags">{s.tags.map(x => <span key={x}>{t('salons.tags.' + x)}</span>)}</p>

            {s.deal && (
              <section className="shop__offer" aria-labelledby="offer-h">
                <span className="shop__offer-ic" aria-hidden="true">{I.tag}</span>
                <div>
                  <p id="offer-h" className="shop__offer-label">{t('salonPage.offer')}</p>
                  <p className="shop__offer-deal">{t('salons.deals.' + s.deal)}</p>
                  <p className="shop__offer-note">{t('salonPage.sampleNote')}</p>
                </div>
              </section>
            )}

            <section className="shop__box" aria-labelledby="svc-h">
              <h2 id="svc-h" className="shop__h">{I.scissors}{t('salonPage.services')}</h2>
              <ul className="shop__svc" role="list">
                {s.tags.map(x => <li key={x}>{I.check}<span>{t('salons.tags.' + x)}</span></li>)}
              </ul>
              <p className="shop__price">{t('salonPage.startingAt')} <strong>{price(s.from)}</strong></p>
            </section>

            <p className="shop__sample-note">{t('salonPage.sampleNote')}</p>
          </div>

          <aside className="shop__side" aria-label={t('salonPage.visit')}>
            <div className="shop__card">
              <p className="shop__h">{I.pin}{t('salonPage.visit')}</p>
              <p className="shop__card-area">{area}</p>
              {status}
              <p className="shop__sample-note">{t('salonPage.contactUnavailable')}</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="shop__ftr"><a className="ulink" href={home} lang={L.hreflang}>TrimCircle · {t('footer.tagline')}</a></footer>
      <script dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
    </>
  );
}
