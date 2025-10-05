'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { PortfolioData } from '@/templates/types';

const messages = [
  'Reading your CV...',
  'Extracting your achievements...',
  'Detecting your top skills...',
  'Mapping experience to impact...',
  'Designing your value story...',
  'Placing your photo & branding...',
  'Final checks...',
];

export default function AIBuildingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 2000);

    const startBuild = async () => {
      const cvFileString = localStorage.getItem('cvFile');
      const photoFileString = localStorage.getItem('photoFile');
      const selectedTemplate = localStorage.getItem('selectedTemplate');

      if (!cvFileString || !selectedTemplate) {
        toast({
          variant: 'destructive',
          title: 'Missing Information',
          description: 'Could not find CV or template. Please start over.',
        });
        router.push('/create');
        return;
      }

      try {
        const cvFile = JSON.parse(cvFileString);

        const formData = new FormData();
        // The file needs to be reconstructed from the base64 string
        const byteCharacters = atob(cvFile.data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: cvFile.type });
        const reconstructedFile = new File([blob], cvFile.name, { type: cvFile.type });

        formData.append('cv', reconstructedFile);
        
        if (photoFileString) {
             formData.append('photo', photoFileString);
        }

        const response = await fetch('/api/parse-cv', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
           throw new Error(errorData.error || 'Failed to parse CV.');
        }

        const portfolioData: PortfolioData = await response.json();
        
        // Save the final parsed data
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        
        // Navigate to final page
        router.push('/portfolio');

      } catch (error: any) {
        console.error('Build process failed:', error);
        toast({
          variant: 'destructive',
          title: 'Build Failed',
          description: error.message || 'Could not generate portfolio. Please try again.',
        });
        router.push('/create');
      }
    };

    startBuild();

    return () => {
      clearInterval(messageInterval);
    };
  }, [router, toast]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-inter">
      <div className="animate-spin mb-8 border-4 border-t-transparent border-white rounded-full w-16 h-16"></div>
      <h1 className="text-3xl font-bold mb-6">Preparing your portfolio...</h1>
      <div className="text-center space-y-2 opacity-80" style={{ height: '50px' }}>
         <p className="text-sm transition-opacity duration-500 opacity-100">
            {messages[currentMessageIndex]}
          </p>
      </div>
       <p className="mt-8 text-xs text-gray-400">This usually takes 10–30 seconds depending on the document size.</p>
    </main>
  );
}
