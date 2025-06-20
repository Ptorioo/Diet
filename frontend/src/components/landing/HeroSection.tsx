import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
      <div className="absolute inset-0 opacity-50">
         <Image 
            src="https://content.jerrymk.uk/-AzkLRnW2n2"
            alt="Assortment of delicious food"
            fill
            className="opacity-20 object-cover"
            priority
        />
      </div>
      <div className="container relative mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Dietogether
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
          又犯餐廳選擇障礙了？ <br></br>
          用交通時間和天氣幫你做出選擇，下一餐不用再煩惱！
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105">
            <Link href="/select-preferences-demo">那麼，吃啥好呢？</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
