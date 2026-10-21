/* TrimCircle home — interactions + motion.
   Runs once in the browser after hydration (see components/SiteEffects.tsx).
   Content is fully visible without JS; hidden start states only apply under html.motion. */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';

export type Runtime = {
  locale: string;
  hreflang: string;
  hero: Record<'locating' | 'located' | 'denied' | 'empty' | 'badPincode' | 'searching' | 'searchingCat', string>;
  salons: {
    count: string; empty: string; distance: string;
    locTitle: string; locSub: string; locFound: string; locFoundSub: string; locCity: string; locating: string; denied: string;
    inCity: string; allIndia: string; nearest: string;
    cities: string[]; citiesEn: string[];
  };
  hindiPrompt: { text: string; yes: string; no: string; href: string } | null;
};

let started = false;

export function initSite(R: Runtime) {
  if (started) return;
  started = true;

  const html = document.documentElement;
  const $ = <E extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as unknown as E;
  const $$ = <E extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as unknown as E[];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let lenis: Lenis | null = null;
  const fmt = (s: string, v: Record<string, unknown> = {}) => s
    .replace(/\{(\w+), plural, ((?:[^{}]|\{[^{}]*\})*)\}/g, (_, k, body) => {
      const n = Number(v[k]);
      const forms = Object.fromEntries([...body.matchAll(/(\w+|=\d+)\s*\{([^}]*)\}/g)].map(m => [m[1], m[2]]));
      const pr = new Intl.PluralRules(R.hreflang).select(n);
      return (forms['=' + n] ?? forms[pr] ?? forms.other ?? '').replace(/#/g, String(n));
    })
    .replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m));

  /* ------------------------------------------------------------------ language */
  function rememberLocale(code: string) {
    try { localStorage.setItem('tc-locale', code); } catch (e) {}
    // Same cookie name next-intl reads, so the choice carries over if locale routing moves to middleware.
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000;SameSite=Lax`;
  }
  $$<HTMLAnchorElement>('a[data-locale]').forEach(a => a.addEventListener('click', () => rememberLocale(a.dataset.locale)));

  $$('[data-lang]').forEach(box => {
    const btn = $('.lang__btn', box), pop = $('.lang__pop', box);
    const close = () => { btn.setAttribute('aria-expanded', 'false'); pop.hidden = true; };
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open)); pop.hidden = !open;
      if (open) $('a.lang__opt, .lang__opt', pop)?.focus?.();
    });
    document.addEventListener('click', e => { if (!box.contains(e.target as Node)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) { close(); btn.focus(); } });
  });

  // Gentle Hindi suggestion on the English page: never a redirect, only once, only if the browser prefers Hindi.
  try {
    const saved = localStorage.getItem('tc-locale');
    const prefersHi = (navigator.languages || [navigator.language]).some(l => /^hi\b/i.test(l));
    if (R.hindiPrompt && !saved && prefersHi && !sessionStorage.getItem('tc-hi-asked')) {
      sessionStorage.setItem('tc-hi-asked', '1');
      const el = document.createElement('div');
      el.className = 'toast'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Language');
      el.innerHTML = `<p lang="hi">${R.hindiPrompt.text}</p><a href="${R.hindiPrompt.href}" lang="hi" hreflang="hi-IN">${R.hindiPrompt.yes}</a><button type="button">${R.hindiPrompt.no}</button>`;
      $('a', el).addEventListener('click', () => rememberLocale('hi'));
      $('button', el).addEventListener('click', () => { rememberLocale('en'); el.remove(); });
      setTimeout(() => document.body.appendChild(el), 2600);
    }
  } catch (e) {}

  /* ------------------------------------------------------------------ theme */
  // The boot script has already set data-theme; the toggles flip it and remember the choice.
  // Until someone picks, the page stays dark (the boot script's default).
  const themeMeta = $<HTMLMetaElement>('meta[name="theme-color"]');
  const applyTheme = (theme: 'light' | 'dark', animate: boolean) => {
    if (animate && !reduced) {
      html.classList.add('theme-anim');
      setTimeout(() => html.classList.remove('theme-anim'), 450);
    }
    html.setAttribute('data-theme', theme);
    html.style.colorScheme = theme;
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#0A0A0A' : '#FDFDFB';
    $$('[data-theme-toggle]').forEach(b => b.setAttribute('aria-label', theme === 'dark' ? b.dataset.labelLight : b.dataset.labelDark));
  };
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('tc-theme', next); } catch (e) {}
    applyTheme(next, true);
  }));

  /* ------------------------------------------------------------------ owner tool showcase */
  // ARIA tabs: click or arrow keys pick a tool; the stage swaps to its mock-up with a short fade.
  $$('[data-showcase]').forEach(box => {
    const tabs = $$<HTMLButtonElement>('[role="tab"]', box);
    const stage = $('.showcase__stage', box);
    const select = (tab: HTMLButtonElement, focus: boolean) => {
      if (tab.getAttribute('aria-selected') === 'true') return;
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on && !reduced) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
      });
      stage.dataset.active = tab.dataset.tab;
      // on phones the tabs scroll sideways: keep the chosen one in view
      const row = tab.parentElement;
      if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: tab.offsetLeft - row.clientWidth / 2 + tab.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', e => {
        const k = e.key;
        const next = k === 'ArrowDown' || k === 'ArrowRight' ? tabs[(i + 1) % tabs.length]
          : k === 'ArrowUp' || k === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length]
          : k === 'Home' ? tabs[0] : k === 'End' ? tabs[tabs.length - 1] : null;
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });

  /* ------------------------------------------------------------------ mobile sheet */
  const sheet = $('#sheet'), menuBtn = $('.hdr__menu');
  const setSheet = (open: boolean) => {
    sheet.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open) $('.sheet__close', sheet).focus(); else menuBtn.focus();
  };
  menuBtn.addEventListener('click', () => setSheet(true));
  $('.sheet__close', sheet).addEventListener('click', () => setSheet(false));
  $$('.sheet__nav a', sheet).forEach(a => a.addEventListener('click', () => { sheet.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; lenis?.start(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) setSheet(false); });

  /* ------------------------------------------------------------------ smooth anchor scrolling */
  const scrollToEl = (el: HTMLElement, offset = 0) => {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -(parseInt(getComputedStyle(html).scrollPaddingTop) || 80) + offset, duration: 1.2 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };
  document.addEventListener('click', e => {
    const a = (e.target as Element).closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = id === '#top' ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    if (id === '#top') { lenis ? lenis.scrollTo(0, { duration: 1.4 }) : scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }
    else scrollToEl(target);
    history.replaceState(history.state, '', id);
  });

  /* ------------------------------------------------------------------ salon finder */
  // State: where (city or the user's position) + what (service tab, or text sent from the hero search).
  const grid = $('.salons__grid'), cards = $$('.salon', grid), empty = $('.salons__empty');
  const countEl = $('[data-count]'), whereEl = $('[data-where]');
  const pills = $$('.pill[data-f]'), qChip = $<HTMLButtonElement>('[data-q-chip]');
  const citySel = $<HTMLSelectElement>('select[data-city]');
  const cityPicker = $<HTMLDetailsElement>('[data-city-picker]');
  const cityCurrent = $('[data-city-current]', cityPicker);
  const citySearch = $<HTMLInputElement>('[data-city-search]', cityPicker);
  const cityOptions = $$<HTMLButtonElement>('[data-city-option]', cityPicker);
  const cityEmpty = $('[data-city-empty]', cityPicker);
  const clearFilters = $$<HTMLButtonElement>('[data-f-reset]');
  const filterPanel = $<HTMLDetailsElement>('[data-filter-panel]');
  const activeFilters = $('[data-active-filters]');
  const minRating = $<HTMLSelectElement>('[data-min-rating]');
  const maxPrice = $<HTMLSelectElement>('[data-max-price]');
  const openFilter = $<HTMLInputElement>('[data-open-filter]');
  const dealFilter = $<HTMLInputElement>('[data-deal-filter]');
  $('[data-city-fallback]').hidden = true;
  cityPicker.hidden = false;
  const locBtn = $('[data-locate]'), locSub = $('[data-loc-sub]');
  const st = { svc: 'all', city: '', q: '', pos: null as null | [number, number], showAll: false, minRating: '', maxPrice: '', openOnly: false, dealsOnly: false };
  const previewSalons = 4;
  const kmFmt = new Intl.NumberFormat(R.hreflang, { maximumFractionDigits: 1, numberingSystem: 'latn' });
  const distKm = (c: HTMLElement) => {
    const [la1, lo1] = st.pos, la2 = +c.dataset.lat, lo2 = +c.dataset.lng, r = Math.PI / 180;
    const h = Math.sin((la2 - la1) * r / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin((lo2 - lo1) * r / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(h));
  };

  function render() {
    const dist = new Map<HTMLElement, number>();
    if (st.pos) cards.forEach(c => dist.set(c, distKm(c)));
    const q = st.q.toLowerCase();
    let n = 0;
    // per-tab counts follow the current city / search, so each tab says what it will show
    const inPlace = cards.filter(c => (!st.city || c.dataset.city === st.city) && (!q || c.dataset.search.includes(q))
      && (!st.minRating || +c.dataset.rating >= +st.minRating) && (!st.maxPrice || +c.dataset.price <= +st.maxPrice)
      && (!st.openOnly || c.dataset.open === 'true') && (!st.dealsOnly || c.dataset.deal === 'true'));
    pills.forEach(p => { $('[data-n]', p).textContent = String(p.dataset.f === 'all' ? inPlace.length : inPlace.filter(c => c.dataset.tags.split(' ').includes(p.dataset.f)).length); });
    cards.forEach(c => {
      const ok = inPlace.includes(c) && (st.svc === 'all' || c.dataset.tags.split(' ').includes(st.svc));
      c.hidden = !ok; if (ok) n++;
      const d = $('[data-dist]', c);
      if (st.pos) { d.hidden = false; d.textContent = fmt(R.salons.distance, { km: kmFmt.format(dist.get(c)) }); } else d.hidden = true;
    });
    const by = {
      near: (x: HTMLElement, y: HTMLElement) => dist.get(x) - dist.get(y),
      price: (x: HTMLElement, y: HTMLElement) => +x.dataset.price - +y.dataset.price,
      rating: (x: HTMLElement, y: HTMLElement) => +y.dataset.rating - +x.dataset.rating,
    }[st.pos ? 'near' : 'rating'];
    [...cards].sort(by).forEach(c => grid.appendChild(c));
    const visibleCards = $$<HTMLElement>('.salon', grid).filter(c => !c.hidden);
    visibleCards.forEach((c, i) => c.classList.toggle('is-preview-hidden', !st.showAll && i >= previewSalons));
    const more = $<HTMLButtonElement>('[data-show-salons]');
    more.hidden = visibleCards.length <= previewSalons;
    more.firstChild.textContent = st.showAll ? more.dataset.lessLabel : more.dataset.moreLabel;
    pills.forEach(p => p.setAttribute('aria-pressed', String(p.dataset.f === st.svc)));
    qChip.hidden = !st.q; qChip.textContent = st.q ? `“${st.q}” ×` : '';
    empty.hidden = n > 0;
    countEl.textContent = fmt(R.salons.count, { count: n });
    whereEl.textContent = st.pos ? R.salons.nearest : st.city ? fmt(R.salons.inCity, { city: R.salons.cities[+st.city] }) : R.salons.allIndia;
    cityCurrent.textContent = citySel.selectedOptions[0]?.textContent || '';
    cityOptions.forEach(option => option.setAttribute('aria-pressed', String(option.dataset.cityOption === st.city)));
    const activeCount = Number(st.svc !== 'all') + Number(!!st.city || !!st.pos) + Number(!!st.minRating) + Number(!!st.maxPrice) + Number(st.openOnly) + Number(st.dealsOnly);
    activeFilters.textContent = String(activeCount); activeFilters.hidden = !activeCount;
    clearFilters.forEach(button => { if (button.classList.contains('finder__clear')) button.hidden = !(activeCount || st.q); });
    grid.scrollTo({ left: 0 }); grid.dispatchEvent(new Event('scroll'));
    // the row restarts from the left; the visible cards ripple in so the change is felt
    if (!reduced) gsap.fromTo(cards.filter(c => !c.hidden).slice(0, 6), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: .5, stagger: .05, ease: 'expo.out', overwrite: true });
    ScrollTrigger.refresh();
  }
  function setCity(i: string) {
    st.city = i; citySel.value = i;
    st.pos = null; locBtn.setAttribute('aria-pressed', 'false'); locSub.textContent = '';
    render();
  }
  function applyFilter(f: string) { st.svc = f; render(); }

  // "Use my location": sort every salon by real distance from the visitor.
  function locate(onDone?: (ok: boolean) => void) {
    if (!('geolocation' in navigator)) { locSub.textContent = R.salons.denied; onDone?.(false); return; }
    locBtn.classList.add('is-busy'); locBtn.setAttribute('aria-busy', 'true'); locSub.textContent = R.salons.locating;
    navigator.geolocation.getCurrentPosition(p => {
      locBtn.classList.remove('is-busy'); locBtn.removeAttribute('aria-busy');
      st.pos = [p.coords.latitude, p.coords.longitude]; st.city = ''; citySel.value = '';
      locBtn.setAttribute('aria-pressed', 'true'); locSub.textContent = R.salons.locFoundSub;
      render(); onDone?.(true);
    }, () => {
      locBtn.classList.remove('is-busy'); locBtn.removeAttribute('aria-busy');
      locSub.textContent = R.salons.denied; $<HTMLElement>('summary', cityPicker).focus(); onDone?.(false);
    }, { timeout: 10000, maximumAge: 300000 });
  }

  pills.forEach(p => p.addEventListener('click', () => applyFilter(p.dataset.f)));
  $('[data-show-salons]').addEventListener('click', () => { st.showAll = !st.showAll; render(); });
  citySel.addEventListener('change', () => setCity(citySel.value));
  cityOptions.forEach(option => option.addEventListener('click', () => {
    setCity(option.dataset.cityOption); cityPicker.open = false; citySearch.value = '';
    cityOptions.forEach(item => { item.hidden = false; }); cityEmpty.hidden = true;
    $<HTMLElement>('summary', cityPicker).focus();
  }));
  citySearch.addEventListener('input', () => {
    const query = citySearch.value.trim().toLocaleLowerCase(R.hreflang);
    cityOptions.forEach(option => { option.hidden = !option.textContent.toLocaleLowerCase(R.hreflang).includes(query); });
    cityEmpty.hidden = cityOptions.some(option => !option.hidden);
  });
  document.addEventListener('click', e => { if (!cityPicker.contains(e.target as Node)) cityPicker.open = false; });
  document.addEventListener('click', e => { if (!filterPanel.contains(e.target as Node)) filterPanel.open = false; });
  cityPicker.addEventListener('keydown', e => { if (e.key === 'Escape' && cityPicker.open) { e.stopPropagation(); cityPicker.open = false; $<HTMLElement>('summary', cityPicker).focus(); } });
  filterPanel.addEventListener('keydown', e => { if (e.key === 'Escape' && filterPanel.open) { filterPanel.open = false; $<HTMLElement>('summary', filterPanel).focus(); } });
  minRating.addEventListener('change', () => { st.minRating = minRating.value; render(); });
  maxPrice.addEventListener('change', () => { st.maxPrice = maxPrice.value; render(); });
  openFilter.addEventListener('change', () => { st.openOnly = openFilter.checked; render(); });
  dealFilter.addEventListener('change', () => { st.dealsOnly = dealFilter.checked; render(); });
  qChip.addEventListener('click', () => { st.q = ''; render(); });
  locBtn.addEventListener('click', () => { if (st.pos) setCity(''); else locate(); });
  clearFilters.forEach(button => button.addEventListener('click', () => {
    Object.assign(st, { svc: 'all', q: '', pos: null, minRating: '', maxPrice: '', openOnly: false, dealsOnly: false });
    minRating.value = ''; maxPrice.value = ''; openFilter.checked = false; dealFilter.checked = false;
    locBtn.setAttribute('aria-pressed', 'false'); locSub.textContent = ''; setCity('');
  }));
  $$('.pick[data-filter]').forEach(r => r.addEventListener('click', () => applyFilter(r.dataset.filter)));
  $$<HTMLElement>('[data-service-filter]').forEach(a => a.addEventListener('click', () => applyFilter(a.dataset.serviceFilter)));
  cards.forEach((c, i) => c.classList.toggle('is-preview-hidden', i >= previewSalons));

  /* ------------------------------------------------------------------ hero search → finder */
  const form = $<HTMLFormElement>('.search'), input = $<HTMLInputElement>('input', form), status = $('.search__status', form), nearBtn = $('[data-near]', form);
  const say = (msg: string, err = false) => { status.textContent = msg; status.classList.toggle('is-error', err); };
  const toSalons = () => setTimeout(() => scrollToEl($('#salons')), 350);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) { say(R.hero.empty, true); input.focus(); return; }
    say('');
    // a city name picks the city; anything else searches salon names and areas
    const lc = q.toLowerCase();
    const ci = [R.salons.cities, R.salons.citiesEn].map(l => l.findIndex(c => c.toLowerCase() === lc)).find(i => i >= 0);
    if (ci !== undefined) { st.q = ''; setCity(String(ci)); }
    else { st.q = q; setCity(''); }
    toSalons();
  });
  nearBtn.addEventListener('click', () => {
    nearBtn.classList.add('is-busy'); say(R.hero.locating);
    locate(ok => { nearBtn.classList.remove('is-busy'); if (ok) { say(''); toSalons(); } else { say(R.hero.denied, true); input.focus(); } });
  });

  // city tiles ("Find salons in your city") pick that city in the finder
  $$('.chip[data-area]').forEach(c => c.addEventListener('click', () => {
    const i = R.salons.cities.indexOf(c.dataset.area);
    st.q = ''; setCity(i >= 0 ? String(i) : ''); toSalons();
  }));

  /* ------------------------------------------------------------------ hero: rotating service word */
  const rot = $('[data-rotate]');
  if (rot && !reduced) {
    const words: string[] = JSON.parse(rot.dataset.rotate);
    let w = 0;
    setInterval(() => {
      rot.classList.add('is-out');
      setTimeout(() => { w = (w + 1) % words.length; rot.textContent = words[w]; rot.classList.remove('is-out'); }, 380);
    }, 2600);
  }
  /* ------------------------------------------------------------------ side-scroll arrows (works without motion) */
  // <button data-scroll="<row selector>" data-dir="-1|1"> scrolls that row by one card.
  const rows = new Map<HTMLElement, HTMLButtonElement[]>();
  $$<HTMLButtonElement>('[data-scroll]').forEach(b => {
    const r = $(b.dataset.scroll);
    if (r) rows.set(r, [...(rows.get(r) || []), b]);
  });
  rows.forEach((btns, row) => {
    const upd = () => {
      const max = row.scrollWidth - row.clientWidth - 2;
      btns.forEach(b => { b.disabled = b.dataset.dir === '-1' ? row.scrollLeft <= 2 : row.scrollLeft >= max; });
    };
    btns.forEach(b => b.addEventListener('click', () => {
      const card = row.firstElementChild as HTMLElement;
      const gap = parseFloat(getComputedStyle(row).columnGap) || 16;
      row.scrollBy({ left: Number(b.dataset.dir) * ((card?.getBoundingClientRect().width || 300) + gap), behavior: reduced ? 'auto' : 'smooth' });
    }));
    row.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    upd();
  });

  /* ------------------------------------------------------------------ mobile dock */
  const dock = $('[data-dock]');
  dock.addEventListener('click', () => {
    lenis ? lenis.scrollTo(0, { duration: 1 }) : scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    setTimeout(() => input.focus({ preventScroll: true }), reduced ? 0 : 700);
  });
  if ('IntersectionObserver' in window) {
    let pastSearch = false, inOwners = false, inFtr = false;
    const upd = () => dock.classList.toggle('is-on', pastSearch && !inOwners && !inFtr);
    new IntersectionObserver(([e]) => { pastSearch = !e.isIntersecting && e.boundingClientRect.top < 0; upd(); }).observe(form);
    new IntersectionObserver(([e]) => { inOwners = e.isIntersecting; upd(); }, { rootMargin: '0px 0px -30% 0px' }).observe($('.owners'));
    new IntersectionObserver(([e]) => { inFtr = e.isIntersecting; upd(); }).observe($('.ftr'));
  }

  /* ------------------------------------------------------------------ header (works without motion) */
  const hdr = $('.hdr');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('is-scrolled', y > 12);
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (goingDown && y > 240 && sheet.hidden) { hdr.classList.add('is-hidden'); $$('.lang__pop').forEach(p => { p.hidden = true; }); $$('.lang__btn').forEach(b => b.setAttribute('aria-expanded', 'false')); }
    else if (goingUp || y < 240) hdr.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  hdr.addEventListener('focusin', () => hdr.classList.remove('is-hidden'));

  /* ------------------------------------------------------------------ hero background video (works without motion) */
  // Poster only for reduced motion or data saver; small file on phones; paused while off screen.
  const heroVideo = $<HTMLVideoElement>('.hero__video');
  const saveData = (navigator as any).connection?.saveData;
  if (heroVideo && !reduced && !saveData) {
    // Start after page load so the multi-MB video doesn't hold up the category photos and fonts.
    const pauseBtn = $('.hero__pause');
    let userPaused = false;
    const start = () => {
      heroVideo.muted = true; // React doesn't server-render the muted attribute; autoplay needs it.
      heroVideo.src = matchMedia('(min-width: 700px)').matches ? heroVideo.dataset.src : heroVideo.dataset.srcSm;
      const play = () => { if (!userPaused) heroVideo.play().catch(() => {}); };
      play();
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { e.isIntersecting ? play() : heroVideo.pause(); }).observe(heroVideo);
      // Visible pause control for the looping video (WCAG 2.2.2); a user pause sticks while scrolling.
      pauseBtn.hidden = false;
      pauseBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        userPaused ? heroVideo.pause() : play();
        pauseBtn.setAttribute('aria-pressed', String(userPaused));
        pauseBtn.setAttribute('aria-label', userPaused ? pauseBtn.dataset.labelPlay : pauseBtn.dataset.labelPause);
      });
    };
    document.readyState === 'complete' ? start() : addEventListener('load', start, { once: true });
  }

  /* ================================================================== MOTION */
  if (reduced) { html.classList.add('ready'); html.classList.remove('motion', 'intro-on'); return; }

  gsap.registerPlugin(ScrollTrigger, Flip);
  const EXPO = 'expo.out';
  html.classList.add('ready');

  // Lenis smooth scroll on desktop pointers only
  if (fine) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    html.classList.add('lenis');
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- split helpers ---------- */
  function splitWords(el: Element) {
    // Keeps <em> intact: wraps each word in a mask; em words stay italic.
    const out: HTMLElement[] = [];
    const walk = (node: Node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const m = document.createElement('span'); m.className = 'wm';
            const i = document.createElement('span'); i.textContent = p;
            m.appendChild(i); frag.appendChild(m); out.push(i);
          });
          (n as ChildNode).replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return out;
  }

  /* ---------- hero entrance (after intro) ---------- */
  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: EXPO } });
    tl.from('.hero__title', { opacity: 0, y: 18, duration: 1.0 })
      .to('.hero .rise', { opacity: 1, y: 0, duration: 1, stagger: .08 }, '-=.9')
      .from('.hero__media', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.hdr__bar > *', { y: -20, opacity: 0, duration: .8, stagger: .06 }, 0);
    return tl;
  }

  /* ---------- intro (once per session) ---------- */
  if (html.classList.contains('intro-on')) {
    const num = $('.intro__num'), counter = { v: 0 };
    lenis?.stop();
    const tl = gsap.timeline({ defaults: { ease: EXPO } });
    tl.from('.intro__logo', { scale: .6, opacity: 0, duration: .8 })
      .to('.intro__ring circle', { strokeDashoffset: 0, duration: 1.05, ease: 'power3.inOut' }, 0.1)
      .to(counter, { v: 100, duration: 1.05, ease: 'power3.inOut', onUpdate: () => { num.textContent = String(Math.round(counter.v)); } }, 0.1)
      .from('.intro__msg', { opacity: 0, y: 8, duration: .6 }, 0.2)
      .to('.intro', { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut' }, 1.2)
      .add(() => { html.classList.remove('intro-on'); lenis?.start(); gsap.set('.intro', { display: 'none' }); try { sessionStorage.setItem('tc-intro', '1'); } catch (e) {} ScrollTrigger.refresh(); }, 2.0)
      .add(heroIn(), 1.45);
  } else {
    heroIn();
  }

  const mm = gsap.matchMedia();

  /* (hero service tiles ride in with their .rise box; a separate GSAP transform here fought the tiles' CSS hover transition) */

  /* ---------- section headings: words rise from masks ---------- */
  $$('[data-split]').forEach(h => {
    const words = splitWords(h);
    gsap.from(words, { yPercent: 110, duration: 1.1, ease: EXPO, stagger: .06, scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
  });
  $$('.sec-sub, .owners__sub').forEach(p => gsap.from(p, { opacity: 0, y: 20, duration: 1, ease: EXPO, scrollTrigger: { trigger: p, start: 'top 90%', once: true } }));

  /* ---------- image clip reveals (outside hero) ---------- */
  $$('.reveal').forEach(r => {
    if (r.closest('.hero')) return;
    const inner = $('.ph__in', r), img = $('img', r);
    gsap.timeline({ scrollTrigger: { trigger: r, start: 'top 88%', once: true } })
      .to(inner, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' })
      .to(img, { scale: 1, duration: 1.6, ease: EXPO }, 0);
  });

  /* ---------- city tiles rise in ---------- */
  gsap.from('.cities__grid li', { opacity: 0, y: 24, duration: .8, ease: EXPO, stagger: .04, scrollTrigger: { trigger: '.cities__grid', start: 'top 90%', once: true } });

  /* ---------- how it works: steps rise in ---------- */
  gsap.from('.how-step', { opacity: 0, y: 30, duration: .9, ease: EXPO, stagger: .1, scrollTrigger: { trigger: '.how__steps', start: 'top 88%', once: true } });


  /* ---------- salon tiles ---------- */


  /* ---------- owners: chat types in, count-up facts ---------- */
  gsap.from('.owners__steps li', { x: -24, opacity: 0, duration: .8, ease: EXPO, stagger: .1, scrollTrigger: { trigger: '.owners__steps', start: 'top 85%', once: true } });
  $$('[data-count-to]').forEach(el => {
    const to = parseFloat(el.dataset.countTo), o = { v: 0 };
    if (!to) return;
    el.textContent = '0';
    gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-IN'); } });
  });

  /* ---------- magnetic buttons + custom cursor (desktop) ---------- */
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const cleanups: (() => void)[] = [];
    $$('.magnetic').forEach(b => {
      const mv = (e: MouseEvent) => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5, ease: 'power3.out' }); };
      const lv = () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' });
      b.addEventListener('mousemove', mv); b.addEventListener('mouseleave', lv);
      cleanups.push(() => { b.removeEventListener('mousemove', mv); b.removeEventListener('mouseleave', lv); });
    });

    html.classList.add('cursor-on');
    const c = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    const dx = gsap.quickTo(dot, 'x', { duration: .12, ease: 'power3' }), dy = gsap.quickTo(dot, 'y', { duration: .12, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
    const mv = (e: MouseEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as Element;
      const media = t.closest<HTMLElement>('[data-cursor]');
      const link = t.closest('a, button, input, [role="button"]');
      c.classList.toggle('is-media', !!media);
      c.classList.toggle('is-link', !media && !!link);
      if (media) label.textContent = media.dataset.cursor;
    };
    const hide = () => gsap.to(c, { opacity: 0, duration: .2 }), show = () => gsap.to(c, { opacity: 1, duration: .2 });
    addEventListener('mousemove', mv); document.addEventListener('mouseover', over);
    document.addEventListener('mouseleave', hide); document.addEventListener('mouseenter', show);
    cleanups.push(() => { html.classList.remove('cursor-on'); removeEventListener('mousemove', mv); document.removeEventListener('mouseover', over); });
    return () => cleanups.forEach(f => f());
  });

  // Re-measure scroll triggers whenever the page height changes (fonts, late images, filters, hot reload).
  let lastH = document.body.scrollHeight, rt: ReturnType<typeof setTimeout>;
  new ResizeObserver(() => {
    const h = document.body.scrollHeight;
    if (Math.abs(h - lastH) < 2) return;
    lastH = h; clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  document.readyState === 'complete' ? ScrollTrigger.refresh() : addEventListener('load', () => ScrollTrigger.refresh());
}
