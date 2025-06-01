'use client';
import LoadingResults from '@/app/results/loading';
import ResultsList from '@/components/results/ResultsList';
import type { Restaurant, RestaurantsResponse } from '@/lib/types';
import { useUserLocation } from '@/lib/useUserLocation';
import { useEffect, useState } from 'react';

const DEFAULT_LOCATION = { lat: 25.0182544, lon: 121.5354438 };

interface ResultsPageProps {
  searchParams: {
    preference?: string;
  };
}

// Helper to fetch restaurants filtered by preference from backend
async function fetchRestaurants(
  preferenceId: string,
  lat: number,
  lon: number
): Promise<RestaurantsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  const query =
    preferenceId && preferenceId !== '12'
      ? `?mlabel_id=${encodeURIComponent(preferenceId)}&method=walk,bicycle&origin_lat=${lat}&origin_lng=${lon}`
      : `?mlabel_id=12&method=walk,bicycle&origin_lat=${lat}&origin_lng=${lon}`;
  const res = await fetch(`${apiUrl}/api/restaurants/${query}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  const data = await res.json();
  console.log('Fetched restaurants:', data);
  return data;
}

export default function ResultsClient({ searchParams }: ResultsPageProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [condition, setCondition] = useState<string>('');
  const [feelslike, setFeelslike] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { location, error } = useUserLocation();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const preference = searchParams.preference || '12';
        const coords = error ? DEFAULT_LOCATION : location;
        if (!coords) return;
        const response = await fetchRestaurants(preference, coords.lat, coords.lon);
        const fetchedRestaurants = response.restaurants || [];
        const fetchedWeather = response.weather || {
          temp: 0,
          feelslike: 0,
          humidity: 0,
          conditions: 'Unknown',
          icon: 'unknown',
        };
        setRestaurants(
          fetchedRestaurants.map((restaurant) => ({
            ...restaurant,
            eat_in: restaurant.eat_in || false,
            type: restaurant.type || preference,
            latitude: restaurant.latitude || 'Unknown Latitude',
            longitude: restaurant.longitude || 'Unknown Longitude',
            travel_time_seconds: restaurant.travel_time_seconds || 0,
          }))
        );
        setCondition(fetchedWeather.conditions || 'Unknown');
        setFeelslike(fetchedWeather.feelslike || NaN);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (location || error) {
      fetchData();
    }
  }, [location, error, searchParams]);

  if (loading) return <LoadingResults />;

  return (
    <ResultsList
      restaurants={restaurants}
      condition={condition}
      feelslike={feelslike}
    />
  );
}