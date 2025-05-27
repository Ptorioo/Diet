import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingRestaurantCard = () => (
  <Card className="overflow-hidden shadow-lg rounded-xl flex flex-col">
    <Skeleton className="w-full h-48 sm:h-56" />
    <CardHeader className="pb-3">
      <Skeleton className="h-6 w-3/4 rounded" />
      <Skeleton className="h-4 w-1/2 mt-1 rounded" />
    </CardHeader>
    <CardContent className="flex-grow space-y-3">
      <Skeleton className="h-5 w-2/3 rounded" />
      <Skeleton className="h-5 w-3/5 rounded" />
      <Skeleton className="h-4 w-full rounded" />
    </CardContent>
    <CardFooter className="bg-muted/50 p-4">
      <div className="flex items-center justify-between w-full">
        <Skeleton className="h-5 w-1/4 rounded" />
        <Skeleton className="h-7 w-1/5 rounded" />
      </div>
    </CardFooter>
  </Card>
);

export default function LoadingResults() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 md:mb-12 text-center">
        <Skeleton className="h-10 w-3/4 sm:w-1/2 mx-auto rounded" />
        <Skeleton className="h-6 w-1/2 sm:w-1/3 mx-auto mt-3 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(3)].map((_, index) => (
          <LoadingRestaurantCard key={index} />
        ))}
      </div>
    </div>
  );
}
