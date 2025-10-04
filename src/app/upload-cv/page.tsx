'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { User, UploadCloud } from 'lucide-react';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import ModernTemplate from '@/templates/ModernTemplate';
import type { PortfolioData } from '@/templates/types';

// Dummy data for previewing the template
const dummyData: PortfolioData = {
  name: 'John Doe',
  title: 'Senior Software Engineer',
  summary:
    'A passionate software engineer with over 10 years of experience in building scalable web applications and leading high-performing teams.',
  skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL', 'AWS'],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      start: '2020',
      end: 'Present',
      description:
        'Leading the development of a new cloud-native platform, improving system performance by 30%.',
    },
     {
      role: 'Frontend Developer',
      company: 'Creative Minds LLC',
      start: '2017',
      end: '2020',
      description:
        'Developed and maintained the main user interface for a widely used design tool, focusing on user experience and responsive design.',
    },
  ],
  projects: [
    {
      title: 'Project Phoenix',
      description:
        'A complete overhaul of an e-commerce platform to improve user engagement and sales.',
      tech: ['Next.js', 'Stripe', 'Vercel'],
      link: '#',
    },
    {
      title: 'Data Visualizer',
      description:
        'An interactive dashboard for visualizing complex data sets using D3.js and React.',
      tech: ['React', 'D3.js', 'Express'],
      link: '#',
    },
  ],
  education: [
    {
      degree: 'B.Sc. in Computer Science',
      institution: 'State University',
      start: '2013',
      end: '2017',
    },
  ],
};


export default function UploadCV() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const avatarImage = PlaceHolderImages.find(p => p.id === 'profile-avatar-placeholder');


  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col justify-center px-10 py-16 w-full max-w-lg">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-2 font-headline text-center">
              Upload Your CV
            </h1>
            <p className="text-muted-foreground mb-10 text-center">
              Let’s start building your portfolio. Upload your CV or fill in your
              info manually.
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all duration-300">
                <label className="block text-foreground font-semibold mb-3">
                  Upload CV / Resume
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (MAX. 5MB)</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleCvFileChange}/>
                  </label>
                </div>
                {cvFile && <p className="text-sm text-muted-foreground mt-4">Selected file: {cvFile.name}</p>}
              </div>

              <div className="p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 flex items-center space-x-6">
                <div className="relative w-20 h-20 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                  {profilePic ? (
                    <Image
                      src={profilePic}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    avatarImage && (
                      <Image
                        src={avatarImage.imageUrl}
                        alt="Profile placeholder"
                        data-ai-hint={avatarImage.imageHint}
                        fill
                        className="object-cover opacity-50"
                      />
                    )
                  )}
                   {!profilePic && <User className="w-8 h-8 text-muted-foreground z-10" />}
                </div>
                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Profile Picture (Optional)
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="w-full border-border rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-secondary file:text-secondary-foreground hover:file:opacity-90 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="relative text-center my-8">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                      Or
                  </span>
              </div>
            </div>
            
            <Button variant="link" className="w-full text-primary hover:underline font-medium">
              Fill Form Manually
            </Button>

            <Button className="mt-6 w-full btn-special py-6 text-lg">
              Continue
            </Button>
          </div>
        </div>
        <div className="mt-16">
            <h2 className="text-center text-2xl font-bold mb-8">Template Preview</h2>
            <ModernTemplate data={dummyData} />
        </div>
        <ThemeSwitcher />
      </div>
    </ThemeProvider>
  );
}
