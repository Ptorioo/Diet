'use client';
import LoadingResults from '@/app/results/loading';
import ResultsList from '@/components/results/ResultsList';
import type { Restaurant, RestaurantsResponse } from '@/lib/types';
import { useUserLocation } from '@/lib/useUserLocation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Url } from 'next/dist/shared/lib/router/router';

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
      ? `?mlabel_id=${encodeURIComponent(preferenceId)}&method=walk,bicycle,transit&origin_lat=${lat}&origin_lng=${lon}`
      : `?mlabel_id=12&method=walk,bicycle,transit&origin_lat=${lat}&origin_lng=${lon}`;
  const res = await fetch(`${apiUrl}/api/restaurants/${query}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  const data = await res.json();
  // console.log('Fetched restaurants:', data);
  return data;
}

export default function ResultsClient({ searchParams }: ResultsPageProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [condition, setCondition] = useState<string>('');
  const [isBadWeather, setIsBadWeather] = useState<boolean>(false);
  const [isHotWeather, setIsHotWeather] = useState<boolean>(false);
  const [feelslike, setFeelslike] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { location, error } = useUserLocation();

  // render reselection button only when there are still 2+ preferences
  const [preferenceIsSingle, setPreferenceIsSingle] = useState<Boolean>(false);
  const [reselectionLink, setReselectionLink] = useState<String>("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const preference = searchParams.preference || '12';
        setPreferenceIsSingle((preference.split(',').length <= 1));
        
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
          is_bad_weather: false,
          is_hot_weather: false
        };
        setRestaurants(
          fetchedRestaurants.map((restaurant) => ({
            ...restaurant,
            eat_in: restaurant.eat_in || false,
            type: restaurant.type || preference,
            latitude: restaurant.latitude || 'Unknown Latitude',
            longitude: restaurant.longitude || 'Unknown Longitude',
            travel_time_walk: restaurant.travel_time_walk || 0,
            travel_time_bicycle: restaurant.travel_time_bicycle || 0,
            travel_time_transit: restaurant.travel_time_transit || 0,
            travel_time_drive: restaurant.travel_time_drive || 0, 
          }))
        );
        setCondition(fetchedWeather.conditions || 'Unknown');
        setIsBadWeather(fetchedWeather.is_bad_weather || false);
        setIsHotWeather(fetchedWeather.is_hot_weather || false);
        setFeelslike(fetchedWeather.feelslike || NaN);
        setReselectionLink(`/select-preferences?preference=${encodeURIComponent(preference)}`);
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
    <div>
      <ResultsList
        restaurants={restaurants}
        condition={condition}
        isBadWeather={isBadWeather}
        isHotWeather={isHotWeather}
        feelslike={feelslike}
      />

      {!preferenceIsSingle && (<div className="fixed top-3 right-3 z-50">
        <Button
          asChild
          className="
            bg-accent hover:bg-accent/90 text-accent-foreground 
            px-2 py-1 text-sm 
            md:px-4 md:py-3 md:text-base 
            rounded-full shadow-md 
            transition-transform hover:scale-105
          "
        >
          <Link href={reselectionLink as Url}>繼續縮小選擇</Link>
        </Button>
      </div>)}
    </div>
  );
}