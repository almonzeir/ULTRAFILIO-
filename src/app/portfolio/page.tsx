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
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    const data = localStorage.getItem('portfolioData');
    const photo = localStorage.getItem('userPhoto');

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
    if (photo) {
      setUserPhoto(photo);
    }
  }, [router, toast]);

  const renderTemplate = () => {
    if (!template || !userData) {
      return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Loading Portfolio...</h1>
            <p>Please wait a moment.</p>
        </div>
      );
    }

    const dataWithPhoto = { ...userData, photoUrl: userPhoto };

    switch (template) {
      case 'modern':
        return <ModernTemplate data={dataWithPhoto} />;
      case 'minimalist':
        return <MinimalistTemplate data={dataWithPhoto} />;
      case 'basic':
        return <BasicTemplate data={dataWithPhoto} />;
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
