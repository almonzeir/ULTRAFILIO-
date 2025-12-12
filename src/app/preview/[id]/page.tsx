'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Palette, Briefcase, Zap, Sparkles,
    Smartphone, Monitor, X, Menu, Rocket, Minimize2, FileText, Check,
    Pencil, Share
} from 'lucide-react';
import { useColorTheme } from '@/context/color-theme-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShareDialog } from '@/components/share/ShareDialog';

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
import type { PortfolioData } from '@/templates/types';

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

export default function RealPreviewPage({ params }: { params: { id: string } }) {
    const portfolioId = params.id;
    const router = useRouter();
    const { toast } = useToast();

    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const { theme, setTheme, availableThemes } = useColorTheme();

    // Publish State
    const [isPublishOpen, setIsPublishOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            // Save current state (Template + Theme)
            // Note: We are optimistically trying to save 'theme'. If col doesn't exist, it might fail or ignore.
            const { error } = await supabase
                .from('portfolios')
                .update({
                    template_id: selectedTemplate,
                    theme: theme // Assuming column exists or JSONB
                })
                .eq('id', portfolioId);

            if (error) {
                console.warn("Could not save theme/template during publish (might be harmless):", error);
            }

            // Open Modal
            setIsPublishOpen(true);
            toast({
                title: "Portfolio Published!",
                description: "Your site is live.",
            });
        } catch (e) {
            console.error("Publish error", e);
        } finally {
            setIsPublishing(false);
        }
    };

    // Fetch Real Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('id', portfolioId)
                    .single();

                if (error) throw error;
                if (!data) throw new Error('Portfolio not found');

                // Map DB data to PortfolioData type
                // Note: We need to handle potentially missing fields based on the loose DB schema
                const mappedData: PortfolioData = {
                    personalInfo: {
                        fullName: data.title ? data.title.replace("'s Portfolio", "") : "User Name", // Fallback
                        title: data.subtitle || "Professional Role",
                        tagline: data.description,
                        email: data.email,
                        phone: data.phone,
                        location: data.location,
                        website: data.website,
                        linkedInURL: data.linkedin,
                        githubURL: data.github,
                        portfolioNameAbbr: data.title ? data.title.charAt(0) : "U",
                        profilePhotoURL: data.profile_photo_url || "",
                    },
                    about: {
                        extendedBio: data.description,
                        skills: data.skills || [], // Assuming stored as JSON array
                        stats: []
                    },
                    experience: data.experience || [],
                    education: data.education || [],
                    projects: data.projects || [],
                    certifications: data.certifications || [],
                    languages: data.languages || [],
                };

                setPortfolioData(mappedData);
                if (data.template_id && templates.find(t => t.id === data.template_id)) {
                    setSelectedTemplate(data.template_id);
                }
            } catch (err: any) {
                console.error('Error fetching portfolio:', err);
                toast({
                    variant: 'destructive',
                    title: 'Load Failed',
                    description: 'Could not load your portfolio data.'
                });
            } finally {
                setLoading(false);
            }
        };

        if (portfolioId) {
            fetchData();
        }
    }, [portfolioId, toast]);

    const handleSaveAndEdit = () => {
        // Here we would typically update the template_id in DB first
        // Then navigate to the editor
        router.push(`/builder/${portfolioId}`); // Assuming builder route
    };

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="animate-pulse">Loading your Masterpiece...</p>
                </div>
            </div>
        );
    }

    if (!portfolioData) return null;

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

            {/* --- SIDEBAR (Controls) --- */}
            <aside
                className={`flex-shrink-0 bg-neutral-900 border-r border-neutral-800 transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
                    } ${!isSidebarOpen && 'absolute z-20'}`}
            >
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                    <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                        UltraFolio
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-neutral-800 rounded-lg lg:hidden">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-neutral-700">

                    {/* Template Selector */}
                    <div>
                        <h3 className="text-xs font-bold uppercase text-neutral-500 mb-4 tracking-wider">Select Template</h3>
                        <div className="grid gap-2">
                            {templates.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 text-left border ${selectedTemplate === t.id
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

                    {/* Color Selector */}
                    <div>
                        <h3 className="text-xs font-bold uppercase text-neutral-500 mb-4 tracking-wider">Color Theme</h3>
                        <div className="space-y-2">
                            {availableThemes.map((t) => (
                                <button
                                    key={t.name}
                                    onClick={() => setTheme(t.name)}
                                    className={`flex items-center gap-3 w-full p-2.5 rounded-lg border transition-all duration-200 ${theme === t.name
                                        ? 'bg-neutral-800 border-neutral-600 text-white shadow-md'
                                        : 'border-transparent text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                                        }`}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full border border-white/10 shadow-sm"
                                        style={{ backgroundColor: t.primary }}
                                    />
                                    <span className="font-medium capitalize">{t.name}</span>
                                    {theme === t.name && <Check className="ml-auto w-4 h-4 text-neutral-400" />}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Sidebar Footer Actions */}
                <div className="p-6 border-t border-neutral-800 space-y-3">
                    <Button
                        onClick={handleSaveAndEdit}
                        className="w-full bg-white text-black hover:bg-neutral-200"
                        size="lg"
                    >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Content
                    </Button>
                </div>
            </aside>


            {/* --- MAIN PREVIEW AREA --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-neutral-950 relative">

                {/* Toolbar */}
                <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-4 bg-neutral-900/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
                                <Menu size={20} />
                            </button>
                        )}
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
                        <Button variant="ghost" className="text-neutral-400 hover:text-white" onClick={handleSaveAndEdit}>
                            Edit Details
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                            onClick={handlePublish}
                            disabled={isPublishing}
                        >
                            {isPublishing ? 'Publishing...' : (
                                <>
                                    <Share className="w-4 h-4 mr-2" />
                                    Publish
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <ShareDialog
                    open={isPublishOpen}
                    onOpenChange={setIsPublishOpen}
                    portfolioId={portfolioId}
                    portfolioName={portfolioData?.personalInfo.fullName}
                />

                {/* Preview Viewport */}
                <div className="flex-1 overflow-hidden relative bg-neutral-950 flex items-center justify-center p-4 sm:p-8">
                    <div
                        className={`transition-all duration-500 ease-in-out bg-white relative shadow-2xl ${viewMode === 'mobile'
                            ? 'w-[390px] h-[844px] rounded-[50px] border-[12px] border-neutral-900 ring-1 ring-neutral-700 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]'
                            : 'w-full h-full rounded-xl border border-neutral-800'
                            }`}
                    >
                        {/* Dynamic Island / Notch for Mobile */}
                        {viewMode === 'mobile' && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-32 bg-black rounded-b-2xl z-50 flex items-center justify-center">
                                <div className="w-16 h-4 bg-neutral-900/50 rounded-full" />
                            </div>
                        )}

                        {/* Status Bar Mockup (Time/Battery) */}
                        {viewMode === 'mobile' && (
                            <div className="absolute top-3 left-6 z-40 text-[10px] font-bold text-black dark:text-white mix-blend-difference">
                                9:41
                            </div>
                        )}
                        {viewMode === 'mobile' && (
                            <div className="absolute top-3 right-6 z-40 flex items-center gap-1">
                                <div className="w-4 h-2.5 border border-black dark:border-white rounded-[2px] mix-blend-difference opacity-80" />
                            </div>
                        )}

                        {/* The Template Renders Here via IFRAME for True Native Responsive Behavior */}
                        <iframe
                            src={`/render/${portfolioId}?theme=${theme}&template=${selectedTemplate}`}
                            className={`w-full h-full border-0 ${viewMode === 'mobile' ? 'rounded-[38px]' : 'rounded-none'}`}
                            title="Portfolio Preview"
                        />
                    </div>
                </div>

            </main>
        </div>
    );
}
