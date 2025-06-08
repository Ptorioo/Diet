import type { LucideIcon } from 'lucide-react';

export interface Restaurant {
  id: string;
  name: string;
  eat_in: boolean;
  type: string; 
  latitude: string;
  longitude: string;
  travel_time_walk?: number;
  travel_time_bicycle?: number;
  travel_time_transit?: number;
  travel_time_drive?: number;
  image?: string;
  traffic_cost?: number;
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
  is_bad_weather: boolean;
  is_hot_weather: boolean;
}

export interface UserLocation {
  lat: number;
  lon: number;
}

export interface RestaurantsResponse {
  weather: WeatherConditions;
  restaurants: Restaurant[];
}