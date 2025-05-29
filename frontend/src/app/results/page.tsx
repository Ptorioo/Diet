import ResultsList from '@/components/results/ResultsList';
import { MOCK_WEATHER_CONDITIONS } from '@/lib/mockData';
import type { Restaurant } from '@/lib/types';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoadingResults from './loading'; // Ensure this component exists

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Results for you - Diet`,
    description: `Find the best based on your cravings and the weather.`,
  };
}

interface ResultsPageProps {
  searchParams: Promise<{
    preference?: string;
    latitude?: string;
    longitude?: string;
  }>;
}

// Helper to fetch restaurants filtered by preference from backend
async function fetchRestaurants(preferenceId: string): Promise<Restaurant[]> {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  const query = preferenceId && preferenceId !== '12'
    ? `?mlabel_id=${encodeURIComponent(preferenceId)}`
    : '';
  const res = await fetch(`${apiUrl}/api/restaurants${query}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  const data = await res.json();
  return data;
}

// Helper to fetch weather from API
async function fetchWeather(lat: string, lon: string): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_VISUALCROSSING_API_KEY;
    if (!apiKey) throw new Error('Missing Visual Crossing API key');
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(lat)},${encodeURIComponent(lon)}/today?unitGroup=metric&include=current,days&key=${apiKey}&contentType=json`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();

    return (
      data.currentConditions?.conditions ||
      data.days?.[0]?.conditions ||
      MOCK_WEATHER_CONDITIONS[0]
    );
  } catch (error) {
    console.error('Error fetching weather:', error);
    return MOCK_WEATHER_CONDITIONS[Math.floor(Math.random() * MOCK_WEATHER_CONDITIONS.length)];
  }
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const preference = params.preference || '12';
  const lat = params.latitude || '25.017329';
  const lon = params.longitude || '121.539752';

  const weather = await fetchWeather(lat, lon);

  let restaurants: Restaurant[] = [];
  try {
    restaurants = await fetchRestaurants(preference);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }

  restaurants = restaurants.map(restaurant => {
    return {
      ...restaurant,
      eat_in: restaurant.eat_in || false,
      type: restaurant.type || preference,
      latitude: restaurant.latitude || 'Unknown Latitude',
      longitude: restaurant.longitude || "Unknown Longitude",
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
