import type { LucideIcon } from 'lucide-react';

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  hasOutdoorSeating: boolean;
  type: string; 
  address: string; 
  imageUrl: string;
  hint?: string; // For placeholder images
  // Properties from WeatherAwareRecommendationsOutput if different
  score?: number; 
}

export interface RestaurantPreference {
  id: string;
  name: string;
  icon: LucideIcon;
}

// This matches the input structure for nearbyRestaurants
export interface NearbyRestaurantInput {
  name: string;
  rating: number;
  hasOutdoorSeating: boolean;
}

// This matches the output structure
export interface RecommendedRestaurant {
  name: string;
  rating: number;
  hasOutdoorSeating: boolean;
  score: number;
  // Potentially add other fields from the original Restaurant type if needed
  id?: string; 
  type?: string;
  address?: string;
  imageUrl?: string;
  hint?: string;
}
