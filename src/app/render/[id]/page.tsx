'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';

// Dynamic Template Imports
const ModernTemplate = dynamic(() => import('@/templates/ModernTemplate'), {
    loading: () => <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});
const ExecutiveTemplate = dynamic(() => import('@/templates/ExecutiveTemplate'), {
    loading: () => <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});
const CreativeTemplate = dynamic(() => import('@/templates/CreativeTemplate'), {
    loading: () => <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});
const MinimalPlusTemplate = dynamic(() => import('@/templates/MinimalPlusTemplate'), {
    loading: () => <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});
const BasicTemplate = dynamic(() => import('@/templates/BasicTemplate'), {
    loading: () => <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});
const MinimalistTemplate = dynamic(() => import('@/templates/MinimalistTemplate'), {
    loading: () => <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});
const Cyber3DTemplate = dynamic(() => import('@/templates/Cyber3DTemplate'), {
    loading: () => <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-500" /></div>
});
const AuroraTemplate = dynamic(() => import('@/templates/AuroraTemplate'), {
    loading: () => <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
});

const GeneratedModernTemplate = dynamic(() => import('@/templates/GeneratedModernTemplate'), {
    loading: () => <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});

import type { PortfolioData } from '@/templates/types';

export default function RenderPage({ params }: { params: { id: string } }) {
    const portfolioId = params.id;
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const { setTheme } = useTheme();

    // Apply theme from URL if present (for iframe control)
    useEffect(() => {
        if (mode) {
            setTheme(mode);
        } else {
            setTheme('dark'); // Default to dark if not validating
        }
    }, [mode, setTheme]);

    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('id', portfolioId)
                    .single();

                if (error) throw error;
                if (!data) return;

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

                setPortfolioData(mappedData);
                // Allow overriding template via URL param too, for live switching
                const templateParam = searchParams.get('template');
                if (templateParam) {
                    setSelectedTemplate(templateParam);
                } else if (data.template_id) {
                    setSelectedTemplate(data.template_id);
                }
            } catch (err) {
                console.error('Render error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (portfolioId) {
            fetchData();
        }
    }, [portfolioId, searchParams]);

    if (loading) return <div className="min-h-screen bg-neutral-900" />; // Silent loading
    if (!portfolioData) return <div className="text-white text-center p-10">Portfolio Not Found</div>;

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
    }[selectedTemplate] || ModernTemplate;

    return (
        <div className="absolute inset-0">
            <CurrentTemplate data={portfolioData} isDarkMode={mode === 'dark' || !mode} />
        </div>
    );
}
