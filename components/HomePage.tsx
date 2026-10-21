// The TrimCircle home page for one locale, rendered on the server. Interactions live in SiteEffects.
// Dark-first editorial layout: one geometric sans, black and white, a single copper accent.
import { Fragment } from 'react';
import { LOCALES, byCode } from '@/i18n/locales.mjs';
import { money } from '@/i18n/t.mjs';
import { CONFIG, CATEGORIES, SALONS, AREA_CITY } from '@/data/home.mjs';
import { getT, localeHref } from '@/lib/i18n';
import { I, F } from './icons';
import { Logo, Mark } from './Logo';
import { CityLandmark } from './CityLandmark';
import { ThemeToggle } from './ThemeToggle';
import SiteEffects from './SiteEffects';
import type { Runtime } from '@/lib/site-effects';
import '@/styles/home.css';

const pad = (n: number) => String(n).padStart(2, '0');
// "*words*" in messages mark the accent phrase of a heading.
const Emph = ({ text }: { text: string }) => (
  <>{String(text).split(/\*(.+?)\*/g).map((p, i) => (i % 2 ? <em key={i}>{p}</em> : <Fragment key={i}>{p}</Fragment>))}</>
);
const plain = (text: string) => String(text).replace(/\*/g, '');

// Small uppercase label above a section heading.
const Eyebrow = ({ children }: { children: string }) => <p className="eyebrow">{children}</p>;

// Offer cards use a photo that matches the offer itself.
const OFFER_PHOTOS: Record<string, string> = {
  'royal-cuts': 'look-4', 'gulmohar-beauty-studio': 'look-6', 'little-stars-kids-salon': 'cat-kids', 'shringaar-bridal-lounge': 'look-5',
  'nawab-hair-salon': 'hero-2', 'glow-ladies-parlour': 'cat-women', 'bandra-blowout-studio': 'look-2', 'tiny-trims': 'salon-3', 'pink-city-bridal': 'cat-bridal',
};

// Owner tools shown in the showcase, in order.
const SHOWCASE = [{ key: 'page', icon: I.globe }, { key: 'google', icon: I.pin }, { key: 'whatsapp', icon: I.chat }, { key: 'bookings', icon: I.calendar }];

const FEATURED_CITIES = [{ key: 'agra', index: 10 }, { key: 'delhi', index: 0 }, { key: 'mumbai', index: 1 }, { key: 'bengaluru', index: 2 }, { key: 'jaipur', index: 8 }];

const NAV: [string, string][] = [['salons', '#salons'], ['how', '#how'], ['cities', '#cities']];

export default function HomePage({ locale }: { locale: string }) {
  const L = byCode(locale);
  const t = getT(locale);
  const year = new Date().getFullYear();
  const ex = t('common.examplePhoto');
  const areas: string[] = t.raw('areas');
  const areasEn: string[] = getT('en').raw('areas'); // search matches English area names on every language page
  const cityNames: string[] = t.raw('citySec.list');
  const price = (n: number) => money(n, locale);
  const salonHref = (slug: string) => `${localeHref(locale)}salon/${slug}/`;
  const waHref = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t('owners.waText'))}`;
  const deals = SALONS.filter(x => x.deal);
  const pick = deals[0];
  const cityCount = new Set(SALONS.map(s => AREA_CITY[s.areaIndex])).size;
  const ticker: string[] = t.raw('home2.ticker');
  const faq: { q: string; a: string }[] = t.raw('home2.faq.items');
  const runtime: Runtime = {
    locale, hreflang: L.hreflang,
    hero: Object.fromEntries(['locating', 'located', 'denied', 'empty', 'badPincode', 'searching', 'searchingCat'].map(k => [k, t.raw(`hero.${k}`)])) as Runtime['hero'],
    salons: {
      count: t.raw('salons.count'), empty: t.raw('salons.empty'), distance: t.raw('salons.distance'),
      locTitle: t.raw('salons.locTitle'), locSub: t.raw('salons.locSub'), locFound: t.raw('salons.locFound'), locFoundSub: t.raw('salons.locFoundSub'),
      locCity: t.raw('salons.locCity'), locating: t.raw('salons.locating'), denied: t.raw('salons.denied'),
      inCity: t.raw('salons.inCity'), allIndia: t.raw('salons.allIndia'), nearest: t.raw('salons.nearest'),
      cities: cityNames, citiesEn: getT('en').raw('citySec.list'),
    },
    hindiPrompt: locale === 'en' ? { text: 'यह पेज हिन्दी में देखें?', yes: 'हिन्दी में देखें', no: 'No thanks', href: localeHref('hi') } : null,
  };

  const langList = (cls: string) => (
    <ul className={cls} role="list">
      {LOCALES.map(l => (
        <li key={l.code}>
          {l.ready ? (
            <a className={`lang__opt${l.code === locale ? ' is-current' : ''}`} href={localeHref(l.code)} hrefLang={l.hreflang} lang={l.hreflang}
              data-locale={l.code} aria-current={l.code === locale ? 'true' : undefined}>
              <span>{l.name}</span>{l.code === locale && I.check}
            </a>
          ) : (
            <span className="lang__opt is-soon" lang={l.hreflang} dir={l.dir} aria-disabled="true">
              <span>{l.name}</span><small lang={L.hreflang} dir="ltr">{t('common.comingSoon')}</small>
            </span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <a className="skip" href="#main">{t('common.skip')}</a>

      <div className="intro" aria-hidden="true">
        <div className="intro__mark">
          <svg className="intro__ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" pathLength={1} /></svg>
          <Mark className="intro__logo" />
        </div>
        <p className="intro__count"><span className="intro__num">0</span></p>
        <p className="intro__msg">{t('intro.loading')}</p>
      </div>

      <div className="cursor" aria-hidden="true"><span className="cursor__dot"></span><span className="cursor__ring"><span className="cursor__label"></span></span></div>

      {/* ============ HEADER ============ */}
      <header className="hdr">
        <div className="hdr__bar">
          <a className="hdr__logo" href="#top" aria-label="TrimCircle home"><Logo label="TrimCircle — salons near you" /></a>
          <nav className="hdr__nav" aria-label="Main">
            {NAV.map(([k, h]) => <a key={k} href={h}>{t('nav.' + k)}</a>)}
          </nav>
          <div className="hdr__right">
            <ThemeToggle className="hdr__theme" toDark={t('common.themeDark')} toLight={t('common.themeLight')} />
            <div className="lang" data-lang="">
              <button className="lang__btn" type="button" aria-expanded="false" aria-controls={`lang-pop-${locale}`} aria-label={`${t('common.chooseLanguage')}: ${L.name}`}>
                {I.globe}<span>{L.name}</span>{I.chevron}
              </button>
              <div className="lang__pop" id={`lang-pop-${locale}`} hidden>
                <p className="lang__title">{t('common.chooseLanguage')}</p>
                {langList('lang__list')}
              </div>
            </div>
            <a className="btn btn--accent btn--sm hdr__cta magnetic" href="#owners">{t('nav.listCta')}</a>
            <button className="hdr__menu" type="button" aria-expanded="false" aria-controls="sheet">{I.menu}<span className="sr">{t('common.menu')}</span></button>
          </div>
        </div>
        {/* ticker: plain facts about TrimCircle, scrolling */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker__track">
            {[0, 1].map(k => (
              <span key={k} className="ticker__set">
                {ticker.map(item => <span key={item} className="ticker__item"><i></i>{item}</span>)}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="sheet" id="sheet" hidden>
        <div className="sheet__top">
          <Logo label="TrimCircle" />
          <button className="sheet__close" type="button">{I.close}<span className="sr">{t('common.close')}</span></button>
        </div>
        <nav className="sheet__nav" aria-label="Mobile">
          {[...NAV, ['owners', '#owners']].map(([k, h], i) => <a key={k} href={h}><small>{pad(i + 1)}</small>{t('nav.' + k)}</a>)}
        </nav>
        <div className="sheet__lang"><p className="lang__title">{I.globe} {t('common.language')}</p>{langList('lang__list lang__list--grid')}</div>
      </div>

      <main id="main">
        {/* ============ HERO ============ */}
        <section className="hero" id="top">
          <div className="hero__media" aria-hidden="true"><span className="hero__glow"></span><span className="hero__stars"></span></div>
          <div className="hero__in">
            <h1 className="hero__title">
              <span className="hero__lead">{t('hero.titleLead')}</span>
              <span className="hero__fill">{t('hero.titleAccent')}</span>
            </h1>
            <p className="hero__sub rise">{t('hero.referenceSub')}</p>

            <form className="search rise" role="search" action="#salons" noValidate>
              <label className="sr" htmlFor={`q-${locale}`}>{t('hero.searchLabel')}</label>
              <div className="search__field">
                {I.search}
                <input id={`q-${locale}`} name="q" type="text" autoComplete="address-level2" enterKeyHint="search" placeholder={t('hero.placeholder')} aria-describedby={`q-status-${locale}`} />
                <button className="search__near" type="button" data-near="">{I.locate}<span>{t('hero.nearMe')}</span></button>
                <button className="btn btn--accent search__go" type="submit"><span>{t('hero.submitShort')}</span>{I.arrow}</button>
              </div>
              <p className="search__status" id={`q-status-${locale}`} role="status" aria-live="polite"></p>
            </form>

            {pick && (
              <a className="hero__pick rise" href={salonHref(pick.slug)}>
                <span className="hero__pick-ic" aria-hidden="true">{F.tag}</span>
                <span className="hero__pick-copy">
                  <small>{t('home2.hero.pick')} · <span lang="en">{pick.name}</span></small>
                  <strong>{t('salons.deals.' + pick.deal)}</strong>
                </span>
                <span className="hero__pick-go">{t('home2.hero.view')}{I.arrow}</span>
              </a>
            )}
          </div>

          {/* services: photo tiles that filter the salon finder */}
          <nav className="services rise" aria-label={t('hero.quick')}>
            {CATEGORIES.filter(c => c.key !== 'unisex').map(c => (
              <a key={c.key} className="service" href="#salons" data-service-filter={c.key}>
                <span className="service__ph"><img src={`/assets/photos/${c.photo}.webp`} alt="" width={720} height={900} loading="lazy" decoding="async" /></span>
                <span className="service__name">{t(`categories.items.${c.key}.card`)}</span>
                <span className="service__from">{t('common.from', { price: price(c.from) })}</span>
              </a>
            ))}
          </nav>
        </section>

        {/* ============ STATS ============ */}
        <section className="stats" aria-label="TrimCircle">
          {(t.raw('home2.stats') as { value: string; label: string }[]).map(s => (
            <div key={s.label} className="stat">
              <strong>{s.value.replace('{salons}', String(SALONS.length)).replace('{cities}', String(cityCount))}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </section>

        {/* ============ STATEMENT ============ */}
        <section className="statement" aria-labelledby="statement-h">
          <h2 id="statement-h" className="display" data-split=""><Emph text={t('home2.statement.title')} /></h2>
          <p className="statement__sub">“{t('home2.statement.sub')}”</p>
          <a className="btn btn--ghost" href="#salons">{t('home2.statement.cta')}{I.arrow}</a>
        </section>

        {/* ============ OFFERS ============ */}
        <section className="sec offers" aria-labelledby="offers-h">
          <div className="sec__head">
            <div>
              <Eyebrow>{t('home2.offers.eyebrow')}</Eyebrow>
              <h2 id="offers-h" className="h2" data-split="">{t('home2.offers.title')}</h2>
              <p className="sec__sub">{t('home2.offers.sub')}</p>
            </div>
            <div className="sec__actions">
              <button type="button" className="roundbtn" data-scroll=".offers__row" data-dir="-1" aria-label={t('offers.prev')}><span className="flip">{I.arrow}</span></button>
              <button type="button" className="roundbtn" data-scroll=".offers__row" data-dir="1" aria-label={t('offers.next')}>{I.arrow}</button>
            </div>
          </div>
          <ul className="offers__row" role="list">
            {deals.map(x => (
              <li key={x.slug} className="offer">
                <a className="offer__link" href={salonHref(x.slug)} aria-label={`${t('salons.deals.' + x.deal)} — ${x.name}`}></a>
                <img className="offer__ph" src={`/assets/photos/${OFFER_PHOTOS[x.slug] ?? x.photo}.webp`} alt="" loading="lazy" decoding="async" />
                <span className="offer__arrow" aria-hidden="true">{I.arrow}</span>
                <div className="offer__body">
                  <h3 className="offer__title">{t('salons.deals.' + x.deal)}</h3>
                  <p className="offer__tag" lang="en">{x.name}</p>
                  <p className="offer__area">{areas[x.areaIndex]}</p>
                </div>
                <div className="offer__foot">
                  <span>{t('home2.offers.view')}</span>
                  <span>{t('common.from', { price: price(x.from) })} →</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ============ SALONS NEAR YOU ============ */}
        <section className="sec salons" id="salons" aria-labelledby="salons-h">
          <div className="sec__head">
            <div>
              <Eyebrow>{t('home2.salons.eyebrow')}</Eyebrow>
              <h2 id="salons-h" className="h2" data-split="">{plain(t('salons.title'))}</h2>
              <p className="sec__sub">{t('salons.sub')}</p>
            </div>
          </div>

          {/* service filters as pills, then one toolbar: count | near me | filters */}
          <div className="filters" role="group" aria-label={t('salons.filterLabel')}>
            {Object.entries(t.raw('salons.filters') as Record<string, string>).filter(([k]) => k !== 'open').map(([k, v], i) => (
              <button key={k} type="button" className="pill" data-f={k} aria-pressed={i === 0 ? 'true' : 'false'}>
                {v}<span className="pill__n" data-n="">{k === 'all' ? SALONS.length : SALONS.filter(s => s.tags.includes(k)).length}</span>
              </button>
            ))}
          </div>
          <div className="finder">
            <p className="salons__count" aria-live="polite">
              <strong data-count="">{t('salons.count', { count: SALONS.length })}</strong> <span data-where="">{t('salons.allIndia')}</span>
              <button type="button" className="finder__clear" data-f-reset="" hidden>{t('salons.showAll')}</button>
            </p>
            <button type="button" className="finder__locate" data-locate="" aria-pressed="false">{F.locate}<span>{t('salons.nearMe')}</span></button>
            <div className="finder__where">
              <div className="finder__select finder__city" data-city-fallback="">
                {F.pin}
                <label className="sr" htmlFor={`city-${locale}`}>{t('salons.cityLabel')}</label>
                <select id={`city-${locale}`} data-city="" defaultValue="">
                  <option value="">{t('salons.allCities')}</option>
                  {cityNames.map((c, i) => <option key={c} value={i}>{c}</option>)}
                </select>
                {I.chevron}
              </div>
              <details className="city-picker" data-city-picker="" hidden>
                <summary className="city-picker__trigger">{F.pin}<span data-city-current="">{t('salons.allCities')}</span>{I.chevron}</summary>
                <div className="city-picker__menu">
                  <label className="sr" htmlFor={`city-search-${locale}`}>{t('salons.searchCities')}</label>
                  <input id={`city-search-${locale}`} className="city-picker__search" type="search" placeholder={t('salons.searchCities')} data-city-search="" />
                  <div className="city-picker__options">
                    <button type="button" data-city-option="" aria-pressed="true">{t('salons.allCities')}</button>
                    {cityNames.map((c, i) => <button type="button" key={c} data-city-option={i} aria-pressed="false">{c}</button>)}
                  </div>
                  <p className="city-picker__empty" data-city-empty="" hidden>{t('salons.noCities')}</p>
                </div>
              </details>
            </div>
            <details className="filter-panel" data-filter-panel="">
              <summary className="filter-panel__trigger">{I.filter}<span>{t('salons.filterButton')}</span><span className="filter-panel__active" data-active-filters="" hidden></span>{I.chevron}</summary>
              <div className="filter-panel__content">
                <div className="filter-panel__fields">
                  <label>{t('salons.minimumRating')}<select data-min-rating="" defaultValue=""><option value="">{t('salons.anyRating')}</option><option value="4">4.0+</option><option value="4.5">4.5+</option><option value="4.8">4.8+</option></select></label>
                  <label>{t('salons.maxPrice')}<select data-max-price="" defaultValue=""><option value="">{t('salons.anyPrice')}</option><option value="100">₹100</option><option value="200">₹200</option><option value="500">₹500</option><option value="1000">₹1,000</option><option value="3000">₹3,000</option></select></label>
                </div>
                <div className="filter-panel__checks">
                  <label><input type="checkbox" data-open-filter="" /> {t('salons.toggles.open')}</label>
                  <label><input type="checkbox" data-deal-filter="" /> {t('salons.toggles.deal')}</label>
                </div>
              </div>
            </details>
          </div>
          <p className="finder__status" aria-live="polite">
            <button type="button" className="finder__q" data-q-chip="" hidden></button>
            <span data-loc-sub=""></span>
          </p>

          <div className="salons__grid">
            {SALONS.map(s => (
              <article key={s.slug} className="salon" data-tags={s.tags.join(' ')} data-open={String(s.open)} data-deal={String(!!s.deal)}
                data-city={AREA_CITY[s.areaIndex]} data-price={s.from} data-rating={s.rating} data-lat={s.geo[0]} data-lng={s.geo[1]}
                data-search={`${s.name} ${areas[s.areaIndex]} ${areasEn[s.areaIndex]}`.toLowerCase()}>
                <a className="salon__link" href={salonHref(s.slug)}>
                  <span className="salon__ph">
                    <img src={`/assets/photos/${s.photo}.webp`} alt="" loading="lazy" decoding="async" />
                    <span className="salon__rating">{I.star}{s.rating}</span>
                  </span>
                  <span className="salon__body">
                    <span className="salon__name" lang="en">{s.name}</span>
                    <span className="salon__meta">{areas[s.areaIndex]}<span className="salon__dist" data-dist="" hidden></span></span>
                    <span className={`salon__open${s.open ? ' is-open' : ''}`}><i></i>{s.open ? t('salons.openNow') : t('salons.opensAt', { time: s.opensAt })}</span>
                    {s.deal && <span className="salon__deal">{F.tag}{t('salons.deals.' + s.deal)}</span>}
                    <span className="salon__foot">
                      <span className="salon__price">{t('common.from', { price: price(s.from) })}</span>
                      <span className="salon__view">{t('salons.view')} {I.arrow}</span>
                    </span>
                  </span>
                </a>
              </article>
            ))}
          </div>
          <div className="salons__more"><button type="button" className="btn btn--ghost" data-show-salons="" data-more-label={t('salons.seeAll')} data-less-label={t('salons.showFewer')}>{t('salons.seeAll')} {I.arrow}</button></div>
          <div className="salons__empty" hidden>
            <p>{t('salons.empty')}</p>
            <button type="button" className="btn btn--ghost" data-f-reset="">{t('salons.showAll')}</button>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="sec how" id="how" aria-labelledby="how-h">
          <div className="sec__head sec__head--center">
            <div>
              <Eyebrow>{t('home2.how.eyebrow')}</Eyebrow>
              <h2 id="how-h" className="h2" data-split=""><Emph text={t('home2.how.title')} /></h2>
            </div>
          </div>
          <ol className="how__steps" role="list">
            {t.raw('how.steps').map((s: { title: string; short: string }, i: number) => (
              <li key={i} className="how-step">
                <span className="how-step__num">{pad(i + 1)}</span>
                <span className="how-step__ic" aria-hidden="true">{[I.search, I.tag, I.check][i]}</span>
                <h3 className="how-step__title">{s.title}</h3>
                <p className="how-step__text">{s.short}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ============ CITIES ============ */}
        <section className="sec cities" id="cities" aria-labelledby="cities-h">
          <div className="sec__head">
            <div>
              <Eyebrow>{t('home2.cities.eyebrow')}</Eyebrow>
              <h2 id="cities-h" className="h2" data-split="">{plain(t('citySec.title'))}</h2>
              <p className="sec__sub">{t('citySec.sub')}</p>
            </div>
          </div>
          <ul className="cities__grid" role="list">
            {FEATURED_CITIES.map(({ key, index }) => {
              const city = cityNames[index];
              return <li key={key}>
                <button type="button" className="chip city" data-area={city}>
                  <CityLandmark city={key} />
                  <span className="city__copy"><span className="city__name">{city}</span><span className="city__description">{t('citySec.sampleSalons', { count: SALONS.filter(s => AREA_CITY[s.areaIndex] === index).length })}</span></span>
                  <span className="city__arrow" aria-hidden="true">{I.arrow}</span>
                </button>
              </li>;
            })}
          </ul>
        </section>

        {/* ============ FOR SALON OWNERS: pick a tool, see it working ============ */}
        <section className="sec showcase" id="salon-tools" aria-labelledby="showcase-h">
          <div className="sec__head">
            <div>
              <Eyebrow>{t('home2.tools.eyebrow')}</Eyebrow>
              <h2 id="showcase-h" className="h2" data-split="">{plain(t('salonTools.showcase.title'))}</h2>
              <p className="sec__sub">{t('salonTools.showcase.sub')}</p>
            </div>
          </div>
          <div className="showcase__body" data-showcase="">
            <div className="showcase__side">
              <div className="showcase__tabs" role="tablist" aria-labelledby="showcase-h" aria-orientation="vertical">
                {SHOWCASE.map(({ key, icon }, i) => (
                  <button key={key} type="button" role="tab" id={`sc-tab-${key}`} aria-controls={`sc-panel-${key}`} aria-selected={i === 0 ? 'true' : 'false'} tabIndex={i === 0 ? 0 : -1}
                    className={`sc-tab sc-tab--${key}`} data-tab={key}>
                    <span className="sc-tab__icon" aria-hidden="true">{icon}</span>
                    <span className="sc-tab__text">
                      <span className="sc-tab__label">{t(`salonTools.showcase.tabs.${key}.label`)}{key === 'bookings' && <small>{t('salonTools.comingSoon')}</small>}</span>
                      <span className="sc-tab__desc"><span>{t(`salonTools.showcase.tabs.${key}.short`)}</span></span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="showcase__stage" data-active="page">
              <span className="showcase__tag">{t('salonTools.example')}</span>

              <div className="sc-panel" role="tabpanel" id="sc-panel-page" aria-labelledby="sc-tab-page" tabIndex={0}>
                <div className="pmock">
                  <div className="pmock__bar"><Logo className="pmock__logo" label="TrimCircle" /><span>{t('salonPageFeature.example')}</span></div>
                  <div className="pmock__address">{I.globe}<span>trimcircle.in/salon/royal-cuts</span></div>
                  <div className="pmock__hero">
                    <img src="/assets/photos/example-interior-barber.webp" alt="" loading="lazy" decoding="async" />
                    <div className="pmock__identity"><strong lang="en">Royal Cuts</strong><span>{I.pin}{areas[0]}</span></div>
                  </div>
                  <div className="pmock__content">
                    <div><strong>{t('salonPageFeature.previewServices')}</strong><span>{t('common.from', { price: price(120) })}</span></div>
                    <div><strong>{t('salonPageFeature.previewHours')}</strong><span>{t('salonPageFeature.previewHoursValue')}</span></div>
                    <span className="pmock__action">{I.chat}{t('salonPageFeature.previewContact')}</span>
                  </div>
                </div>
              </div>

              <div className="sc-panel" role="tabpanel" id="sc-panel-google" aria-labelledby="sc-tab-google" tabIndex={0} hidden>
                <div className="gmock">
                  <div className="gmock__photos">
                    <img src="/assets/photos/example-interior-barber.webp" alt="" loading="lazy" decoding="async" />
                    <img src="/assets/photos/hero-2.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="gmock__body">
                    <strong className="gmock__name" lang="en">Royal Cuts</strong>
                    <span className="gmock__rating"><b>4.7</b><span className="gmock__stars" aria-hidden="true">{I.star}{I.star}{I.star}{I.star}{I.star}</span><span>({t('salonTools.showcase.google.reviews', { count: 214 })})</span></span>
                    <span className="gmock__meta">{t('salonTools.showcase.google.type')} · {areas[0]}</span>
                    <span className="gmock__meta"><b className="gmock__open">{t('salonTools.showcase.google.open')}</b> · {t('salonTools.showcase.google.closes')}</span>
                    <div className="gmock__actions">
                      <span>{I.locate}{t('salonTools.showcase.google.directions')}</span>
                      <span>{I.phone}{t('salonTools.showcase.google.call')}</span>
                      <span>{I.globe}{t('salonTools.showcase.google.website')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sc-panel" role="tabpanel" id="sc-panel-whatsapp" aria-labelledby="sc-tab-whatsapp" tabIndex={0} hidden>
                <div className="wmock">
                  <div className="wmock__top"><span className="wmock__avatar"><Mark className="wmock__mark" /></span><span><strong>{t('salonTools.showcase.whatsappName')}</strong><small>online</small></span></div>
                  <div className="wmock__chat">
                    <p className="wmock__msg wmock__msg--in">{t('salonTools.whatsapp.previewChoose')}<span className="wmock__choice">{I.camera}{t('salonTools.whatsapp.previewPhotoOption')}</span></p>
                    <p className="wmock__msg wmock__msg--out wmock__msg--photo"><img src="/assets/photos/salon-5.webp" alt="" loading="lazy" decoding="async" /><span>{t('salonTools.whatsapp.previewPhotoMessage')}</span></p>
                    <p className="wmock__msg wmock__msg--in wmock__msg--done">{I.check}{t('salonTools.whatsapp.previewPublished')}</p>
                  </div>
                </div>
              </div>

              <div className="sc-panel" role="tabpanel" id="sc-panel-bookings" aria-labelledby="sc-tab-bookings" tabIndex={0} hidden>
                <div className="bmock">
                  <div className="bmock__top"><strong>{t('salonTools.showcase.bookings.today')}</strong><span className="bmock__soon">{t('salonTools.comingSoon')}</span></div>
                  <div className="bmock__now">
                    <span className="bmock__now-label">{t('salonTools.showcase.bookings.nowServing')}</span>
                    <span className="bmock__now-row"><b>10:00</b><span>{t('salonTools.appointments.previewAppointment')}</span><i aria-hidden="true"></i></span>
                  </div>
                  <ul className="bmock__list" role="list">
                    <li><b>10:30</b><span>{t('salonTools.appointments.previewAppointment')}<small>{t('salonTools.appointments.previewScheduled')}</small></span></li>
                    <li><b>11:00</b><span>{t('salonTools.showcase.bookings.walkIn')}<small>{t('salonTools.appointments.previewQueue')}</small></span></li>
                    <li><b>11:30</b><span>{t('salonTools.appointments.previewAppointment')}<small>{t('salonTools.appointments.previewScheduled')}</small></span></li>
                  </ul>
                  <span className="bmock__queue">{I.users}{t('salonTools.showcase.bookings.waiting', { count: 3 })}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ OWNERS CTA ============ */}
        <section className="owners" id="owners" aria-labelledby="owners-h">
          <div className="owners__in">
            <div className="owners__copy">
              <Eyebrow>{t('home2.owners.eyebrow')}</Eyebrow>
              <h2 id="owners-h" className="h2" data-split="">{plain(t('owners.title'))}</h2>
              <p className="owners__sub">“{t('owners.sub')}”</p>
              <ol className="owners__steps" role="list">
                {t.raw('owners.steps').map((s: string, i: number) => <li key={i}><span>{i + 1}</span>{s}</li>)}
              </ol>
              <p className="owners__line">{t('home2.owners.line')}</p>
              <div className="owners__cta">
                <a className="btn btn--accent btn--lg magnetic" href={waHref} target="_blank" rel="noopener" data-cursor="WhatsApp">{I.chat}<span>{t('owners.cta')}</span></a>
                <p className="owners__note">{t('owners.ctaNote')}</p>
              </div>
            </div>
            <div className="owners__visual">
              <img src="/assets/photos/salon-owner-generated.png" alt={ex} loading="lazy" decoding="async" />
              <span className="ph__tag">{ex}</span>
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="sec faq" aria-labelledby="faq-h">
          <div className="sec__head sec__head--center">
            <div>
              <Eyebrow>{t('home2.faq.eyebrow')}</Eyebrow>
              <h2 id="faq-h" className="h2" data-split="">{t('home2.faq.title')}</h2>
              <p className="sec__sub">{t('home2.faq.sub')}</p>
            </div>
          </div>
          <div className="faq__list">
            {faq.map((f, i) => (
              <details key={f.q} className="faq__item" open={i === 0}>
                <summary>{f.q}<span className="faq__ic" aria-hidden="true">{I.chevron}</span></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ============ CLOSING ============ */}
        <section className="closing" aria-labelledby="closing-h">
          <Eyebrow>{t('home2.closing.eyebrow')}</Eyebrow>
          <h2 id="closing-h" className="display" data-split=""><Emph text={t('home2.closing.title')} /></h2>
          <p className="closing__sub">“{t('home2.closing.sub')}”</p>
          <div className="closing__cta">
            <a className="btn btn--accent btn--lg magnetic" href="#top">{I.search}<span>{t('home2.closing.search')}</span></a>
            <a className="btn btn--ghost btn--lg" href={waHref} target="_blank" rel="noopener">{I.chat}<span>{t('home2.closing.owner')}</span></a>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="ftr">
        <div className="ftr__top">
          <div className="ftr__brand">
            <Logo label="TrimCircle" />
            <p className="ftr__tag">{t('home2.footer.blurb')}</p>
          </div>
          <nav className="ftr__col" aria-label={t('footer.explore')}>
            <p className="ftr__h">{t('footer.explore')}</p>
            {NAV.map(([k, h]) => <a key={k} href={h}>{t('nav.' + k)}</a>)}
          </nav>
          <div className="ftr__col">
            <p className="ftr__h">{t('footer.owners')}</p>
            <a href={waHref} target="_blank" rel="noopener">{t('footer.ownersLink')}</a>
            <a href="#salon-tools">{t('home2.tools.eyebrow')}</a>
            <a href="#owners">{t('nav.listCta')}</a>
          </div>
          <div className="ftr__col">
            <p className="ftr__h">{t('footer.languages')}</p>
            {LOCALES.filter(l => l.ready).map(l => (
              <a key={l.code} className={l.code === locale ? 'is-current' : undefined} href={localeHref(l.code)} hrefLang={l.hreflang} lang={l.hreflang}
                data-locale={l.code} aria-current={l.code === locale ? 'true' : undefined}>{l.name}</a>
            ))}
            <p className="ftr__soon">{t('footer.moreLangs', { count: LOCALES.filter(l => !l.ready).length })}</p>
          </div>
        </div>
        <p className="ftr__mark" aria-hidden="true"><span>TRIM</span>CIRCLE</p>
        <div className="ftr__bottom">
          <p>{t('footer.rights', { year })}</p>
          <p>{t('footer.photosNote')}</p>
          <div className="ftr__actions">
            <ThemeToggle className="ftr__theme" toDark={t('common.themeDark')} toLight={t('common.themeLight')} />
            <a href="#top">{I.arrowUp}{t('footer.top')}</a>
          </div>
        </div>
      </footer>

      <button className="dock" type="button" data-dock="" aria-label={t('hero.submit')}>{I.search}<span>{t('hero.submit')}</span></button>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { '@context': 'https://schema.org', '@type': 'WebSite', name: 'TrimCircle', url: CONFIG.siteUrl + '/', inLanguage: L.hreflang, description: t('meta.description') },
        { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: L.hreflang, mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      ]).replace(/</g, '\\u003c') }} />
      <SiteEffects runtime={runtime} />
    </>
  );
}
