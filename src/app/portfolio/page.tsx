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
  const [loading, setLoading] = useState(true);

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
    
    try {
        setTemplate(selectedTemplate);
        setUserData(JSON.parse(data));
    } catch(e) {
        toast({
            variant: 'destructive',
            title: 'Error loading data',
            description: 'Could not read portfolio data. Please try creating it again.',
        });
        router.push('/create');
    } finally {
        setLoading(false);
    }
    
  }, [router, toast]);

  const renderTemplate = () => {
    if (loading || !template || !userData) {
      return (
        <div className="text-center p-20 flex flex-col items-center justify-center min-h-screen bg-dark-bg">
            <div className="animate-spin mb-4 border-2 border-t-transparent border-electric-blue rounded-full w-12 h-12"></div>
            <h1 className="text-2xl font-bold text-text-light">Loading Portfolio...</h1>
            <p className="text-gray-400">Please wait a moment.</p>
        </div>
      );
    }

    switch (template) {
      case 'modern':
        return <ModernTemplate data={userData} />;
      case 'minimalist':
        // This template would need to be updated to support the new data structure
        // For now, we pass a simplified version of the data
        const minimalistData = {
            personalInfo: userData.personalInfo,
            experience: userData.experience,
            about: {extendedBio: userData.about.extendedBio, stats: [], skills: []},
            projects: [],
            education: [],
            // @ts-ignore
            name: userData.personalInfo.fullName,
            // @ts-ignore
            title: userData.personalInfo.title,
            // @ts-ignore
            summary: userData.personalInfo.tagline,
        };
        return <MinimalistTemplate data={minimalistData} />;
      case 'basic':
        // This template would need to be updated to support the new data structure
         const basicData = {
            personalInfo: userData.personalInfo,
            experience: userData.experience,
            about: {extendedBio: userData.about.extendedBio, stats: [], skills: []},
            projects: [],
            education: [],
            // @ts-ignore
            name: userData.personalInfo.fullName,
            // @ts-ignore
            title: userData.personalInfo.title,
            // @ts-ignore
            summary: userData.personalInfo.tagline,
        };
        return <BasicTemplate data={basicData} />;
      default:
        return <p className="p-20 text-center">Unknown template selected. Please go back and choose a template.</p>;
    }
  };

  return (
    <div>
      {/* Add controls for editing, changing template etc. here */}
      <div className="p-4 bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b flex items-center justify-center gap-4">
        <h1 className="text-lg font-semibold">Your Generated Portfolio</h1>
        <button onClick={() => router.push('/choose-template')} className="text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 rounded-md">Change Template</button>
      </div>
      {renderTemplate()}
    </div>
  );
}
