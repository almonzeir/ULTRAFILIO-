'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModernTemplate from '@/templates/ModernTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import { ThemeProvider } from '@/components/theme-provider';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import type { PortfolioData } from '@/templates/types';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

const sampleData: PortfolioData = {
  personalInfo: {
    fullName: "Your Name",
    portfolioNameAbbr: "YN",
    title: "Your Title",
    tagline: "Your personal tagline or a brief introduction.",
    profilePhotoURL: "/placeholder.svg",
    email: "your.email@example.com",
    linkedInURL: "https://linkedin.com/in/your-profile",
    location: "Your City, Your Country"
  },
  about: {
    extendedBio: "This is an extended bio about you. You can talk about your passions, your skills, and your experience.",
    stats: [
      { icon: "briefcase", value: "5+", label: "Years Experience" },
      { icon: "check-circle", value: "12", label: "Projects Done" },
      { icon: "users", value: "10", label: "Happy Clients" },
      { icon: "award", value: "3", label: "Awards Won" }
    ],
    skills: [
      { icon: "code", category: "Frontend", tags: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
      { icon: "server", category: "Backend", tags: ["Node.js", "Express", "PostgreSQL", "GraphQL"] },
      { icon: "cloud", category: "DevOps", tags: ["Docker", "Kubernetes", "GCP", "AWS"] }
    ]
  },
  experience: [
    {
      dates: "Jan 2022 - Present",
      location: "San Francisco, CA",
      jobTitle: "Software Engineer",
      company: "Tech Company",
      responsibilities: ["Developing and maintaining web applications using React and Node.js.", "Collaborating with cross-functional teams to deliver high-quality software."],
      tags: ["React", "Node.js", "TypeScript"]
    }
  ],
  projects: [
    {
      imageURL: "/project-placeholder.svg",
      name: "Project One",
      category: "Web Application",
      description: "A cool project I worked on.",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      detailsURL: "#"
    },
    {
      imageURL: "/project-placeholder.svg",
      name: "Project Two",
      category: "Mobile Application",
      description: "Another cool project.",
      tags: ["Next.js", "GraphQL", "PostgreSQL"],
      detailsURL: "#"
    }
  ]
};

export default function TemplatePreviewPage() {
  const router = useRouter();
  const [template, setTemplate] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('selectedTemplate');
    if (!t) {
        router.push('/choose-template');
        return;
    }
    setTemplate(t);
  }, [router]);

  const handleContinue = () => {
    router.push('/choose-profile-type');
  };

  const TemplateComponent = {
    modern: ModernTemplate,
    minimalist: MinimalistTemplate,
    basic: BasicTemplate,
  }[template || 'modern'];

  return (
    <LanguageProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <FirebaseClientProvider>
          <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
            <div className="text-center pt-10">
              <h1 className="text-3xl font-bold mb-3">Preview Your Portfolio</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                You can explore your chosen design before continuing.
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 mt-4 pt-8">
              {TemplateComponent && <TemplateComponent data={sampleData} />}
            </div>

            <div className="text-center my-16">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 mr-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ← Back
              </button>
              <button
                onClick={handleContinue}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
              >
                Continue →
              </button>
            </div>
            <ThemeSwitcher />
          </main>
          <Toaster />
        </FirebaseClientProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
