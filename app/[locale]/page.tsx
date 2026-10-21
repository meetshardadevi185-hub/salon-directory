import HomePage from '@/components/HomePage';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <HomePage locale={(await params).locale} />;
}
