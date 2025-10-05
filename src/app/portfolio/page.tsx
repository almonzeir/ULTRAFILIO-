'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModernTemplate from '@/templates/ModernTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';

export default function PortfolioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [template, setTemplate] = useState<string | null>(null);
  const [userData, setUserData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    const data = localStorage.getItem('portfolioData');

    if (!selectedTemplate || !data) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Could not generate portfolio. Please start over.',
      });
      router.push('/create');
      return;
    }
    
    setTemplate(selectedTemplate);
    setUserData(JSON.parse(data));
    
  }, [router, toast]);

  const renderTemplate = () => {
    if (!template || !userData) {
      return (
        <div className="text-center p-20">
            <h1 className="text-2xl font-bold">Loading Portfolio...</h1>
            <p>Please wait a moment.</p>
        </div>
      );
    }
    
    // The photo URL is now part of the main data object in the new structure
    // const dataWithPhoto = { ...userData, photoUrl: userPhoto };

    switch (template) {
      case 'modern':
        return <ModernTemplate data={userData} />;
      case 'minimalist':
        // This template would need to be updated to support the new data structure
        // For now, we pass a simplified version of the data
        const minimalistData = {
            name: userData.personalInfo.fullName,
            title: userData.personalInfo.title,
            summary: userData.personalInfo.tagline,
            experience: userData.experience.map(e => ({
                role: e.jobTitle,
                company: e.company,
                start: e.dates.split('–')[0],
                end: e.dates.split('–')[1],
                description: e.responsibilities.join(' '),
            })),
            projects: [], // Minimalist template doesn't show them
            skills: [], // Minimalist template doesn't show them
        };
        // @ts-ignore
        return <MinimalistTemplate data={minimalistData} />;
      case 'basic':
        // This template would need to be updated to support the new data structure
         const basicData = {
            name: userData.personalInfo.fullName,
            title: userData.personalInfo.title,
            summary: userData.personalInfo.tagline,
            experience: userData.experience.map(e => ({
                role: e.jobTitle,
                company: e.company,
                start: e.dates.split('–')[0],
                end: e.dates.split('–')[1],
                description: e.responsibilities.join(' '),
            })),
        };
        // @ts-ignore
        return <BasicTemplate data={basicData} />;
      default:
        return <p>Unknown template selected.</p>;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-inter">
      {/* Add controls for editing, changing template etc. here */}
      <div className="p-4 bg-background/80 backdrop-blur-md sticky top-0 z-10 border-b flex items-center justify-center gap-4">
        <h1 className="text-lg font-semibold">Your Generated Portfolio</h1>
        <button onClick={() => router.push('/choose-template')} className="text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 rounded-md">Change Template</button>
      </div>
      {renderTemplate()}
    </main>
  );
}
