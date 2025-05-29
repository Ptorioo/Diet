import { useEffect, useState } from 'react';

const DEFAULT_LOCATION = { lat: 25.0182544, lon: 121.5354438 };

export function useUserLocation() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setLocation(DEFAULT_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
        setLocation(DEFAULT_LOCATION);
      }
    );
  }, []);

  return { location, error };
}