// The footer shared by the home page and the all-salons page, so both look identical.
import { LOCALES } from '@/i18n/locales.mjs';
import { getT, localeHref } from '@/lib/i18n';
import { I } from './icons';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

type Props = {
  locale: string;
  nav: [string, string][];   // [message key under "nav", href]
  waHref: string;
  base?: string;             // prefix for same-page anchors when used on another page
};

export default function SiteFooter({ locale, nav, waHref, base = '' }: Props) {
  const t = getT(locale);
  const year = new Date().getFullYear();
  return (
    <footer className="ftr">
      <div className="ftr__top">
        <div className="ftr__brand">
          <Logo label="TrimCircle" />
          <p className="ftr__tag">{t('home2.footer.blurb')}</p>
        </div>
        <nav className="ftr__col" aria-label={t('footer.explore')}>
          <p className="ftr__h">{t('footer.explore')}</p>
          {nav.map(([k, h]) => <a key={k} href={h}>{t('nav.' + k)}</a>)}
        </nav>
        <div className="ftr__col">
          <p className="ftr__h">{t('footer.owners')}</p>
          <a href={waHref} target="_blank" rel="noopener">{t('footer.ownersLink')}</a>
          <a href={`${base}#salon-tools`}>{t('home2.tools.eyebrow')}</a>
          <a href={`${base}#owners`}>{t('nav.listCta')}</a>
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
  );
}
