import type { Restaurant } from '@/lib/types';
import RestaurantCard from './RestaurantCard';
import { AlertCircle, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ResultsListProps {
  restaurants: Restaurant[];
  weather: string;
  preference: string;
}

const ResultsList = ({ restaurants, weather, preference }: ResultsListProps) => {
  if (!restaurants || restaurants.length === 0) {
    return (
      <Alert variant="default" className="max-w-2xl mx-auto my-12 border-accent text-accent-foreground bg-accent/10">
        <AlertCircle className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">No Restaurants Found</AlertTitle>
        <AlertDescription>
          We couldn't find any restaurants matching your criteria for "{preference}" in "{weather}" conditions. Try a different preference!
        </AlertDescription>
      </Alert>
    );
  }

  // Sort by score, highest first
  const topPicksCount = 2; // Emphasize top 1 or 2

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 md:mb-12 text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Your Top Restaurant Picks!</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.id || restaurant.name} // Prefer ID if available
            restaurant={restaurant}
            isTopPick={index < topPicksCount}
            weather={weather}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
