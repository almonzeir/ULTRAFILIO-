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
            const updates = {
                title: portfolioData.personalInfo.fullName, // + "'s Portfolio"? Keeping it simple for now.
                subtitle: portfolioData.personalInfo.title,
                description: portfolioData.about.extendedBio || portfolioData.personalInfo.tagline, // Prefer extendedBio
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

                // section_order: portfolioData.sectionOrder, // Try to save order if column exists
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('portfolios')
                .update(updates)
                .eq('id', portfolioId);

            if (error) throw error;

            toast({ title: dictionary?.editor?.saved || "Saved", description: dictionary?.editor?.saveSuccess || "Changes saved successfully." });
        } catch (error: any) {
            console.error('Error saving:', error);
            toast({ variant: 'destructive', title: dictionary?.editor?.error || 'Error', description: dictionary?.editor?.saveError || 'Failed to save changes.' });
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
                            <strong>Note:</strong> {language === 'ar' ? 'هذا هو الرابط العام الفريد الخاص بك. يرجى نسخه وحفظه في مكان آمن. لن تتمكن من استعادته بسهولة لاحقًا!' : 'This is your unique public link. Please copy it and save it in a safe place. You won\'t be able to retrieve it easily later!'}
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

            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold">{dict.editPortfolio}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Appearance Toggle */}
                        <div className="flex bg-muted rounded-md p-1 mr-4">
                            <button onClick={() => setIsDarkMode(false)} className={`p-1.5 rounded-sm transition-all ${!isDarkMode ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}><Sun size={14} /></button>
                            <button onClick={() => setIsDarkMode(true)} className={`p-1.5 rounded-sm transition-all ${isDarkMode ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}><Moon size={14} /></button>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="edit">{dict.edit}</TabsTrigger>
                                <TabsTrigger value="layout">{dict.layout}</TabsTrigger>
                                <TabsTrigger value="preview">{dict.preview}</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button variant="outline" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} {saving ? dict.saving : dict.save}
                        </Button>
                        <Button onClick={handlePublish} disabled={publishing}>
                            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4 mr-2" />} {publishing ? dict.publishing : dict.publish}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            {activeTab === 'edit' ? (
                <main className="container py-8 max-w-4xl mx-auto space-y-8 pb-32">

                    {/* Personal Info */}
                    <Card>
                        <CardHeader><CardTitle>{dict.personalInfo}</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            {/* Profile Photo Upload */}
                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-muted bg-muted flex items-center justify-center shrink-0">
                                    {portfolioData.personalInfo.profilePhotoURL ? (
                                        <img src={portfolioData.personalInfo.profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                                    )}
                                </div>
                                <div className="space-y-2 flex-1">
                                    <Label>Profile Photo</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="max-w-xs cursor-pointer" />
                                        {portfolioData.personalInfo.profilePhotoURL && (
                                            <Button variant="ghost" size="icon" onClick={() => updatePersonalInfo('profilePhotoURL', '')} title="Remove Photo">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Recommended: Square JPG/PNG, max 2MB.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Full Name</Label><Input value={portfolioData.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Professional Title</Label><Input value={portfolioData.personalInfo.title} onChange={(e) => updatePersonalInfo('title', e.target.value)} /></div>
                            </div>
                            <div className="space-y-2"><Label>Tagline / Bio</Label><Textarea value={portfolioData.personalInfo.tagline} onChange={(e) => updatePersonalInfo('tagline', e.target.value)} /></div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Email</Label><Input value={portfolioData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Location</Label><Input value={portfolioData.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} /></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>LinkedIn</Label><Input value={portfolioData.personalInfo.linkedInURL} onChange={(e) => updatePersonalInfo('linkedInURL', e.target.value)} /></div>
                                <div className="space-y-2"><Label>GitHub</Label><Input value={portfolioData.personalInfo.githubURL} onChange={(e) => updatePersonalInfo('githubURL', e.target.value)} /></div>
                            </div>
                            <div className="space-y-2"><Label>Website</Label><Input value={portfolioData.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} /></div>
                        </CardContent>
                    </Card>

                    {/* About & Skills */}
                    <Card>
                        <CardHeader><CardTitle>{dict.aboutSkills}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label>Extended Bio</Label><Textarea value={portfolioData.about.extendedBio} onChange={(e) => updateAbout('extendedBio', e.target.value)} rows={5} /></div>
                            <div className="space-y-2">
                                <Label>Skills (comma separated tags) - will be categorized as "General"</Label>
                                <Input
                                    value={portfolioData.about.skills?.flatMap(s => s.tags).join(', ') || ''}
                                    onChange={(e) => updateAbout('skills', [{ category: 'General', tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }])}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Projects */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{dict.projects}</CardTitle>
                            <Button variant="outline" size="sm" onClick={addProject}><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {portfolioData.projects.map((proj, idx) => (
                                <div key={idx} className="p-4 border rounded-lg space-y-4 relative bg-muted/20">
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => removeProject(idx)}><Trash2 className="h-4 w-4" /></Button>

                                    <div className="grid md:grid-cols-2 gap-4 mr-8">
                                        <div className="space-y-2"><Label>Project Name</Label><Input value={proj.name} onChange={(e) => updateProject(idx, 'name', e.target.value)} /></div>
                                        <div className="space-y-2"><Label>Link (URL)</Label><Input value={proj.detailsURL || ''} onChange={(e) => updateProject(idx, 'detailsURL', e.target.value)} placeholder="https://..." /></div>
                                    </div>
                                    <div className="space-y-2"><Label>Description</Label><Textarea value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} rows={2} /></div>
                                    <div className="space-y-2"><Label>Technologies (comma separated)</Label><Input value={proj.tags?.join(', ') || ''} onChange={(e) => updateProject(idx, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} /></div>

                                    <div className="space-y-2">
                                        <Label>Project Image</Label>
                                        <div className="flex items-center gap-4">
                                            {proj.imageURL ? (
                                                <div className="relative w-24 h-16 rounded overflow-hidden border">
                                                    <img src={proj.imageURL} alt="Preview" className="w-full h-full object-cover" />
                                                    <button onClick={() => updateProject(idx, 'imageURL', '')} className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white"><X size={16} /></button>
                                                </div>
                                            ) : (
                                                <div className="w-24 h-16 bg-muted rounded flex items-center justify-center border border-dashed"><ImageIcon className="text-muted-foreground h-6 w-6" /></div>
                                            )}
                                            <div className="flex-1">
                                                <Input type="file" accept="image/*" onChange={(e) => handleProjectImageUpload(idx, e)} className="cursor-pointer" />
                                                <p className="text-xs text-muted-foreground mt-1">Upload a screenshot (PNG/JPG)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {portfolioData.projects.length === 0 && <p className="text-center text-muted-foreground">Showcase your work! Add a project.</p>}
                        </CardContent>
                    </Card>

                    {/* Experience */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{dict.experience}</CardTitle>
                            <Button variant="outline" size="sm" onClick={addExperience}><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {portfolioData.experience.map((exp, idx) => (
                                <div key={idx} className="p-4 border rounded-lg space-y-4 relative bg-muted/20">
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => removeExperience(idx)}><Trash2 className="h-4 w-4" /></Button>
                                    <div className="grid md:grid-cols-2 gap-4 mr-8">
                                        <div className="space-y-2"><Label>Job Title</Label><Input value={exp.jobTitle} onChange={(e) => updateExperience(idx, 'jobTitle', e.target.value)} /></div>
                                        <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} /></div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Dates</Label><Input value={exp.dates} onChange={(e) => updateExperience(idx, 'dates', e.target.value)} placeholder="2020 - Present" /></div>
                                        <div className="space-y-2"><Label>Location</Label><Input value={exp.location || ''} onChange={(e) => updateExperience(idx, 'location', e.target.value)} /></div>
                                    </div>
                                    <div className="space-y-2"><Label>Responsibilities</Label><Textarea value={exp.responsibilities.join('\n')} onChange={(e) => updateExperience(idx, 'responsibilities', e.target.value.split('\n').filter(Boolean))} rows={3} placeholder="One per line" /></div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{dict.education}</CardTitle>
                            <Button variant="outline" size="sm" onClick={addEducation}><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {(portfolioData.education || []).map((ed, idx) => (
                                <div key={idx} className="p-4 border rounded-lg space-y-4 relative bg-muted/20">
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => removeEducation(idx)}><Trash2 className="h-4 w-4" /></Button>
                                    <div className="grid md:grid-cols-2 gap-4 mr-8">
                                        <div className="space-y-2"><Label>Degree</Label><Input value={ed.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} /></div>
                                        <div className="space-y-2"><Label>Institution</Label><Input value={ed.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} /></div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Years</Label><Input value={ed.endDate || ''} onChange={(e) => updateEducation(idx, 'endDate', e.target.value)} placeholder="e.g. 2018 - 2022" /></div>
                                        <div className="space-y-2"><Label>Field of Study (Optional)</Label><Input value={ed.field || ''} onChange={(e) => updateEducation(idx, 'field', e.target.value)} /></div>
                                    </div>
                                </div>
                            ))}
                            {(!portfolioData.education || portfolioData.education.length === 0) && <p className="text-center text-muted-foreground">Add your educational background.</p>}
                        </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{dict.certifications}</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setPortfolioData(prev => ({ ...prev, certifications: [...(prev.certifications || []), ""] }))}><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(portfolioData.certifications || []).map((cert, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input value={cert} onChange={(e) => setPortfolioData(prev => ({ ...prev, certifications: (prev.certifications || []).map((c, i) => i === idx ? e.target.value : c) }))} placeholder="e.g. AWS Certified Solution Architect" />
                                    <Button variant="ghost" size="icon" onClick={() => setPortfolioData(prev => ({ ...prev, certifications: (prev.certifications || []).filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            ))}
                            {(!portfolioData.certifications || portfolioData.certifications.length === 0) && <p className="text-center text-muted-foreground text-sm">No certifications added.</p>}
                        </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{dict.languages}</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setPortfolioData(prev => ({ ...prev, languages: [...(prev.languages || []), { name: "", level: "Native" }] }))}><Plus className="h-4 w-4 mr-2" />{dict.add}</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(portfolioData.languages || []).map((lang, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <Input value={lang.name} onChange={(e) => setPortfolioData(prev => ({ ...prev, languages: (prev.languages || []).map((l, i) => i === idx ? { ...l, name: e.target.value } : l) }))} placeholder="Language (e.g. Spanish)" />
                                    <Input value={lang.level} onChange={(e) => setPortfolioData(prev => ({ ...prev, languages: (prev.languages || []).map((l, i) => i === idx ? { ...l, level: e.target.value } : l) }))} placeholder="Level (e.g. Fluent)" className="w-32" />
                                    <Button variant="ghost" size="icon" onClick={() => setPortfolioData(prev => ({ ...prev, languages: (prev.languages || []).filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            ))}
                            {(!portfolioData.languages || portfolioData.languages.length === 0) && <p className="text-center text-muted-foreground text-sm">No languages added.</p>}
                        </CardContent>
                    </Card>

                </main>
            ) : activeTab === 'layout' ? (
                <main className="container py-8 max-w-2xl mx-auto">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><LayoutGrid className="h-5 w-5" /> {dict.layout}</CardTitle><CardDescription>Drag and drop to reorder sections.</CardDescription></CardHeader>
                        <CardContent>
                            <LayoutEditor sectionOrder={portfolioData.sectionOrder || DEFAULT_SECTION_ORDER} onOrderChange={(newOrder) => setPortfolioData(prev => ({ ...prev, sectionOrder: newOrder }))} />
                        </CardContent>
                    </Card>
                </main>
            ) : (
                /* Preview Mode */
                <div className={`w-full ${isDarkMode ? 'dark' : ''}`}>
                    <div className="bg-background min-h-screen">
                        <div className={isDarkMode ? 'dark' : ''}>
                            <TemplateComponent data={portfolioData} templateId={templateId} isDarkMode={isDarkMode} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
