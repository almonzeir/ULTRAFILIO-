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
    <div className="flex flex-col min-h-dvh bg-[#0a0612] text-white relative selection:bg-white selection:text-black">
      {/* Purple Gradient Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(139,92,246,0.15),_transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      <div className="relative z-10">
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
    </div>
  );
}
