'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Template {
    key: string;
    name: string;
    description: string;
    image: string;
}

interface Carousel3DProps {
    items: Template[];
}

export default function Carousel3D({ items }: Carousel3DProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    return (
        <div
            className="relative w-full h-[800px] flex flex-col items-center justify-center [perspective:1000px] overflow-hidden bg-[#fafafa] dark:bg-[#030303]"
        >
            {/* Background Grain */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-neutral-200 dark:bg-neutral-800 opacity-[0.05] blur-[150px] rounded-full pointer-events-none" />

            {/* Carousel Container */}
            <div className="relative w-full max-w-6xl h-[600px] flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                    {items.map((item, index) => {
                        // Calculate distance accounting for wrap-around
                        let offset = index - activeIndex;
                        if (offset > items.length / 2) offset -= items.length;
                        if (offset < -items.length / 2) offset += items.length;

                        const isActive = offset === 0;

                        // We hide items far away
                        if (Math.abs(offset) > 1 && !isActive) return null;

                        return (
                            <motion.div
                                key={item.key}
                                className="absolute w-[340px] md:w-[500px] aspect-[4/5] glass-surface !p-2 border-white/40 dark:border-white/20 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
                                initial={false}
                                animate={{
                                    scale: isActive ? 1 : 0.85,
                                    opacity: isActive ? 1 : 0.4,
                                    x: isActive ? 0 : offset > 0 ? 80 : -80,
                                    z: isActive ? 0 : -200,
                                    rotateY: isActive ? 0 : offset > 0 ? -35 : 35,
                                    zIndex: isActive ? 10 : 5,
                                    filter: isActive ? 'brightness(1)' : 'brightness(0.4)',
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 180,
                                    damping: 25,
                                }}
                            >
                                {/* Card Content */}
                                <div className="flex flex-col h-full relative rounded-[2.8rem] overflow-hidden bg-black/95 backdrop-blur-3xl border border-white/10">

                                    {/* Text Content */}
                                    <div className="flex-shrink-0 text-center mb-8 mt-12 px-10">
                                        <h3 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase italic">{item.name}</h3>
                                        <p className="text-neutral-500 text-lg leading-relaxed font-medium italic">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Image Container (Inset Interface) */}
                                    <div className="flex-1 relative w-full overflow-hidden mt-auto">
                                        {/* Mock Browser/App Header */}
                                        <div className="h-10 bg-white/5 w-full flex items-center gap-1.5 px-6 border-b border-white/5 backdrop-blur-xl">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                        </div>

                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover object-top p-4"
                                        />

                                        {/* Interaction Overlay */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-black/5 transition-colors pointer-events-none" />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-8 z-50 w-20 h-20 rounded-full liquid-glass border border-white/20 text-black dark:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 group shadow-2xl"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-8 z-50 w-20 h-20 rounded-full liquid-glass border border-white/20 text-black dark:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 group shadow-2xl"
                    aria-label="Next"
                >
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-4 mt-8 z-10">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`transition-all duration-500 rounded-full shadow-2xl ${i === activeIndex
                            ? 'w-12 h-2 bg-black dark:bg-white'
                            : 'w-2 h-2 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
