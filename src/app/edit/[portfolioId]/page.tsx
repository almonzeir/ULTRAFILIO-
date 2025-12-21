'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Loader2, Save, Rocket, ArrowLeft, Plus, Trash2, LayoutGrid,
    Upload, X, Moon, Sun, Image as ImageIcon, Copy, Check
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
import { useDictionary } from '@/hooks/use-dictionary';

import { cn } from '@/lib/utils';
import { TEMPLATES } from '@/lib/templates';
import { CheckCircle2 } from 'lucide-react';


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

const DEFAULT_SECTION_ORDER = ['hero', 'about', 'experience', 'projects', 'education', 'certifications', 'skills', 'contact'];

const TemplateComponent = ({ data, templateId, isDarkMode }: { data: PortfolioData, templateId: string, isDarkMode: boolean }) => {
    // Inject dark mode class
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    switch (templateId) {
        case 'modern': return <ModernTemplate data={data} />;
        case 'executive': return <ExecutiveTemplate data={data} />;
        case 'creative': return <CreativeTemplate data={data} />;
        case 'minimal-plus': return <MinimalPlusTemplate data={data} />;
        case 'basic': return <BasicTemplate data={data} />;
        case 'minimalist': return <MinimalistTemplate data={data} />;
        case 'cyber': return <Cyber3DTemplate data={data} />;
        case 'aurora': return <AuroraTemplate data={data} />;

        case 'generated': return <GeneratedModernTemplate data={data} />;
        default: return <ModernTemplate data={data} />;
    }
};

export default function EditPortfolioPage() {
    const params = useParams();
    const portfolioId = params.portfolioId as string;
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const { toast } = useToast();
    const { dictionary, language } = useDictionary();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [activeTab, setActiveTab] = useState('edit');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [templateId, setTemplateId] = useState('modern');
    const [isMobileView, setIsMobileView] = useState(false);

    // Portfolio Data State
    const [portfolioData, setPortfolioData] = useState<PortfolioData>({
        personalInfo: {
            fullName: '',
            title: '',
            tagline: '',
            email: '',
            location: '',
            website: '',
            linkedInURL: '',
            githubURL: '',
            profilePhotoURL: '',
        },
        about: {
            extendedBio: '',
            skills: [],
        },
        projects: [],
        experience: [],
        education: [],
        certifications: [],
        languages: [],
        sectionOrder: DEFAULT_SECTION_ORDER,
    });

    // Publish Success State
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [publishedUrl, setPublishedUrl] = useState('');
    const [hasCopied, setHasCopied] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!user || !portfolioId) return;

            try {
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('id', portfolioId)
                    .single();

                if (error) throw error;
                if (!data) throw new Error('Portfolio not found');

                // Check ownership
                if (data.user_id !== user.id) {
                    toast({ variant: 'destructive', title: 'Unauthorized', description: 'You do not have permission to edit this portfolio.' });
                    router.push('/dashboard');
                    return;
                }

                setTemplateId(data.template_id || 'modern');

                // Map DB data to local state
                setPortfolioData({
                    personalInfo: {
                        fullName: data.title ? data.title.replace("'s Portfolio", "") : "User Name",
                        title: data.subtitle || "",
                        tagline: data.description || "", // Mapping description to tagline
                        email: data.email || "",
                        location: data.location || "",
                        website: data.website || "",
                        linkedInURL: data.linkedin || "",
                        githubURL: data.github || "",
                        profilePhotoURL: data.profile_photo_url || "",
                    },
                    about: {
                        extendedBio: data.description || "", // Mapping description to extendedBio as well (shared field)
                        skills: data.skills || [],
                    },
                    projects: data.projects || [],
                    experience: data.experience || [],
                    education: data.education || [],
                    certifications: data.certifications || [],
                    languages: data.languages || [],
                    sectionOrder: data.section_order || DEFAULT_SECTION_ORDER, // Assuming section_order column
                });

            } catch (error: any) {
                console.error('Error fetching portfolio:', error);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to load portfolio.' });
            } finally {
                setLoading(false);
            }
        };

        if (!userLoading) {
            fetchPortfolio();
        }
    }, [user, userLoading, portfolioId, router, toast]);

    const handleSave = async () => {
        if (!portfolioId || !user) return;
        setSaving(true);
        try {
            // Map state back to DB columns
            const updates: Record<string, any> = {
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

                template_id: templateId,
                updated_at: new Date().toISOString(),
            };

            // Try to save with section_order first
            let error;
            try {
                const result = await supabase
                    .from('portfolios')
                    .update({ ...updates, section_order: portfolioData.sectionOrder })
                    .eq('id', portfolioId);
                error = result.error;
            } catch {
                error = { message: 'section_order failed' };
            }

            // If section_order column doesn't exist, save without it
            if (error && (error.message?.includes('section_order') || error.message?.includes('column'))) {
                console.log('section_order column not found, saving without it');
                const result = await supabase
                    .from('portfolios')
                    .update(updates)
                    .eq('id', portfolioId);
                error = result.error;
            }

            if (error) throw error;

            toast({ title: dictionary?.editor?.saved || "Saved", description: dictionary?.editor?.saveSuccess || "Changes saved successfully." });
        } catch (error: any) {
            console.error('Error saving:', error);
            toast({ variant: 'destructive', title: dictionary?.editor?.error || 'Error', description: error.message || 'Failed to save changes.' });
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!portfolioId || !user) return;
        setPublishing(true);
        try {
            await handleSave(); // Ensure saved first

            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch('/api/portfolio/publish', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    portfolioId,
                    templateId,
                    portfolioData // Pass the full data object for generation
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to publish');
            }

            const { url } = await response.json();
            setPublishedUrl(url);
            setPublishDialogOpen(true);
        } catch (error: any) {
            console.error('Error publishing:', error);
            toast({ variant: 'destructive', title: dictionary?.editor?.error || 'Error', description: error.message || 'Could not publish portfolio.' });
        } finally {
            setPublishing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publishedUrl);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
        toast({ title: "Copied!", description: "URL copied to clipboard." });
    };

    // Helper functions
    const updatePersonalInfo = (field: keyof PortfolioData['personalInfo'], value: string) => {
        setPortfolioData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const updateAbout = (field: keyof PortfolioData['about'], value: any) => {
        setPortfolioData(prev => ({
            ...prev,
            about: { ...prev.about, [field]: value }
        }));
    };

    const updateProject = (index: number, field: string, value: any) => {
        setPortfolioData(prev => {
            const newProjects = [...prev.projects];
            newProjects[index] = { ...newProjects[index], [field]: value };
            return { ...prev, projects: newProjects };
        });
    };

    const addProject = () => {
        setPortfolioData(prev => ({
            ...prev,
            projects: [...prev.projects, { name: dictionary?.editor?.newProject || 'New Project', tags: [] }]
        }));
    };

    const removeProject = (index: number) => {
        setPortfolioData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const updateExperience = (index: number, field: string, value: any) => {
        setPortfolioData(prev => {
            const newExp = [...prev.experience];
            newExp[index] = { ...newExp[index], [field]: value };
            return { ...prev, experience: newExp };
        });
    };

    const addExperience = () => {
        setPortfolioData(prev => ({
            ...prev,
            experience: [...prev.experience, { jobTitle: dictionary?.editor?.jobTitle || 'Job Title', company: dictionary?.editor?.company || 'Company', responsibilities: [] }]
        }));
    };

    const removeExperience = (index: number) => {
        setPortfolioData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const updateEducation = (index: number, field: string, value: any) => {
        setPortfolioData(prev => {
            const newEdu = [...(prev.education || [])];
            newEdu[index] = { ...newEdu[index], [field]: value };
            return { ...prev, education: newEdu };
        });
    };

    const addEducation = () => {
        setPortfolioData(prev => ({
            ...prev,
            education: [...(prev.education || []), { degree: dictionary?.editor?.degree || 'Degree', institution: dictionary?.editor?.institution || 'Institution' }]
        }));
    };

    const removeEducation = (index: number) => {
        setPortfolioData(prev => ({
            ...prev,
            education: (prev.education || []).filter((_, i) => i !== index)
        }));
    };

    const handleProjectImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `project-${index}-${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `projects/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolios')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('portfolios').getPublicUrl(filePath);

            updateProject(index, 'imageURL', data.publicUrl);
            toast({ title: dictionary?.editor?.uploadSuccess || "Image Uploaded", description: "Project image saved successfully." });
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({ variant: 'destructive', title: dictionary?.editor?.uploadError || "Upload Failed", description: error.message || "Could not upload image." });
        }
    };

    const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `profile-${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `photos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolios')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('portfolios').getPublicUrl(filePath);

            updatePersonalInfo('profilePhotoURL', data.publicUrl);
            toast({ title: dictionary?.editor?.uploadSuccess || "Photo Uploaded", description: "Profile photo saved successfully." });
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({ variant: 'destructive', title: dictionary?.editor?.uploadError || "Upload Failed", description: error.message || "Could not upload photo." });
        }
    };

    if (loading || userLoading || !dictionary) {
        return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    const dict = dictionary.editor;

    return (
        <div className="min-h-screen bg-background">
            {/* Publish Success Dialog */}
            <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <Rocket className="w-6 h-6" />
                            {dictionary.preview.successTitle}
                        </DialogTitle>
                        <DialogDescription>
                            {dictionary.preview.successDesc}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-sm text-amber-800 dark:text-amber-200">
                            <strong>Note:</strong> This is your unique public link. Please copy it and save it in a safe place.
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">Link</Label>
                                <Input id="link" defaultValue={publishedUrl} readOnly className="h-9" />
                            </div>
                            <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                                <span className="sr-only">Copy</span>
                                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="rounded-full hover:bg-muted">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black tracking-widest uppercase text-muted-foreground leading-none mb-1">Portfolio Studio</h1>
                            <h2 className="text-lg font-bold truncate max-w-[200px]">{portfolioData.personalInfo.fullName || 'Untitled'}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-muted/50 p-1 rounded-xl">
                            <TabsList className="bg-transparent border-0 gap-1">
                                <TabsTrigger value="edit" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">{dict.edit || 'Edit'}</TabsTrigger>
                                <TabsTrigger value="layout" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">{dict.layout || 'Layout'}</TabsTrigger>
                                <TabsTrigger value="templates" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">Templates</TabsTrigger>
                                <TabsTrigger value="preview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">{dict.preview || 'Preview'}</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="h-6 w-[1px] bg-border mx-2" />

                        {/* Appearance Toggle */}
                        <div className="flex bg-muted/50 rounded-xl p-1">
                            <button
                                onClick={() => setIsDarkMode(false)}
                                className={`p-2 rounded-lg transition-all ${!isDarkMode ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Light Mode"
                            >
                                <Sun size={16} />
                            </button>
                            <button
                                onClick={() => setIsDarkMode(true)}
                                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Dark Mode"
                            >
                                <Moon size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-40">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/10 blur-[150px] rounded-full" />
            </div>

            {/* Main Content */}
            {activeTab === 'edit' ? (
                <main className="container py-8 max-w-4xl mx-auto space-y-8 pb-32">

                    {/* Personal Info */}
                    <Card className="rounded-3xl bg-card/40 backdrop-blur-xl border-border shadow-2xl overflow-hidden group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-primary rounded-full" />
                                {dict.personalInfo}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {/* Profile Photo Upload */}
                            <div className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-2xl bg-muted/30 border border-white/5">
                                <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-primary/20 bg-muted/50 flex items-center justify-center shrink-0 shadow-inner group/photo">
                                    {portfolioData.personalInfo.profilePhotoURL ? (
                                        <img src={portfolioData.personalInfo.profilePhotoURL} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-110" />
                                    ) : (
                                        <ImageIcon className="h-10 w-10 text-primary opacity-20" />
                                    )}
                                    {portfolioData.personalInfo.profilePhotoURL && (
                                        <button
                                            onClick={() => updatePersonalInfo('profilePhotoURL', '')}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity"
                                        >
                                            <Trash2 className="h-6 w-6 text-white" />
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3 flex-1 text-center md:text-left">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Portfolio Identity</Label>
                                        <h4 className="font-bold">Set your professional avatar</h4>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                        <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm cursor-pointer hover:bg-primary/90 transition-all active:scale-95">
                                            <Upload className="w-4 h-4" />
                                            {dict.uploadPhoto}
                                            <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                                        </label>
                                    </div>
                                    <p className="text-xs text-muted-foreground italic">Optimal: 1000x1000px · PNG or JPG</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                    <Input className="rounded-xl border-muted-foreground/10 focus:ring-primary h-12" value={portfolioData.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Professional Title</Label>
                                    <Input className="rounded-xl border-muted-foreground/10 focus:ring-primary h-12" value={portfolioData.personalInfo.title} onChange={(e) => updatePersonalInfo('title', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Tagline / Bio</Label>
                                <Textarea className="rounded-xl border-muted-foreground/10 focus:ring-primary min-h-[100px]" value={portfolioData.personalInfo.tagline} onChange={(e) => updatePersonalInfo('tagline', e.target.value)} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2"><Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Email</Label><Input className="rounded-xl h-12" value={portfolioData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} /></div>
                                <div className="space-y-2"><Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Location</Label><Input className="rounded-xl h-12" value={portfolioData.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} /></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2"><Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">LinkedIn</Label><Input className="rounded-xl h-12" value={portfolioData.personalInfo.linkedInURL} onChange={(e) => updatePersonalInfo('linkedInURL', e.target.value)} /></div>
                                <div className="space-y-2"><Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">GitHub</Label><Input className="rounded-xl h-12" value={portfolioData.personalInfo.githubURL} onChange={(e) => updatePersonalInfo('githubURL', e.target.value)} /></div>
                            </div>
                            <div className="space-y-2"><Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Personal Website</Label><Input className="rounded-xl h-12" value={portfolioData.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} /></div>
                        </CardContent>
                    </Card>

                    {/* About & Skills */}
                    <Card className="rounded-3xl bg-card/40 backdrop-blur-xl border-border shadow-2xl overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                                {dict.aboutSkills}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Bio / About</Label>
                                <Textarea className="rounded-xl border-muted-foreground/10 focus:ring-primary min-h-[200px]" value={portfolioData.about.extendedBio} onChange={(e) => updateAbout('extendedBio', e.target.value)} rows={5} />
                            </div>
                            <div className="space-y-2 p-6 rounded-2xl bg-muted/20 border border-white/5">
                                <Label className="font-bold text-xs uppercase tracking-widest text-primary mb-2 block">Skills & Expertise</Label>
                                <Input
                                    className="rounded-xl h-12 bg-background/50"
                                    placeholder="React, Design Systems, UX Strategy..."
                                    value={portfolioData.about.skills?.flatMap(s => s.tags).join(', ') || ''}
                                    onChange={(e) => updateAbout('skills', [{ category: 'General', tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }])}
                                />
                                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-tight">Separate tags with commas</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Projects */}
                    <Card className="rounded-3xl bg-card/40 backdrop-blur-xl border-border shadow-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-violet-500 rounded-full" />
                                {dict.projects}
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={addProject} className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            {portfolioData.projects.map((proj, idx) => (
                                <div key={idx} className="group/item p-6 rounded-3xl border border-border/50 bg-muted/10 transition-all hover:bg-muted/20 relative">
                                    <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all" onClick={() => removeProject(idx)}><Trash2 className="h-4 w-4" /></Button>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Project Name</Label><Input className="rounded-xl h-12" value={proj.name} onChange={(e) => updateProject(idx, 'name', e.target.value)} /></div>
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Project URL</Label><Input className="rounded-xl h-12" value={proj.detailsURL || ''} onChange={(e) => updateProject(idx, 'detailsURL', e.target.value)} placeholder="https://..." /></div>
                                    </div>
                                    <div className="space-y-2 mb-6"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Success Description</Label><Textarea className="rounded-xl" value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} rows={3} /></div>
                                    <div className="space-y-2 mb-6"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Stack / Tags</Label><Input className="rounded-xl h-12" value={proj.tags?.join(', ') || ''} onChange={(e) => updateProject(idx, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} /></div>

                                    <div className="p-4 rounded-2xl bg-background/40 border border-white/5">
                                        <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">Project Visual</Label>
                                        <div className="flex items-center gap-6">
                                            {proj.imageURL ? (
                                                <div className="relative w-40 h-24 rounded-2xl overflow-hidden border shadow-xl">
                                                    <img src={proj.imageURL} alt="Preview" className="w-full h-full object-cover" />
                                                    <button onClick={() => updateProject(idx, 'imageURL', '')} className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white"><X size={20} /></button>
                                                </div>
                                            ) : (
                                                <div className="w-40 h-24 bg-muted/50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-muted-foreground/30 text-muted-foreground">
                                                    <ImageIcon className="h-8 w-8 opacity-20 mb-1" />
                                                    <span className="text-[10px] uppercase font-black opacity-30 tracking-tighter">No Preview</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <label className="inline-flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary rounded-xl font-bold text-xs cursor-pointer hover:bg-primary/5 transition-all">
                                                    <Upload className="w-3 h-3" />
                                                    Upload Screenshot
                                                    <input type="file" accept="image/*" onChange={(e) => handleProjectImageUpload(idx, e)} className="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {portfolioData.projects.length === 0 && (
                                <div className="text-center py-12 border border-dashed rounded-3xl opacity-50">
                                    <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"><Plus className="w-6 h-6" /></div>
                                    <p className="font-bold">Showcase your masterpiece</p>
                                    <p className="text-xs">Add your first project to impress recruiters.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Experience */}
                    <Card className="rounded-3xl bg-card/40 backdrop-blur-xl border-border shadow-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                                {dict.experience}
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={addExperience} className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {portfolioData.experience.map((exp, idx) => (
                                <div key={idx} className="p-6 rounded-3xl border border-border/50 bg-muted/10 transition-all hover:bg-muted/20 relative">
                                    <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all" onClick={() => removeExperience(idx)}><Trash2 className="h-4 w-4" /></Button>
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Job Title</Label><Input className="rounded-xl h-12" value={exp.jobTitle} onChange={(e) => updateExperience(idx, 'jobTitle', e.target.value)} /></div>
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Company</Label><Input className="rounded-xl h-12" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} /></div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Dates</Label><Input className="rounded-xl h-12" value={exp.dates} onChange={(e) => updateExperience(idx, 'dates', e.target.value)} placeholder="2020 - Present" /></div>
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Location</Label><Input className="rounded-xl h-12" value={exp.location || ''} onChange={(e) => updateExperience(idx, 'location', e.target.value)} /></div>
                                    </div>
                                    <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Key Impact Bullets (One per line)</Label><Textarea className="rounded-xl" value={exp.responsibilities.join('\n')} onChange={(e) => updateExperience(idx, 'responsibilities', e.target.value.split('\n').filter(Boolean))} rows={4} placeholder="Summarize your achievements..." /></div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card className="rounded-3xl bg-card/40 backdrop-blur-xl border-border shadow-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-blue-500 rounded-full" />
                                {dict.education}
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={addEducation} className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {(portfolioData.education || []).map((ed, idx) => (
                                <div key={idx} className="p-6 rounded-3xl border border-border/50 bg-muted/10 transition-all hover:bg-muted/20 relative">
                                    <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all" onClick={() => removeEducation(idx)}><Trash2 className="h-4 w-4" /></Button>
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Degree</Label><Input className="rounded-xl h-12" value={ed.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} /></div>
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Institution</Label><Input className="rounded-xl h-12" value={ed.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} /></div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Completion Year</Label><Input className="rounded-xl h-12" value={ed.endDate || ''} onChange={(e) => updateEducation(idx, 'endDate', e.target.value)} placeholder="e.g. 2018 - 2022" /></div>
                                        <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest opacity-60">Field of Study</Label><Input className="rounded-xl h-12" value={ed.field || ''} onChange={(e) => updateEducation(idx, 'field', e.target.value)} /></div>
                                    </div>
                                </div>
                            ))}
                            {(!portfolioData.education || portfolioData.education.length === 0) && (
                                <div className="text-center py-6 border border-dashed rounded-3xl opacity-50">
                                    <p className="text-sm font-medium">Add your academic background</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card className="rounded-3xl bg-card/40 backdrop-blur-xl border-border shadow-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-amber-500 rounded-full" />
                                {dict.certifications}
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setPortfolioData(prev => ({ ...prev, certifications: [...(prev.certifications || []), ""] }))} className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {(portfolioData.certifications || []).map((cert, idx) => (
                                <div key={idx} className="flex gap-3 group/cert">
                                    <Input className="rounded-xl h-12 flex-1" value={cert} onChange={(e) => setPortfolioData(prev => ({ ...prev, certifications: (prev.certifications || []).map((c, i) => i === idx ? e.target.value : c) }))} placeholder="e.g. AWS Certified Solution Architect" />
                                    <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5" onClick={() => setPortfolioData(prev => ({ ...prev, certifications: (prev.certifications || []).filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            ))}
                            {(!portfolioData.certifications || portfolioData.certifications.length === 0) && <p className="text-center text-muted-foreground text-sm font-medium py-4">No certifications added yet.</p>}
                        </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card className="rounded-3xl bg-card/40 backdrop-blur-xl border-border shadow-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-cyan-500 rounded-full" />
                                {dict.languages}
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setPortfolioData(prev => ({ ...prev, languages: [...(prev.languages || []), { name: "", level: "Native" }] }))} className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {(portfolioData.languages || []).map((lang, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-muted/10 border border-border/50 items-center">
                                    <Input className="rounded-xl h-12 flex-1" value={lang.name} onChange={(e) => setPortfolioData(prev => ({ ...prev, languages: (prev.languages || []).map((l, i) => i === idx ? { ...l, name: e.target.value } : l) }))} placeholder="Language (e.g. Spanish)" />
                                    <Input className="rounded-xl h-12 sm:w-48" value={lang.level} onChange={(e) => setPortfolioData(prev => ({ ...prev, languages: (prev.languages || []).map((l, i) => i === idx ? { ...l, level: e.target.value } : l) }))} placeholder="Level (e.g. Fluent)" />
                                    <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0" onClick={() => setPortfolioData(prev => ({ ...prev, languages: (prev.languages || []).filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            ))}
                            {(!portfolioData.languages || portfolioData.languages.length === 0) && <p className="text-center text-muted-foreground text-sm font-medium py-4">Add the languages you speak.</p>}
                        </CardContent>
                    </Card>

                </main>
            ) : activeTab === 'layout' ? (
                <main className="container py-12 max-w-2xl mx-auto pb-32">
                    <Card className="rounded-3xl bg-card/40 backdrop-blur-xl border-border shadow-2xl overflow-hidden">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-primary rounded-full" />
                                {dict.layout}
                            </CardTitle>
                            <CardDescription className="text-sm font-medium opacity-60">Drag and drop sections to customize your portfolio's narrative flow.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <LayoutEditor sectionOrder={portfolioData.sectionOrder || DEFAULT_SECTION_ORDER} onOrderChange={(newOrder) => setPortfolioData(prev => ({ ...prev, sectionOrder: newOrder }))} />
                        </CardContent>
                    </Card>
                </main>
            ) : activeTab === 'templates' ? (
                <main className="container py-12 max-w-6xl mx-auto pb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black tracking-tight mb-2">Choose your aesthetic</h2>
                        <p className="text-muted-foreground">Select a template to instantly transform your portfolio.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TEMPLATES.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => setTemplateId(t.id)}
                                className={cn(
                                    "group relative cursor-pointer overflow-hidden rounded-3xl border-2 transition-all duration-300 bg-card hover:shadow-xl",
                                    templateId === t.id ? "border-primary shadow-lg ring-4 ring-primary/10" : "border-transparent hover:border-primary/50"
                                )}
                            >
                                <div className={cn(
                                    "aspect-video w-full bg-muted/50 p-6 flex flex-col items-center justify-center gap-4 transition-colors",
                                    templateId === t.id ? "bg-primary/5" : "group-hover:bg-primary/5"
                                )}>
                                    <div className="w-16 h-16 rounded-full bg-background shadow-sm flex items-center justify-center">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full",
                                            t.id === 'aurora' ? "bg-gradient-to-tr from-purple-500 to-cyan-500" :
                                                t.id === 'cyber' ? "bg-gradient-to-tr from-cyan-500 to-fuchsia-500" :
                                                    t.id === 'modern' ? "bg-gradient-to-tr from-blue-500 to-indigo-500" :
                                                        "bg-gradient-to-tr from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-500"
                                        )} />
                                    </div>
                                    <h3 className="font-bold text-lg">{t.name}</h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                                </div>
                                {templateId === t.id && (
                                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            ) : (
                /* Preview Mode - Studio Simulator */
                <main className="flex-grow flex flex-col items-center py-12 px-6 bg-muted/30 pb-40">
                    <div className="w-full max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex flex-col">
                                <h3 className="text-xl font-black tracking-tight">Live Simulator</h3>
                                <p className="text-sm text-muted-foreground">Previewing as external visitor</p>
                            </div>
                            <div className="flex items-center gap-2 px-1 py-1 bg-muted rounded-xl border border-border">
                                <button
                                    onClick={() => setIsMobileView(false)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        !isMobileView ? "bg-background shadow-sm" : "opacity-40 hover:opacity-70"
                                    )}
                                >
                                    Desktop
                                </button>
                                <button
                                    onClick={() => setIsMobileView(true)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        isMobileView ? "bg-background shadow-sm" : "opacity-40 hover:opacity-70"
                                    )}
                                >
                                    Mobile
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className={cn(
                                "rounded-[2rem] border-[12px] border-zinc-900 shadow-2xl overflow-hidden bg-background relative transition-all duration-500",
                                isDarkMode ? 'dark' : '',
                                isMobileView
                                    ? "w-[375px] h-[700px]"
                                    : "w-full aspect-video"
                            )}>
                                {/* Browser/Phone Bar Mockup */}
                                <div className={cn(
                                    "absolute top-0 left-0 right-0 bg-zinc-900 flex items-center px-4 gap-2 z-20",
                                    isMobileView ? "h-8 justify-center" : "h-10 px-6"
                                )}>
                                    {isMobileView ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-3 bg-white/10 rounded-full" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                            </div>
                                            <div className="mx-auto w-1/3 h-5 bg-white/5 rounded-md flex items-center justify-center">
                                                <span className="text-[10px] text-white/20 font-mono">ultrafolio.ai/p/{portfolioId}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className={cn(
                                    "absolute inset-x-0 bottom-0 overflow-y-auto overflow-x-hidden studio-scrollbar",
                                    isMobileView ? "top-8" : "top-10"
                                )}>
                                    {isMobileView ? (
                                        /* Mobile: Render at 1280px width and scale down to fit 375px */
                                        <div
                                            style={{
                                                width: '1280px',
                                                transform: 'scale(0.293)',
                                                transformOrigin: 'top left',
                                                height: 'auto'
                                            }}
                                        >
                                            <TemplateComponent data={portfolioData} templateId={templateId} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : (
                                        <TemplateComponent data={portfolioData} templateId={templateId} isDarkMode={isDarkMode} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
            {/* Floating Studio Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
                <div className="bg-background/80 backdrop-blur-2xl border border-border p-3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 px-3">
                        {saving || publishing ? (
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground animate-pulse">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                {saving ? 'Syncing...' : 'Publishing...'}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                All changes synced
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-2xl h-11 px-6 font-bold hover:bg-muted"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {dict.save}
                        </Button>
                        <Button
                            onClick={handlePublish}
                            disabled={publishing}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-11 px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            {publishing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                            {dict.publish}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
