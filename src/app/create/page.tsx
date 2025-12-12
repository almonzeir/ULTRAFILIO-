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
  const [factIndex, setFactIndex] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);

  const STEPS = [
    { label: "Initializing AI Engine...", duration: 2000 },
    { label: "Scanning CV Document...", duration: 3000 },
    { label: "Extracting Professional Skills...", duration: 4000 },
    { label: "Analyzing Work Experience...", duration: 4000 },
    { label: "Structuring Portfolio Data...", duration: 3000 },
    { label: "Finalizing Design System...", duration: 2000 },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % PORTFOLIO_FACTS.length);
    }, 4000);
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
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted)/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-2xl w-full mx-auto px-6 flex flex-col items-center">

        {/* Spinner */}
        <div className="relative mb-16">
          <motion.div
            className="w-20 h-20 rounded-full border-2 border-muted"
            style={{ borderTopColor: 'hsl(var(--primary))' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-10 space-y-2">
          <motion.h2
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight"
          >
            {STEPS[currentStep]?.label || "Finalizing..."}
          </motion.h2>
          <p className="text-muted-foreground">AI is crafting your professional story</p>
        </div>

        {/* Steps */}
        <div className="w-full max-w-md space-y-3 mb-12">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-primary scale-125' :
                  isCompleted ? 'bg-muted-foreground' : 'bg-muted'
                  }`} />
                <span className={`text-sm transition-colors duration-300 ${isActive ? 'text-foreground font-medium' :
                  isCompleted ? 'text-muted-foreground' : 'text-muted'
                  }`}>
                  {step.label}
                </span>
                {isCompleted && <span className="ml-auto text-muted-foreground text-xs">✓</span>}
              </div>
            );
          })}
        </div>

        {/* Fact */}
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="border border-border p-6 rounded-2xl max-w-lg w-full text-center bg-card"
          >
            <p className="text-xs font-medium text-muted-foreground tracking-widest uppercase mb-3">Did You Know?</p>
            <p className="text-base text-foreground font-medium leading-relaxed">
              "{PORTFOLIO_FACTS[factIndex]}"
            </p>
          </motion.div>
        </AnimatePresence>

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
