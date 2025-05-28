import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RecommendedRestaurant } from '@/lib/types';
import { Star, Sun, CloudRain, Zap, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: RecommendedRestaurant;
  isTopPick: boolean;
  weather: string; // To give context for seating
}

const RestaurantCard = ({ restaurant, isTopPick, weather }: RestaurantCardProps) => {
  const weatherNorm = weather.toLowerCase(); //Normalized weather
  let seatingAdvantage = "";
  if (restaurant.hasOutdoorSeating) {
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
          src={restaurant.imageUrl || `https://placehold.co/600x400.png`}
          alt={restaurant.name}
          fill
          className="object-cover"
          data-ai-hint={restaurant.hint || "restaurant food"}
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
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span>{restaurant.rating.toFixed(1)} Rating</span>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          {restaurant.hasOutdoorSeating ? 
            <Sun className="w-5 h-5 text-green-600" /> : 
            <CloudRain className="w-5 h-5 text-blue-500" />
          }
          <span>{restaurant.hasOutdoorSeating ? 'Outdoor Seating Available' : 'Indoor Seating'}</span>
        </div>
        {seatingAdvantage && <p className="text-xs text-primary">{seatingAdvantage}</p>}
        {restaurant.address && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span>{restaurant.address}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 p-4">
        <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium text-muted-foreground">Score:</span>
            <span className="text-lg font-bold text-primary">{restaurant.score.toFixed(2)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;
