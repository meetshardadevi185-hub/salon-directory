import SalonPage, { salonMetadata, salonSlugs } from '@/components/SalonPage';

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;
export const generateStaticParams = salonSlugs;
export const generateMetadata = async ({ params }: { params: Params }) => { const p = await params; return salonMetadata(p.locale, p.slug); };

export default async function Page({ params }: { params: Params }) {
  const p = await params;
  return <SalonPage locale={p.locale} slug={p.slug} />;
}
