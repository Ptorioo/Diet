"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center shadow-xl border-destructive bg-destructive/10">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 text-destructive mb-4">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-bold text-destructive">Oops! Something went wrong.</CardTitle>
          <CardDescription className="text-destructive/80 text-base mt-2">
            We encountered an issue while fetching restaurant recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === 'development' && error?.message && (
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-destructive/5 p-4 text-left text-sm text-destructive">
              {error.message}
            </pre>
          )}
          <Button
            onClick={() => reset()}
            variant="destructive"
            size="lg"
            className="mt-8 px-8 py-3 text-lg rounded-full shadow-md hover:bg-destructive/90"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
