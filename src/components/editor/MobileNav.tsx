'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pen, Layout, Grid, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const NAV_ITEMS = [
    { id: 'edit', label: 'Edit', icon: Pen },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'templates', label: 'Theme', icon: Grid },
    { id: 'preview', label: 'Preview', icon: Eye },
];

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden user-select-none">
            {/* Glossy Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl border-t border-white/10" />

            <div className="relative flex items-center justify-around p-2 pb-safe-area">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="flex flex-col items-center justify-center p-2 w-full relative group"
                        >
                            <div className={cn(
                                "p-2 rounded-2xl transition-all duration-300 mb-1",
                                isActive
                                    ? "bg-primary/20 text-primary scale-110 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                    : "text-muted-foreground hover:bg-white/5"
                            )}>
                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium transition-colors duration-200",
                                isActive ? "text-primary" : "text-muted-foreground/60"
                            )}>
                                {item.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="activeTabMobile"
                                    className="absolute -top-[1px] w-1/3 h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
