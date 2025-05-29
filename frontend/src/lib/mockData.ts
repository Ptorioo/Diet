import type { RestaurantPreference } from './types';
import { Pizza, Coffee, Drumstick, Fish, Beef, Leaf, UtensilsCrossed } from 'lucide-react';

export const RESTAURANT_TYPES: RestaurantPreference[] = [
  { id: 'italian', label_name: 'Italian', icon: Pizza },
  { id: 'cafe', label_name: 'Cafe', icon: Coffee },
  { id: 'mexican', label_name: 'Mexican', icon: Drumstick },
  { id: 'sushi', label_name: 'Sushi', icon: Fish },
  { id: 'burgers', label_name: 'Burgers', icon: Beef },
  { id: 'healthy', label_name: 'Healthy', icon: Leaf },
  { id: 'any', label_name: 'Any Cuisine', icon: UtensilsCrossed },
];


export const MOCK_WEATHER_CONDITIONS: string[] = [
  "Sunny and warm",
  "Cloudy with a chance of rain",
  "Chilly and clear",
  "Pleasantly cool with a light breeze",
  "Hot and humid",
  "Light drizzle",
];
