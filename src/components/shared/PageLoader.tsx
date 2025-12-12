'use client';

import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
    message?: string;
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">{message}</p>
            </div>
        </div>
    );
}
