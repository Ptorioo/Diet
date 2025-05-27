import HeroSection from '@/components/landing/HeroSection';
import FeatureCard from '@/components/landing/FeatureCard';
import { CheckCircle2, CloudSun, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground sm:text-4xl">
            Why Choose <span className="text-primary">Diet</span>?
          </h2>
          <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
            Discover a smarter way to dine. We blend your preferences with real-time conditions to suggest the perfect spot.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CheckCircle2 className="h-8 w-8" />}
              title="Smart Preferences"
              description="Quickly tell us what you're craving with our intuitive selection process."
            />
            <FeatureCard
              icon={<CloudSun className="h-8 w-8" />}
              title="Weather-Wise Picks"
              description="We consider current weather to enhance your dining experience, prioritizing comfort."
            />
            <FeatureCard
              icon={<Award className="h-8 w-8" />}
              title="Top-Notch Suggestions"
              description="Get curated restaurant recommendations, scored and ranked just for you."
            />
          </div>
        </div>
      </section>
    </>
  );
}
