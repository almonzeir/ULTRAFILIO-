'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pen, Layout, Grid, Settings, Eye, ChevronRight, Rocket, Monitor, Tablet, Smartphone } from 'lucide-react';
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
}

const NAV_ITEMS = [
    { id: 'edit', label: 'Content', icon: Pen },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'templates', label: 'Templates', icon: Grid },
    { id: 'preview', label: 'Preview', icon: Eye },
    // { id: 'settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ activeTab, setActiveTab, onPublish, isPublishing, previewDevice = 'desktop', setPreviewDevice }: SidebarNavProps) {
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
                    className="w-full h-16 rounded-2xl text-base font-black relative overflow-hidden group transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] border-0 bg-transparent p-0"
                >
                    {/* Animated Aurora Background */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-1000" />

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    </div>

                    {/* Glass Overlay */}
                    <div className="absolute inset-[2px] rounded-xl bg-gradient-to-b from-white/20 to-transparent backdrop-blur-sm" />

                    {/* Top Highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                    {/* Outer Glow */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-cyan-400/50 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />

                    {/* Content */}
                    <div className="flex items-center justify-center gap-3 relative z-10 h-full">
                        {isPublishing ? (
                            <>
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="text-white font-bold tracking-wide drop-shadow-lg">Launching...</span>
                            </>
                        ) : (
                            <>
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-white via-slate-200 to-slate-400 border border-white/50 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.3)] group-hover:from-white group-hover:via-slate-100 group-hover:to-slate-300 group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                                    {/* Shining glare effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent opacity-60 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <Rocket className="w-5 h-5 text-slate-700 drop-shadow-sm group-hover:rotate-12 transition-transform relative z-10" />
                                </div>
                                <span className="text-white font-bold tracking-wide text-lg drop-shadow-lg">Publish to Web</span>
                                <ChevronRight className="w-5 h-5 text-white/80 -ml-1 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </Button>
            </div>
        </div>
    );
}
