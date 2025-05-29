import type { RestaurantPreference } from './types';
import { Pizza, Coffee, Drumstick, Fish, Beef, Leaf, UtensilsCrossed } from 'lucide-react';

export const RESTAURANT_TYPES: RestaurantPreference[] = [
  { id: 'italian', name: 'Italian', icon: Pizza },
  { id: 'cafe', name: 'Cafe', icon: Coffee },
  { id: 'mexican', name: 'Mexican', icon: Drumstick },
  { id: 'sushi', name: 'Sushi', icon: Fish },
  { id: 'burgers', name: 'Burgers', icon: Beef },
  { id: 'healthy', name: 'Healthy', icon: Leaf },
  { id: 'any', name: 'Any Cuisine', icon: UtensilsCrossed },
];


export const MOCK_WEATHER_CONDITIONS: string[] = [
  "Sunny and warm",
  "Cloudy with a chance of rain",
  "Chilly and clear",
  "Pleasantly cool with a light breeze",
  "Hot and humid",
  "Light drizzle",
];
