import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Restaurant } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import RestaurantCard from './RestaurantCard';

interface ResultsListProps {
  restaurants: Restaurant[];
  condition: string;
  feelslike: number;
}

const ResultsList = ({ restaurants, condition, feelslike }: ResultsListProps) => {
  if (!restaurants || restaurants.length === 0) {
    return (
      <Alert variant="default" className="max-w-2xl mx-auto my-12 border-accent text-accent-foreground bg-accent/10">
        <AlertCircle className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">No Restaurants Found</AlertTitle>
        <AlertDescription>
          找不到餐廳... 請換一個餐廳類別再試一次 🔍
        </AlertDescription>
      </Alert>
    );
  }

  // Sort by score, highest first
  const topPicksCount = 2; // Emphasize top 1 or 2
  const weatherNorm = condition.toLowerCase();
  const rainyWeather = (weatherNorm.includes("rain") || weatherNorm.includes("drizzle"))
  const hotWeather = (feelslike > 30)

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 md:mb-12 text-center">
        <h3 className="text-2xl text-foreground sm:text-2xl">
          今天{
            rainyWeather? "陰陰雨雨，讓人懶得出門 ☔" : (
              hotWeather? `熱爆，體感溫度高達${feelslike}° 🌡️` :
              "還算舒適，沒雨又不熱 ☺️"
            )
          }
        </h3>
        <br></br>
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          考量交通時間與天氣，為您推薦以下餐廳！
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.id || restaurant.name} // Prefer ID if available
            restaurant={restaurant}
            isTopPick={index < topPicksCount}
            weather={condition}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
