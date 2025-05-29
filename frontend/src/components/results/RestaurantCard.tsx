import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Restaurant } from '@/lib/types';
import { Star, Sun, CloudRain, Zap, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isTopPick: boolean;
  weather: string; // To give context for seating
}

const RestaurantCard = ({ restaurant, isTopPick, weather }: RestaurantCardProps) => {
  const weatherNorm = weather.toLowerCase(); //Normalized weather
  let seatingAdvantage = "";
  if (!restaurant.eat_in) {
    if (weatherNorm.includes("sunny") || weatherNorm.includes("clear") || weatherNorm.includes("breeze")) {
      seatingAdvantage = "Great outdoor seating for this weather!";
    } else if (weatherNorm.includes("rain") || weatherNorm.includes("drizzle")) {
      seatingAdvantage = "Has outdoor seating (check if covered).";
    }
  } else {
     if (weatherNorm.includes("rain") || weatherNorm.includes("drizzle")) {
      seatingAdvantage = "Cozy indoor seating, perfect for rainy days.";
    }
  }


  return (
    <Card className={cn(
      "overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl flex flex-col",
      isTopPick ? "border-2 border-primary bg-primary/5" : "bg-card"
    )}>
      <div className="relative w-full h-48 sm:h-56">
        <Image
          src={`https://placehold.co/600x400.png`}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        {isTopPick && (
          <Badge variant="default" className="absolute top-3 right-3 bg-accent text-accent-foreground shadow-md">
            <Zap className="w-4 h-4 mr-1" /> Top Pick
          </Badge>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">{restaurant.name}</CardTitle>
        {restaurant.type && <CardDescription className="text-sm text-muted-foreground">{restaurant.type}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <div className="flex items-center space-x-2 text-muted-foreground">
          {!restaurant.eat_in ? 
            <Sun className="w-5 h-5 text-green-600" /> : 
            <CloudRain className="w-5 h-5 text-blue-500" />
          }
          <span>{!restaurant.eat_in ? 'Outdoor Seating Available' : 'Indoor Seating'}</span>
        </div>
        {seatingAdvantage && <p className="text-xs text-primary">{seatingAdvantage}</p>}
        {restaurant.latitude !== undefined && restaurant.longitude !== undefined && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.name)}/@${Number(restaurant.latitude).toFixed(6)},${Number(restaurant.longitude).toFixed(6)},17z`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              {Number(restaurant.latitude).toFixed(4)}, {Number(restaurant.longitude).toFixed(4)}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
