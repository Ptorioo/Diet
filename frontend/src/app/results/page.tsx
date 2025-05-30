import ResultsClient from '@/components/results/ResultsClient';

export const dynamic = 'force-dynamic';

interface ResultsPageProps {
  searchParams: Promise<{
    preference?: string;
  }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  try {
    const resolvedSearchParams = await searchParams;
    return <ResultsClient searchParams={resolvedSearchParams} />;
  } catch (error) {
    console.error('Failed to resolve search params:', error);
    return <div>Error loading results</div>;
  }
}