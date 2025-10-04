import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonialsData = [
  {
    quote: "UltraFolio is a game-changer. I had a stunning portfolio live in 15 minutes without writing a single line of code. The templates are absolutely beautiful.",
    name: "Sarah K.",
    title: "UX Designer",
    avatarId: "testimonial-avatar-1",
  },
  {
    quote: "As a developer, I appreciate good design. UltraFolio delivers an Apple-level experience. The ability to download the code is a huge plus for me.",
    name: "Alex D.",
    title: "Full-Stack Engineer",
    avatarId: "testimonial-avatar-2",
  },
  {
    quote: "The Arabic language support with proper RTL is fantastic. It's rare to see this level of quality and attention to detail for a global audience.",
    name: "Fatima A.",
    title: "Product Manager",
    avatarId: "testimonial-avatar-3",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Loved by Creatives & Developers</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Don't just take our word for it. Here's what people are saying about UltraFolio.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root">
          <div className="-mt-8 sm:-mx-4 sm:pl-4">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonialsData.map((testimonial) => {
                const avatar = PlaceHolderImages.find(p => p.id === testimonial.avatarId);
                return (
                  <Card key={testimonial.name} className="pt-8 bg-card text-card-foreground border-border/50">
                    <CardContent>
                      <blockquote className="text-lg leading-7 tracking-tight text-card-foreground">
                        <p>“{testimonial.quote}”</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        {avatar && (
                           <Image
                            className="h-12 w-12 rounded-full bg-muted"
                            src={avatar.imageUrl}
                            alt={testimonial.name}
                            data-ai-hint={avatar.imageHint}
                            width={48}
                            height={48}
                          />
                        )}
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                        </div>
                      </figcaption>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
