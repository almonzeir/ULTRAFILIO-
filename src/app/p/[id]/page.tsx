'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useColorTheme } from '@/context/color-theme-context';
import { Loader2 } from 'lucide-react';

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

// Template mapping
const TEMPLATES: Record<string, React.ComponentType<{ data: PortfolioData }>> = {
    'aurora': AuroraTemplate,
    'modern': ModernTemplate,
    'executive': ExecutiveTemplate,
    'creative': CreativeTemplate,
    'minimal-plus': MinimalPlusTemplate,
    'basic': BasicTemplate,
    'minimalist': MinimalistTemplate,
    'generated': GeneratedModernTemplate,
    'cyber': Cyber3DTemplate,
};

export default function PublicPortfolioPage({ params }: { params: { id: string } }) {
    const idOrSlug = params.id;
    const { setTheme } = useColorTheme();

    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try to find by ID first, then by slug
                let query = supabase.from('portfolios').select('*');

                // Check if it's a UUID format or a slug
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

                if (isUUID) {
                    query = query.eq('id', idOrSlug);
                } else {
                    // Try to find by slug (custom URL)
                    query = query.eq('slug', idOrSlug);
                }

                const { data, error } = await query.single();

                if (error || !data) {
                    // If not found by slug, try by ID as fallback
                    if (!isUUID) {
                        const { data: fallbackData, error: fallbackError } = await supabase
                            .from('portfolios')
                            .select('*')
                            .eq('id', idOrSlug)
                            .single();

                        if (fallbackError || !fallbackData) {
                            setNotFound(true);
                            return;
                        }
                        // Use fallback data
                        processPortfolioData(fallbackData);
                        return;
                    }
                    setNotFound(true);
                    return;
                }

                processPortfolioData(data);
            } catch (err) {
                console.error('Public Load error:', err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        const processPortfolioData = (data: any) => {
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
            if (data.template_id) setSelectedTemplate(data.template_id);
            if (data.theme) setTheme(data.theme);
        };

        if (idOrSlug) {
            fetchData();
        }
    }, [idOrSlug, setTheme]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                    <p className="text-white/50 animate-pulse">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    if (notFound || !portfolioData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-black text-white mb-4">404</h1>
                    <p className="text-xl text-white/50 mb-8">Portfolio not found</p>
                    <a
                        href="/"
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-colors"
                    >
                        Create Your Own
                    </a>
                </div>
            </div>
        );
    }

    const CurrentTemplate = TEMPLATES[selectedTemplate] || ModernTemplate;

    return <CurrentTemplate data={portfolioData} />;
}
