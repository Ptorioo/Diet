'use client';
import ResultsList from '@/components/results/ResultsList';
import { MOCK_WEATHER_CONDITIONS } from '@/lib/mockData';
import type { Restaurant } from '@/lib/types';
import { Suspense, useEffect, useState } from 'react';
import LoadingResults from './loading';
import { useUserLocation } from '@/lib/useUserLocation';

interface ResultsPageProps {
  searchParams: Promise<{
    preference?: string;
  }>;
}

// Helper to fetch restaurants filtered by preference from backend
async function fetchRestaurants(
  preferenceId: string,
  lat: number,
  lon: number
): Promise<Restaurant[]> {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  const query =
    preferenceId && preferenceId !== '12'
      ? `?mlabel_id=${encodeURIComponent(preferenceId)}&method=walk&origin_lat=${lat}&origin_lng=${lon}`
      : 'mlabel_id=12';
  const res = await fetch(`${apiUrl}/api/restaurants/${query}`, { cache: 'no-store' });
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
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
      lat
    )},${encodeURIComponent(
      lon
    )}/today?unitGroup=metric&include=current,days&key=${apiKey}&contentType=json`;

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

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [weather, setWeather] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { location, error } = useUserLocation();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = await searchParams;
        const preference = params.preference || '12';
        if (!location) return;
        const fetchedRestaurants = await fetchRestaurants(preference, location.lat, location.lon);
        setRestaurants(
          fetchedRestaurants.map((restaurant) => ({
            ...restaurant,
            eat_in: restaurant.eat_in || false,
            type: restaurant.type || preference,
            latitude: restaurant.latitude || 'Unknown Latitude',
            longitude: restaurant.longitude || 'Unknown Longitude',
          }))
        );
        const fetchedWeather = await fetchWeather(location.lat.toString(), location.lon.toString());
        setWeather(fetchedWeather);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (location) {
      fetchData();
    }
  }, [location, searchParams]);

  if (error) return <div>Error: {error}</div>;
  if (!location || loading) return <LoadingResults />;

  const params = { preference: '12' }; // fallback if needed

  return (
    <Suspense fallback={<LoadingResults />}>
      <ResultsList
        restaurants={restaurants}
        weather={weather}
        preference={params.preference}
      />
    </Suspense>
  );
}

// Add a check for dynamic rendering, though App Router handles this well.
export const dynamic = 'force-dynamic';