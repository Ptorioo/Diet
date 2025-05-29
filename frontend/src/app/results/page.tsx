import ResultsClient from '@/components/results/ResultsClient';

export const dynamic = 'force-dynamic';

interface ResultsPageProps {
  searchParams: Promise<{
    preference?: string;
  }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <ResultsClient searchParams={resolvedSearchParams} />
  );
}