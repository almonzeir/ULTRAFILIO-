'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';
import { useRouter } from 'next/navigation';
import type { PortfolioData, Person, Experience, Project, Education } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';

const mockParsedData: PortfolioData = {
  personalInfo: {
    fullName: "John Doe",
    portfolioNameAbbr: "JD",
    title: "Senior Software Engineer",
    tagline: "An experienced software engineer specializing in building scalable web applications with modern technologies. Passionate about clean code and great user experiences.",
    email: "john.doe@example.com",
    linkedInURL: "https://linkedin.com/in/johndoe",
    location: "San Francisco, USA",
    profilePhotoURL: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NTk0NzE4Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  about: {
    extendedBio: "With over 5 years in the industry, I've had the privilege of contributing to robust applications and leading talented teams. My philosophy revolves around creating user-centric products that are not only functional but also a delight to use. I thrive in collaborative environments and am always eager to tackle new challenges.",
    stats: [
      {"icon": "trending-up", "value": "5+", "label": "Years in Industry"},
      {"icon": "check-circle", "value": "40+", "label": "Projects Delivered"},
      {"icon": "code", "value": "10+", "label": "Core Technologies"},
      {"icon": "globe", "value": "2", "label": "Languages Spoken"}
    ],
    skills: [
      {
        "category": "Frontend Development",
        "icon": "laptop-2",
        "tags": ["React", "Next.js", "Tailwind CSS", "TypeScript"]
      },
      {
        "category": "Backend & Data",
        "icon": "server",
        "tags": ["Node.js / Express", "Genkit", "PostgreSQL", "Firebase"]
      },
      {
        "category": "Tools & Cloud",
        "icon": "settings",
        "tags": ["Google Cloud", "Docker", "Git / GitHub", "CI/CD"]
      }
    ]
  },
  experience: [
    {
      jobTitle: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      dates: "2020 – Present",
      location: "San Francisco, CA",
      responsibilities: [
        "Led the development of a new microservices-based architecture, improving system scalability by 50%.",
        "Mentored junior engineers, fostering a culture of knowledge sharing and growth.",
        "Reduced API response times by 30% through performance optimization."
      ],
      tags: ["React", "Node.js", "Microservices"]
    },
    {
      jobTitle: "Software Engineer",
      company: "Innovate Co.",
      dates: "2018 – 2020",
      location: "Palo Alto, CA",
      responsibilities": [
        "Developed and maintained features for a high-traffic consumer-facing web application.",
        "Collaborated with product managers to define feature specifications and timelines."
      ],
      tags: ["JavaScript", "React", "Redux"]
    }
  ],
  projects: [
    {
      name: "Portfolio Generator",
      category: "Web App",
      description: "A tool to automatically generate a personal portfolio website from a CV using AI.",
      imageURL": "https://images.unsplash.com/photo-1674469569316-fc5e94b02537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZGFyayUyMHBvcnRmb2xpb3xlbnwwfHx8fDE3NTk1NzMzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Next.js", "Tailwind CSS", "TypeScript", "Genkit"],
      detailsURL": "#"
    },
     {
      name: "E-Commerce Analytics Dashboard",
      category: "Data Visualization",
      description: "A dashboard for visualizing sales data and customer behavior for an e-commerce platform.",
      imageURL": "https://images.unsplash.com/photo-1742540531234-146d41a8833b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxsaWdodCUyMHBvcnRmb2xpb3xlbnwwfHx8fDE3NTk1NzMzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags": ["React", "D3.js", "Node.js"],
      detailsURL": "#"
    }
  ],
   education: [
        {
            degree: "B.Sc. in Computer Science",
            institution: "State University",
            startDate: "2014",
            endDate: "2018",
        },
    ],
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
    handleDataAndNavigate(portfolioData);
  };
  
  const handleUploadAndNavigate = async (cvFile: File, photoFile: File | null) => {
    setIsParsing(true);
    toast({
      title: 'Processing your CV...',
      description: 'This may take a moment. We are using a mock parser for this demo.',
    });

    // Simulate parsing delay
    setTimeout(() => {
        let finalData = { ...mockParsedData };
        if (photoFile) {
            const photoReader = new FileReader();
            photoReader.readAsDataURL(photoFile);
            photoReader.onload = () => {
                const photoDataUri = photoReader.result as string;
                finalData.personalInfo.profilePhotoURL = photoDataUri;
                handleDataAndNavigate(finalData);
                setIsParsing(false);
            }
        } else {
            handleDataAndNavigate(finalData);
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
