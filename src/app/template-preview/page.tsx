'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sun, Moon, Menu, X, Check, Monitor, Smartphone, Sparkles, Layout, Zap, Ghost, Feather, Box } from 'lucide-react';

// Templates
import ModernTemplate from '@/templates/ModernTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import MinimalPlusTemplate from '@/templates/MinimalPlusTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import ExecutiveTemplate from '@/templates/ExecutiveTemplate';
import AuroraTemplate from '@/templates/AuroraTemplate';
import FuturisticTemplate from '@/templates/GeneratedModernTemplate';
import Cyber3DTemplate from '@/templates/Cyber3DTemplate';

import { ColorThemeProvider, useColorTheme } from '@/context/color-theme-context';
import type { PortfolioData } from '@/templates/types';

// Sample data for preview
const sampleData: PortfolioData = {
  personalInfo: {
    fullName: "Alex Johnson",
    portfolioNameAbbr: "AJ",
    title: "Senior Full Stack Developer",
    tagline: "Building elegant solutions to complex problems. I craft beautiful, performant web applications with modern technologies.",
    profilePhotoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    email: "alex.johnson@example.com",
    linkedInURL: "https://linkedin.com/in/alexjohnson",
    githubURL: "https://github.com/alexjohnson",
    location: "San Francisco, CA"
  },
  about: {
    extendedBio: "I'm a passionate developer with 8+ years of experience building web applications. I specialize in React, TypeScript, and Node.js, and I love creating intuitive user experiences that make a difference.",
    stats: [
      { icon: "briefcase", value: "8+", label: "Years Experience" },
      { icon: "check-circle", value: "50+", label: "Projects Done" },
      { icon: "users", value: "30+", label: "Happy Clients" },
      { icon: "award", value: "5", label: "Awards Won" }
    ],
    skills: [
      { icon: "code", category: "Frontend", tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js"] },
      { icon: "server", category: "Backend", tags: ["Node.js", "Express", "PostgreSQL", "GraphQL", "Python"] },
      { icon: "cloud", category: "DevOps", tags: ["Docker", "Kubernetes", "AWS", "GCP", "CI/CD"] }
    ]
  },
  experience: [
    {
      dates: "2021 - Present",
      location: "San Francisco, CA",
      jobTitle: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      responsibilities: ["Lead development of flagship product used by 100K+ users", "Architected microservices infrastructure reducing costs by 40%", "Mentored team of 5 junior developers"],
      tags: ["React", "Node.js", "AWS", "PostgreSQL"]
    },
    {
      dates: "2018 - 2021",
      location: "New York, NY",
      jobTitle: "Full Stack Developer",
      company: "StartupXYZ",
      responsibilities: ["Built customer-facing dashboard from scratch", "Implemented real-time features using WebSockets"],
      tags: ["Vue.js", "Python", "MongoDB"]
    }
  ],
  projects: [
    {
      imageURL: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
      name: "E-Commerce Platform",
      category: "Web Application",
      description: "Full-featured e-commerce platform with real-time inventory, payments, and analytics dashboard.",
      tags: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
      detailsURL: "#"
    },
    {
      imageURL: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      name: "Analytics Dashboard",
      category: "SaaS Application",
      description: "Real-time analytics dashboard for tracking user behavior and business metrics.",
      tags: ["React", "D3.js", "Node.js", "WebSocket"],
      detailsURL: "#"
    },
    {
      imageURL: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
      name: "Mobile Banking App",
      category: "Mobile Application",
      description: "Secure mobile banking application with biometric authentication.",
      tags: ["React Native", "TypeScript", "Node.js"],
      detailsURL: "#"
    }
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "Stanford University",
      startDate: "2014",
      endDate: "2018"
    }
  ],
  certifications: ["AWS Solutions Architect", "Google Cloud Professional"],
  languages: [{ name: "English", level: "Native" }, { name: "Spanish", level: "Intermediate" }]
};

// Template definitions
const templates = [
  { id: 'aurora', name: 'Aurora (Pro)', icon: Sparkles, color: 'bg-gradient-to-r from-violet-500 to-purple-500' },
  { id: 'modern', name: 'Modern', icon: Layout, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  { id: 'creative', name: 'Creative', icon: Zap, color: 'bg-gradient-to-r from-pink-500 to-orange-500' },
  { id: 'minimalist', name: 'Minimalist', icon: Ghost, color: 'bg-gradient-to-r from-gray-500 to-slate-500' },
  { id: 'minimalplus', name: 'Minimal+', icon: Feather, color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
  { id: 'executive', name: 'Executive', icon: Box, color: 'bg-gradient-to-r from-amber-500 to-yellow-500' },
  { id: 'futuristic', name: 'Futuristic', icon: Feather, color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
  { id: 'cyber3d', name: 'Cyber V1 (3D)', icon: Box, color: 'bg-gradient-to-r from-cyan-400 to-blue-600' },
  { id: 'basic', name: 'Classic', icon: Layout, color: 'bg-gradient-to-r from-slate-500 to-gray-600' },
];

// Template components mapping
const templateComponents: Record<string, React.ComponentType<{ data: PortfolioData; isDarkMode?: boolean }>> = {
  aurora: AuroraTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  minimalist: MinimalistTemplate,
  minimalplus: MinimalPlusTemplate,
  executive: ExecutiveTemplate,
  futuristic: FuturisticTemplate,
  cyber3d: Cyber3DTemplate,
  basic: BasicTemplate,
};

function TemplatePreviewContent() {
  const router = useRouter();
  const { theme, setTheme, availableThemes } = useColorTheme();

  const [selectedTemplate, setSelectedTemplate] = useState('aurora');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved template from localStorage if exists
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate && templateComponents[savedTemplate]) {
      setSelectedTemplate(savedTemplate);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem('selectedTemplate', selectedTemplate);
    router.push('/choose-profile-type');
  };

  const SelectedTemplateComponent = templateComponents[selectedTemplate] || AuroraTemplate;

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-900 text-white font-sans">

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR (Controls) --- */}
      <aside
        className={`
                    fixed lg:relative z-40 lg:z-auto
                    h-full bg-neutral-900 border-r border-neutral-800 
                    transition-all duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen
            ? 'w-[85vw] sm:w-80 translate-x-0'
            : 'w-0 -translate-x-full'
          }
                `}
      >
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between min-w-[280px]">
          <div className="font-bold text-lg sm:text-xl tracking-tight">UltraFolio</div>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-neutral-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-neutral-700 min-w-[280px]">

          {/* Template Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase text-neutral-500 mb-3 sm:mb-4 tracking-wider">Select Template</h3>
            <div className="grid gap-1.5 sm:gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    localStorage.setItem('selectedTemplate', t.id);
                    // Auto-close sidebar on mobile after selection
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center gap-3 w-full p-2.5 sm:p-3 rounded-xl transition-all duration-200 text-left border ${selectedTemplate === t.id
                    ? 'bg-neutral-800 border-neutral-600 text-white shadow-lg'
                    : 'border-transparent text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${t.color} flex items-center justify-center shadow-inner`}>
                    <t.icon size={14} className="text-white" />
                  </div>
                  <span className="font-medium">{t.name}</span>
                  {selectedTemplate === t.id && <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          {/* Light/Dark Mode Toggle */}
          <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 p-4 rounded-xl border border-violet-500/30">
            <h3 className="text-xs font-bold uppercase text-violet-400 mb-3 tracking-wider flex items-center gap-2">
              {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
              Appearance Mode
            </h3>
            <div className="bg-neutral-800 p-1 rounded-xl flex">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${!isDarkMode ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}
              >
                <Sun size={16} /> Light
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${isDarkMode ? 'bg-violet-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase text-neutral-500 mb-4 tracking-wider">Color Theme</h3>
            <div className="grid grid-cols-4 gap-2">
              {availableThemes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  title={t.name}
                  className={`relative w-full aspect-square rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${theme === t.name
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-transparent hover:border-neutral-600 hover:scale-105'
                    }`}
                  style={{ backgroundColor: t.primary }}
                >
                  {theme === t.name && <Check className="w-5 h-5 text-white drop-shadow-lg" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <button
              onClick={handleContinue}
              className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg"
            >
              Use This Template →
            </button>
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-full py-3 bg-neutral-800 text-neutral-300 font-medium rounded-xl hover:bg-neutral-700 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN PREVIEW AREA --- */}
      <main className={`flex-1 flex flex-col min-w-0 relative transition-colors duration-300 ${isDarkMode ? 'dark bg-neutral-950' : 'bg-slate-50'}`}>

        {/* Toolbar */}
        <div className="h-14 sm:h-16 border-b border-neutral-800 flex items-center justify-between px-3 sm:px-4 bg-neutral-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Always show menu button on mobile, conditional on desktop */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2.5 sm:p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors ${isSidebarOpen ? 'lg:hidden' : ''}`}
            >
              <Menu size={22} />
            </button>
            <div className="h-6 w-px bg-neutral-800 mx-2 hidden sm:block" />
            <div className="flex bg-neutral-800/50 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                title="Desktop View"
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                title="Mobile View"
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
            <span className="hidden sm:inline">Preview Mode</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20 animate-pulse">
              Live
            </div>
          </div>
        </div>

        {/* Preview Viewport */}
        <div className="flex-1 overflow-hidden relative bg-neutral-950 flex items-center justify-center p-2 sm:p-4 md:p-8">
          <div
            className={`transition-all duration-500 ease-in-out bg-white dark:bg-neutral-950 overflow-hidden shadow-2xl relative ${viewMode === 'mobile'
              ? 'w-[300px] sm:w-[375px] h-[550px] sm:h-[667px] rounded-[2rem] sm:rounded-[3rem] border-4 sm:border-8 border-neutral-800 ring-1 ring-neutral-700'
              : 'w-full h-full rounded-lg sm:rounded-xl border border-neutral-800'
              }`}
          >
            {/* The Template Renders Here */}
            <div className={`w-full h-full overflow-auto ${isDarkMode ? 'dark' : ''}`}>
              <SelectedTemplateComponent data={sampleData} isDarkMode={isDarkMode} />
            </div>

            {/* Mobile notch indicator */}
            {viewMode === 'mobile' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-black rounded-full z-50" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrap with ColorThemeProvider
export default function TemplatePreviewPage() {
  return (
    <ColorThemeProvider>
      <TemplatePreviewContent />
    </ColorThemeProvider>
  );
}
