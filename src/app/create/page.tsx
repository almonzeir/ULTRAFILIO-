'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';
import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@/templates/types';

export default function CreatePortfolioPage() {
  const [showManualForm, setShowManualForm] = React.useState(false);
  const router = useRouter();

  const handleDataAndNavigate = (data: PortfolioData) => {
    // In a real app, you might send this to a backend.
    // For now, we store in localStorage to pass between pages.
    try {
      localStorage.setItem('userData', JSON.stringify(data));
      router.push('/choose-template');
    } catch (e) {
      console.error('Failed to save user data to localStorage', e);
      // Optionally, show an error toast to the user
    }
  };

  const handleManualFormSubmit = (formData: Omit<PortfolioData, 'skills' | 'projects' | 'education' | 'experience' > & { skills: string;[key: string]: any }) => {
    const portfolioData: PortfolioData = {
      name: formData.name,
      title: formData.title,
      summary: formData.summary,
      // A real implementation would handle multiple entries for these fields.
      // For now, we'll create single entries based on the form.
      experience: [
        {
          role: formData.exp_role || '',
          company: formData.exp_company || '',
          start: formData.exp_start || '',
          end: formData.exp_end || '',
          description: formData.exp_description || '',
        },
      ],
      education: [
        {
          degree: formData.edu_degree || '',
          institution: formData.edu_institution || '',
          start: formData.edu_start_year || '',
          end: formData.edu_end_year || '',
        },
      ],
      projects: [
        {
          title: formData.proj_title || '',
          description: formData.proj_description || '',
          tech: (formData.proj_tech || '').split(',').map(t => t.trim()).filter(Boolean),
          link: formData.proj_link || '',
        },
      ],
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
       // Add other properties from your form as needed
      ...formData.personal_info
    };
    handleDataAndNavigate(portfolioData);
  };
  
  const handleUploadAndNavigate = () => {
    // This is a placeholder. In a real app, you would parse the CV
    // and then call handleDataAndNavigate with the extracted data.
    const dummyData: PortfolioData = {
        name: 'John Doe',
        title: 'Software Engineer',
        summary: 'A passionate software engineer with experience in building web applications.',
        skills: ['React', 'TypeScript', 'Node.js'],
        experience: [{ role: 'Frontend Developer', company: 'Tech Corp', start: '2020', end: 'Present', description: 'Developing cool stuff.' }],
        projects: [{ title: 'My Project', description: 'A very cool project.', tech: ['React'] }],
        education: [{ degree: 'B.Sc. Computer Science', institution: 'University of Code', start: '2016', end: '2020' }]
    };
    handleDataAndNavigate(dummyData);
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
        <UploadCVCard onContinue={handleUploadAndNavigate} />
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
