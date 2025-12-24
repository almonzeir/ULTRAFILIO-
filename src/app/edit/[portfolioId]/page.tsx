'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Loader2, Save, Rocket, ArrowLeft, Plus, Trash2, LayoutGrid,
    Upload, X, Moon, Sun, Image as ImageIcon, Copy, Check, Sparkles, MonitorSmartphone, ArrowRight,
    ChevronRight, Pen, Layout, Grid, Eye, Globe, MapPin, Mail, Phone, Linkedin, Github, RefreshCw
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { LayoutEditor } from '@/components/LayoutEditor';
import type { PortfolioData } from '@/templates/types';
import { SidebarNav } from '@/components/editor/SidebarNav';
import { MobileNav } from '@/components/editor/MobileNav';
import { OnboardingTour } from '@/components/editor/OnboardingTour';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { useDictionary } from '@/hooks/use-dictionary';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import ProPaywallModal from '@/components/shared/pro-paywall-modal';

const DEFAULT_SECTION_ORDER = ['hero', 'about', 'experience', 'projects', 'education', 'certifications', 'skills', 'contact'];

// --- ENHANCED TEMPLATES DATA ---
const AVAILABLE_TEMPLATES = [
    {
        id: 'aurora',
        name: 'Aurora',
        description: 'Premium template with mesmerizing aurora backgrounds and fluid animations.',
        features: ['Aurora Effects', 'Animations', 'Premium'],
        bestFor: ['Designers', 'Creatives'],
        colorScheme: { bg: '#0f0720', accent: '#a855f7' },
        isPremium: true,
        isNew: true,
        darkModeOnly: false
    },
    {
        id: 'liquid-silk',
        name: 'Liquid Silk',
        description: 'Elegant architectural minimalism with beautiful mesh gradients.',
        features: ['Mesh Gradients', 'Minimal', 'Elegant'],
        bestFor: ['Architects', 'UI/UX'],
        colorScheme: { bg: '#050510', accent: '#6366f1' },
        isPremium: false,
        isNew: true,
        darkModeOnly: false
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and professional design perfect for tech portfolios.',
        features: ['Dark Mode', 'Glass Effects', 'Smooth'],
        bestFor: ['Developers', 'Engineers'],
        colorScheme: { bg: '#0a0a0f', accent: '#3b82f6' },
        isPremium: false,
        isPopular: true,
        darkModeOnly: false
    },
    {
        id: 'executive',
        name: 'Executive',
        description: 'Bold and authoritative design for senior professionals.',
        features: ['Professional', 'Bold', 'Corporate'],
        bestFor: ['Executives', 'Managers'],
        colorScheme: { bg: '#111111', accent: '#f59e0b' },
        isPremium: false,
        isPopular: true,
        darkModeOnly: false
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Artistic and unique with bold gradients and expressive layouts.',
        features: ['Gradients', 'Artistic', 'Bold'],
        bestFor: ['Artists', 'Illustrators'],
        colorScheme: { bg: '#1a0505', accent: '#ef4444' },
        isPremium: false,
        darkModeOnly: false
    },
    {
        id: 'minimal-plus',
        name: 'Minimal Plus',
        description: 'Clean and elegant with sophisticated micro-interactions.',
        features: ['Light Mode', 'Clean', 'Refined'],
        bestFor: ['Writers', 'Consultants'],
        colorScheme: { bg: '#fafafa', accent: '#10b981' },
        isPremium: false,
        darkModeOnly: false
    },
    {
        id: 'generated',
        name: 'Futuristic',
        description: 'Tech-forward design with cutting-edge cyber aesthetics.',
        features: ['Cyber Style', 'Tech', 'Futuristic'],
        bestFor: ['Tech Leads', 'Innovators'],
        colorScheme: { bg: '#000000', accent: '#8b5cf6' },
        isPremium: false,
        lightModeOnly: true,
        darkModeOnly: false
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Ultra-simple and distraction-free for maximum focus.',
        features: ['Light Mode', 'Simple', 'Focus'],
        bestFor: ['Academics', 'Researchers'],
        colorScheme: { bg: '#ffffff', accent: '#6b7280' },
        isPremium: false,
        darkModeOnly: false
    },
    {
        id: 'cyber',
        name: 'Cyber 3D',
        description: 'Experimental 3D experience with matrix effects and glowing elements.',
        features: ['3D Effects', 'Matrix', 'Neon'],
        bestFor: ['Gamers', 'Developers'],
        colorScheme: { bg: '#000000', accent: '#06b6d4' },
        isPremium: true,
        isNew: true,
        darkModeOnly: true
    },
    {
        id: 'basic',
        name: 'Basic',
        description: 'Classic resume-style layout that works everywhere.',
        features: ['Classic', 'ATS-Friendly', 'Simple'],
        bestFor: ['Job Seekers', 'Graduates'],
        colorScheme: { bg: '#1a1a1a', accent: '#9ca3af' },
        isPremium: false,
        darkModeOnly: false
    },
];

export default function EditPortfolioPage() {
    const params = useParams();
    const portfolioId = params.portfolioId as string;
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const isPro = true; // PRO CONSTRAINTS DISABLED - Free for first 1000 users
    const { toast } = useToast();
    const { dictionary, language } = useDictionary();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [activeTab, setActiveTab] = useState('edit');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    // Load theme preference from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('editor-theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    // Save theme preference when it changes
    useEffect(() => {
        localStorage.setItem('editor-theme', isDarkMode ? 'dark' : 'light');
        console.log("Editor: isDarkMode changed to:", isDarkMode);
    }, [isDarkMode]);
    const [templateId, setTemplateId] = useState('modern');
    const [colorTheme, setColorTheme] = useState('purple');
    const [isMobileView, setIsMobileView] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    // Template search and filter state
    const [templateSearch, setTemplateSearch] = useState('');
    const [templateFilter, setTemplateFilter] = useState<'all' | 'premium' | 'standard'>('all');

    // Portfolio Data
    const [portfolioData, setPortfolioData] = useState<PortfolioData>({
        personalInfo: { fullName: '', title: '', tagline: '', email: '', location: '', website: '', linkedInURL: '', githubURL: '', profilePhotoURL: '' },
        about: { extendedBio: '', skills: [] },
        projects: [],
        experience: [],
        education: [],
        certifications: [],
        languages: [],
        sectionOrder: DEFAULT_SECTION_ORDER,
    });

    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [publishedUrl, setPublishedUrl] = useState('');
    const [hasCopied, setHasCopied] = useState(false);

    // Refs for synchronization and race-condition prevention
    const dataFetchedRef = React.useRef(false);
    const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Controlled refresh key for preview to prevent infinite reloading
    const [previewKey, setPreviewKey] = useState(Date.now());

    // Refresh preview when template, theme, or color changes
    useEffect(() => {
        setPreviewKey(Date.now());
    }, [templateId, isDarkMode, colorTheme]);

    // Detect Mobile
    useEffect(() => {
        const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-save on content/layout/style changes (Debounced)
    useEffect(() => {
        if (loading || !dataFetchedRef.current) return; // Don't save on initial mount or before data is ready

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(() => {
            handleSave(true);
        }, 3000); // Save after 3 seconds of inactivity

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [portfolioData, templateId, colorTheme, isDarkMode]);

    // Fetch Data (Once per mount)
    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!user || !portfolioId || dataFetchedRef.current) return;
            try {
                const { data, error } = await supabase.from('portfolios').select('*').eq('id', portfolioId).single();
                if (error || !data) throw new Error('Portfolio not found');
                if (data.user_id !== user.id) {
                    router.push('/dashboard'); return;
                }

                // Set lock BEFORE setting states to prevent the auto-save effect from thinking these are user changes
                dataFetchedRef.current = true;

                setTemplateId(data.template_id || 'modern');
                setColorTheme(data.color_theme || 'purple');
                setPortfolioData({
                    personalInfo: {
                        fullName: data.title ? data.title.replace("'s Portfolio", "") : "User Name",
                        title: data.subtitle || "",
                        tagline: data.description || "",
                        email: data.email || "",
                        location: data.location || "",
                        website: data.website || "",
                        linkedInURL: data.linkedin || "",
                        githubURL: data.github || "",
                        profilePhotoURL: data.profile_photo_url || "",
                    },
                    about: {
                        extendedBio: data.description || "",
                        // Merge skills with duplicate category names
                        skills: (() => {
                            const skills = data.skills || [];
                            if (!Array.isArray(skills) || skills.length === 0) return [];

                            const categoryMap = new Map<string, string[]>();
                            for (const skill of skills) {
                                const categoryKey = (skill.category || 'General').toLowerCase().trim();
                                const existingTags = categoryMap.get(categoryKey) || [];
                                if (Array.isArray(skill.tags)) {
                                    existingTags.push(...skill.tags);
                                } else if (typeof skill.tags === 'string') {
                                    existingTags.push(skill.tags);
                                }
                                categoryMap.set(categoryKey, existingTags);
                            }

                            return Array.from(categoryMap.entries()).map(([key, tags]) => ({
                                category: key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                                tags: [...new Set(tags.filter(t => t && t.trim()))]
                            })).filter(s => s.tags.length > 0);
                        })(),
                    },
                    projects: data.projects || [],
                    experience: data.experience || [],
                    education: data.education || [],
                    certifications: data.certifications || [],
                    languages: data.languages || [],
                    sectionOrder: data.section_order || DEFAULT_SECTION_ORDER,
                });
            } catch (error) {
                console.error(error);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        if (!userLoading) fetchPortfolio();
    }, [user, userLoading, portfolioId, router]);

    // Save & Publish Handlers
    const handleSave = async (silent = false, overrideTemplateId?: string, overrideColorTheme?: string) => {
        if (!portfolioId || !user || !dataFetchedRef.current) return;

        // Clear any pending debounced saves
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        if (silent) setSaving(true);
        try {
            const updates: any = {
                title: portfolioData.personalInfo.fullName,
                subtitle: portfolioData.personalInfo.title,
                description: portfolioData.about.extendedBio || portfolioData.personalInfo.tagline,
                email: portfolioData.personalInfo.email,
                location: portfolioData.personalInfo.location,
                website: portfolioData.personalInfo.website,
                linkedin: portfolioData.personalInfo.linkedInURL,
                github: portfolioData.personalInfo.githubURL,
                profile_photo_url: portfolioData.personalInfo.profilePhotoURL,
                skills: portfolioData.about.skills,
                projects: portfolioData.projects,
                experience: portfolioData.experience,
                education: portfolioData.education,
                certifications: portfolioData.certifications,
                languages: portfolioData.languages,
                template_id: overrideTemplateId || templateId,
                // DISABLED: Missing in DB
                // color_theme: overrideColorTheme || colorTheme,
                // section_order: portfolioData.sectionOrder, 
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase.from('portfolios').update(updates).eq('id', portfolioId);
            if (error) throw error;
            if (!silent) toast({ title: "Saved", description: "Changes saved successfully." });
            setPreviewKey(Date.now()); // Refresh preview iframe
        } catch (e: any) {
            console.error("Save Error Details:", e);
            if (!silent) toast({
                variant: 'destructive',
                title: "Error Saving",
                description: e.message || "Check console for details. A database column might be missing."
            });
        } finally {
            setSaving(false);
        }
    };

    const [isPaywallOpen, setIsPaywallOpen] = useState(false);

    const handlePublish = async () => {
        if (!portfolioId) return;

        // PRO CONSTRAINT REMOVED - All users can publish
        // if (!isPro) {
        //     setIsPaywallOpen(true);
        //     return;
        // }

        setPublishing(true);
        try {
            await handleSave(true);
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('/api/portfolio/publish', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ portfolioId, templateId, portfolioData }),
            });
            if (!response.ok) throw new Error('Failed to publish');
            const { url } = await response.json();
            setPublishedUrl(url);
            setPublishDialogOpen(true);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setPublishing(false);
        }
    };

    // Helper State Setters
    const updatePersonalInfo = (field: keyof PortfolioData['personalInfo'], value: string) =>
        setPortfolioData(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: value } }));

    const updateAbout = (field: keyof PortfolioData['about'], value: any) =>
        setPortfolioData(p => ({ ...p, about: { ...p.about, [field]: value } }));

    // Image Upload Handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${portfolioId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        try {
            setSaving(true);
            const { error: uploadError } = await supabase.storage.from('portfolios').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('portfolios').getPublicUrl(filePath);

            // Update local state
            setPortfolioData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, profilePhotoURL: data.publicUrl }
            }));

            // Save to database immediately
            await supabase.from('portfolios').update({
                profile_photo_url: data.publicUrl,
                updated_at: new Date().toISOString()
            }).eq('id', portfolioId);

            // Force preview refresh
            setPreviewKey(Date.now());

            toast({ title: "Success", description: "Profile photo updated and preview refreshed!" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Upload Failed", description: error.message });
        } finally {
            setSaving(false);
        }
    };

    // --- RENDERERS ---

    if (loading || userLoading || !dictionary) {
        return <div className="flex items-center justify-center min-h-screen bg-[#050510]"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
    }

    const dict = dictionary.editor;

    return (
        <div className="flex flex-col min-h-screen bg-[#050510] text-gray-100 font-sans">
            <MeshGradientBackground />

            {/* Header - Desktop */}
            <header className="hidden lg:flex items-center justify-between h-16 px-6 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="rounded-full hover:bg-white/5">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xs font-black tracking-widest uppercase text-muted-foreground">Portfolio Studio</h1>
                        <h2 className="text-sm font-bold">{portfolioData.personalInfo.fullName || 'Untitled'}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Indicator that saving is automatic */}
                    {saving && (
                        <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Syncing...
                        </div>
                    )}
                </div>
            </header>

            {/* Header - Mobile */}
            <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={handlePublish}
                        disabled={publishing}
                        size="sm"
                        className="h-9 px-4 rounded-full bg-white text-black text-xs font-bold shadow-lg hover:bg-white/90"
                    >
                        <Rocket className="w-3.5 h-3.5 mr-1.5" />
                        {publishing ? '...' : 'Publish'}
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 relative z-10">
                {/* --- SIDEBAR NAVIGATION (Desktop) --- */}
                <SidebarNav
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onPublish={handlePublish}
                    isPublishing={publishing}
                    previewDevice={previewDevice}
                    setPreviewDevice={setPreviewDevice}
                    isPro={isPro}
                />

                {/* --- MAIN CONTENT AREA --- */}
                <main className={cn(
                    "flex-1 relative h-[calc(100vh-4rem)] pb-24 lg:pb-10 custom-scrollbar",
                    activeTab === 'preview' ? "overflow-hidden p-0" : "overflow-y-auto p-4 md:p-8"
                )}>
                    {activeTab === 'edit' && (
                        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Section Header */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Edit Content</h1>
                                <p className="text-white/50">Update your details to keep your portfolio fresh.</p>
                            </div>

                            {/* Personal Info Card */}
                            <div className="glass-card p-6 md:p-8 rounded-3xl space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70">
                                        <Pen className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold">Personal Information</h3>
                                </div>

                                {/* Profile Photo Upload */}
                                <div className="flex flex-col items-center sm:items-start gap-4">
                                    <Label className="text-xs uppercase font-bold text-white/50">Profile Photo</Label>
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 border-2 border-white/10 group-hover:border-white/20 transition-all">
                                            {portfolioData.personalInfo.profilePhotoURL ? (
                                                <img src={portfolioData.personalInfo.profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-2xl">
                                                    {portfolioData.personalInfo.fullName?.[0] || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                                            <ImageIcon className="w-6 h-6 text-white" />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                    {/* Apply Changes Button */}
                                    <Button
                                        onClick={() => {
                                            handleSave(false);
                                        }}
                                        disabled={saving}
                                        size="sm"
                                        className="mt-4 h-9 px-4 rounded-xl bg-white text-black text-xs font-bold shadow-lg hover:bg-white/90 transition-all"
                                    >
                                        <RefreshCw className={cn("w-3.5 h-3.5 mr-2", saving && "animate-spin")} />
                                        {saving ? 'Applying...' : 'Apply Changes'}
                                    </Button>
                                </div>

                                {/* Core Details */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-white/50">Full Name</Label>
                                        <Input className="bg-white/5 border-white/10 rounded-xl h-11 focus:ring-indigo-500" value={portfolioData.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-white/50">Job Title</Label>
                                        <Input className="bg-white/5 border-white/10 rounded-xl h-11 focus:ring-indigo-500" value={portfolioData.personalInfo.title} onChange={e => updatePersonalInfo('title', e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-white/50">Tagline</Label>
                                    <Textarea className="bg-white/5 border-white/10 rounded-xl min-h-[80px] focus:ring-indigo-500" value={portfolioData.personalInfo.tagline} onChange={e => updatePersonalInfo('tagline', e.target.value)} />
                                </div>

                                {/* Extended Bio */}
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-white/50">Extended Bio (About Me)</Label>
                                    <Textarea
                                        className="bg-white/5 border-white/10 rounded-xl min-h-[120px] focus:ring-indigo-500"
                                        value={portfolioData.about.extendedBio || ''}
                                        onChange={e => updateAbout('extendedBio', e.target.value)}
                                        placeholder="Tell your story..."
                                    />
                                </div>

                                {/* Skills Editor */}
                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-xs uppercase font-bold text-white/50">Skills & Expertise</Label>
                                            <div className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-white/60 uppercase tracking-tighter">New</div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const newSkills = [...(portfolioData.about.skills || [])];
                                                newSkills.push({ category: 'New Category', tags: [] });
                                                updateAbout('skills', newSkills);
                                            }}
                                            className="h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs"
                                        >
                                            <Plus className="w-3 h-3 mr-1.5" /> Add Category
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {(portfolioData.about.skills || []).map((skill, categoryIdx) => (
                                            <div key={categoryIdx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4 group/cat relative">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover/cat:opacity-100 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-opacity"
                                                    onClick={() => {
                                                        const newSkills = [...(portfolioData.about.skills || [])];
                                                        newSkills.splice(categoryIdx, 1);
                                                        updateAbout('skills', newSkills);
                                                    }}
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </Button>

                                                <div className="flex items-baseline gap-2">
                                                    <input
                                                        type="text"
                                                        value={skill.category}
                                                        onChange={(e) => {
                                                            const newSkills = [...(portfolioData.about.skills || [])];
                                                            newSkills[categoryIdx].category = e.target.value;
                                                            updateAbout('skills', newSkills);
                                                        }}
                                                        className="bg-transparent border-none p-0 text-sm font-bold text-white/80 focus:ring-0 w-full placeholder:text-white/10"
                                                        placeholder="Category Name (e.g. Design)"
                                                    />
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {skill.tags?.map((tag, tagIdx) => (
                                                        <div
                                                            key={tagIdx}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 group/tag hover:border-white/20 transition-all"
                                                        >
                                                            <span className="text-xs font-medium">{tag}</span>
                                                            <button
                                                                onClick={() => {
                                                                    const newSkills = [...(portfolioData.about.skills || [])];
                                                                    newSkills[categoryIdx].tags.splice(tagIdx, 1);
                                                                    updateAbout('skills', newSkills);
                                                                }}
                                                                className="opacity-40 hover:opacity-100"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <input
                                                        type="text"
                                                        placeholder="Add tag..."
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const val = e.currentTarget.value.trim();
                                                                if (val) {
                                                                    const newSkills = [...(portfolioData.about.skills || [])];
                                                                    if (!newSkills[categoryIdx].tags.includes(val)) {
                                                                        newSkills[categoryIdx].tags.push(val);
                                                                        updateAbout('skills', newSkills);
                                                                        e.currentTarget.value = '';
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500/50 w-24 transition-all focus:w-32 placeholder:text-white/20"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {(portfolioData.about.skills || []).length === 0 && (
                                            <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl">
                                                <p className="text-xs text-white/20 italic">No skills added. Click &quot;Add Category&quot; to begin.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-white/50">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                                            <Input className="pl-10 bg-white/5 border-white/10 rounded-xl h-11 focus:ring-indigo-500" value={portfolioData.personalInfo.email || ''} onChange={e => updatePersonalInfo('email', e.target.value)} placeholder="hello@example.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-white/50">Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                                            <Input className="pl-10 bg-white/5 border-white/10 rounded-xl h-11 focus:ring-indigo-500" value={portfolioData.personalInfo.phone || ''} onChange={e => updatePersonalInfo('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-xs uppercase font-bold text-white/50">Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                                            <Input className="pl-10 bg-white/5 border-white/10 rounded-xl h-11 focus:ring-indigo-500" value={portfolioData.personalInfo.location || ''} onChange={e => updatePersonalInfo('location', e.target.value)} placeholder="City, Country" />
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-white/50">Website</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                                            <Input className="pl-10 bg-white/5 border-white/10 rounded-xl h-11 focus:ring-indigo-500" value={portfolioData.personalInfo.website || ''} onChange={e => updatePersonalInfo('website', e.target.value)} placeholder="https://" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-white/50">LinkedIn</Label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                                            <Input className="pl-10 bg-white/5 border-white/10 rounded-xl h-11 focus:ring-indigo-500" value={portfolioData.personalInfo.linkedInURL || ''} onChange={e => updatePersonalInfo('linkedInURL', e.target.value)} placeholder="Profile URL" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-white/50">GitHub</Label>
                                        <div className="relative">
                                            <Github className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                                            <Input className="pl-10 bg-white/5 border-white/10 rounded-xl h-11 focus:ring-indigo-500" value={portfolioData.personalInfo.githubURL || ''} onChange={e => updatePersonalInfo('githubURL', e.target.value)} placeholder="Profile URL" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Projects - with Image Upload */}
                            <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70">
                                            <MonitorSmartphone className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold">Projects</h3>
                                    </div>
                                    <Button size="sm" onClick={() => setPortfolioData(p => ({ ...p, projects: [...p.projects, { name: 'New Project', tags: [], description: '' }] }))} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
                                        <Plus className="w-4 h-4 mr-2" /> Add
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {portfolioData.projects.map((proj, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 relative group">
                                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 rounded-full" onClick={() => setPortfolioData(p => ({ ...p, projects: p.projects.filter((_, idx) => idx !== i) }))}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <div className="grid md:grid-cols-[120px_1fr] gap-4">
                                                {/* Project Image */}
                                                <div className="relative group/img">
                                                    <div className="w-full aspect-square md:w-28 md:h-28 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                                        {proj.imageURL ? (
                                                            <img src={proj.imageURL} alt={proj.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon className="w-8 h-8" /></div>
                                                        )}
                                                    </div>
                                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer rounded-xl">
                                                        <Upload className="w-5 h-5 text-white" />
                                                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                            if (!e.target.files?.[0]) return;
                                                            const file = e.target.files[0];
                                                            const fileName = `project-${portfolioId}-${i}-${Date.now()}.${file.name.split('.').pop()}`;
                                                            const { error } = await supabase.storage.from('portfolios').upload(`projects/${fileName}`, file);
                                                            if (!error) {
                                                                const { data } = supabase.storage.from('portfolios').getPublicUrl(`projects/${fileName}`);
                                                                const newP = [...portfolioData.projects]; newP[i].imageURL = data.publicUrl; setPortfolioData(p => ({ ...p, projects: newP }));
                                                            }
                                                        }} />
                                                    </label>
                                                </div>
                                                {/* Project Details */}
                                                <div className="space-y-2 flex-1">
                                                    <Input placeholder="Project Name" className="bg-transparent border-none text-lg font-bold p-0 focus-visible:ring-0 placeholder:text-white/20" value={proj.name} onChange={e => { const newP = [...portfolioData.projects]; newP[i].name = e.target.value; setPortfolioData(p => ({ ...p, projects: newP })); }} />
                                                    <Textarea placeholder="Short description..." className="bg-black/20 border-0 rounded-xl text-sm" value={proj.description || ''} onChange={e => { const newP = [...portfolioData.projects]; newP[i].description = e.target.value; setPortfolioData(p => ({ ...p, projects: newP })); }} />
                                                    <Input placeholder="Link (optional)" className="bg-black/20 border-0 rounded-lg text-xs" value={proj.detailsURL || ''} onChange={e => { const newP = [...portfolioData.projects]; newP[i].detailsURL = e.target.value; setPortfolioData(p => ({ ...p, projects: newP })); }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {portfolioData.projects.length === 0 && <p className="text-center text-white/30 py-4 italic">No projects yet. Add your masterpiece.</p>}
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold">Experience</h3>
                                    <Button size="sm" onClick={() => setPortfolioData(p => ({ ...p, experience: [...p.experience, { jobTitle: '', company: '', responsibilities: [] }] }))} className="bg-white/10 hover:bg-white/20 text-white rounded-lg"><Plus className="w-4 h-4 mr-2" /> Add</Button>
                                </div>
                                {portfolioData.experience.map((exp, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 relative space-y-3">
                                        <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 rounded-full" onClick={() => setPortfolioData(p => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }))}><Trash2 className="w-4 h-4" /></Button>
                                        <Input placeholder="Job Title" className="bg-transparent border-b border-white/10 rounded-none text-lg font-bold focus-visible:ring-0" value={exp.jobTitle} onChange={e => { const n = [...portfolioData.experience]; n[i].jobTitle = e.target.value; setPortfolioData(p => ({ ...p, experience: n })); }} />
                                        <Input placeholder="Company" className="bg-transparent border-b border-white/10 rounded-none focus-visible:ring-0" value={exp.company} onChange={e => { const n = [...portfolioData.experience]; n[i].company = e.target.value; setPortfolioData(p => ({ ...p, experience: n })); }} />
                                        <Input placeholder="Dates (e.g., 2020 - Present)" className="bg-transparent border-b border-white/10 rounded-none text-sm focus-visible:ring-0" value={exp.dates || ''} onChange={e => { const n = [...portfolioData.experience]; n[i].dates = e.target.value; setPortfolioData(p => ({ ...p, experience: n })); }} />
                                    </div>
                                ))}
                                {portfolioData.experience.length === 0 && <p className="text-center text-white/30 py-4 italic">No experience added yet.</p>}
                            </div>

                            {/* Education */}
                            <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold">Education</h3>
                                    <Button size="sm" onClick={() => setPortfolioData(p => ({ ...p, education: [...(p.education || []), { degree: '', institution: '' }] }))} className="bg-white/10 hover:bg-white/20 text-white rounded-lg"><Plus className="w-4 h-4 mr-2" /> Add</Button>
                                </div>
                                {(portfolioData.education || []).map((edu, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 relative space-y-3">
                                        <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 rounded-full" onClick={() => setPortfolioData(p => ({ ...p, education: (p.education || []).filter((_, idx) => idx !== i) }))}><Trash2 className="w-4 h-4" /></Button>
                                        <Input placeholder="Degree (e.g., Bachelor of Science)" className="bg-transparent border-b border-white/10 rounded-none text-lg font-bold focus-visible:ring-0" value={edu.degree} onChange={e => { const n = [...(portfolioData.education || [])]; n[i].degree = e.target.value; setPortfolioData(p => ({ ...p, education: n })); }} />
                                        <Input placeholder="Institution" className="bg-transparent border-b border-white/10 rounded-none focus-visible:ring-0" value={edu.institution} onChange={e => { const n = [...(portfolioData.education || [])]; n[i].institution = e.target.value; setPortfolioData(p => ({ ...p, education: n })); }} />
                                        <Input placeholder="Field of Study" className="bg-transparent border-b border-white/10 rounded-none text-sm focus-visible:ring-0" value={edu.field || ''} onChange={e => { const n = [...(portfolioData.education || [])]; n[i].field = e.target.value; setPortfolioData(p => ({ ...p, education: n })); }} />
                                    </div>
                                ))}
                                {(portfolioData.education || []).length === 0 && <p className="text-center text-white/30 py-4 italic">No education added yet.</p>}
                            </div>

                            {/* Certifications */}
                            <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold">Certifications</h3>
                                    <Button size="sm" onClick={() => setPortfolioData(p => ({ ...p, certifications: [...(p.certifications || []), ''] }))} className="bg-white/10 hover:bg-white/20 text-white rounded-lg"><Plus className="w-4 h-4 mr-2" /> Add</Button>
                                </div>
                                {(portfolioData.certifications || []).map((cert, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <Input placeholder="Certification Name" className="bg-white/5 border-white/10 rounded-xl h-11 flex-1" value={cert} onChange={e => { const n = [...(portfolioData.certifications || [])]; n[i] = e.target.value; setPortfolioData(p => ({ ...p, certifications: n })); }} />
                                        <Button size="icon" variant="ghost" className="hover:bg-red-500/10 hover:text-red-400 rounded-full" onClick={() => setPortfolioData(p => ({ ...p, certifications: (p.certifications || []).filter((_, idx) => idx !== i) }))}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                                {(portfolioData.certifications || []).length === 0 && <p className="text-center text-white/30 py-4 italic">No certifications added yet.</p>}
                            </div>

                            {/* Languages */}
                            <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold">Languages</h3>
                                    <Button size="sm" onClick={() => setPortfolioData(p => ({ ...p, languages: [...(p.languages || []), { name: '', level: '' }] }))} className="bg-white/10 hover:bg-white/20 text-white rounded-lg"><Plus className="w-4 h-4 mr-2" /> Add</Button>
                                </div>
                                {(portfolioData.languages || []).map((lang, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <Input placeholder="Language" className="bg-white/5 border-white/10 rounded-xl h-11 flex-1" value={lang.name} onChange={e => { const n = [...(portfolioData.languages || [])]; n[i].name = e.target.value; setPortfolioData(p => ({ ...p, languages: n })); }} />
                                        <Input placeholder="Level (e.g., Native)" className="bg-white/5 border-white/10 rounded-xl h-11 w-32" value={lang.level || ''} onChange={e => { const n = [...(portfolioData.languages || [])]; n[i].level = e.target.value; setPortfolioData(p => ({ ...p, languages: n })); }} />
                                        <Button size="icon" variant="ghost" className="hover:bg-red-500/10 hover:text-red-400 rounded-full" onClick={() => setPortfolioData(p => ({ ...p, languages: (p.languages || []).filter((_, idx) => idx !== i) }))}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                                {(portfolioData.languages || []).length === 0 && <p className="text-center text-white/30 py-4 italic">No languages added yet.</p>}
                            </div>

                            {/* Mobile Actions (Visible only on mobile) */}
                            <div className="lg:hidden pb-20 space-y-3">
                                <Button
                                    onClick={() => handleSave()}
                                    disabled={saving || publishing}
                                    variant="outline"
                                    className="w-full h-12 rounded-xl bg-white/5 border-white/10 text-white font-medium backdrop-blur-md"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>

                                <Button
                                    onClick={handlePublish}
                                    disabled={publishing || saving}
                                    className="w-full h-14 rounded-xl text-lg font-black bg-white text-black shadow-lg hover:bg-white/90 transition-all"
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        {publishing ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Rocket className="w-6 h-6" />
                                        )}
                                        <span>{publishing ? 'Publishing...' : 'Publish to Web'}</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'templates' && (() => {
                        // Filter templates using top-level state
                        const filteredTemplates = AVAILABLE_TEMPLATES.filter(tmpl => {
                            const matchesSearch = tmpl.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                                tmpl.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
                                tmpl.features.some(f => f.toLowerCase().includes(templateSearch.toLowerCase()));
                            const matchesFilter = templateFilter === 'all' ||
                                (templateFilter === 'premium' && tmpl.isPremium) ||
                                (templateFilter === 'standard' && !tmpl.isPremium);
                            return matchesSearch && matchesFilter;
                        });

                        return (
                            <div className="max-w-7xl mx-auto p-4 md:p-8">
                                {/* Header Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-10"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <div>
                                            <h1 className="text-4xl font-black tracking-tight text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                                                Pick your style
                                            </h1>
                                            <p className="text-white/50">Switch templates anytime. Your content stays the same.</p>
                                        </div>

                                        {/* Search & Filters */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            {/* Search */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search templates..."
                                                    value={templateSearch}
                                                    onChange={(e) => setTemplateSearch(e.target.value)}
                                                    className="w-full sm:w-64 px-4 py-2.5 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>

                                            {/* Filters */}
                                            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                                                {(['all', 'premium', 'standard'] as const).map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setTemplateFilter(type)}
                                                        className={cn(
                                                            "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                                            templateFilter === type
                                                                ? "bg-primary text-white shadow-lg"
                                                                : "text-white/50 hover:text-white hover:bg-white/5"
                                                        )}
                                                    >
                                                        {type === 'all' ? 'All' : type === 'premium' ? '⭐ Premium' : 'Standard'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Template Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredTemplates.map((tmpl, index) => (
                                        <motion.div
                                            key={tmpl.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            onClick={() => {
                                                setTemplateId(tmpl.id);
                                                handleSave(true, tmpl.id);
                                            }}
                                            className="group cursor-pointer relative"
                                        >
                                            {/* Glassmorphism Card */}
                                            <div className={cn(
                                                "relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500",
                                                "bg-gradient-to-b from-white/[0.08] to-white/[0.02]",
                                                "backdrop-blur-xl border-2",
                                                templateId === tmpl.id
                                                    ? "border-primary shadow-[0_0_40px_-10px_var(--primary),inset_0_0_30px_rgba(139,92,246,0.1)]"
                                                    : "border-white/10 hover:border-white/25 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                                            )}>
                                                {/* Animated Gradient Background */}
                                                <div
                                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{
                                                        background: `radial-gradient(circle at 50% 0%, ${tmpl.colorScheme.accent}20 0%, transparent 70%)`
                                                    }}
                                                />

                                                {/* Preview Area */}
                                                <div
                                                    className="absolute inset-3 rounded-xl overflow-hidden flex flex-col"
                                                    style={{ backgroundColor: tmpl.colorScheme.bg }}
                                                >
                                                    {/* Simulated Header */}
                                                    <div className="flex justify-between items-center p-2 opacity-50">
                                                        <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: tmpl.colorScheme.bg === '#ffffff' || tmpl.colorScheme.bg === '#fafafa' ? '#000' : '#fff' }} />
                                                        <div className="flex gap-1">
                                                            <div className="w-2 h-1 rounded-full" style={{ backgroundColor: tmpl.colorScheme.bg === '#ffffff' || tmpl.colorScheme.bg === '#fafafa' ? '#000' : '#fff' }} />
                                                            <div className="w-2 h-1 rounded-full" style={{ backgroundColor: tmpl.colorScheme.bg === '#ffffff' || tmpl.colorScheme.bg === '#fafafa' ? '#000' : '#fff' }} />
                                                        </div>
                                                    </div>

                                                    {/* Hero Section */}
                                                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4">
                                                        <div
                                                            className="w-14 h-14 rounded-full"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${tmpl.colorScheme.accent}, ${tmpl.colorScheme.accent}80)`,
                                                                boxShadow: `0 0 30px ${tmpl.colorScheme.accent}40`
                                                            }}
                                                        />
                                                        <div className="w-3/4 h-2 rounded-full opacity-30" style={{ backgroundColor: tmpl.colorScheme.bg === '#ffffff' || tmpl.colorScheme.bg === '#fafafa' ? '#000' : '#fff' }} />
                                                        <div className="w-1/2 h-1.5 rounded-full opacity-20" style={{ backgroundColor: tmpl.colorScheme.bg === '#ffffff' || tmpl.colorScheme.bg === '#fafafa' ? '#000' : '#fff' }} />
                                                    </div>

                                                    {/* Bottom Sections */}
                                                    <div className="grid grid-cols-2 gap-2 p-3 opacity-40">
                                                        <div className="h-8 rounded-lg" style={{ backgroundColor: tmpl.colorScheme.bg === '#ffffff' || tmpl.colorScheme.bg === '#fafafa' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }} />
                                                        <div className="h-8 rounded-lg" style={{ backgroundColor: tmpl.colorScheme.bg === '#ffffff' || tmpl.colorScheme.bg === '#fafafa' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }} />
                                                    </div>

                                                    {/* Template-specific Effects */}
                                                    {tmpl.id === 'aurora' && (
                                                        <div className="absolute inset-0 pointer-events-none">
                                                            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-purple-500/30 to-transparent blur-xl" />
                                                        </div>
                                                    )}
                                                    {tmpl.id === 'cyber' && (
                                                        <div className="absolute inset-0 pointer-events-none opacity-30">
                                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:12px_12px]" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Hover Preview Button */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-sm">
                                                    <button
                                                        className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold flex items-center gap-2 hover:bg-white/20 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTemplateId(tmpl.id);
                                                            handleSave(true, tmpl.id);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Select Template
                                                    </button>
                                                </div>

                                                {/* Selection Check */}
                                                {templateId === tmpl.id && (
                                                    <div className="absolute top-3 right-3 bg-primary text-white p-2 rounded-full shadow-lg">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                )}

                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    {tmpl.isPremium && (
                                                        <span className="px-2 py-1 rounded-md bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                                                            Premium
                                                        </span>
                                                    )}
                                                    {tmpl.isNew && (
                                                        <span className="px-2 py-1 rounded-md bg-gradient-to-r from-emerald-500/80 to-teal-500/80 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                                                            New
                                                        </span>
                                                    )}
                                                    {tmpl.isPopular && (
                                                        <span className="px-2 py-1 rounded-md bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                                                            Popular
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Info Section */}
                                            <div className="mt-4 px-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">{tmpl.name}</h3>
                                                        <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{tmpl.description}</p>
                                                    </div>
                                                    <div
                                                        className="w-4 h-4 rounded-full flex-shrink-0 mt-1 ring-2 ring-white/10"
                                                        style={{ backgroundColor: tmpl.colorScheme.accent }}
                                                    />
                                                </div>

                                                {/* Features */}
                                                <div className="flex flex-wrap gap-1.5 mt-3">
                                                    {tmpl.features.slice(0, 3).map(feature => (
                                                        <span
                                                            key={feature}
                                                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/50 font-medium"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Best For */}
                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/30">
                                                    <span>Best for:</span>
                                                    <span className="text-white/50">{tmpl.bestFor.join(', ')}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Empty State */}
                                {filteredTemplates.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-20"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                            <Grid className="w-8 h-8 text-white/30" />
                                        </div>
                                        <p className="text-white/50 text-lg mb-2">No templates found</p>
                                        <p className="text-white/30 text-sm">Try adjusting your search or filters</p>
                                    </motion.div>
                                )}
                            </div>
                        );
                    })()}

                    {activeTab === 'layout' && (
                        <div className="w-full max-w-2xl mx-auto px-3 py-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-6 sm:mb-8">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1 sm:mb-2">Drag & Drop Layout</h1>
                                <p className="text-sm sm:text-base text-white/50">Reorder the sections to tell your story your way.</p>
                            </div>
                            <div className="glass-card p-2 sm:p-3 rounded-2xl sm:rounded-3xl overflow-hidden">
                                <LayoutEditor sectionOrder={portfolioData.sectionOrder || DEFAULT_SECTION_ORDER} onOrderChange={(newOrder) => setPortfolioData(prev => ({ ...prev, sectionOrder: newOrder }))} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'preview' && (
                        <div className="w-full h-full flex flex-col bg-[#050510]">
                            {/* Preview Controls Bar */}
                            <div className="flex items-center justify-between p-2 sm:p-3 bg-black/40 border-b border-white/5">
                                <div className="hidden sm:block text-xs text-white/40">
                                    Previewing: <span className="text-white font-medium">{AVAILABLE_TEMPLATES.find(t => t.id === templateId)?.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap sm:flex-nowrap">
                                    {/* Template Quick Switcher */}
                                    <select
                                        value={templateId}
                                        onChange={(e) => {
                                            const newId = e.target.value;
                                            setTemplateId(newId);
                                            // SAVE DIRECTLY - NO TIMEOUT
                                            handleSave(true, newId);
                                        }}
                                        className="bg-white/10 border border-white/10 rounded-md sm:rounded-lg text-[10px] sm:text-xs text-white px-1.5 sm:px-2 py-1 sm:py-1.5 focus:outline-none focus:ring-1 focus:ring-white/20"
                                    >
                                        {AVAILABLE_TEMPLATES.map(t => (
                                            <option key={t.id} value={t.id} className="bg-neutral-900">{t.name}</option>
                                        ))}
                                    </select>

                                    {/* Color Theme Swatches */}
                                    <div className={cn(
                                        "flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-white/5 rounded-md sm:rounded-lg border border-white/10 relative transition-all",
                                        templateId === 'cyber' && "opacity-40 grayscale pointer-events-none"
                                    )}>
                                        {[
                                            { id: 'purple', color: '#8b5cf6' },
                                            { id: 'blue', color: '#3b82f6' },
                                            { id: 'green', color: '#10b981' },
                                            { id: 'orange', color: '#f97316' },
                                            { id: 'red', color: '#ef4444' },
                                            { id: 'indigo', color: '#6366f1' },
                                            { id: 'pink', color: '#ec4899' },
                                        ].map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => {
                                                    setColorTheme(theme.id);
                                                    // SAVE DIRECTLY - NO TIMEOUT
                                                    handleSave(true, undefined, theme.id);
                                                }}
                                                className={cn(
                                                    "w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border sm:border-2 hover:scale-110 transition-all",
                                                    colorTheme === theme.id ? "border-white ring-1 sm:ring-2 ring-white/30 scale-110" : "border-white/20 hover:border-white/40"
                                                )}
                                                style={{ backgroundColor: theme.color }}
                                                title={theme.id.charAt(0).toUpperCase() + theme.id.slice(1)}
                                            />
                                        ))}
                                    </div>

                                    {/* Dark/Light Mode Toggle - ONLY affects template preview */}
                                    <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-white/5 rounded-md sm:rounded-lg border border-white/10">
                                        <button
                                            onClick={() => setIsDarkMode(true)}
                                            className={cn(
                                                "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1",
                                                isDarkMode
                                                    ? "bg-white/10 text-white"
                                                    : "text-white/40 hover:text-white/60"
                                            )}
                                            title="Dark Mode"
                                        >
                                            <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            <span className="hidden xs:inline sm:inline">Dark</span>
                                        </button>
                                        <button
                                            onClick={() => setIsDarkMode(false)}
                                            className={cn(
                                                "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1",
                                                !isDarkMode
                                                    ? "bg-white/10 text-white"
                                                    : "text-white/40 hover:text-white/60"
                                            )}
                                            title="Light Mode"
                                        >
                                            <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            <span className="hidden xs:inline sm:inline">Light</span>
                                        </button>
                                    </div>


                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden relative">
                                {portfolioId ? (
                                    <iframe
                                        src={`/render/${portfolioId}?template=${templateId}&theme=${isDarkMode ? 'dark' : 'light'}&color=${colorTheme}&t=${previewKey}`}
                                        className={cn(
                                            "border-0 select-none bg-neutral-900 transition-all duration-500 shadow-2xl",
                                            previewDevice === 'desktop' && "w-full h-full",
                                            previewDevice === 'tablet' && "w-[768px] h-[1024px] mx-auto mt-4 rounded-[2rem] border-8 border-neutral-800",
                                            previewDevice === 'mobile' && "w-[375px] h-[667px] mx-auto mt-4 rounded-[2.5rem] border-[6px] border-neutral-800"
                                        )}
                                        style={previewDevice !== 'desktop' ? {
                                            transform: `scale(${previewDevice === 'tablet' ? 0.35 : 0.45})`,
                                            transformOrigin: 'top center'
                                        } : {}}
                                        title="Portfolio Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-8 h-8 animate-spin text-white/20" />
                                    </div>
                                )}
                            </div>

                            {/* Desktop: Removed Open in new tab hint as requested */}
                        </div>
                    )}
                </main>
            </div>

            {/* --- MOBILE NAVIGATION (Bottom) --- */}
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Onboarding Tour */}
            <OnboardingTour />

            {/* Publish Dialog */}
            <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
                <DialogContent className="sm:max-w-md bg-[#0f1014] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-indigo-400">
                            <Rocket className="w-6 h-6" />
                            {dictionary.preview.successTitle}
                        </DialogTitle>
                        <DialogDescription className="text-white/60">
                            {dictionary.preview.successDesc}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                        <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg text-sm text-indigo-200">
                            <strong>Note:</strong> This is your unique public link. Share it with the world!
                        </div>

                        <div className="flex items-center space-x-2">
                            <Input value={publishedUrl} readOnly className="h-10 bg-black/40 border-white/10 text-white" />
                            <Button size="icon" onClick={() => {
                                navigator.clipboard.writeText(publishedUrl);
                                setHasCopied(true);
                                setTimeout(() => setHasCopied(false), 2000);
                                toast({ title: "Copied!", description: "URL copied to clipboard." });
                            }} className="bg-indigo-600 hover:bg-indigo-500">
                                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                        <Button onClick={() => window.open(publishedUrl, '_blank')} variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                            Visit Live Site <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <ProPaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
                templateName={AVAILABLE_TEMPLATES.find(t => t.id === templateId)?.name}
            />
        </div>
    );
}
