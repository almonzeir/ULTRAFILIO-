'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/landing/hero';
import HowItWorks from '@/components/landing/how-it-works';
import TemplateGallery from '@/components/landing/template-gallery';
import Pricing from '@/components/landing/pricing';
import Testimonials from '@/components/landing/testimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      {/* Purple Gradient Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(139,92,246,0.15),_transparent_70%)]" />
      </div>

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <HowItWorks />
          <TemplateGallery />
          <Pricing />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </div>
  );
}
