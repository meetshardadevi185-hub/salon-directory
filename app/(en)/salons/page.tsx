import SalonsPage, { salonsMetadata } from '@/components/SalonsPage';
import { DEFAULT_LOCALE } from '@/i18n/locales.mjs';

export const metadata = salonsMetadata(DEFAULT_LOCALE);

export default function Page() {
  return <SalonsPage locale={DEFAULT_LOCALE} />;
}
