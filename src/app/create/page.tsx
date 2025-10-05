'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';
import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';

const mockParsedData: PortfolioData = {
    person: {
        fullName: "John Doe",
        headline: "Senior Software Engineer",
        summary: "An experienced software engineer specializing in building scalable web applications with modern technologies. Passionate about clean code and great user experiences.",
    },
    contact: {
        email: "john.doe@example.com",
        phone: "123-456-7890",
        location: "San Francisco, USA",
        website: "johndoe.dev",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
    },
    experience: [
        {
            role: "Senior Software Engineer",
            company: "Tech Solutions Inc.",
            location: "San Francisco, CA",
            startDate: "2020-01",
            endDate: "Present",
            bullets: [
                "Led the development of a new microservices-based architecture, improving system scalability by 50%.",
                "Mentored junior engineers, fostering a culture of knowledge sharing and growth.",
                "Reduced API response times by 30% through performance optimization.",
            ],
        },
    ],
    projects: [
        {
            name: "Portfolio Generator",
            description: "A tool to automatically generate a personal portfolio website from a CV.",
            tech: ["Next.js", "Tailwind CSS", "TypeScript", "Genkit"],
            links: [{ url: "https://github.com/johndoe/portfolio-generator" }],
            impact: "Enabled hundreds of users to create a professional online presence in minutes.",
        },
    ],
    education: [
        {
            degree: "B.Sc. in Computer Science",
            field: "Computer Science",
            institution: "State University",
            startDate: "2012",
            endDate: "2016",
            notes: "Graduated with Honors.",
        },
    ],
    skills: ["React", "TypeScript", "Node.js", "Next.js", "GraphQL", "PostgreSQL", "Docker"],
    certifications: [],
    awards: [],
    languages: [{ name: "English", level: "Native" }],
    interests: ["Hiking", "Photography", "Open Source"],
    photoUrl: null,
};


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
      title: 'Processing your CV...',
      description: 'This may take a moment.',
    });

    // Simulate parsing delay
    setTimeout(() => {
        if (photoFile) {
            const photoReader = new FileReader();
            photoReader.readAsDataURL(photoFile);
            photoReader.onload = async () => {
                const photoDataUri = photoReader.result as string;
                localStorage.setItem('userPhoto', photoDataUri);
                handleDataAndNavigate(mockParsedData);
                setIsParsing(false);
            }
        } else {
            localStorage.removeItem('userPhoto');
            handleDataAndNavigate(mockParsedData);
            setIsParsing(false);
        }
    }, 2000);
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
