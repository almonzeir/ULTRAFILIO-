'use client';

import Header from '@/components/layout/header';
import Pricing from '@/components/landing/pricing';
import Footer from '@/components/layout/footer';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#050A14]">
            <Header />
            <main className="pt-20">
                <Pricing />
            </main>
            <Footer />
        </div>
    );
}
