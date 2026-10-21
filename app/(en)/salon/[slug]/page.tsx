import SalonPage, { salonMetadata, salonSlugs } from '@/components/SalonPage';
import { DEFAULT_LOCALE } from '@/i18n/locales.mjs';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;
export const generateStaticParams = salonSlugs;
export const generateMetadata = async ({ params }: { params: Params }) => salonMetadata(DEFAULT_LOCALE, (await params).slug);

export default async function Page({ params }: { params: Params }) {
  return <SalonPage locale={DEFAULT_LOCALE} slug={(await params).slug} />;
}
