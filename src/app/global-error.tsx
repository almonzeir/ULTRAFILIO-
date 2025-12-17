'use client';

import * as React from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Something went wrong!
                    </h1>
                    <p className="mt-4 text-base text-muted-foreground">
                        {error.message || 'An unexpected error has occurred.'}
                    </p>
                    <button
                        onClick={() => reset()}
                        className="mt-8 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
