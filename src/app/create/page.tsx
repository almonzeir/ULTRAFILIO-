'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';
import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { v4 as uuidv4 } from 'uuid';

const mockParsedData: PortfolioData = {
  personalInfo: {
    fullName: "Jane Doe",
    portfolioNameAbbr: "JD",
    title: "Senior Product Designer",
    tagline: "An experienced product designer specializing in creating intuitive and beautiful user interfaces for complex applications. Passionate about user-centric design and problem-solving.",
    email: "jane.doe@example.com",
    linkedInURL: "https://linkedin.com/in/janedoe",
    location: "London, UK",
    profilePhotoURL: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc1OTUyMDY3NXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  about: {
    extendedBio: "With over 7 years in the design industry, I've had the opportunity to work on a diverse range of projects, from mobile apps to enterprise software. My design process is rooted in empathy and a deep understanding of user needs, which I translate into elegant and effective solutions. I enjoy collaborating with cross-functional teams to bring ideas to life.",
    stats: [
      {"icon": "trending-up", "value": "7+", "label": "Years in Design"},
      {"icon": "check-circle", "value": "50+", "label": "Projects Shipped"},
      {"icon": "code", "value": "12+", "label": "Design Tools"},
      {"icon": "globe", "value": "2", "label": "Languages Spoken"}
    ],
    skills: [
      {
        "category": "UX/UI Design",
        "icon": "laptop-2",
        "tags": ["Figma", "Sketch", "Adobe XD", "User Research"]
      },
      {
        "category": "Prototyping & Testing",
        "icon": "server",
        "tags": ["InVision", "Principle", "A/B Testing", "Usability Testing"]
      },
      {
        "category": "Tools & Methodologies",
        "icon": "settings",
        "tags": ["Agile/Scrum", "Jira", "Design Systems", "HTML/CSS"]
      }
    ]
  },
  experience: [
    {
      jobTitle: "Senior Product Designer",
      company: "Innovate Inc.",
      dates: "2021 – Present",
      location: "London, UK",
      responsibilities: [
        "Led the redesign of the main dashboard, improving user satisfaction by 25%.",
        "Developed and maintained the company's design system, ensuring consistency across all products.",
        "Mentored two junior designers, helping them grow their skills and careers."
      ],
      tags: ["UX/UI", "Figma", "Design Systems", "Leadership"]
    },
    {
      jobTitle: "UX/UI Designer",
      company: "Digital Creations",
      dates: "2018 – 2021",
      location: "Manchester, UK",
      responsibilities: [
        "Designed interfaces for client projects, from initial wireframes to high-fidelity mockups.",
        "Worked closely with developers to ensure faithful implementation of designs."
      ],
      tags: ["UX/UI", "Sketch", "Mobile Design"]
    }
  ],
  projects: [
    {
      name: "Fintech Mobile App",
      category: "Mobile App",
      description: "A mobile banking app focused on simplicity and financial wellness. I led the UX research and UI design.",
      imageURL: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDE5ODJ8MHwxfHNlYXJjaHw0fHxmaW50ZWNoJTIwYXBwfGVufDB8fHx8MTc2MTE5Mzk0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Figma", "UX Research", "iOS"],
      detailsURL: "#"
    },
     {
      name: "SaaS Analytics Dashboard",
      category: "Web App",
      description: "A complex data visualization dashboard for a B2B SaaS product. My role was to simplify data presentation.",
      imageURL: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDE5ODJ8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmR8ZW58MHx8fHwxNzYxMTkzOTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["UI Design", "Data Viz", "B2B"],
      detailsURL: "#"
    },
    {
      name: "E-commerce Redesign",
      category: "Branding & Web",
      description: "A complete redesign of an online fashion retailer's website to be more modern and mobile-first.",
      imageURL: "https://images.unsplash.com/photo-1522201949107-6b3f5c5b1285?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDE5ODJ8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwZSUyMGNvbW1lcmNlfGVufDB8fHx8MTc2MTE5NDAxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Web Design", "Branding", "Mobile-First"],
      detailsURL: "#"
    }
  ],
   education: [
        {
            degree: "M.A. in Digital Media Design",
            institution: "University of the Arts",
            startDate: "2016",
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
      description: 'This may take a moment. We are parsing your CV and uploading your photo.',
    });

    try {
      // 1. Send CV to our API route for parsing
      const cvFormData = new FormData();
      cvFormData.append('cv', cvFile);

      const parseResponse = await fetch('/api/parse-cv', {
        method: 'POST',
        body: cvFormData,
      });

      if (!parseResponse.ok) {
        throw new Error('Failed to parse CV');
      }

      const parsedCvData: PortfolioData = await parseResponse.json();

      let photoURL = '';
      if (photoFile) {
        // 2. Upload photo to Firebase Storage
        const storageRef = ref(storage, `profile_photos/${uuidv4()}-${photoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, photoFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              // Optional: handle progress
            },
            (error) => {
              console.error('Photo upload failed:', error);
              reject(error);
            },
            async () => {
              photoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Update portfolio data with photo URL
      parsedCvData.personalInfo.profilePhotoURL = photoURL;

      // 3. Save portfolio data to Firestore
      const docRef = await addDoc(collection(db, 'portfolios'), parsedCvData);

      // 4. Navigate to the dynamic portfolio page
      router.push(`/portfolio/${docRef.id}`);

    } catch (error) {
      console.error('Upload and save failed:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'Could not process your request. Please try again or fill the form manually.',
      });
    } finally {
      setIsParsing(false);
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
