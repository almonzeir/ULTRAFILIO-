import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MacbookFrame } from '@/components/shared/device-frames';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-device-mockup');

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative container mx-auto px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
            Turn Your Resume into a Stunning Portfolio
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            UltraFolio instantly transforms your CV into a beautiful, professional website. No coding required.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg">Get Started for Free</Button>
            <Button size="lg" variant="outline">
              Live Demo
            </Button>
          </div>
        </div>
        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-muted/10 p-2 ring-1 ring-inset ring-foreground/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <MacbookFrame>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={1200}
                  height={800}
                  className="rounded-md"
                />
              )}
            </MacbookFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
