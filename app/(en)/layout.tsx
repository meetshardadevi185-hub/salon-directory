// English lives at the site root: /
import type { ReactNode } from 'react';
import RootDocument, { buildMetadata } from '@/components/RootDocument';
import { DEFAULT_LOCALE } from '@/i18n/locales.mjs';

export { viewport } from '@/components/RootDocument';
export const metadata = buildMetadata(DEFAULT_LOCALE);

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument locale={DEFAULT_LOCALE}>{children}</RootDocument>;
}
