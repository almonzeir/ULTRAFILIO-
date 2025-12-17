'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './portfolio-carousel.css';

interface Template {
    key: string;
    name: string;
    description: string;
    image: string;
}

interface PortfolioCarouselProps {
    items: Template[];
}

const PortfolioCarousel = ({ items }: PortfolioCarouselProps) => {
    return (
        // AMAZING DARK GREY THEME
        <div className="carousel-container relative w-full perspective-1000 bg-[#0a0a0a]">

            {/* Premium cinematic background - Deep Grey/Black Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-[#050505] to-black pointer-events-none" />

            {/* Subtle Ambient Lighting - Cool Silver/White instead of Purple */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-neutral-800/[0.05] blur-[120px] rounded-full pointer-events-none" />

            {/* Refined Grid Pattern - Sharp and Technical */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Side Navigation Arrows - Left */}
            <button
                className="swiper-button-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10 hover:border-white/30 shadow-2xl"
                aria-label="Previous slide"
            >
                <ChevronLeft size={28} />
            </button>

            {/* Side Navigation Arrows - Right */}
            <button
                className="swiper-button-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10 hover:border-white/30 shadow-2xl"
                aria-label="Next slide"
            >
                <ChevronRight size={28} />
            </button>

            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 35, // Slightly reduced rotation for a cleaner look
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: true,
                }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className="swiper_container"
            >
                {items.map((item) => (
                    <SwiperSlide key={item.key}>
                        <div className="flex flex-col h-full overflow-hidden rounded-[24px] group relative shadow-2xl shadow-black/50">
                            {/* Premium Metallic Border Effect */}
                            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/20 via-white/5 to-white/10 p-[1px]">
                                <div className="absolute inset-[1px] rounded-[23px] bg-[#0c0c0c]" />
                            </div>

                            {/* Card content */}
                            <div className="relative z-10 flex flex-col h-full bg-[#0c0c0c] rounded-[24px] overflow-hidden">
                                {/* Image Container */}
                                <div className="relative h-[320px] w-full overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Cinematic Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-80" />

                                    {/* Silver Glint on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col items-center text-center relative mt-[-20px]">
                                    {/* Separator Accent */}
                                    <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />

                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide font-headline">{item.name}</h3>
                                    <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed font-light">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Bottom Pagination Dots */}
                <div className="flex items-center justify-center mt-12 pb-8">
                    <div className="swiper-pagination !relative !bottom-auto !w-auto flex gap-3"></div>
                </div>
            </Swiper>
        </div>
    );
};

export default PortfolioCarousel;
