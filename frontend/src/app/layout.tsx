import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dietogether - Find Your Next Meal',
  description: 'Intelligent restaurant recommendations tailored to your cravings and the weather.',
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        GeistSans.variable
      )}>
        <div className="relative flex min-h-dvh flex-col bg-background">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
