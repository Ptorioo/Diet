import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Restaurant } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CloudRain, Footprints, MapPin, Sun, Zap } from 'lucide-react';
import Image from 'next/image';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isTopPick: boolean;
  weather: string; // To give context for seating
}

const formatTravelTime = (seconds?: number) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) return null;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} min${mins !== 1 ? 's' : ''}${secs > 0 ? ` ${secs} sec${secs !== 1 ? 's' : ''}` : ''}`;
};

const RestaurantCard = ({ restaurant, isTopPick, weather }: RestaurantCardProps) => {
  const weatherNorm = weather.toLowerCase(); //Normalized weather
  let seatingAdvantage = "";
  if (!restaurant.eat_in) {
    if (weatherNorm.includes("rain") || weatherNorm.includes("drizzle")) {
      seatingAdvantage = "No indoor seating, might be troublesome for rainy days.";
    }
  }

  return (
    <Card className={cn(
      "overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl flex flex-col",
      isTopPick ? "border-2 border-primary bg-primary/5" : "bg-card"
    )}>
      <div className="relative w-full h-48 sm:h-56">
        <Image
          src={
            Math.random() < 0.001 // 0.1% chance to show Rickroll
              ? "https://media1.tenor.com/m/x8v1oNUOmg4AAAAC/rickroll-roll.gif"
              : restaurant.image || 'https://content.jerrymk.uk/-ikX37xTjNo'
          }
          alt={restaurant.name}
          fill
          className="object-cover"
          unoptimized
        />
        {isTopPick && (
          <Badge variant="default" className="absolute top-3 right-3 bg-accent text-accent-foreground shadow-md">
            <Zap className="w-4 h-4 mr-1" /> Top Pick
          </Badge>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">{restaurant.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <div className="flex items-center space-x-2 text-muted-foreground">
          {restaurant.eat_in ? 
            <Sun className="w-5 h-5 text-green-600" /> : 
            <CloudRain className="w-5 h-5 text-blue-500" />
          }
          <span>{restaurant.eat_in ? 'Indoor Seating Available' : 'Indoor Seating Not Available'}</span>
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
        {restaurant.travel_time_seconds !== undefined && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Footprints className="w-5 h-5" />
            <span className="font-semibold">{formatTravelTime(restaurant.travel_time_seconds)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
