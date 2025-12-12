'use client';

import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DemoPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12">
                <div className="mb-8">
                    <Button asChild variant="ghost" className="mb-4">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <h1 className="text-4xl font-bold font-display tracking-tight mb-4">
                        Example Portfolios
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Check out these stunning portfolios created with UltraFolio.
                        Yours could be next!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Placeholder for demo items */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-muted-foreground font-medium">Demo Portfolio {i}</p>
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="secondary">View Live</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
