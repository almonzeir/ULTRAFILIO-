'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';
import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { parseCV } from '@/ai/flows/parse-cv';

export default function CreatePortfolioPage() {
  const [showManualForm, setShowManualForm] = React.useState(false);
  const [isParsing, setIsParsing] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDataAndNavigate = (data: PortfolioData) => {
    try {
      localStorage.setItem('portfolioData', JSON.stringify(data));
      router.push('/choose-template');
    } catch (e) {
      console.error('Failed to save user data to localStorage', e);
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: 'Could not save your portfolio data. Please try again.',
      });
    }
  };

  const handleManualFormSubmit = (formData: Omit<PortfolioData, 'skills' | 'projects' | 'education' | 'experience' > & { skills: string;[key: string]: any }) => {
    // This is a simplified conversion. A real app might have more complex logic.
    const portfolioData: PortfolioData = {
      person: {
        fullName: formData.name,
        headline: formData.title,
        summary: formData.summary,
      },
      contact: {
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        website: formData.website,
        linkedin: formData.linkedin,
        github: formData.github,
      },
      experience: formData.exp_role ? [
        {
          role: formData.exp_role,
          company: formData.exp_company || '',
          location: '',
          startDate: formData.exp_start || '',
          endDate: formData.exp_end || '',
          bullets: (formData.exp_description || '').split('\n').filter(b => b),
        },
      ] : [],
      education: formData.edu_degree ? [
        {
          degree: formData.edu_degree,
          field: '',
          institution: formData.edu_institution || '',
          startDate: formData.edu_start_year || '',
          endDate: formData.edu_end_year || '',
          notes: formData.edu_details || '',
        },
      ] : [],
      projects: formData.proj_title ? [
        {
          name: formData.proj_title,
          description: formData.proj_description || '',
          tech: (formData.proj_tech || '').split(',').map(t => t.trim()).filter(Boolean),
          links: formData.proj_link ? [{url: formData.proj_link}] : [],
          impact: '',
        },
      ] : [],
      skills: (formData.skills || '').split(',').map(s => s.trim()).filter(Boolean),
      certifications: [],
      awards: [],
      languages: [],
      interests: []
    };
    handleDataAndNavigate(portfolioData);
  };
  
  const handleUploadAndNavigate = async (cvFile: File, photoFile: File | null) => {
    setIsParsing(true);
    toast({
      title: 'Parsing your CV...',
      description: 'The AI is extracting your experience and skills. This may take a moment.',
    });

    try {
      const reader = new FileReader();
      reader.readAsDataURL(cvFile);
      reader.onload = async () => {
        const cvDataUri = reader.result as string;

        // Also convert photo to data URI if it exists
        if (photoFile) {
            const photoReader = new FileReader();
            photoReader.readAsDataURL(photoFile);
            photoReader.onload = async () => {
                const photoDataUri = photoReader.result as string;
                localStorage.setItem('userPhoto', photoDataUri);
                await handleCvParsing(cvDataUri);
            }
        } else {
            localStorage.removeItem('userPhoto');
            await handleCvParsing(cvDataUri);
        }
      };
    } catch (error) {
      console.error("CV Parsing Error:", error);
      toast({
        variant: "destructive",
        title: "Parsing Failed",
        description: "Could not parse your CV. Please try a different file or fill out the form manually.",
      });
      setIsParsing(false);
    }
  };

  const handleCvParsing = async (cvDataUri: string) => {
    try {
        const parsedData = await parseCV({ cvDataUri });
        handleDataAndNavigate(parsedData);
    } catch(e) {
        console.error("CV Parsing Error:", e);
        toast({
            variant: "destructive",
            title: "Parsing Failed",
            description: "The AI could not understand your CV. Please try a different file or fill out the form manually.",
        });
    } finally {
        setIsParsing(false);
    }
  }


  if (showManualForm) {
    return <ManualForm onSubmit={handleManualFormSubmit} />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold font-display tracking-tight">Create Your Portfolio</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Choose how you’d like to start building your portfolio.</p>
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <UploadCVCard onContinue={handleUploadAndNavigate} isParsing={isParsing} />
        <div 
          className="p-8 bg-gradient-to-b from-black to-gray-900 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border border-gray-800 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-3xl font-semibold mb-4">Fill Your Details Manually</h2>
            <p className="text-gray-400 mb-8">Don’t have a CV? Fill in your information to build your portfolio.</p>
          </div>
          <button 
            onClick={() => setShowManualForm(true)}
            className="w-full py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-200 transition-colors duration-300"
          >
            Start Manual Form
          </button>
        </div>
      </div>
    </section>
  );
}
