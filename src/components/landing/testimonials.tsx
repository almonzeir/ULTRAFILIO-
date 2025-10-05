'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { useEffect, useState, useRef } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function Testimonials() {
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['testimonials'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.testimonials);
    };
    fetchDictionary();
  }, [language]);

  if (!dict) {
    return (
      <section className="py-24 sm:py-32 bg-foreground text-background dark:bg-white dark:text-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="h-8 w-48 mx-auto bg-gray-600/30 rounded animate-pulse" />
            <div className="h-6 w-80 mx-auto mt-6 bg-gray-500/30 rounded animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const testimonialsData = [
    {
      quote: dict.testimonial1.quote,
      name: 'Sarah K.',
      title: dict.testimonial1.title,
      avatarId: 'testimonial-avatar-1',
    },
    {
      quote: dict.testimonial2.quote,
      name: 'Alex D.',
      title: dict.testimonial2.title,
      avatarId: 'testimonial-avatar-2',
    },
    {
      quote: dict.testimonial3.quote,
      name: 'Fatima A.',
      title: dict.testimonial3.title,
      avatarId: 'testimonial-avatar-3',
    },
    {
      quote: dict.testimonial4.quote,
      name: 'Kenji T.',
      title: dict.testimonial4.title,
      avatarId: 'testimonial-avatar-4',
    },
    {
      quote: dict.testimonial5.quote,
      name: 'Maria G.',
      title: dict.testimonial5.title,
      avatarId: 'testimonial-avatar-5',
    },
    {
      quote: dict.testimonial6.quote,
      name: 'David L.',
      title: dict.testimonial6.title,
      avatarId: 'testimonial-avatar-6',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-foreground text-background dark:bg-white dark:text-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">{dict.title}</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground dark:text-gray-600">
            {dict.subtitle}
          </p>
        </div>

        <Swiper
          key={language} // Re-initialize on language change to apply direction
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="w-full mt-16"
        >
          {testimonialsData.map((testimonial, index) => {
            const avatar = PlaceHolderImages.find((p) => p.id === testimonial.avatarId);
            return (
              <SwiperSlide key={index} className="h-full">
                <Card className="flex flex-col h-full bg-card text-card-foreground border-border/50">
                  <CardContent className="flex flex-col flex-grow p-6 text-left rtl:text-right">
                    <blockquote className="flex-grow text-lg leading-7 tracking-tight text-card-foreground">
                      <p>“{testimonial.quote}”</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      {avatar && (
                        <Image
                          className="h-12 w-12 rounded-full bg-muted object-cover"
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
