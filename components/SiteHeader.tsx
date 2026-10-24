// The white header bar shared by the all-salons page and the salon profile page.
import { LOCALES } from '@/i18n/locales.mjs';
import { getT, localeHref } from '@/lib/i18n';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

type Props = {
  locale: string;
  active?: 'salons' | 'home';
  waHref: string;
  /** where each language link goes, e.g. the same page in another language */
  langHref: (code: string) => string;
};

export default function SiteHeader({ locale, active, waHref, langHref }: Props) {
  const t = getT(locale);
  const home = localeHref(locale);
  return (
    <header className="hdr dr-hdr">
      <div className="hdr__bar">
        <a className="hdr__logo" href={home} aria-label="TrimCircle home"><Logo label="TrimCircle — salons near you" /></a>
        <nav className="hdr__nav" aria-label="Main">
          <a href={home} aria-current={active === 'home' ? 'page' : undefined}>{t('dir.navHome')}</a>
          <a href={`${home}salons/`} aria-current={active === 'salons' ? 'page' : undefined}>{t('dir.navSalons')}</a>
          <a href={`${home}#cities`}>{t('dir.navCities')}</a>
        </nav>
        <div className="hdr__right">
          <ThemeToggle className="hdr__theme" toDark={t('common.themeDark')} toLight={t('common.themeLight')} />
          {LOCALES.filter(l => l.ready && l.code !== locale).map(l => (
            <a key={l.code} className="dr-lang" href={langHref(l.code)} hrefLang={l.hreflang} lang={l.hreflang}>{l.name}</a>
          ))}
          <a className="btn btn--accent btn--sm hdr__cta" href={waHref} target="_blank" rel="noopener">{t('dir.listCta')}</a>
        </div>
      </div>
    </header>
  );
}
