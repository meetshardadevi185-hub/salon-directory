import SalonsPage, { salonsMetadata } from '@/components/SalonsPage';

type Params = Promise<{ locale: string }>;

export const generateMetadata = async ({ params }: { params: Params }) => salonsMetadata((await params).locale);

export default async function Page({ params }: { params: Params }) {
  return <SalonsPage locale={(await params).locale} />;
}
