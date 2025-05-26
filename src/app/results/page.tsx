import { Suspense } from 'react';
import type { Metadata } from 'next';
import { MOCK_NEARBY_RESTAURANTS, MOCK_WEATHER_CONDITIONS } from '@/lib/mockData';
import type { RecommendedRestaurant } from '@/lib/types';
import ResultsList from '@/components/results/ResultsList';
import LoadingResults from './loading'; // Ensure this component exists

export async function generateMetadata({ searchParams }: { searchParams: { preference?: string } }): Promise<Metadata> {
  const preference = searchParams.preference || 'restaurants';
  return {
    title: `Results for ${preference} - Diet`,
    description: `Find the best ${preference} based on your cravings and the weather.`,
  };
}

interface ResultsPageProps {
  searchParams: {
    preference?: string;
  };
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const preference = searchParams.preference || 'Any Cuisine'; // Default to 'Any Cuisine' if not specified
  
  // Simulate picking a random weather condition
  const mockWeather = MOCK_WEATHER_CONDITIONS[Math.floor(Math.random() * MOCK_WEATHER_CONDITIONS.length)]; // Keep for display
  const augmentedRecommendations: RecommendedRestaurant[] = MOCK_NEARBY_RESTAURANTS.map(rec => ({
    ...rec,
    type: rec.type || preference,
    address: rec.address,
    imageUrl: rec.imageUrl,
    hint: rec.hint,
    score: rec.score !== undefined ? rec.score : 0,
  }));

  return (
    <Suspense fallback={<LoadingResults />}>
      <ResultsList
        restaurants={augmentedRecommendations}
        weather={mockWeather}
        preference={preference}
      />
    </Suspense>
  );
}

// Add a check for dynamic rendering, though App Router handles this well.
export const dynamic = 'force-dynamic';
