import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
      <div className="absolute inset-0 opacity-50">
         <Image 
            src="https://placehold.co/1920x1080.png" // Generic food background
            alt="Assortment of delicious food" 
            layout="fill" 
            objectFit="cover" 
            className="opacity-20"
            priority
        />
      </div>
      <div className="container relative mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Diet
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
          Your next favorite meal, decided intelligently. Let us find the perfect restaurant for your cravings and today's weather.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105">
            <Link href="/select-preferences">Find My Next Meal</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
