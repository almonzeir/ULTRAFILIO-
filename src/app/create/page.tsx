
'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';
import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Header from '@/components/layout/header';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';

// Define UploadMeta type based on the prompt
interface UploadMeta {
  cvFileUrl: string;
  cvFileType: 'pdf' | 'doc' | 'docx';
  profilePhotoURL?: string;
  fileSizeBytes: number;
}

const AuthPrompt = ({ dict }: { dict: Dictionary['createPage']['authPrompt'] }) => (
  <section className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white px-6 py-20 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
      <h1 className="text-3xl font-bold font-display tracking-tight mb-4">{dict.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {dict.description}
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/login">{dict.login}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">{dict.signup}</Link>
        </Button>
      </div>
    </div>
  </section>
);


export default function CreatePortfolioPage() {
  const [showManualForm, setShowManualForm] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();
  const { language } = useLanguage();
  const [dict, setDict] = React.useState<Dictionary['createPage'] | null>(null);

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.createPage);
    };
    fetchDictionary();
  }, [language]);

  const handleManualFormSubmit = (formData: any) => {
    // This function now receives structured data from react-hook-form
    const portfolioData: PortfolioData = {
      personalInfo: {
        fullName: formData.fullName,
        portfolioNameAbbr: formData.fullName.split(' ').map((n:string) => n[0]).join('').toUpperCase(),
        title: formData.professionalTitle,
        tagline: formData.summary,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        linkedinURL: formData.linkedin,
        githubURL: formData.github,
        location: formData.location,
        profilePhotoURL: '', // Manual form doesn't handle photo upload yet
      },
      about: {
        extendedBio: formData.summary,
        stats: [],
        skills: formData.skills ? formData.skills.split(',').map((s: string) => ({ category: "General", icon: "code", tags: [s.trim()] })) : []
      },
      experience: formData.experience.map((exp: any) => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        location: '', // Not in form
        dates: `${exp.startDate || ''} - ${exp.endDate || 'Present'}`,
        responsibilities: exp.description ? exp.description.split('\n').filter(Boolean) : [],
        tags: []
      })).filter((exp: any) => exp.jobTitle && exp.company),
      education: formData.education.map((edu: any) => ({
        degree: edu.degree,
        institution: edu.institution,
        startDate: edu.startYear,
        endDate: edu.endYear,
      })).filter((edu: any) => edu.degree && edu.institution),
      projects: formData.projects.map((proj: any) => ({
        name: proj.title,
        description: proj.description,
        category: 'General',
        imageURL: '',
        tags: proj.technologies ? proj.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        detailsURL: proj.link || '#',
      })).filter((proj: any) => proj.name),
      certifications: formData.certifications.map((cert: any) => `${cert.name}${cert.organization ? ` - ${cert.organization}` : ''}${cert.year ? ` (${cert.year})` : ''}`).filter(Boolean),
      languages: formData.languages.map((lang: any) => ({ name: lang.language, level: lang.proficiency })).filter((lang: any) => lang.name),
    };
    
    try {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      localStorage.setItem('chosenTemplate', 'modern'); // Default template for manual entry

      const dummyUploadMeta: UploadMeta = {
        cvFileUrl: 'manual-entry',
        cvFileType: 'pdf', 
        fileSizeBytes: 0,
      };
      localStorage.setItem('uploadMeta', JSON.stringify(dummyUploadMeta));

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

  const handleUploadAndNavigate = async (cvFile: File, photoFile: File | null) => {
    setIsProcessing(true);
    toast({
      title: 'Processing files...',
      description: 'Saving your files securely before the next step.',
    });

    try {
      const tempCvFileUrl = URL.createObjectURL(cvFile);
      const tempProfilePhotoURL = photoFile ? URL.createObjectURL(photoFile) : undefined;

      const newUploadMeta: UploadMeta = {
        cvFileUrl: tempCvFileUrl,
        cvFileType: cvFile.name.split('.').pop() as 'pdf' | 'doc' | 'docx',
        fileSizeBytes: cvFile.size,
        profilePhotoURL: tempProfilePhotoURL,
      };

      // Persist to localStorage
      localStorage.setItem('uploadMeta', JSON.stringify(newUploadMeta));
      if (tempProfilePhotoURL) {
        localStorage.setItem('profilePhotoURL', tempProfilePhotoURL);
      } else {
        localStorage.removeItem('profilePhotoURL');
      }

      // Clear any old portfolio data and extracted data
      localStorage.removeItem('portfolioData');
      localStorage.removeItem('extracted');

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

  if (loading || !dict) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPrompt dict={dict.authPrompt} />;
  }

  if (showManualForm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ManualForm 
            onSubmit={handleManualFormSubmit} 
            onBack={() => setShowManualForm(false)} 
            dict={dict.manualForm}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="min-h-full bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold font-display tracking-tight">{dict.title}</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{dict.subtitle}</p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <UploadCVCard onContinue={handleUploadAndNavigate} isParsing={isProcessing} dict={dict.uploadCard} />
            <div
              className="p-8 bg-gradient-to-b from-black to-gray-900 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border border-gray-800 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-3xl font-semibold mb-4">{dict.manualCard.title}</h2>
                <p className="text-gray-400 mb-8">{dict.manualCard.description}</p>
              </div>
              <button
                onClick={() => setShowManualForm(true)}
                className="w-full py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-200 transition-colors duration-300"
              >
                {dict.manualCard.button}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
