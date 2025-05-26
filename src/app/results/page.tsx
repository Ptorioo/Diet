import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getWeatherAwareRecommendations, type WeatherAwareRecommendationsOutput } from '@/ai/flows/weather-aware-recommendations';
import { MOCK_NEARBY_RESTAURANTS, MOCK_WEATHER_CONDITIONS, mapToNearbyRestaurantInput } from '@/lib/mockData';
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
  const mockWeather = MOCK_WEATHER_CONDITIONS[Math.floor(Math.random() * MOCK_WEATHER_CONDITIONS.length)];

  const nearbyRestaurantInputs = mapToNearbyRestaurantInput(MOCK_NEARBY_RESTAURANTS, preference);

  let recommendations: WeatherAwareRecommendationsOutput = [];
  try {
    if (nearbyRestaurantInputs.length > 0) {
        recommendations = await getWeatherAwareRecommendations({
        restaurantType: preference,
        weatherDescription: mockWeather,
        nearbyRestaurants: nearbyRestaurantInputs,
      });
    } else {
      // If no restaurants of the selected type are available.
      // This case might be hit if mapToNearbyRestaurantInput filters aggressively and returns empty.
      // It might also return empty if its internal logic finds nothing.
      recommendations = [];
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // Handle error state, perhaps show an error message component
    // For now, recommendations will be an empty array, handled by ResultsList
  }

  // Augment recommendations with additional details from mock data if needed
  const augmentedRecommendations: RecommendedRestaurant[] = recommendations.map(rec => {
    const originalRestaurant = MOCK_NEARBY_RESTAURANTS.find(r => r.name === rec.name);
    return {
      ...rec,
      id: originalRestaurant?.id,
      type: originalRestaurant?.type || preference,
      address: originalRestaurant?.address,
      imageUrl: originalRestaurant?.imageUrl,
      hint: originalRestaurant?.hint,
    };
  });

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
