import { Utensils } from 'lucide-react';
import Link from 'next/link';

const AppLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <Utensils className="h-7 w-7" />
      <span className="text-2xl font-bold tracking-tight">Dietogether</span>
    </Link>
  );
};

export default AppLogo;
