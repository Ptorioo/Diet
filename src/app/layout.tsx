import type {Metadata} from 'next';
import {GeistSans} from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Diet - Find Your Next Meal',
  description: 'Intelligent restaurant recommendations tailored to your cravings and the weather.',
  manifest: '/manifest.json', // Assuming PWA manifest might be added later
  icons: {
    apple: '/apple-icon.png', // Assuming PWA icons might be added later
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
