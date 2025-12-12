'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ManualForm from '@/components/create/ManualForm';
import Header from '@/components/layout/header';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import { useToast } from '@/hooks/use-toast';
import type { Dictionary } from '@/lib/dictionaries';
import { PortfolioData } from '@/templates/types';

export default function BuilderPage({ params }: { params: { id: string } }) {
    const portfolioId = params.id;
    const router = useRouter();
    const { toast } = useToast();
    const { language } = useLanguage();
    const [dict, setDict] = useState<Dictionary['createPage'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>(null);
    const [photoURL, setPhotoURL] = useState<string>('');

    useEffect(() => {
        const fetchDictionary = async () => {
            const dictionary = await getDictionary(language);
            setDict(dictionary.createPage);
        };
        fetchDictionary();
    }, [language]);

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

                // Map DB data to Form Data
                const formData = {
                    fullName: data.title ? data.title.replace("'s Portfolio", "") : "",
                    professionalTitle: data.subtitle || "",
                    summary: data.description || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    website: data.website || "",
                    linkedin: data.linkedin || "",
                    github: data.github || "",
                    // Flatten skills array to comma-separated string if it's stored as complex object in DB
                    // Check how skills are stored. In create/page.tsx:
                    // skills: formData.skills ? ...map... : []
                    // But in DB read, data.skills might be array of objects.
                    // ManualForm expects string "React, Node, Typescript"
                    skills: Array.isArray(data.skills)
                        ? data.skills.map((s: any) => s.tags ? s.tags.join(', ') : '').join(', ')
                        : "",

                    experience: data.experience || [],
                    education: data.education || [],
                    projects: data.projects || [],
                    certifications: data.certifications ? data.certifications.map((c: string) => {
                        // Parse string "Name - Org (Year)" back to object if possible, or just put in name
                        // This is tricky. The ManualForm stores as objects, but CreatePage potentially flattened them?
                        // Looking at create/page.tsx:
                        // certifications: formData.certifications.map... -> string[]
                        // So we lost structure. We put the whole string in 'name' as fallback.
                        return { name: c, organization: '', year: '' };
                    }) : [],
                    languages: data.languages || [],
                };

                setInitialData(formData);
                setPhotoURL(data.profile_photo_url || "");

            } catch (error) {
                console.error('Error fetching data:', error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load portfolio data.' });
            } finally {
                setLoading(false);
            }
        };

        if (portfolioId) {
            fetchData();
        }
    }, [portfolioId, toast]);

    const handleUpdate = async (formData: any) => {
        setLoading(true);
        try {
            // 1. Upload new photo if provided
            let newPhotoURL = photoURL;
            if (formData.photoFile) {
                const fileExt = formData.photoFile.name.split('.').pop();
                const fileName = `${portfolioId}-${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('portfolios')
                    .upload(`photos/${fileName}`, formData.photoFile);

                if (!uploadError) {
                    const { data } = supabase.storage.from('portfolios').getPublicUrl(`photos/${fileName}`);
                    newPhotoURL = data.publicUrl;
                }
            }

            // 2. Prepare update payload
            // Re-construct PortfolioData structure for DB
            const skillsArray = formData.skills
                ? formData.skills.split(',').map((s: string) => ({ category: "General", icon: "code", tags: [s.trim()] }))
                : [];

            const certificationsArray = formData.certifications.map((c: any) =>
                `${c.name}${c.organization ? ` - ${c.organization}` : ''}${c.year ? ` (${c.year})` : ''}`
            );

            const { error } = await supabase
                .from('portfolios')
                .update({
                    title: formData.fullName + "'s Portfolio", // Update title if name changed
                    subtitle: formData.professionalTitle,
                    description: formData.summary,
                    email: formData.email,
                    phone: formData.phone,
                    location: formData.location,
                    website: formData.website,
                    linkedin: formData.linkedin,
                    github: formData.github,
                    profile_photo_url: newPhotoURL,
                    skills: skillsArray,
                    experience: formData.experience,
                    education: formData.education,
                    projects: formData.projects,
                    certifications: certificationsArray,
                    languages: formData.languages,
                    // Don't update template_id or user_id
                })
                .eq('id', portfolioId);

            if (error) throw error;

            toast({ title: '✅ Success', description: 'Portfolio updated successfully!' });

            // Redirect back to preview
            router.push(`/preview/${portfolioId}`);

        } catch (error: any) {
            console.error('Update failed:', error);
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Update failed.' });
            setLoading(false);
        }
    };

    if (loading || !dict) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <ManualForm
                    onSubmit={handleUpdate}
                    onBack={() => router.push(`/preview/${portfolioId}`)}
                    dict={dict.manualForm}
                    initialData={initialData}
                    initialPhotoURL={photoURL}
                />
            </main>
        </div>
    );
}
