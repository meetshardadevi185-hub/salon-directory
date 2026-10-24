'use client';
// The interactive part of the all-salons page: search, filters, sort, grid/list view and pagination.
// Everything is computed from the sample salons the server passes in, so it works on the static export.
import { useMemo, useRef, useState } from 'react';
import { createT } from '@/i18n/t.mjs';
import { I } from './icons';

export type DirSalon = {
  slug: string; name: string; area: string; areaEn: string; city: number; tags: string[];
  open: boolean; opensAt?: string; from: number; priceText: string; rating: number; reviews: number;
  deal: string | null; photo: string; phone: string; href: string;
};
type Props = {
  locale: string;
  dir: Record<string, string>;
  salons: DirSalon[];
  categories: { key: string; label: string }[];
  cities: { index: number; name: string; nameEn: string }[];
  waHref: string;
};

const SORTS = ['relevant', 'rating', 'priceLow', 'priceHigh', 'reviews'] as const;
type Sort = typeof SORTS[number];
const SORT_KEY: Record<Sort, string> = { relevant: 'sortRelevant', rating: 'sortRating', priceLow: 'sortPriceLow', priceHigh: 'sortPriceHigh', reviews: 'sortReviews' };
const RATINGS = [4.5, 4, 3];

const Stars = ({ v }: { v: number }) => (
  <span className="dr-stars" aria-hidden="true">
    {[1, 2, 3, 4, 5].map(n => <span key={n} className={n <= Math.round(v) ? 'is-on' : ''}>{I.star}</span>)}
  </span>
);

export default function SalonsDirectory({ locale, dir, salons, categories, cities, waHref }: Props) {
  const t = useMemo(() => createT({ dir }, { dir }, locale) as ((k: string, v?: Record<string, unknown>) => string), [dir, locale]);

  const [q, setQ] = useState('');
  const [city, setCity] = useState<number | ''>('');
  const [cats, setCats] = useState<string[]>([]);
  const [cityBoxes, setCityBoxes] = useState<number[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [openOnly, setOpenOnly] = useState(false);
  const [dealOnly, setDealOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('relevant');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [perPage, setPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [moreCats, setMoreCats] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const reset = () => { setQ(''); setCity(''); setCats([]); setCityBoxes([]); setMinRating(0); setOpenOnly(false); setDealOnly(false); setSort('relevant'); setPage(1); };
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const touch = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };

  const cityName = (i: number) => cities.find(c => c.index === i)?.name ?? '';

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = salons.filter(s => {
      if (needle && !`${s.name} ${s.area} ${s.areaEn} ${s.tags.join(' ')} ${categories.filter(c => s.tags.includes(c.key)).map(c => c.label).join(' ')}`.toLowerCase().includes(needle)) return false;
      if (city !== '' && s.city !== city) return false;
      if (cityBoxes.length && !cityBoxes.includes(s.city)) return false;
      if (cats.length && !cats.some(c => s.tags.includes(c))) return false;
      if (minRating && s.rating < minRating) return false;
      if (openOnly && !s.open) return false;
      if (dealOnly && !s.deal) return false;
      return true;
    });
    const by: Record<Sort, (a: DirSalon, b: DirSalon) => number> = {
      relevant: () => 0,
      rating: (a, b) => b.rating - a.rating,
      priceLow: (a, b) => a.from - b.from,
      priceHigh: (a, b) => b.from - a.from,
      reviews: (a, b) => b.reviews - a.reviews,
    };
    return [...list].sort(by[sort]);
  }, [salons, categories, q, city, cats, cityBoxes, minRating, openOnly, dealOnly, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * perPage, cur * perPage);
  const featured = filtered.filter(s => s.deal);
  const featRow = useRef<HTMLUListElement>(null);
  const slide = (dir: number) => { const el = featRow.current; if (el) el.scrollBy({ left: dir * (el.clientWidth + 12), behavior: 'smooth' }); };
  const catCount = (key: string) => salons.filter(s => s.tags.includes(key)).length;
  const cityCount = (i: number) => salons.filter(s => s.city === i).length;
  const visibleCats = moreCats ? categories : categories.slice(0, 5);
  const where = city === '' ? t('dir.allCities') : cityName(city);
  const heading = q.trim() ? t('dir.results', { what: q.trim(), where }) : t('dir.resultsAll', { where });
  const activeCount = cats.length + cityBoxes.length + (minRating ? 1 : 0) + (openOnly ? 1 : 0) + (dealOnly ? 1 : 0);
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  const card = (s: DirSalon) => (
    <article key={s.slug} className="dr-card">
      <a className="dr-card__ph" href={s.href} tabIndex={-1} aria-hidden="true">
        <img src={`/assets/photos/${s.photo}.webp`} alt="" loading="lazy" decoding="async" />
        {s.rating >= 4.8 && <span className="dr-badge">{t('dir.topRated')}</span>}
        <span className="dr-rate">{I.star}{s.rating.toFixed(1)}</span>
      </a>
      <button type="button" className={`dr-heart${saved.includes(s.slug) ? ' is-on' : ''}`} aria-pressed={saved.includes(s.slug)} aria-label={`${t('dir.save')}: ${s.name}`} onClick={() => setSaved(toggle(saved, s.slug))}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" /></svg>
      </button>
      <div className="dr-card__body">
        <h3 className="dr-card__name"><a href={s.href} lang="en">{s.name}</a></h3>
        <p className="dr-card__meta">{s.area}</p>
        <p className={`dr-card__open${s.open ? ' is-open' : ''}`}><i></i>{s.open ? t('dir.openNow') : t('dir.closes', { time: s.opensAt })}<span>{t('dir.from', { price: s.priceText })}</span></p>
        <div className="dr-card__actions">
          <a className="dr-btn dr-btn--ghost" href={`tel:${s.phone}`}>{I.phone}{t('dir.call')}</a>
          <a className="dr-btn" href={s.href}>{t('dir.viewProfile')}</a>
        </div>
      </div>
    </article>
  );

  const filtersBlock = (
    <div className="dr-filters">
      <div className="dr-filters__head">
        <h2>{t('dir.filters')}{activeCount ? <span className="dr-count">{activeCount}</span> : null}</h2>
        <button type="button" className="dr-link" onClick={reset}>{t('dir.reset')}</button>
      </div>

      <fieldset className="dr-group">
        <legend>{t('dir.category')}</legend>
        <label className="dr-check"><input type="checkbox" checked={cats.length === 0} onChange={() => touch(setCats)([])} /><span>{t('dir.allCategories')}</span><em>{salons.length}</em></label>
        {visibleCats.map(c => (
          <label key={c.key} className="dr-check"><input type="checkbox" checked={cats.includes(c.key)} onChange={() => touch(setCats)(toggle(cats, c.key))} /><span>{c.label}</span><em>{catCount(c.key)}</em></label>
        ))}
        {categories.length > 5 && <button type="button" className="dr-link" onClick={() => setMoreCats(!moreCats)}>{moreCats ? t('dir.showLess') : t('dir.showMore')}</button>}
      </fieldset>

      <fieldset className="dr-group">
        <legend>{t('dir.location')}</legend>
        {cities.filter(c => cityCount(c.index) > 0).map(c => (
          <label key={c.index} className="dr-check"><input type="checkbox" checked={cityBoxes.includes(c.index)} onChange={() => touch(setCityBoxes)(toggle(cityBoxes, c.index))} /><span>{c.name}</span><em>{cityCount(c.index)}</em></label>
        ))}
      </fieldset>

      <fieldset className="dr-group">
        <legend>{t('dir.rating')}</legend>
        {RATINGS.map(r => (
          <label key={r} className="dr-check"><input type="checkbox" checked={minRating === r} onChange={() => touch(setMinRating)(minRating === r ? 0 : r)} /><span><Stars v={r} /> {t('dir.ratingUp', { n: r.toFixed(1) })}</span><em>{salons.filter(s => s.rating >= r).length}</em></label>
        ))}
      </fieldset>

      <fieldset className="dr-group">
        <legend>{t('dir.openNow')}</legend>
        <label className="dr-check"><input type="checkbox" checked={openOnly} onChange={() => touch(setOpenOnly)(!openOnly)} /><span>{t('dir.openNow')}</span><em>{salons.filter(s => s.open).length}</em></label>
      </fieldset>

      <fieldset className="dr-group">
        <legend>{t('dir.offers')}</legend>
        <label className="dr-check"><input type="checkbox" checked={dealOnly} onChange={() => touch(setDealOnly)(!dealOnly)} /><span>{t('dir.offersOnly')}</span><em>{salons.filter(s => s.deal).length}</em></label>
      </fieldset>
    </div>
  );

  return (
    <>
      {/* ---------- hero with the search card ---------- */}
      <section className="dr-hero" aria-labelledby="dr-h1">
        <div className="dr-wrap">
          <h1 id="dr-h1" className="dr-hero__title">
            {t('dir.heroTitle').split(/\*(.+?)\*/g).map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p))}
          </h1>
          <p className="dr-hero__sub">{t('dir.heroSub')}</p>
          <form className="dr-search" role="search" onSubmit={e => e.preventDefault()}>
            <label className="dr-search__field">
              {I.search}
              <span><small>{t('dir.whatLabel')}</small>
                <input type="search" value={q} placeholder={t('dir.whatPlaceholder')} onChange={e => touch(setQ)(e.target.value)} /></span>
            </label>
            <label className="dr-search__field">
              {I.pin}
              <span><small>{t('dir.whereLabel')}</small>
                <select value={city} onChange={e => touch(setCity)(e.target.value === '' ? '' : Number(e.target.value))}>
                  <option value="">{t('dir.allCities')}</option>
                  {cities.filter(c => cityCount(c.index) > 0).map(c => <option key={c.index} value={c.index}>{c.name}</option>)}
                </select></span>
            </label>
            <a className="dr-btn dr-btn--lg" href="#dr-results">{t('dir.searchBtn')}</a>
          </form>
          <p className="dr-popular">
            <span>{t('dir.popular')}:</span>
            {categories.map(c => (
              <button key={c.key} type="button" className={cats.includes(c.key) ? 'is-on' : ''} onClick={() => touch(setCats)(cats.includes(c.key) ? [] : [c.key])}>{c.label}</button>
            ))}
          </p>
        </div>
      </section>

      {/* ---------- filters + results ---------- */}
      <section className="dr-main dr-wrap" id="dr-results">
        <aside className="dr-side" aria-label={t('dir.filters')}>
          <details className="dr-side__sheet" open>
            <summary className="dr-side__toggle">{I.filter}<span>{t('dir.filters')}</span>{activeCount ? <span className="dr-count">{activeCount}</span> : null}{I.chevron}</summary>
            {filtersBlock}
          </details>
        </aside>

        <div className="dr-content">
          <div className="dr-bar">
            <div>
              <h2 className="dr-bar__title">{heading}</h2>
              <p className="dr-bar__count" aria-live="polite">{t('dir.found', { count: filtered.length })}</p>
            </div>
            <div className="dr-bar__tools">
              <label className="dr-select"><span>{t('dir.sort')}:</span>
                <select value={sort} onChange={e => touch(setSort)(e.target.value as Sort)}>
                  {SORTS.map(s => <option key={s} value={s}>{t(`dir.${SORT_KEY[s]}`)}</option>)}
                </select>
              </label>
              <div className="dr-view" role="group" aria-label="View">
                <button type="button" aria-pressed={view === 'grid'} aria-label={t('dir.gridView')} onClick={() => setView('grid')}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" /><rect x="13.5" y="4" width="6.5" height="6.5" /><rect x="4" y="13.5" width="6.5" height="6.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" /></svg>
                </button>
                <button type="button" aria-pressed={view === 'list'} aria-label={t('dir.listView')} onClick={() => setView('list')}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01" /></svg>
                </button>
              </div>
            </div>
          </div>

          {featured.length > 0 && cur === 1 && (
            <section className="dr-featured" aria-labelledby="dr-feat-h">
              <div className="dr-featured__head">
                <h3 id="dr-feat-h">{I.tag}{t('dir.featuredTitle')}<small>{t('dir.featuredSub')}</small></h3>
                {featured.length > 3 && (
                  <div className="dr-featured__nav">
                    <button type="button" aria-label={t('dir.prev')} onClick={() => slide(-1)}><span className="flip">{I.arrow}</span></button>
                    <button type="button" aria-label={t('dir.next')} onClick={() => slide(1)}>{I.arrow}</button>
                  </div>
                )}
              </div>
              <ul role="list" ref={featRow}>
                {featured.map(s => (
                  <li key={s.slug} className="dr-feat">
                    <a className="dr-feat__ph" href={s.href} tabIndex={-1} aria-hidden="true"><img src={`/assets/photos/${s.photo}.webp`} alt="" loading="lazy" decoding="async" /></a>
                    <p className="dr-feat__offer">{I.tag}<span>{s.deal}</span></p>
                    <div className="dr-feat__body">
                      <h4 lang="en">{s.name}</h4>
                      <p className="dr-card__rating"><b>{s.rating.toFixed(1)}</b><Stars v={s.rating} /><span>({s.reviews})</span></p>
                      <p className="dr-card__meta">{s.area}</p>
                      <a className="dr-btn dr-btn--ghost dr-btn--block" href={s.href}>{t('dir.visit')}</a>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {filtered.length === 0 ? (
            <div className="dr-empty"><p>{t('dir.empty')}</p><button type="button" className="dr-btn" onClick={reset}>{t('dir.emptyCta')}</button></div>
          ) : (
            <div className={`dr-results dr-results--${view}`}>
              <div className="dr-grid">{shown.map(card)}</div>
            </div>
          )}

          <section className="dr-banner" aria-label={t('dir.bannerTitle')}>
            <div>
              <h3>{t('dir.bannerTitle')}</h3>
              <p>{t('dir.bannerText')}</p>
            </div>
            <a className="dr-btn" href={waHref} target="_blank" rel="noopener">{t('dir.bannerCta')}</a>
          </section>

          {filtered.length > 0 && (
            <nav className="dr-pager" aria-label="Pagination">
              <div className="dr-pager__pages">
                <button type="button" disabled={cur === 1} aria-label={t('dir.prev')} onClick={() => setPage(cur - 1)}><span className="flip">{I.arrow}</span></button>
                {pageNumbers.map(n => <button key={n} type="button" aria-current={n === cur ? 'page' : undefined} aria-label={t('dir.page', { n })} className={n === cur ? 'is-on' : ''} onClick={() => setPage(n)}>{n}</button>)}
                <button type="button" disabled={cur === pages} aria-label={t('dir.next')} onClick={() => setPage(cur + 1)}>{I.arrow}</button>
              </div>
              <label className="dr-select"><span>{t('dir.perPage')}:</span>
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  {[6, 9, 12].map(n => <option key={n} value={n}>{t('dir.perPageUnit', { n })}</option>)}
                </select>
              </label>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
