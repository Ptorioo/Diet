"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RESTAURANT_TYPES } from '@/lib/mockData';
import type { RestaurantPreference } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const PreferenceCard = ({
  preference,
  isSelected,
  onSelect,
}: {
  preference: RestaurantPreference;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const Icon = preference.icon;
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isSelected ? "ring-2 ring-primary shadow-xl scale-105 border-primary" : "border-border hover:border-primary/50",
        "bg-card rounded-xl overflow-hidden"
      )}
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
        <Icon className={cn("h-12 w-12 mb-2", isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
        <span className={cn("text-lg font-medium", isSelected ? "text-primary" : "text-card-foreground")}>
          {preference.name}
        </span>
      </CardContent>
    </Card>
  );
};

const PreferenceSelector = () => {
  const [selectedPreferenceId, setSelectedPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSelectPreference = (id: string) => {
    setSelectedPreferenceId(id);
  };

  const handleSubmit = () => {
    if (selectedPreferenceId) {
      setIsLoading(true);
      const selectedPreference = RESTAURANT_TYPES.find(p => p.id === selectedPreferenceId);
      if (selectedPreference) {
        router.push(`/results?preference=${encodeURIComponent(selectedPreference.name)}`);
      } else {
        // Fallback or error handling if preference not found, though unlikely
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <h2 className="text-3xl font-bold text-center mb-4 text-foreground sm:text-4xl">
        What are you in the mood for?
      </h2>
      <p className="text-center text-muted-foreground mb-10 md:mb-12 max-w-xl mx-auto">
        Select a cuisine type. We'll use this to find the best spots near you.
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        {RESTAURANT_TYPES.map((preference) => (
          <PreferenceCard
            key={preference.id}
            preference={preference}
            isSelected={selectedPreferenceId === preference.id}
            onSelect={() => handleSelectPreference(preference.id)}
          />
        ))}
      </div>

      <div className="text-center">
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={!selectedPreferenceId || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Finding Restaurants...
            </>
          ) : (
            'Find Restaurants'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PreferenceSelector;
