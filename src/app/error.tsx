'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-destructive/10 p-3">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2 text-foreground">
                    Something went wrong!
                </h1>

                <p className="text-muted-foreground mb-6">
                    We encountered an unexpected error. Please try again.
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-6 p-4 bg-muted rounded-md text-left">
                        <p className="text-sm font-mono text-destructive break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex gap-3 justify-center">
                    <Button onClick={reset} variant="outline">
                        Try Again
                    </Button>
                    <Button onClick={() => window.location.href = '/'}>
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
