'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pen, Layout, Grid, Settings, Eye, ChevronRight, Rocket, Monitor, Tablet, Smartphone, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SidebarNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onPublish: () => void;
    isPublishing: boolean;
    previewDevice?: 'desktop' | 'tablet' | 'mobile';
    setPreviewDevice?: (device: 'desktop' | 'tablet' | 'mobile') => void;
    isPro?: boolean;
}

const NAV_ITEMS = [
    { id: 'edit', label: 'Content', icon: Pen },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'templates', label: 'Templates', icon: Grid },
    { id: 'preview', label: 'Preview', icon: Eye },
    // { id: 'settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ activeTab, setActiveTab, onPublish, isPublishing, previewDevice = 'desktop', setPreviewDevice, isPro = false }: SidebarNavProps) {
    const router = useRouter();

    return (
        <div className="hidden lg:flex w-64 flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-white/10 bg-gradient-to-b from-[#1a1b20] to-[#0a0b10] backdrop-blur-xl">
            <div className="p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6 pl-2">
                    Editor Tools
                </h2>

                <div className="space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "text-white bg-white/10 border border-white/20 shadow-[inner_0_1px_0_rgba(255,255,255,0.1)]"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <>
                                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50" />
                                    </>
                                )}

                                <Icon className={cn("w-5 h-5 relative z-10 transition-colors", isActive ? "text-white" : "group-hover:text-white")} />
                                <span className="relative z-10">{item.label}</span>

                                {isActive && (
                                    <ChevronRight className="w-4 h-4 ml-auto text-white/50 relative z-10" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Device Switcher */}
                <div className="mt-8">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 pl-2">
                        Preview Device
                    </h2>
                    <div className="flex items-center p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                        {[
                            { id: 'desktop', icon: Monitor },
                            { id: 'tablet', icon: Tablet },
                            { id: 'mobile', icon: Smartphone },
                        ].map((dev) => {
                            const Icon = dev.icon;
                            const isActive = previewDevice === dev.id;
                            return (
                                <button
                                    key={dev.id}
                                    onClick={() => setPreviewDevice?.(dev.id as any)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all duration-500 relative",
                                        isActive ? "text-white scale-110" : "text-white/30 hover:text-white/60"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="device-active"
                                            className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <Icon className="w-4 h-4 relative z-10" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-white/5 bg-gradient-to-t from-black/30 to-transparent">
                <Button
                    onClick={onPublish}
                    disabled={isPublishing}
                    className="w-full h-16 rounded-2xl text-base font-black relative overflow-hidden group transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] border-0 bg-white text-black hover:bg-white/90 shadow-lg"
                >
                    {/* PRO CONSTRAINT REMOVED - Crown icon hidden for free version */}
                    {/* {!isPro && (
                        <div className="absolute top-0 right-0 p-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        </div>
                    )} */}
                    {/* Content */}
                    <div className="flex items-center justify-center gap-3 h-full">
                        {isPublishing ? (
                            <>
                                <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                                <span className="font-bold tracking-wide">Launching...</span>
                            </>
                        ) : (
                            <>
                                <Rocket className="w-5 h-5" />
                                <span className="font-bold tracking-wide text-lg">Publish to Web</span>
                                <ChevronRight className="w-5 h-5 text-black/60 -ml-1 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </Button>
            </div>
        </div>
    );
}
