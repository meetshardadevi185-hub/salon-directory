// Every other ready locale gets its own prefix: /hi/, /bn/, …
import type { ReactNode } from 'react';
import RootDocument, { buildMetadata } from '@/components/RootDocument';
import { READY, DEFAULT_LOCALE } from '@/i18n/locales.mjs';

type Params = Promise<{ locale: string }>;

export { viewport } from '@/components/RootDocument';
export const dynamicParams = false;
export const generateStaticParams = () => READY.filter(l => l.code !== DEFAULT_LOCALE).map(l => ({ locale: l.code }));
export const generateMetadata = async ({ params }: { params: Params }) => buildMetadata((await params).locale);

export default async function Layout({ children, params }: { children: ReactNode; params: Params }) {
  return <RootDocument locale={(await params).locale}>{children}</RootDocument>;
}
