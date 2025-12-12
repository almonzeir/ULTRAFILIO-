'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Palette, Briefcase, Zap, Sparkles, Sidebar, Moon, Sun,
    Smartphone, Monitor, ChevronLeft, ChevronRight, X, Menu, Rocket, Minimize2, FileText, Check
} from 'lucide-react';
import { useColorTheme } from '@/context/color-theme-context';
import { SAMPLE_PORTFOLIO_DATA } from '@/lib/sample-portfolio-data';

// Templates
import ModernTemplate from '@/templates/ModernTemplate';
import ExecutiveTemplate from '@/templates/ExecutiveTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import MinimalPlusTemplate from '@/templates/MinimalPlusTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import GeneratedModernTemplate from '@/templates/GeneratedModernTemplate';
import Cyber3DTemplate from '@/templates/Cyber3DTemplate';
import AuroraTemplate from '@/templates/AuroraTemplate';

const templates = [
    { id: 'aurora', name: 'Aurora', icon: Sparkles, color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    { id: 'modern', name: 'Modern', icon: Sparkles, color: 'bg-violet-500' },
    { id: 'executive', name: 'Executive', icon: Briefcase, color: 'bg-blue-600' },
    { id: 'creative', name: 'Creative', icon: Palette, color: 'bg-pink-500' },
    { id: 'minimal-plus', name: 'Minimal+', icon: Zap, color: 'bg-emerald-500' },
    { id: 'generated', name: 'Futuristic', icon: Rocket, color: 'bg-cyan-600' },
    { id: 'cyber', name: 'Cyber V1 (3D)', icon: Monitor, color: 'bg-purple-600' },
    { id: 'minimalist', name: 'Minimalist', icon: Minimize2, color: 'bg-gray-700' },
    { id: 'basic', name: 'Classic', icon: FileText, color: 'bg-slate-600' },
];

export default function DemoTemplatePage() {
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const { theme, setTheme, availableThemes } = useColorTheme();

    // Mounted check to avoid hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const CurrentTemplate = {
        'aurora': AuroraTemplate,
        'modern': ModernTemplate,
        'executive': ExecutiveTemplate,
        'creative': CreativeTemplate,
        'minimal-plus': MinimalPlusTemplate,
        'basic': BasicTemplate,
        'minimalist': MinimalistTemplate,
        'generated': GeneratedModernTemplate,
        'cyber': Cyber3DTemplate,
    }[selectedTemplate] || AuroraTemplate;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-neutral-900 text-white font-sans">

            {/* Mobile sidebar backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- SIDEBAR (Controls) --- */}
            <aside
                className={`
                    fixed lg:relative z-40 lg:z-auto
                    h-full bg-neutral-900 border-r border-neutral-800 
                    transition-all duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen
                        ? 'w-[85vw] sm:w-80 translate-x-0'
                        : 'w-0 -translate-x-full'
                    }
                `}
            >
                <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between min-w-[280px]">
                    <div className="font-bold text-lg sm:text-xl tracking-tight">UltraFolio</div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-neutral-800 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-neutral-700 min-w-[280px]">

                    {/* Template Selector */}
                    <div>
                        <h3 className="text-xs font-bold uppercase text-neutral-500 mb-3 sm:mb-4 tracking-wider">Select Template</h3>
                        <div className="grid gap-1.5 sm:gap-2">
                            {templates.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setSelectedTemplate(t.id);
                                        // Auto-close sidebar on mobile after selection
                                        if (window.innerWidth < 1024) {
                                            setIsSidebarOpen(false);
                                        }
                                    }}
                                    className={`flex items-center gap-3 w-full p-2.5 sm:p-3 rounded-xl transition-all duration-200 text-left border ${selectedTemplate === t.id
                                        ? 'bg-neutral-800 border-neutral-600 text-white shadow-lg'
                                        : 'border-transparent text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg ${t.color} flex items-center justify-center shadow-inner`}>
                                        <t.icon size={14} className="text-white" />
                                    </div>
                                    <span className="font-medium">{t.name}</span>
                                    {selectedTemplate === t.id && <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Light/Dark Mode Toggle - NOW MORE PROMINENT */}
                    <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 p-4 rounded-xl border border-violet-500/30">
                        <h3 className="text-xs font-bold uppercase text-violet-400 mb-3 tracking-wider flex items-center gap-2">
                            {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
                            Appearance Mode
                        </h3>
                        <div className="bg-neutral-800 p-1 rounded-xl flex">
                            <button
                                onClick={() => setIsDarkMode(false)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${!isDarkMode ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                            >
                                <Sun size={16} /> Light
                            </button>
                            <button
                                onClick={() => setIsDarkMode(true)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${isDarkMode ? 'bg-violet-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                            >
                                <Moon size={16} /> Dark
                            </button>
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div>
                        <h3 className="text-xs font-bold uppercase text-neutral-500 mb-4 tracking-wider">Color Theme</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {availableThemes.map((t) => (
                                <button
                                    key={t.name}
                                    onClick={() => setTheme(t.name)}
                                    title={t.name}
                                    className={`relative w-full aspect-square rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${theme === t.name
                                        ? 'border-white scale-110 shadow-lg'
                                        : 'border-transparent hover:border-neutral-600 hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: t.primary }}
                                >
                                    {theme === t.name && <Check className="w-5 h-5 text-white drop-shadow-lg" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800">
                        <Link href="/create" className="flex items-center justify-center w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                            Use This Template
                        </Link>
                    </div>
                </div>
            </aside>


            {/* --- MAIN PREVIEW AREA --- */}
            <main className={`flex-1 flex flex-col min-w-0 relative transition-colors duration-300 ${isDarkMode ? 'dark bg-neutral-950' : 'bg-slate-50'}`}>

                {/* Toolbar */}
                <div className="h-14 sm:h-16 border-b border-neutral-800 flex items-center justify-between px-3 sm:px-4 bg-neutral-900/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Always show menu button on mobile, conditional on desktop */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={`p-2.5 sm:p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors ${isSidebarOpen ? 'lg:hidden' : ''}`}
                        >
                            <Menu size={22} />
                        </button>
                        <div className="h-6 w-px bg-neutral-800 mx-2 hidden sm:block"></div>
                        <div className="flex bg-neutral-800/50 p-1 rounded-lg border border-neutral-800">
                            <button
                                onClick={() => setViewMode('desktop')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                                title="Desktop View"
                            >
                                <Monitor size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('mobile')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                                title="Mobile View"
                            >
                                <Smartphone size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
                        <span className="hidden sm:inline">Preview Mode</span>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20 animate-pulse">
                            Live
                        </div>
                    </div>
                </div>

                {/* Preview Viewport */}
                <div className="flex-1 overflow-hidden relative bg-neutral-950 flex items-center justify-center p-2 sm:p-4 md:p-8">
                    <div
                        className={`transition-all duration-500 ease-in-out bg-white dark:bg-neutral-950 overflow-hidden shadow-2xl relative ${viewMode === 'mobile'
                            ? 'w-[300px] sm:w-[375px] h-[550px] sm:h-[667px] rounded-[2rem] sm:rounded-[3rem] border-4 sm:border-8 border-neutral-800 ring-1 ring-neutral-700'
                            : 'w-full h-full rounded-lg sm:rounded-xl border border-neutral-800'
                            }`}
                    >
                        {/* The Template Renders Here - Full Height, Internal Scroll */}
                        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700 scroll-smooth">
                            {/* @ts-ignore - Dynamic prop passing */}
                            <CurrentTemplate
                                data={SAMPLE_PORTFOLIO_DATA}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
