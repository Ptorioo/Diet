import FeatureCard from '@/components/landing/FeatureCard';
import HeroSection from '@/components/landing/HeroSection';
import { Award, CheckCircle2, CloudSun } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground sm:text-4xl">
            為啥要用 <span className="text-primary">Dietogether</span>？
          </h2>
          <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
            吃飯也要聰明！即時取得你的位置與天氣狀況，帶你找最合拍的餐廳。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CheckCircle2 className="h-8 w-8" />}
              title="限時餐廳選擇"
              description="左滑右滑，隨你的直覺，快速找到您餐廳偏好！"
            />
            <FeatureCard
              icon={<CloudSun className="h-8 w-8" />}
              title="基於天氣推薦"
              description="下大雨？熱到爆？我們都幫您考慮進去了！"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8" />}
              title="超頂推薦結果"
              description="為您計算餐廳分數並得到最頂的餐廳排序！"
            />
          </div>
        </div>
      </section>
    </>
  );
}
