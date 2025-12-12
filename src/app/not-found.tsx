import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-muted p-4">
                        <FileQuestion className="h-16 w-16 text-muted-foreground" />
                    </div>
                </div>

                <h1 className="text-6xl font-bold mb-2 text-foreground">404</h1>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Page Not Found</h2>

                <p className="text-muted-foreground mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <Link href="/">
                    <Button size="lg">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
