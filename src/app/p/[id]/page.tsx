'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useColorTheme } from '@/context/color-theme-context';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

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
    'liquid-silk': MinimalPlusTemplate,
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

// Define Pro Templates
const PRO_TEMPLATES = ['cyber', 'aurora', 'minimal-plus', 'creative', 'modern'];

export default function PublicPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
    const [idOrSlug, setIdOrSlug] = useState<string | null>(null);

    useEffect(() => {
        if (params && typeof params.then === 'function') {
            params.then((p) => setIdOrSlug(p.id));
        } else {
            // Fallback for when params is already resolved (older Next.js or different env)
            const p = params as unknown as { id: string };
            setIdOrSlug(p.id);
        }
    }, [params]);

    const { setTheme } = useColorTheme();
    const searchParams = useSearchParams();
    const templateOverride = searchParams.get('template');

    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!idOrSlug) return;
            try {
                // Try to find by ID first, then by slug
                let query = supabase
                    .from('portfolios')
                    .select('*');

                // Check if it's a UUID format or a slug
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

                if (isUUID) {
                    query = query.eq('id', idOrSlug);
                } else {
                    query = query.eq('slug', idOrSlug);
                }

                const { data, error } = await query.single();

                if (error || !data) {
                    setNotFound(true);
                    return;
                }

                processPortfolioData(data, true);
            } catch (err) {
                console.error('Public Load error:', err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        const processPortfolioData = (data: any, ownerIsPro: boolean) => {
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
                },
                experience: data.experience || [],
                education: data.education || [],
                projects: data.projects || [],
                certifications: data.certifications || [],
                languages: data.languages || [],
            };

            setPortfolioData(mappedData);

            // Handle Template Override Security
            let finalTemplate = data.template_id || 'modern';

            if (templateOverride && TEMPLATES[templateOverride]) {
                const isRequestedTemplatePro = PRO_TEMPLATES.includes(templateOverride);

                // Only allow override if the template is not Pro, or if the owner IS a Pro member
                if (!isRequestedTemplatePro || ownerIsPro) {
                    finalTemplate = templateOverride;
                    console.log(`Using overridden template: ${finalTemplate}`);
                } else {
                    console.warn(`Unauthorized Pro template requested: ${templateOverride}. Reverting to base.`);
                }
            }

            setSelectedTemplate(finalTemplate);
            if (data.theme) setTheme(data.theme);
        };

        if (idOrSlug) {
            fetchData();
        }
    }, [idOrSlug, setTheme, templateOverride]);

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
