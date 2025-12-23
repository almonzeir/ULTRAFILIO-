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

// --- TEMPLATES DATA (Moved from choose-template) ---
const AVAILABLE_TEMPLATES = [
    { id: 'aurora', name: 'Aurora', description: 'Award-winning design with aurora backgrounds.', isNew: true },
    { id: 'liquid-silk', name: 'Liquid Silk', description: 'Architectural minimalism with mesh gradients.', isNew: true },
    { id: 'modern', name: 'Modern', description: 'Premium & Dynamic design with smooth animations.', isPopular: true },
    { id: 'executive', name: 'Executive', description: 'Professional & Bold design for serious pros.', isPopular: true },
    { id: 'creative', name: 'Creative', description: 'Artistic & Unique with bold gradients.' },
    { id: 'minimal-plus', name: 'Minimal Plus', description: 'Clean & Elegant with sophistical interactions.' },
    { id: 'generated', name: 'Futuristic', description: 'Tech-Forward design with cutting-edge styling.' },
    { id: 'minimalist', name: 'Minimalist', description: 'Ultra Simple and distraction-free.' },
    { id: 'cyber', name: 'Cyber 3D', description: 'Experimental 3D Interactive Experience.', isNew: true },
    { id: 'basic', name: 'Basic', description: 'Classic Resume style.' },
];

export default function EditPortfolioPage() {
    const params = useParams();
    const portfolioId = params.portfolioId as string;
    const router = useRouter();
    const { user, isPro, loading: userLoading } = useUser();
    const { toast } = useToast();
    const { dictionary, language } = useDictionary();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [activeTab, setActiveTab] = useState('edit');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [templateId, setTemplateId] = useState('modern');
    const [colorTheme, setColorTheme] = useState('purple');
    const [isMobileView, setIsMobileView] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

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
                        skills: data.skills || [],
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
                color_theme: overrideColorTheme || colorTheme,
                updated_at: new Date().toISOString(),
                section_order: portfolioData.sectionOrder
            };

            const { error } = await supabase.from('portfolios').update(updates).eq('id', portfolioId);
            if (error) throw error;
            if (!silent) toast({ title: "Saved", description: "Changes saved successfully." });
            setPreviewKey(Date.now()); // Refresh preview iframe
        } catch (e: any) {
            if (!silent) toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setSaving(false);
        }
    };

    const [isPaywallOpen, setIsPaywallOpen] = useState(false);

    const handlePublish = async () => {
        if (!portfolioId) return;

        if (!isPro) {
            setIsPaywallOpen(true);
            return;
        }

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

                    {activeTab === 'templates' && (
                        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-8">
                            <div className="mb-10 text-center lg:text-left">
                                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Pick your style</h1>
                                <p className="text-white/40">Switch templates anytime. Your content stays the same.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {AVAILABLE_TEMPLATES.map((tmpl) => (
                                    <div
                                        key={tmpl.id}
                                        onClick={() => {
                                            setTemplateId(tmpl.id);
                                            // SAVE DIRECTLY - NO TIMEOUT
                                            handleSave(true, tmpl.id);
                                        }}
                                        className="group cursor-pointer"
                                    >
                                        {/* Card Container */}
                                        <div className={cn(
                                            "relative aspect-[4/5] rounded-3xl overflow-hidden transition-all duration-500 border-2",
                                            templateId === tmpl.id
                                                ? "border-primary shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)] scale-[1.05]"
                                                : "border-white/5 hover:border-white/20 hover:scale-[1.02]"
                                        )}>
                                            {/* Micro-Preview / Wireframe (CSS Based) */}
                                            <div className={cn(
                                                "absolute inset-0 p-3 flex flex-col gap-2",
                                                tmpl.id === 'aurora' && "bg-[#0f0720]",
                                                tmpl.id === 'liquid-silk' && "bg-[#050510]",
                                                tmpl.id === 'modern' && "bg-[#0a0a0f]",
                                                tmpl.id === 'executive' && "bg-[#111111]",
                                                tmpl.id === 'creative' && "bg-[#1a0505]",
                                                tmpl.id === 'minimal-plus' && "bg-[#fafafa]",
                                                tmpl.id === 'minimalist' && "bg-white",
                                                tmpl.id === 'cyber' && "bg-black",
                                                tmpl.id === 'basic' && "bg-neutral-900"
                                            )}>
                                                {/* Simulated Header */}
                                                <div className="flex justify-between items-center opacity-40">
                                                    <div className={cn("w-4 h-1.5 rounded-full", tmpl.id === 'minimalist' || tmpl.id === 'minimal-plus' ? "bg-black" : "bg-white")} />
                                                    <div className="flex gap-1">
                                                        <div className={cn("w-2 h-1 rounded-full", tmpl.id === 'minimalist' || tmpl.id === 'minimal-plus' ? "bg-black" : "bg-white")} />
                                                        <div className={cn("w-2 h-1 rounded-full", tmpl.id === 'minimalist' || tmpl.id === 'minimal-plus' ? "bg-black" : "bg-white")} />
                                                    </div>
                                                </div>

                                                {/* Simulated Hero */}
                                                <div className="mt-4 space-y-2">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full mx-auto",
                                                        tmpl.id === 'aurora' && "bg-gradient-to-tr from-purple-500 to-pink-500",
                                                        tmpl.id === 'modern' && "bg-blue-500",
                                                        tmpl.id === 'executive' && "bg-amber-500/20 border border-amber-500/50",
                                                        tmpl.id === 'creative' && "bg-rose-500",
                                                        tmpl.id === 'minimal-plus' && "bg-neutral-200",
                                                        (tmpl.id === 'minimalist' || tmpl.id === 'basic') && "bg-neutral-300",
                                                        tmpl.id === 'cyber' && "bg-cyan-500/20 border border-cyan-400"
                                                    )} />
                                                    <div className={cn("h-2 w-3/4 mx-auto rounded-full", tmpl.id === 'minimalist' || tmpl.id === 'minimal-plus' ? "bg-black/10" : "bg-white/10")} />
                                                    <div className={cn("h-1.5 w-1/2 mx-auto rounded-full", tmpl.id === 'minimalist' || tmpl.id === 'minimal-plus' ? "bg-black/5" : "bg-white/5")} />
                                                </div>

                                                {/* Simulated Sections */}
                                                <div className="mt-auto grid grid-cols-2 gap-2 opacity-30">
                                                    <div className={cn("h-8 rounded-lg", tmpl.id === 'minimalist' || tmpl.id === 'minimal-plus' ? "bg-black/5" : "bg-white/5")} />
                                                    <div className={cn("h-8 rounded-lg", tmpl.id === 'minimalist' || tmpl.id === 'minimal-plus' ? "bg-black/5" : "bg-white/5")} />
                                                </div>

                                                {/* Abstract Accents (Template Specific) */}
                                                {tmpl.id === 'aurora' && (
                                                    <div className="absolute inset-x-0 top-0 h-10 bg-purple-600/20 blur-xl rounded-full translate-y--5" />
                                                )}
                                                {tmpl.id === 'cyber' && (
                                                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                                                )}
                                            </div>

                                            {/* Selection Overlay */}
                                            {templateId === tmpl.id && (
                                                <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center">
                                                    <div className="bg-primary text-white p-2 rounded-full shadow-lg scale-110">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Label Area */}
                                        <div className="mt-4 px-2">
                                            <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{tmpl.name}</h3>
                                            <div className="flex items-center gap-1.5 mt-1 shrink-0">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    tmpl.id === 'cyber' ? "bg-cyan-400" :
                                                        tmpl.id === 'aurora' ? "bg-purple-400" :
                                                            tmpl.id === 'creative' ? "bg-rose-400" : "bg-white/20"
                                                )} />
                                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                                                    {tmpl.id === 'cyber' || tmpl.id === 'aurora' ? 'Premium' : 'Standard'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {activeTab === 'layout' && (
                        <div className="max-w-2xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Drag & Drop Layout</h1>
                                <p className="text-white/50">Reorder the sections to tell your story your way.</p>
                            </div>
                            <div className="glass-card p-2 rounded-3xl">
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

                            {/* Desktop: Open in new tab hint */}
                            <div className="hidden lg:flex justify-center p-2 bg-black/20 text-[10px] text-white/30 uppercase tracking-widest">
                                Live Preview Mode • <a href={`/render/${portfolioId}?template=${templateId}`} target="_blank" className="hover:text-white ml-1 underline">Open Fullscreen</a>
                            </div>
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
