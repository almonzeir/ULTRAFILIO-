'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';
import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ArrowRight, Pen } from 'lucide-react';
import Header from '@/components/layout/header';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

// Portfolio facts to show during loading
const PORTFOLIO_FACTS = [
  "Your portfolio speaks louder than your résumé.",
  "Small side-projects can change your career.",
  "Your portfolio shapes people's perception instantly.",
  "Portfolios beat degrees in creative fields.",
  "Digital portfolios are global branding power.",
  "One great project can open a thousand doors.",
  "Your work tells your story better than words.",
  "Recruiters spend 7 seconds on a résumé, 2 minutes on a portfolio.",
  "The best portfolios show process, not just results.",
  "A portfolio is your 24/7 sales pitch."
];

const LoadingScreen = () => {
  const [logs, setLogs] = React.useState<string[]>([]);
  const [currentStep, setCurrentStep] = React.useState(0);

  // Advanced Tech Steps
  const STEPS = [
    { label: "INITIALIZING NEURAL CORE...", duration: 2500 },
    { label: "ESTABLISHING SECURE UPLINK...", duration: 3000 },
    { label: "VECTORIZING PROFESSIONAL DATA...", duration: 4000 },
    { label: "OPTIMIZING SEMANTIC LAYERS...", duration: 3500 },
    { label: "SYNTHESIZING DESIGN SYSTEM...", duration: 3000 },
    { label: "FINALIZING OUTPUT MATRIX...", duration: 2000 },
  ];

  // Simulated Terminal Logs
  React.useEffect(() => {
    let logIndex = 0;
    const possibleLogs = [
      "Allocating memory block 0x8F4...",
      "Parsing distinct entities...",
      "Resolving dependency graph...",
      "Injecting styles...",
      "Verifying integrity hash...",
      "Compiling assets...",
      "Optimizing render tree...",
      "Connecting to distribution network...",
      "Applying heuristic analysis...",
      "Generating layout permutations...",
      "Analyzing content density...",
      "Refining color variables...",
      "Calibrating animation timing...",
      "System green.",
    ];

    const interval = setInterval(() => {
      if (logIndex < possibleLogs.length) {
        setLogs((prev) => [...prev.slice(-4), `> ${possibleLogs[logIndex]}`]);
        logIndex++;
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const runSteps = (index: number) => {
      if (index >= STEPS.length) return;
      setCurrentStep(index);
      timeout = setTimeout(() => {
        runSteps(index + 1);
      }, STEPS[index].duration);
    };
    runSteps(0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden font-mono text-cyan-500 selection:bg-cyan-500/20">
      {/* --- Sci-Fi Background Layer --- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#050510] to-black" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e91a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e91a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* --- Holographic Central Core --- */}
      <div className="relative z-10 flex flex-col items-center">

        <div className="relative w-64 h-64 mb-16 flex items-center justify-center">
          {/* Ring 1 - Fast Reverse Spin */}
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-b-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          {/* Ring 2 - Slow Forward Spin */}
          <motion.div
            className="absolute inset-4 rounded-full border-r-2 border-l-2 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          {/* Ring 3 - Pulse */}
          <motion.div
            className="absolute inset-12 rounded-full border border-cyan-300/20 bg-cyan-900/10 backdrop-blur-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Center Logo / Core */}
          <div className="relative z-20 flex flex-col items-center justify-center bg-black/80 rounded-full w-24 h-24 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.5)]">
            <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>

          {/* Orbiting Particle */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-3 w-3 bg-white rounded-full absolute top-0 left-1/2 -translate-x-1/2 blur-[2px] shadow-[0_0_10px_white]" />
          </motion.div>
        </div>

        {/* --- Main Status Text --- */}
        <div className="text-center space-y-4 mb-12 relative">
          {/* Glitch Effect Line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent absolute -top-6 animate-pulse opacity-50" />

          <h2 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-cyan-50 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            {STEPS[currentStep]?.label || "SYSTEM READY"}
          </h2>
          <p className="text-cyan-400/60 text-sm uppercase tracking-widest">
            AI Processing Unit Active
          </p>
        </div>

        {/* --- Steps Progress Bar --- */}
        <div className="w-full max-w-sm mb-12">
          <div className="flex justify-between items-end mb-2 text-xs text-cyan-600 font-mono">
            <span>PROGRESS</span>
            <span>{Math.round((currentStep / (STEPS.length - 1)) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-cyan-900/30 rounded-full overflow-hidden border border-cyan-900/50">
            <motion.div
              className="h-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* --- Terminal Window --- */}
        <div className="w-full max-w-lg bg-black/80 border border-cyan-800/50 rounded-lg p-4 font-mono text-xs shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-6 bg-cyan-900/20 border-b border-cyan-800/50 flex items-center px-3 gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
            <span className="ml-auto text-cyan-700 font-bold text-[10px]">TERMINAL.EXE</span>
          </div>
          <div className="mt-4 space-y-1 h-24 flex flex-col justify-end">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-cyan-300/80 truncate"
              >
                {log}
              </motion.div>
            ))}
          </div>
          {/* Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
        </div>

      </div>
    </div>
  );
};

const AuthPrompt = ({ dict }: { dict: Dictionary['createPage']['authPrompt'] }) => (
  <section className="min-h-screen bg-background text-foreground px-6 py-20 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center p-10 border border-border rounded-3xl bg-card">
      <h1 className="text-3xl font-bold tracking-tight mb-4">{dict.title}</h1>
      <p className="text-muted-foreground mb-8">
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
  const [hoveredSide, setHoveredSide] = React.useState<'left' | 'right' | null>(null);
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

  const handleManualFormSubmit = async (formData: any) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('No auth token');

      let photoURL = '';
      if (formData.photoFile) {
        const fileExt = formData.photoFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('portfolios')
          .upload(`photos/${fileName}`, formData.photoFile);

        if (!uploadError) {
          const { data } = supabase.storage.from('portfolios').getPublicUrl(`photos/${fileName}`);
          photoURL = data.publicUrl;
        }
      }

      const portfolioData: PortfolioData = {
        personalInfo: {
          fullName: formData.fullName,
          portfolioNameAbbr: formData.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
          title: formData.professionalTitle,
          tagline: formData.summary,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          linkedInURL: formData.linkedin,
          githubURL: formData.github,
          location: formData.location,
          profilePhotoURL: photoURL,
        },
        about: {
          extendedBio: formData.summary,
          stats: [],
          skills: formData.skills ? formData.skills.split(',').map((s: string) => ({ category: "General", icon: "code", tags: [s.trim()] })) : []
        },
        experience: formData.experience.map((exp: any) => ({
          jobTitle: exp.jobTitle,
          company: exp.company,
          location: '',
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

      await supabase.from('users').upsert({
        id: user.id,
        display_name: portfolioData.personalInfo.fullName,
      }, { onConflict: 'id' });

      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          title: portfolioData.personalInfo.fullName + "'s Portfolio",
          subtitle: portfolioData.personalInfo.title,
          description: portfolioData.personalInfo.tagline,
          email: portfolioData.personalInfo.email,
          phone: portfolioData.personalInfo.phone,
          location: portfolioData.personalInfo.location,
          website: portfolioData.personalInfo.website,
          linkedin: portfolioData.personalInfo.linkedInURL,
          github: portfolioData.personalInfo.githubURL,
          experience: portfolioData.experience,
          education: portfolioData.education,
          skills: portfolioData.about.skills,
          projects: portfolioData.projects,
          certifications: portfolioData.certifications,
          languages: portfolioData.languages,
          template_id: 'executive',
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '✅ Portfolio Created!',
        description: 'Now choose a template for your portfolio.',
      });

      router.push(`/choose-template?portfolioId=${portfolio.id}`);

    } catch (error: any) {
      console.error('Error creating portfolio:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not create portfolio.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const [extractedData, setExtractedData] = React.useState<any>(null);
  const [uploadedPhotoURL, setUploadedPhotoURL] = React.useState<string>('');

  const handleGeneratePortfolio = async (cvFile: File, photoFile: File | null) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to create a portfolio.' });
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error('No auth token found');

      let photoURL = '';
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('portfolios')
          .upload(`photos/${fileName}`, photoFile);

        if (!uploadError) {
          const { data } = supabase.storage.from('portfolios').getPublicUrl(`photos/${fileName}`);
          photoURL = data.publicUrl;
        }
      }

      const formData = new FormData();
      formData.append('cv', cvFile);
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      formData.append('userId', user.id);

      const response = await fetch('/api/portfolio/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse CV.');
      }

      const { portfolioId } = await response.json();

      const { data: portfolio, error: fetchError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', portfolioId)
        .single();

      if (fetchError || !portfolio) {
        throw new Error('Could not fetch extracted data');
      }

      const formattedData = {
        fullName: portfolio.title?.replace("'s Portfolio", '') || '',
        professionalTitle: portfolio.subtitle || '',
        summary: portfolio.description || '',
        location: portfolio.location || '',
        email: portfolio.email || '',
        phone: portfolio.phone || '',
        linkedin: portfolio.linkedin || '',
        github: portfolio.github || '',
        skills: portfolio.skills?.map((s: any) => s.tags?.join(', ')).join(', ') || '',
        experience: portfolio.experience?.length > 0
          ? portfolio.experience.map((exp: any) => ({
            jobTitle: exp.jobTitle || '',
            company: exp.company || '',
            startDate: exp.dates?.split(' - ')[0] || '',
            endDate: exp.dates?.split(' - ')[1] || '',
            description: exp.responsibilities?.join('\n') || '',
          }))
          : [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
        education: portfolio.education?.length > 0
          ? portfolio.education.map((edu: any) => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            startYear: edu.startDate || '',
            endYear: edu.endDate || '',
          }))
          : [{ degree: '', institution: '', startYear: '', endYear: '' }],
        projects: portfolio.projects?.length > 0
          ? portfolio.projects.map((proj: any) => ({
            title: proj.name || '',
            description: proj.description || '',
            technologies: proj.tags?.join(', ') || '',
            link: proj.detailsURL || '',
          }))
          : [{ title: '', description: '', technologies: '', link: '' }],
        certifications: portfolio.certifications?.length > 0
          ? portfolio.certifications.map((cert: string) => ({ name: cert, organization: '', year: '' }))
          : [{ name: '', organization: '', year: '' }],
        languages: portfolio.languages?.length > 0
          ? portfolio.languages.map((lang: any) => ({ language: lang.name || '', proficiency: lang.level || '' }))
          : [{ language: '', proficiency: '' }],
        portfolioId: portfolioId,
      };

      setExtractedData(formattedData);
      setUploadedPhotoURL(photoURL || portfolio.profile_photo_url || '');

      toast({
        title: '✅ CV Parsed Successfully!',
        description: 'Review your info below and fill in any missing details.',
      });

      setShowManualForm(true);

    } catch (error: any) {
      console.error('Portfolio generation failed:', error);
      toast({
        variant: 'destructive',
        title: '🚫 Oh no! Something went wrong.',
        description: error.message || 'Could not generate your portfolio. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewFormSubmit = async (formData: any) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('No auth token');

      let photoURL = uploadedPhotoURL;
      if (formData.photoFile) {
        const fileExt = formData.photoFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('portfolios')
          .upload(`photos/${fileName}`, formData.photoFile);

        if (!uploadError) {
          const { data } = supabase.storage.from('portfolios').getPublicUrl(`photos/${fileName}`);
          photoURL = data.publicUrl;
        }
      }

      const portfolioData: PortfolioData = {
        personalInfo: {
          fullName: formData.fullName,
          portfolioNameAbbr: formData.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
          title: formData.professionalTitle,
          tagline: formData.summary,
          email: formData.email,
          phone: formData.phone,
          linkedInURL: formData.linkedin,
          githubURL: formData.github,
          location: formData.location,
          profilePhotoURL: photoURL,
        },
        about: {
          extendedBio: formData.summary,
          stats: [],
          skills: formData.skills ? formData.skills.split(',').map((s: string) => ({ category: "General", icon: "code", tags: [s.trim()] })) : []
        },
        experience: formData.experience.map((exp: any) => ({
          jobTitle: exp.jobTitle,
          company: exp.company,
          location: '',
          dates: `${exp.startDate || ''} - ${exp.endDate || 'Present'}`,
          responsibilities: exp.description ? exp.description.split('\n').filter(Boolean) : [],
          tags: []
        })).filter((exp: any) => exp.jobTitle || exp.company),
        education: formData.education.map((edu: any) => ({
          degree: edu.degree,
          institution: edu.institution,
          startDate: edu.startYear,
          endDate: edu.endYear,
        })).filter((edu: any) => edu.degree || edu.institution),
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

      const portfolioId = extractedData?.portfolioId;

      if (portfolioId) {
        const { error } = await supabase
          .from('portfolios')
          .update({
            title: portfolioData.personalInfo.fullName + "'s Portfolio",
            subtitle: portfolioData.personalInfo.title,
            description: portfolioData.personalInfo.tagline,
            profile_photo_url: photoURL,
            email: portfolioData.personalInfo.email,
            phone: portfolioData.personalInfo.phone,
            location: portfolioData.personalInfo.location,
            linkedin: portfolioData.personalInfo.linkedInURL,
            github: portfolioData.personalInfo.githubURL,
            experience: portfolioData.experience,
            education: portfolioData.education,
            skills: portfolioData.about.skills,
            projects: portfolioData.projects,
            certifications: portfolioData.certifications,
            languages: portfolioData.languages,
          })
          .eq('id', portfolioId);

        if (error) throw error;

        toast({
          title: '✅ Portfolio Updated!',
          description: 'Now choose a template for your portfolio.',
        });

        router.push(`/choose-template?portfolioId=${portfolioId}`);
      } else {
        await supabase.from('users').upsert({
          id: user.id,
          display_name: portfolioData.personalInfo.fullName,
        }, { onConflict: 'id' });

        const { data: portfolio, error } = await supabase
          .from('portfolios')
          .insert({
            user_id: user.id,
            title: portfolioData.personalInfo.fullName + "'s Portfolio",
            subtitle: portfolioData.personalInfo.title,
            description: portfolioData.personalInfo.tagline,
            profile_photo_url: photoURL,
            email: portfolioData.personalInfo.email,
            phone: portfolioData.personalInfo.phone,
            location: portfolioData.personalInfo.location,
            linkedin: portfolioData.personalInfo.linkedInURL,
            github: portfolioData.personalInfo.githubURL,
            experience: portfolioData.experience,
            education: portfolioData.education,
            skills: portfolioData.about.skills,
            projects: portfolioData.projects,
            certifications: portfolioData.certifications,
            languages: portfolioData.languages,
            template_id: 'executive',
            status: 'draft'
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: '✅ Portfolio Created!',
          description: 'Now choose a template for your portfolio.',
        });

        router.push(`/choose-template?portfolioId=${portfolio.id}`);
      }

    } catch (error: any) {
      console.error('Error saving portfolio:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not save portfolio.',
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

  if (isProcessing) {
    return <LoadingScreen />;
  }

  if (showManualForm) {
    const isFromCVExtraction = extractedData !== null;

    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow">
          {isFromCVExtraction && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary text-primary-foreground py-4 px-6 text-center"
            >
              <p className="font-medium">
                ✅ AI extracted your CV data! Review the info below and fill in anything that's missing.
              </p>
            </motion.div>
          )}
          <ManualForm
            onSubmit={isFromCVExtraction ? handleReviewFormSubmit : handleManualFormSubmit}
            onBack={() => {
              setShowManualForm(false);
              setExtractedData(null);
              setUploadedPhotoURL('');
            }}
            dict={dict.manualForm}
            initialData={extractedData || undefined}
            initialPhotoURL={uploadedPhotoURL || undefined}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">

        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted)/0.3)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <section className="w-full max-w-5xl mx-auto relative z-10">

          {/* Header */}
          <motion.div
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-3">
              {dict.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {dict.subtitle}
            </p>
          </motion.div>

          {/* Split Panel Container */}
          <motion.div
            className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid lg:grid-cols-2">

              {/* LEFT: CV Upload Section (PRIMARY) */}
              <motion.div
                className="relative bg-card transition-all duration-300 border-b lg:border-b-0 lg:border-r border-border"
                onMouseEnter={() => setHoveredSide('left')}
                onMouseLeave={() => setHoveredSide(null)}
                animate={{
                  opacity: hoveredSide === 'right' ? 0.6 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <UploadCVCard
                  onContinue={handleGeneratePortfolio}
                  isProcessing={isProcessing}
                  dict={dict.uploadCard}
                />
              </motion.div>

              {/* RIGHT: Manual Entry Section */}
              <motion.div
                className="relative bg-muted/30 p-8 md:p-10 flex flex-col justify-between cursor-pointer transition-all duration-300 group min-h-[400px]"
                onClick={() => setShowManualForm(true)}
                onMouseEnter={() => setHoveredSide('right')}
                onMouseLeave={() => setHoveredSide(null)}
                animate={{
                  opacity: hoveredSide === 'left' ? 0.6 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
                  <motion.div
                    className="w-40 h-40 border-2 border-foreground rounded-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center mb-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Pen className="w-6 h-6 text-foreground" />
                  </motion.div>

                  <motion.h2
                    className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {dict.manualCard.title}
                  </motion.h2>
                  <motion.p
                    className="text-base text-muted-foreground max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {dict.manualCard.description}
                  </motion.p>
                </div>

                {/* Ghost Button */}
                <motion.button
                  className="relative z-10 mt-8 w-full py-4 rounded-xl border-2 border-foreground text-foreground font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-foreground group-hover:text-background"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {dict.manualCard.button}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </motion.div>

            </div>
          </motion.div>

        </section>
      </main>
    </div>
  );
}
