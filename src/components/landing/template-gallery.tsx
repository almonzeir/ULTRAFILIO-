import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MacbookFrame } from '@/components/shared/device-frames';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Eye } from 'lucide-react';

const templates = [
  {
    key: 'modern',
    name: 'Modern (Apple Noir)',
    description: 'Bold hero, asymmetry, animated cards',
    imageId: 'template-modern',
  },
  {
    key: 'minimalist',
    name: 'Minimalist (Apple Light)',
    description: 'Typography-first, ultra-white canvas',
    imageId: 'template-minimalist',
  },
  {
    key: 'basic',
    name: 'Basic (Editorial)',
    description: 'Clean resume-like column layout',
    imageId: 'template-basic',
  },
];

export default function TemplateGallery() {
  return (
    <section className="py-24 sm:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Choose Your Style</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Select from our professionally designed, Apple-inspired templates.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const image = PlaceHolderImages.find(p => p.id === template.imageId);
            return (
              <Card key={template.key} className="group relative overflow-hidden bg-card text-card-foreground border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="overflow-hidden rounded-lg">
                    <MacbookFrame>
                      {image && (
                         <Image
                            src={image.imageUrl}
                            alt={image.description}
                            data-ai-hint={image.imageHint}
                            width={1200}
                            height={800}
                            className="rounded-md transition-transform duration-500 group-hover:scale-105"
                          />
                      )}
                    </MacbookFrame>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg font-headline">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  </div>
                </CardContent>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="lg" variant="secondary">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
