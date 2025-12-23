'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

// Dynamic Template Imports - SSR disabled to prevent hydration mismatches
const ModernTemplate = dynamic(() => import('@/templates/ModernTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-neutral-900"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
});
const ExecutiveTemplate = dynamic(() => import('@/templates/ExecutiveTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-neutral-900"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
});
const CreativeTemplate = dynamic(() => import('@/templates/CreativeTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-neutral-900"><Loader2 className="h-8 w-8 animate-spin text-rose-500" /></div>
});
const MinimalPlusTemplate = dynamic(() => import('@/templates/MinimalPlusTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-neutral-900"><Loader2 className="h-8 w-8 animate-spin text-green-500" /></div>
});
const BasicTemplate = dynamic(() => import('@/templates/BasicTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-neutral-900"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});
const MinimalistTemplate = dynamic(() => import('@/templates/MinimalistTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>
});
const Cyber3DTemplate = dynamic(() => import('@/templates/Cyber3DTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-neutral-900"><Loader2 className="h-8 w-8 animate-spin text-cyan-500" /></div>
});
const AuroraTemplate = dynamic(() => import('@/templates/AuroraTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-neutral-900"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
});
const LiquidSilkTemplate = dynamic(() => import('@/templates/LiquidSilkTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-neutral-900"><Loader2 className="h-8 w-8 animate-spin text-indigo-400" /></div>
});

const GeneratedModernTemplate = dynamic(() => import('@/templates/GeneratedModernTemplate'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-neutral-900"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});

import type { PortfolioData } from '@/templates/types';
import { useColorTheme } from '@/context/color-theme-context';
import type { ColorTheme } from '@/lib/color-themes';

export default function RealPreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: portfolioId } = React.use(params);
    const searchParams = useSearchParams();
    const themeParam = searchParams.get('theme') || searchParams.get('mode');
    const colorParam = searchParams.get('color') as ColorTheme | null;
    const { setTheme: setColorTheme } = useColorTheme();

    // Determine if dark mode based on URL param (DO NOT use next-themes to avoid global theme change)
    const isDarkMode = themeParam !== 'light';  // Default to dark if not 'light'

    // Apply color theme from URL if present
    useEffect(() => {
        if (colorParam) {
            setColorTheme(colorParam);
        }
    }, [colorParam, setColorTheme]);

    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);

    // Get template from URL or fallback to state
    const urlTemplate = searchParams.get('template');
    const [dbTemplate, setDbTemplate] = useState<string | null>(null);

    // Priority: URL Param > Database Value > Default 'modern'
    const selectedTemplate = urlTemplate || dbTemplate || 'modern';

    useEffect(() => {
        const fetchData = async () => {
            console.log("RenderPage: Fetching data for ID:", portfolioId);
            try {
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('id', portfolioId)
                    .single();

                if (error) {
                    console.error("RenderPage: Supabase error:", error);
                    throw error;
                }

                if (!data) {
                    console.error("RenderPage: No data found");
                    return;
                }

                console.log("RenderPage: Data fetched successfully", data);

                const mappedData: PortfolioData = {
                    personalInfo: {
                        fullName: data.title ? data.title.replace("'s Portfolio", "") : "User Name",
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
                        skills: data.skills || [],
                        stats: []
                    },
                    experience: data.experience || [],
                    education: data.education || [],
                    projects: data.projects || [],
                    certifications: data.certifications || [],
                    languages: data.languages || [],
                };

                console.log("RenderPage: Mapped data:", mappedData);
                setPortfolioData(mappedData);

                // Set DB template
                if (data.template_id) {
                    setDbTemplate(data.template_id);
                }
            } catch (err) {
                console.error('RenderPage: Catch error:', err);
            } finally {
                setLoading(false);
            }
        };
        if (portfolioId) {
            fetchData();
        }
    }, [portfolioId]);

    if (loading) return <div className="min-h-screen bg-neutral-900" />; // Silent loading
    if (!portfolioData) return <div className="text-white text-center p-10">Portfolio Not Found</div>;

    const templateMap: Record<string, React.ComponentType<any>> = {
        'aurora': AuroraTemplate,
        'modern': ModernTemplate,
        'executive': ExecutiveTemplate,
        'creative': CreativeTemplate,
        'minimal-plus': MinimalPlusTemplate,
        'basic': BasicTemplate,
        'minimalist': MinimalistTemplate,
        'generated': GeneratedModernTemplate,
        'cyber': Cyber3DTemplate,
        'liquid-silk': LiquidSilkTemplate,
    };

    const CurrentTemplate = templateMap[selectedTemplate] || ModernTemplate;

    // Debug: Log which template is being rendered
    console.log("RenderPage: Rendering template:", selectedTemplate, "Component:", CurrentTemplate?.name || 'Unknown');

    return (
        <CurrentTemplate data={portfolioData} isDarkMode={isDarkMode} />
    );
}

// Global Error Handler for this page to catch template crashes
export function ErrorBoundary({ error }: { error: Error }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <h2 className="text-xl font-bold text-red-400 mb-2">Preview Error</h2>
            <p className="text-sm text-gray-400 font-mono bg-white/5 p-4 rounded-lg max-w-lg overflow-auto">
                {error.message}
            </p>
        </div>
    );
}
