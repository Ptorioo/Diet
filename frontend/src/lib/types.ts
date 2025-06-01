import type { LucideIcon } from 'lucide-react';

export interface TravelTimes {
  method: string;
  seconds: number;
}

export interface Restaurant {
  id: string;
  name: string;
  eat_in: boolean;
  type: string; 
  latitude: string;
  longitude: string;
  travel_times?: TravelTimes[];
  image?: string;
}

export interface RestaurantPreference {
  id: string;
  label_name: string;
  icon?: LucideIcon;
}

export interface WeatherConditions {
  temp: number;
  feelslike: number;
  humidity: number;
  conditions: string;
  icon: string;
}

export interface UserLocation {
  lat: number;
  lon: number;
}

export interface RestaurantsResponse {
  weather: WeatherConditions;
  restaurants: Restaurant[];
}