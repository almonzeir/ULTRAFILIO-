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
            className="relative w-full h-[800px] flex flex-col items-center justify-center [perspective:1000px] overflow-hidden"
            style={{ background: 'linear-gradient(to bottom, #1a1a2e 0%, #16162a 50%, #0d0d14 100%)' }}
        >
            {/* Background elements - fixed dark colors */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, #000000 100%)' }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

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
                                className="absolute w-[340px] md:w-[500px] aspect-[4/5] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                                style={{ backgroundColor: '#050505' }}
                                initial={false}
                                animate={{
                                    scale: isActive ? 1 : 0.9,
                                    opacity: isActive ? 1 : 0.6,
                                    x: isActive ? 0 : offset > 0 ? 50 : -50,
                                    z: isActive ? 0 : -100,
                                    rotateY: isActive ? 0 : offset > 0 ? -45 : 45,
                                    zIndex: isActive ? 10 : 5,
                                    filter: isActive ? 'brightness(1)' : 'brightness(0.6)',
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 260,
                                    damping: 20,
                                }}
                            >
                                {/* Card Content */}
                                <div className="flex flex-col h-full relative p-8">

                                    {/* Text Content */}
                                    <div className="flex-shrink-0 text-center mb-8 mt-4">
                                        <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">{item.name}</h3>
                                        <p className="text-neutral-400 text-lg leading-relaxed px-2">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Image Container (Inset Interface) */}
                                    <div className="flex-1 relative w-full rounded-t-xl overflow-hidden shadow-2xl mt-auto">
                                        <div className="absolute inset-0 bg-neutral-800 animate-pulse -z-10" />

                                        {/* Mock Browser/App Header */}
                                        <div className="h-6 bg-neutral-800/80 w-full flex items-center gap-1.5 px-3 border-b border-white/5">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                        </div>

                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover object-top"
                                        />

                                        {/* Interaction Overlay */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        )}
                                    </div>
                                </div>

                                {/* Glossy Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-12 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white transition-all hover:scale-110 active:scale-95 group"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-12 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white transition-all hover:scale-110 active:scale-95 group"
                    aria-label="Next"
                >
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-3 mt-4 z-10">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${i === activeIndex
                            ? 'w-8 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                            : 'w-2.5 bg-neutral-700 hover:bg-neutral-600'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
