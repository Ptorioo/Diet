import type { Restaurant, RestaurantPreference, NearbyRestaurantInput } from './types';
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

export const MOCK_NEARBY_RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Bella Italia', rating: 4.5, hasOutdoorSeating: true, type: 'Italian', address: '123 Pasta Lane', imageUrl: 'https://placehold.co/600x400.png', hint: 'italian food' },
  { id: '2', name: 'The Cozy Cafe', rating: 4.2, hasOutdoorSeating: false, type: 'Cafe', address: '456 Coffee St', imageUrl: 'https://placehold.co/600x400.png', hint: 'cafe interior' },
  { id: '3', name: 'El Sombrero', rating: 4.0, hasOutdoorSeating: true, type: 'Mexican', address: '789 Taco Ave', imageUrl: 'https://placehold.co/600x400.png', hint: 'mexican cuisine' },
  { id: '4', name: 'Sushi World', rating: 4.8, hasOutdoorSeating: false, type: 'Sushi', address: '101 Fish Rd', imageUrl: 'https://placehold.co/600x400.png', hint: 'sushi platter' },
  { id: '5', name: 'Burger Palace', rating: 3.9, hasOutdoorSeating: true, type: 'Burgers', address: '202 Patty Blvd', imageUrl: 'https://placehold.co/600x400.png', hint: 'burger meal' },
  { id: '6', name: 'Green Leaf Eatery', rating: 4.6, hasOutdoorSeating: true, type: 'Healthy', address: '303 Salad Dr', imageUrl: 'https://placehold.co/600x400.png', hint: 'healthy salad' },
  { id: '7', name: 'Pasta Express', rating: 3.8, hasOutdoorSeating: false, type: 'Italian', address: '124 Pasta Lane', imageUrl: 'https://placehold.co/600x400.png', hint: 'pasta dish' },
  { id: '8', name: 'Morning Brew', rating: 4.1, hasOutdoorSeating: true, type: 'Cafe', address: '457 Coffee St', imageUrl: 'https://placehold.co/600x400.png', hint: 'coffee shop' },
  { id: '9', name: 'Taco Fiesta', rating: 4.3, hasOutdoorSeating: false, type: 'Mexican', address: '790 Taco Ave', imageUrl: 'https://placehold.co/600x400.png', hint: 'tacos' },
  { id: '10',name: 'General Chow', rating: 4.0, hasOutdoorSeating: false, type: 'Any Cuisine', address: '1 Diverse Street', imageUrl: 'https://placehold.co/600x400.png', hint: 'restaurant interior' },
];

// Helper to convert Restaurant[] to NearbyRestaurantInput[]
export const mapToNearbyRestaurantInput = (restaurants: Restaurant[], selectedType?: string): NearbyRestaurantInput[] => {
  const filteredRestaurants = selectedType && selectedType.toLowerCase() !== 'any cuisine'
    ? restaurants.filter(r => r.type.toLowerCase() === selectedType.toLowerCase() || r.type.toLowerCase() === 'any cuisine')
    : restaurants;
  
  return filteredRestaurants.map(r => ({
    name: r.name,
    rating: r.rating,
    hasOutdoorSeating: r.hasOutdoorSeating,
  }));
};


export const MOCK_WEATHER_CONDITIONS: string[] = [
  "Sunny and warm",
  "Cloudy with a chance of rain",
  "Chilly and clear",
  "Pleasantly cool with a light breeze",
  "Hot and humid",
  "Light drizzle",
];

export const mockDietaryRestrictions = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'ketogenic', label: 'Ketogenic' },
];
