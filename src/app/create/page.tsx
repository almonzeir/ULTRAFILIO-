'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';
import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';


// This function converts a file to a base64 string
const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function CreatePortfolioPage() {
  const [showManualForm, setShowManualForm] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleManualFormSubmit = (formData: any) => {
     // This is a simplified conversion. A real app might have more complex logic.
    const portfolioData: PortfolioData = {
      personalInfo: {
        fullName: formData.name,
        portfolioNameAbbr: formData.name?.charAt(0) || '',
        title: formData.title,
        tagline: formData.summary,
        email: formData.email,
        linkedInURL: formData.linkedin,
        location: formData.location,
        profilePhotoURL: '', // Manual form doesn't handle photo upload yet
      },
      about: {
        extendedBio: "Manually entered profile.",
        stats: [],
        skills: formData.skills ? formData.skills.split(',').map((s: string) => ({ category: "General", icon: "code", tags: [s.trim()] })) : []
      },
      experience: formData.exp_role ? [
        {
          jobTitle: formData.exp_role,
          company: formData.exp_company || '',
          location: '',
          dates: `${formData.exp_start || ''} - ${formData.exp_end || ''}`,
          responsibilities: (formData.exp_description || '').split('\n').filter((b: string) => b),
          tags: []
        },
      ] : [],
      education: formData.edu_degree ? [
        {
          degree: formData.edu_degree,
          institution: formData.edu_institution || '',
          startDate: formData.edu_start_year || '',
          endDate: formData.edu_end_year || '',
        },
      ] : [],
      projects: formData.proj_title ? [
        {
          name: formData.proj_title,
          description: formData.proj_description || '',
          category: 'General',
          imageURL: '',
          tags: (formData.proj_tech || '').split(',').map((t: string) => t.trim()).filter(Boolean),
          detailsURL: formData.proj_link || '#',
        },
      ] : [],
    };
    try {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      // For manual flow, we can skip the build screen and go to a default template
      localStorage.setItem('selectedTemplate', 'modern');
      router.push('/portfolio');
    } catch (e) {
      console.error('Failed to save user data to localStorage', e);
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: 'Could not save your portfolio data. Please try again.',
      });
    }
  };
  
  const handleUploadAndNavigate = async (cvFile: File, photoFile: File | null) => {
    setIsProcessing(true);
    toast({
      title: 'Processing files...',
      description: 'Saving your files securely before the next step.',
    });

    try {
      // Convert CV file to a serializable format (data URL)
      const cvDataUrl = await fileToDataURL(cvFile);
      const cvFileObject = {
        name: cvFile.name,
        type: cvFile.type,
        size: cvFile.size,
        data: cvDataUrl,
      };
      localStorage.setItem('cvFile', JSON.stringify(cvFileObject));

      // Handle photo file if it exists
      if (photoFile) {
        const photoDataUrl = await fileToDataURL(photoFile);
        localStorage.setItem('photoFile', photoDataUrl);
      } else {
        localStorage.removeItem('photoFile');
      }

      // Clear any old portfolio data
      localStorage.removeItem('portfolioData');

      router.push('/choose-template');

    } catch (error) {
      console.error('File processing failed:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'Could not process your files. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
        <UploadCVCard onContinue={handleUploadAndNavigate} isParsing={isProcessing} />
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
