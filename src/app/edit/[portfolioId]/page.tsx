'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Eye, Rocket, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import type { PortfolioData } from '@/templates/types';

// Import templates
import ExecutiveTemplate from '@/templates/ExecutiveTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import MinimalPlusTemplate from '@/templates/MinimalPlusTemplate';

const templateMap: { [key: string]: React.ComponentType<{ data: PortfolioData }> } = {
    'executive': ExecutiveTemplate,
    'creative': CreativeTemplate,
    'minimal-plus': MinimalPlusTemplate,
};

export default function EditPortfolioPage() {
    const { portfolioId } = useParams();
    const searchParams = useSearchParams();
    const templateId = searchParams.get('template') || 'executive';
    const router = useRouter();
    const { user, loading: authLoading } = useUser();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [activeTab, setActiveTab] = useState('edit');

    // Portfolio data state
    const [portfolioData, setPortfolioData] = useState<PortfolioData>({
        personalInfo: { fullName: '' },
        about: {},
        experience: [],
        projects: [],
        education: [],
        certifications: [],
        languages: [],
    });

    // Fetch portfolio data
    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!portfolioId) return;

            try {
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('id', portfolioId)
                    .single();

                if (error) throw error;

                if (data) {
                    // Map database to PortfolioData
                    setPortfolioData({
                        personalInfo: {
                            fullName: data.title?.replace("'s Portfolio", "") || '',
                            title: data.subtitle || '',
                            tagline: data.description || '',
                            email: data.email || '',
                            phone: data.phone || '',
                            location: data.location || '',
                            website: data.website || '',
                            linkedInURL: data.linkedin || '',
                            githubURL: data.github || '',
                            profilePhotoURL: data.profile_photo_url || '',
                        },
                        about: {
                            extendedBio: data.description || '',
                            skills: data.skills || [],
                        },
                        experience: data.experience || [],
                        education: data.education || [],
                        projects: data.projects || [],
                        certifications: data.certifications || [],
                        languages: data.languages || [],
                    });
                }
            } catch (error: any) {
                console.error('Error fetching portfolio:', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not load portfolio data.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [portfolioId, toast]);

    // Save changes to database
    const handleSave = async () => {
        if (!portfolioId || !user) return;
        setSaving(true);

        try {
            const { error } = await supabase
                .from('portfolios')
                .update({
                    title: portfolioData.personalInfo.fullName + "'s Portfolio",
                    subtitle: portfolioData.personalInfo.title,
                    description: portfolioData.personalInfo.tagline || portfolioData.about.extendedBio,
                    email: portfolioData.personalInfo.email,
                    phone: portfolioData.personalInfo.phone,
                    location: portfolioData.personalInfo.location,
                    website: portfolioData.personalInfo.website,
                    linkedin: portfolioData.personalInfo.linkedInURL,
                    github: portfolioData.personalInfo.githubURL,
                    profile_photo_url: portfolioData.personalInfo.profilePhotoURL,
                    experience: portfolioData.experience,
                    education: portfolioData.education,
                    skills: portfolioData.about.skills,
                    projects: portfolioData.projects,
                    certifications: portfolioData.certifications,
                    languages: portfolioData.languages,
                    template_id: templateId,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', portfolioId);

            if (error) throw error;

            toast({
                title: '✅ Saved!',
                description: 'Your changes have been saved.',
            });
        } catch (error: any) {
            console.error('Error saving:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save changes.',
            });
        } finally {
            setSaving(false);
        }
    };

    // Publish to Netlify (placeholder - will implement API)
    const handlePublish = async () => {
        if (!portfolioId || !user) return;
        setPublishing(true);

        try {
            // First save the latest changes
            await handleSave();

            // Then call the publish API
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch('/api/portfolio/publish', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    portfolioId,
                    templateId,
                    portfolioData
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to publish');
            }

            const { url } = await response.json();

            toast({
                title: '🚀 Published!',
                description: `Your portfolio is live at ${url}`,
            });

            // Optionally open the URL
            window.open(url, '_blank');
        } catch (error: any) {
            console.error('Error publishing:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Could not publish portfolio.',
            });
        } finally {
            setPublishing(false);
        }
    };

    // Update personal info
    const updatePersonalInfo = (field: string, value: string) => {
        setPortfolioData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    // Update about
    const updateAbout = (field: string, value: any) => {
        setPortfolioData(prev => ({
            ...prev,
            about: { ...prev.about, [field]: value }
        }));
    };

    // Add experience
    const addExperience = () => {
        setPortfolioData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                jobTitle: '',
                company: '',
                dates: '',
                location: '',
                responsibilities: [''],
                tags: []
            }]
        }));
    };

    // Update experience
    const updateExperience = (index: number, field: string, value: any) => {
        setPortfolioData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            )
        }));
    };

    // Remove experience
    const removeExperience = (index: number) => {
        setPortfolioData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const TemplateComponent = templateMap[templateId] || ExecutiveTemplate;

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold">Edit Portfolio</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="edit">Edit</TabsTrigger>
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button variant="outline" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Save
                        </Button>

                        <Button onClick={handlePublish} disabled={publishing}>
                            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4 mr-2" />}
                            Publish
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            {activeTab === 'edit' ? (
                <main className="container py-8">
                    <div className="max-w-3xl mx-auto space-y-8">

                        {/* Personal Info Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            value={portfolioData.personalInfo.fullName}
                                            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Professional Title</Label>
                                        <Input
                                            id="title"
                                            value={portfolioData.personalInfo.title || ''}
                                            onChange={(e) => updatePersonalInfo('title', e.target.value)}
                                            placeholder="Senior Software Engineer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tagline">Tagline / Summary</Label>
                                    <Textarea
                                        id="tagline"
                                        value={portfolioData.personalInfo.tagline || ''}
                                        onChange={(e) => updatePersonalInfo('tagline', e.target.value)}
                                        placeholder="A brief description of what you do..."
                                        rows={2}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={portfolioData.personalInfo.email || ''}
                                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={portfolioData.personalInfo.location || ''}
                                            onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                            placeholder="San Francisco, CA"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                                        <Input
                                            id="linkedin"
                                            value={portfolioData.personalInfo.linkedInURL || ''}
                                            onChange={(e) => updatePersonalInfo('linkedInURL', e.target.value)}
                                            placeholder="https://linkedin.com/in/johndoe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="github">GitHub URL</Label>
                                        <Input
                                            id="github"
                                            value={portfolioData.personalInfo.githubURL || ''}
                                            onChange={(e) => updatePersonalInfo('githubURL', e.target.value)}
                                            placeholder="https://github.com/johndoe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={portfolioData.personalInfo.website || ''}
                                        onChange={(e) => updatePersonalInfo('website', e.target.value)}
                                        placeholder="https://johndoe.com"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* About Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Extended Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={portfolioData.about.extendedBio || ''}
                                        onChange={(e) => updateAbout('extendedBio', e.target.value)}
                                        placeholder="Tell your story..."
                                        rows={5}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Skills (comma separated)</Label>
                                    <Input
                                        value={portfolioData.about.skills?.flatMap(s => s.tags).join(', ') || ''}
                                        onChange={(e) => updateAbout('skills', [{
                                            category: 'General',
                                            tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                        }])}
                                        placeholder="JavaScript, React, Node.js, Python..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Experience Section */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Experience</CardTitle>
                                <Button variant="outline" size="sm" onClick={addExperience}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {portfolioData.experience.map((exp, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="grid md:grid-cols-2 gap-4 flex-1">
                                                <div className="space-y-2">
                                                    <Label>Job Title</Label>
                                                    <Input
                                                        value={exp.jobTitle}
                                                        onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                                                        placeholder="Software Engineer"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Company</Label>
                                                    <Input
                                                        value={exp.company}
                                                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                        placeholder="Google"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => removeExperience(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Dates</Label>
                                                <Input
                                                    value={exp.dates || ''}
                                                    onChange={(e) => updateExperience(index, 'dates', e.target.value)}
                                                    placeholder="Jan 2020 - Present"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Location</Label>
                                                <Input
                                                    value={exp.location || ''}
                                                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                                    placeholder="San Francisco, CA"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Responsibilities (one per line)</Label>
                                            <Textarea
                                                value={exp.responsibilities.join('\n')}
                                                onChange={(e) => updateExperience(index, 'responsibilities', e.target.value.split('\n').filter(Boolean))}
                                                placeholder="Led a team of 5 engineers...&#10;Increased revenue by 25%..."
                                                rows={4}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Technologies (comma separated)</Label>
                                            <Input
                                                value={exp.tags?.join(', ') || ''}
                                                onChange={(e) => updateExperience(index, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                                placeholder="React, TypeScript, AWS..."
                                            />
                                        </div>
                                    </div>
                                ))}

                                {portfolioData.experience.length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">
                                        No experience added yet. Click "Add" to get started.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </main>
            ) : (
                /* Preview Mode */
                <div className="w-full">
                    <TemplateComponent data={portfolioData} />
                </div>
            )}
        </div>
    );
}
