import type { LucideIcon } from 'lucide-react';

export interface Restaurant {
  id: string;
  name: string;
  eat_in: boolean;
  type: string; 
  latitude: string;
  longitude: string;
  score?: number; 
}

export interface RestaurantPreference {
  id: string;
  label_name: string;
  icon?: LucideIcon;
}
