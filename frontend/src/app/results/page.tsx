import ResultsList from '@/components/results/ResultsList';
import { MOCK_WEATHER_CONDITIONS } from '@/lib/mockData';
import type { RecommendedRestaurant } from '@/lib/types';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoadingResults from './loading'; // Ensure this component exists

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ preference?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const preference = params.preference || 'restaurants';
  return {
    title: `Results for ${preference} - Diet`,
    description: `Find the best ${preference} based on your cravings and the weather.`,
  };
}

interface ResultsPageProps {
  searchParams: Promise<{
    preference?: string;
  }>;
}

// Helper to fetch restaurants filtered by preference from backend
async function fetchRestaurants(preference: string): Promise<RecommendedRestaurant[]> {
  const apiUrl = process.env.APP_API_URL;
  // Add filter param only if preference exists and is not 'Any Cuisine'
  const query = preference && preference !== 'Any Cuisine' ? `?cuisine=${encodeURIComponent(preference.toLowerCase())}` : '';
  const res = await fetch(`${apiUrl}/api/restaurants${query}`, { cache: 'no-store' }); // no-store to avoid caching in dev
  if (!res.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  const data = await res.json();
  console.log(`Fetched restaurants for preference "${preference}":`, data); // Debug log
  return data;
}

// Helper to fetch weather from backend
async function fetchWeather(apiUrl: string): Promise<string> {
  try {
    const res = await fetch(`${apiUrl}/api/weather`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();
    // Assume API returns { condition: "Sunny" }
    return data.condition || MOCK_WEATHER_CONDITIONS[0];
  } catch (error) {
    console.error('Error fetching weather:', error);
    // Fallback to random mock weather
    return MOCK_WEATHER_CONDITIONS[Math.floor(Math.random() * MOCK_WEATHER_CONDITIONS.length)];
  }
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const preference = params.preference || 'Any Cuisine';

  const apiUrl = process.env.APP_API_URL;
  // Fetch weather from API, fallback to mock if unavailable
  const weather = apiUrl
    ? await fetchWeather(apiUrl)
    : MOCK_WEATHER_CONDITIONS[Math.floor(Math.random() * MOCK_WEATHER_CONDITIONS.length)];

  let restaurants: RecommendedRestaurant[] = [];
  try {
    restaurants = await fetchRestaurants(preference);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }

  restaurants = restaurants.map(restaurant => {
    return {
      ...restaurant,
      rating: 5,
      hasOutdoorSeating: false,
      type: restaurant.type || preference,
      address: restaurant.address || 'Unknown Address',
      image_url: restaurant.imageUrl || "https://placehold.co/600x400.png",
      hint: restaurant.hint || 'No additional information available',
      score: restaurant.score !== undefined ? restaurant.score : 0,
    };
  });

  return (
    <Suspense fallback={<LoadingResults />}>
      <ResultsList
        restaurants={restaurants}
        weather={weather}
        preference={preference}
      />
    </Suspense>
  );
}

// Add a check for dynamic rendering, though App Router handles this well.
export const dynamic = 'force-dynamic';
