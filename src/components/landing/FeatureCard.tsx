import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactElement } from 'react';

interface FeatureCardProps {
  icon: ReactElement;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader className="pb-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
