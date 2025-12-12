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
        // FORCED DARK STYLING - always looks the same
        <div className="carousel-container relative w-full perspective-1000 bg-[#0a0a0f]">

            {/* Premium gradient background - always dark */}
            <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent to-indigo-900/20 pointer-events-none" />

            {/* Glowing orb effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {/* Side Navigation Arrows - Left */}
            <button
                className="swiper-button-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/60 backdrop-blur-xl text-white flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10 hover:border-white/40 shadow-2xl"
                aria-label="Previous slide"
            >
                <ChevronLeft size={28} />
            </button>

            {/* Side Navigation Arrows - Right */}
            <button
                className="swiper-button-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/60 backdrop-blur-xl text-white flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10 hover:border-white/40 shadow-2xl"
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
                    rotate: 50,
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
                        <div className="flex flex-col h-full overflow-hidden rounded-[24px] group relative">
                            {/* Glowing border effect */}
                            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-violet-500/30 via-transparent to-indigo-500/30 p-[1px]">
                                <div className="absolute inset-[1px] rounded-[23px] bg-[#0c0c12]" />
                            </div>

                            {/* Card content */}
                            <div className="relative z-10 flex flex-col h-full bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-[24px] overflow-hidden border border-white/10">
                                {/* Image Container */}
                                <div className="relative h-[320px] w-full overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Image overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />

                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-indigo-600/0 group-hover:from-violet-600/10 group-hover:to-indigo-600/10 transition-all duration-500" />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col items-center text-center relative">
                                    {/* Subtle top glow */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{item.name}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Bottom Pagination Dots */}
                <div className="flex items-center justify-center mt-10">
                    <div className="swiper-pagination !relative !bottom-auto !w-auto flex gap-2"></div>
                </div>
            </Swiper>
        </div>
    );
};

export default PortfolioCarousel;
