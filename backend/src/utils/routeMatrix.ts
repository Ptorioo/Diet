// src/utils/routeMatrix.ts

import axios from 'axios';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const url = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';

const getTravelTimes = async (
  origin: { latitude: number; longitude: number },
  destinations: Array<{ latitude: number; longitude: number }>,
  travelMode: 'WALK' | 'DRIVE' | 'BICYCLE' | 'TRANSIT' = 'WALK',
  routingPreference: 'TRAFFIC_AWARE' | 'TRAFFIC_UNAWARE' | 'ROUTING_PREFERENCE_UNSPECIFIED' = 'ROUTING_PREFERENCE_UNSPECIFIED',
  units: 'METRIC' | 'IMPERIAL' = 'METRIC'
): Promise<any[]> => {
  if (!API_KEY) throw new Error('Missing Google Maps API key');

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters'
  };

  const data = {
    origins: [
      {
        waypoint: {
          location: { latLng: origin }
        }
      }
    ],
    destinations: destinations.map(dest => ({
      waypoint: {
        location: { latLng: dest }
      }
    })),
    travelMode,
    routingPreference,
    units,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data; // array of { originIndex, destinationIndex, duration, distanceMeters }
  } catch (error: any) {
    console.error('Error fetching route matrix:', error.response?.data || error.message);
    throw new Error('Failed to compute route matrix');
  }
};

export default getTravelTimes;
