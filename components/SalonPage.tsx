// One salon's profile: photo gallery, status, services and prices, weekly hours, contact and similar salons.
import type { Metadata } from 'next';
import { byCode, READY } from '@/i18n/locales.mjs';
import { money } from '@/i18n/t.mjs';
import { CONFIG, SALONS, AREA_CITY, SERVICE_MENU, HOURS, TEAM, FACILITIES } from '@/data/home.mjs';
import { getT, localeHref } from '@/lib/i18n';
import { I } from './icons';
import { themeToggleScript } from './ThemeToggle';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import { ProfileGallery, WeekHours } from './ProfileClient';
import '@/styles/home.css';
import '@/styles/directory.css';
import '@/styles/profile.css';

export const salonSlugs = () => SALONS.map(s => ({ slug: s.slug }));
const find = (slug: string) => SALONS.find(s => s.slug === slug);
const salonPath = (code: string, slug: string) => `${localeHref(code)}salon/${slug}/`;

export function salonMetadata(locale: string, slug: string): Metadata {
  const s = find(slug), t = getT(locale);
  if (!s) return {};
  const area = (t.raw('areas') as string[])[s.areaIndex];
  return {
    metadataBase: new URL(CONFIG.siteUrl),
    title: t('salonPage.metaTitle', { name: s.name, area }),
    description: s.deal ? `${t('salons.deals.' + s.deal)} — ${s.name}, ${area}.` : `${s.name}, ${area}.`,
    alternates: {
      canonical: CONFIG.siteUrl + salonPath(locale, slug),
      languages: Object.fromEntries(READY.map(l => [l.hreflang, CONFIG.siteUrl + salonPath(l.code, slug)])),
    },
  };
}

// The home page's boot script hides content until its animations run; this page has none, so show everything at once.
const ready = `(function(h){h.classList.add('ready');h.classList.remove('motion','intro-on');})(document.documentElement);`;
const INTERIORS = ['example-interior-barber', 'example-interior-beauty', 'example-interior-kids'];

export default function SalonPage({ locale, slug }: { locale: string; slug: string }) {
  const s = find(slug);
  if (!s) return null;
  const t = getT(locale);
  const home = localeHref(locale);
  const areas: string[] = t.raw('areas');
  const area = areas[s.areaIndex];
  const price = (n: number) => money(n, locale);
  const waHref = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t('owners.waText'))}`;
  const salonWa = `https://wa.me/${s.phone.replace(/\D/g, '')}`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${s.geo[0]},${s.geo[1]}`;
  const kinds = s.tags.map(x => t('salons.tags.' + x)).join(', ');

  // photos: the salon's own, one per service type, then interiors (sample set)
  const photoNames = [...new Set([s.photo, ...s.tags.map(x => `cat-${x}`), ...INTERIORS])].slice(0, 6);
  const images = photoNames.map((n, i) => ({ src: `/assets/photos/${n}.webp`, alt: `${s.name} — ${i + 1}` }));

  // services: union of the menus of the salon's categories, priced from its starting price
  const seen = new Set<string>();
  const services = s.tags.flatMap(tag => (SERVICE_MENU as unknown as Record<string, [string, number][]>)[tag] ?? [])
    .filter(([k]) => (seen.has(k) ? false : (seen.add(k), true))).slice(0, 8)
    .map(([k, m]) => ({ key: k, name: t('profile.svc.' + k), price: Math.max(s.from, Math.round((s.from * m) / 10) * 10) }));

  // team: up to three people from the categories the salon serves; the first is "free now" when the salon is open
  type Member = [string, string, number, string[]];
  const team = s.tags.flatMap(tag => ((TEAM as unknown as Record<string, Member[]>)[tag] ?? [])).slice(0, 3);
  const facilities = [...FACILITIES, ...(s.tags.includes('kids') ? ['kids'] : [])];
  const availability = (i: number) => (!s.open ? { cls: 'is-off', text: t('profile.availClosed') } : i % 2 === 0 ? { cls: 'is-free', text: t('profile.availNow') } : { cls: 'is-busy', text: t('profile.availBusy') });

  const hoursRows =(HOURS as [string, string][]).map(([key, hours]) => ({ key, day: t('profile.days.' + key), hours }));
  const todayHours = hoursRows[(new Date().getDay() + 6) % 7].hours;
  const similar = SALONS.filter(x => x.slug !== s.slug && (AREA_CITY[x.areaIndex] === AREA_CITY[s.areaIndex] || x.tags.some(g => s.tags.includes(g)))).slice(0, 3);
  const statusText = s.open ? t('salons.openNow') : t('salons.opensAt', { time: s.opensAt });

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ready }} />
      <script dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
      <a className="skip" href="#main">{t('common.skip')}</a>
      <SiteHeader locale={locale} active="salons" waHref={waHref} langHref={code => salonPath(code, s.slug)} />

      <main id="main" className="pf">
        <section className="pf-top pf-wrap">
          <nav className="pf-crumbs" aria-label="Breadcrumb">
            <a href={home}>{t('dir.navHome')}</a><span>/</span><a href={`${home}salons/`}>{t('dir.navSalons')}</a><span>/</span><b lang="en">{s.name}</b>
          </nav>
          <div className="pf-head">
            <div>
              <h1 className="pf-name" lang="en">{s.name}</h1>
              <p className="pf-sub">
                <span className="pf-rating">{I.star}<b>{s.rating.toFixed(1)}</b><em>({t('dir.reviews', { count: s.reviews })})</em></span>
                <span className="pf-area">{I.pin}{area}</span>
                <span className={`pf-status${s.open ? ' is-open' : ''}`}><i></i>{statusText}</span>
              </p>
              <p className="pf-tags">{s.tags.map(x => <span key={x}>{t('salons.tags.' + x)}</span>)}<span className="pf-sample">{t('profile.sample')}</span></p>
            </div>
            <div className="pf-actions">
              <a className="dr-btn" href={`tel:${s.phone}`}>{I.phone}{t('profile.call')}</a>
              <a className="dr-btn dr-btn--ghost" href={salonWa} target="_blank" rel="noopener">{I.chat}{t('profile.whatsapp')}</a>
              <a className="dr-btn dr-btn--ghost" href={directions} target="_blank" rel="noopener">{I.locate}{t('profile.directions')}</a>
            </div>
          </div>
        </section>

        <div className="pf-grid pf-wrap">
          <div className="pf-col">
            <section aria-labelledby="pf-photos"><h2 id="pf-photos" className="pf-h">{t('profile.photos')}</h2>
              <ProfileGallery images={images} label={t('profile.photos')} />
            </section>

            {s.deal && (
              <section className="pf-offer" aria-labelledby="pf-offer-h">
                <span className="pf-offer__ic" aria-hidden="true">{I.tag}</span>
                <div>
                  <p id="pf-offer-h" className="pf-offer__label">{t('salonPage.offer')}</p>
                  <p className="pf-offer__deal">{t('salons.deals.' + s.deal)}</p>
                  <p className="pf-offer__note">{t('profile.offerNote')}</p>
                </div>
              </section>
            )}

            <section aria-labelledby="pf-svc"><h2 id="pf-svc" className="pf-h">{t('profile.services')}</h2>
              <ul className="pf-svc" role="list">
                {services.map(v => <li key={v.key}><span>{v.name}</span><b>{price(v.price)}</b></li>)}
              </ul>
              <p className="pf-note">{t('profile.servicesNote')}</p>
            </section>

            {team.length > 0 && (
              <section aria-labelledby="pf-team"><h2 id="pf-team" className="pf-h">{t('profile.team')}</h2>
                <ul className="pf-team" role="list">
                  {team.map(([name, role, years, skills], i) => {
                    const a = availability(i);
                    return (
                      <li key={name} className="pf-person">
                        <span className="pf-person__av" aria-hidden="true">{name.slice(0, 1)}</span>
                        <div>
                          <p className="pf-person__name" lang="en">{name}</p>
                          <p className="pf-person__role">{t('profile.roles.' + role)} · {t('profile.years', { count: years })}</p>
                          <p className="pf-person__skills">{skills.map(k => <span key={k}>{t('profile.svc.' + k)}</span>)}</p>
                        </div>
                        <span className={`pf-avail ${a.cls}`}><i></i>{a.text}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="pf-note">{t('profile.teamNote')}</p>
              </section>
            )}

            <section aria-labelledby="pf-good"><h2 id="pf-good" className="pf-h">{t('profile.good')}</h2>
              <ul className="pf-fac" role="list">
                {facilities.map(k => <li key={k}>{I.check}{t('profile.fac.' + k)}</li>)}
              </ul>
            </section>

            <section aria-labelledby="pf-about"><h2 id="pf-about" className="pf-h">{t('profile.about')}</h2>
              <p className="pf-about">{t('profile.aboutText', { name: s.name, kinds, area })}</p>
            </section>
          </div>

          <aside className="pf-side" aria-label={t('profile.details')}>
            <div className="pf-card">
              <h2 className="pf-h">{t('profile.details')}</h2>
              <dl className="pf-facts">
                <div><dt>{t('profile.status')}</dt><dd><span className={`pf-status${s.open ? ' is-open' : ''}`}><i></i>{statusText}</span></dd></div>
                <div><dt>{t('profile.today')}</dt><dd>{todayHours}</dd></div>
                <div><dt>{t('profile.address')}</dt><dd>{area}</dd></div>
                <div><dt>{t('profile.phone')}</dt><dd><a href={`tel:${s.phone}`}>{s.phone}</a></dd></div>
                <div><dt>{t('profile.startsAt')}</dt><dd>{price(s.from)}</dd></div>
                <div><dt>{t('profile.rating')}</dt><dd>{s.rating.toFixed(1)} ({s.reviews})</dd></div>
              </dl>
              <a className="dr-btn dr-btn--block" href={`tel:${s.phone}`}>{I.phone}{t('profile.call')}</a>
            </div>
            <div className="pf-card">
              <h2 className="pf-h">{t('profile.hours')}</h2>
              <WeekHours rows={hoursRows} todayLabel={t('profile.today')} />
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="pf-similar pf-wrap" aria-labelledby="pf-sim">
            <div className="pf-similar__head"><h2 id="pf-sim" className="pf-h">{t('profile.similar')}</h2><a className="dr-link" href={`${home}salons/`}>{t('profile.viewAll')}</a></div>
            <div className="dr-grid">
              {similar.map(x => (
                <article key={x.slug} className="dr-card">
                  <a className="dr-card__ph" href={salonPath(locale, x.slug)} tabIndex={-1} aria-hidden="true">
                    <img src={`/assets/photos/${x.photo}.webp`} alt="" loading="lazy" decoding="async" />
                    <span className="dr-rate">{I.star}{x.rating.toFixed(1)}</span>
                  </a>
                  <div className="dr-card__body">
                    <h3 className="dr-card__name"><a href={salonPath(locale, x.slug)} lang="en">{x.name}</a></h3>
                    <p className="dr-card__meta">{areas[x.areaIndex]}</p>
                    <p className={`dr-card__open${x.open ? ' is-open' : ''}`}><i></i>{x.open ? t('salons.openNow') : t('salons.opensAt', { time: x.opensAt })}<span>{t('dir.from', { price: price(x.from) })}</span></p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter locale={locale} nav={[['salons', `${home}salons/`], ['cities', `${home}#cities`]]} waHref={waHref} base={home} />
    </>
  );
}
