'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/landing/hero';
import HowItWorks from '@/components/landing/how-it-works';
import TemplateGallery from '@/components/landing/template-gallery';
import Pricing from '@/components/landing/pricing';
import Testimonials from '@/components/landing/testimonials';
import { useUser } from '@/hooks/useUser';

export default function Home() {
  const { user } = useUser();
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <TemplateGallery />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
