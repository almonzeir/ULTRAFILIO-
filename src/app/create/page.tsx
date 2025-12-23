'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';
import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { generateUniqueSlug } from '@/lib/slugs';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ArrowRight, Pen, Crown } from 'lucide-react';
import Header from '@/components/layout/header';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { cn } from '@/lib/utils';

import ProcessingScreen from '@/components/create/ProcessingScreen';
import ProPaywallModal from '@/components/shared/pro-paywall-modal';

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
  const isPro = true; // PRO CONSTRAINTS DISABLED - Free for first 1000 users
  const { language } = useLanguage();
  const [dict, setDict] = React.useState<Dictionary['createPage'] | null>(null);
  const [portfolioCount, setPortfolioCount] = React.useState<number>(0);
  const [isPaywallOpen, setIsPaywallOpen] = React.useState(false);
  const [paywallReason, setPaywallReason] = React.useState<'template' | 'generation_limit'>('generation_limit');

  React.useEffect(() => {
    const fetchPortfolioCount = async () => {
      if (!user) return;
      const { count, error } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!error && count !== null) {
        setPortfolioCount(count);
      }
    };

    const fetchDict = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.createPage);
    };

    fetchPortfolioCount();
    fetchDict();
  }, [user, language]);

  const handleManualFormSubmit = async (formData: any) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }

    // PRO CONSTRAINT REMOVED - No portfolio limit
    // if (portfolioCount >= 3 && !isPro) {
    //   setPaywallReason('generation_limit');
    //   setIsPaywallOpen(true);
    //   return;
    // }

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

      // Generate a unique slug from the user's full name
      const slug = await generateUniqueSlug(portfolioData.personalInfo.fullName);

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
          status: 'draft',
          slug: slug
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '✅ Portfolio Created!',
        description: 'Now choose a template for your portfolio.',
      });

      router.push(`/edit/${portfolio.id}?onboarding=true`);

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

    // PRO CONSTRAINT REMOVED - No portfolio limit
    // if (portfolioCount >= 3 && !isPro) {
    //   setPaywallReason('generation_limit');
    //   setIsPaywallOpen(true);
    //   return;
    // }

    // PRO CONSTRAINT REMOVED - CV upload available to all
    // if (!isPro) {
    //   setPaywallReason('template');
    //   setIsPaywallOpen(true);
    //   return;
    // }

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

        router.push(`/edit/${portfolioId}?onboarding=true`);
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

        router.push(`/edit/${portfolio.id}?onboarding=true`);
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
    return <ProcessingScreen />;
  }

  if (showManualForm) {
    const isFromCVExtraction = extractedData !== null;

    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow">
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
    <div className="flex flex-col min-h-screen bg-[#050510] font-sans selection:bg-primary/20">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 pt-32 md:pt-40 relative overflow-hidden">

        {/* Living Background */}
        <MeshGradientBackground />

        {/* Ambient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/15 blur-[150px] rounded-full" />
          <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute top-[30%] right-[15%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>

        <section className="w-full max-w-5xl mx-auto relative z-10">

          {/* Header */}
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                {dict.title}
              </span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">
              {dict.subtitle}
            </p>
          </motion.div>

          {/* Split Panel Container - Liquid Glass */}
          <motion.div
            className="relative liquid-glass-card rounded-[2rem] overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid lg:grid-cols-2">

              {/* LEFT: CV Upload Section (PRIMARY) */}
              <motion.div
                className="relative transition-all duration-300 border-b lg:border-b-0 lg:border-r border-white/10"
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
                  isPro={isPro}
                />
              </motion.div>

              {/* RIGHT: Manual Entry Section */}
              <motion.div
                className={cn(
                  "relative bg-white/[0.02] p-8 md:p-10 flex flex-col justify-between transition-all duration-300 group min-h-[400px]",
                  "cursor-pointer" // PRO CONSTRAINT REMOVED - Always clickable
                )}
                onClick={() => {
                  // PRO CONSTRAINT REMOVED - Always allow manual form
                  setShowManualForm(true);
                  // if (portfolioCount >= 3 && !isPro) {
                  //   setPaywallReason('generation_limit');
                  //   setIsPaywallOpen(true);
                  // } else {
                  //   setShowManualForm(true);
                  // }
                }}
                onMouseEnter={() => setHoveredSide('right')}
                onMouseLeave={() => setHoveredSide(null)}
                animate={{
                  opacity: hoveredSide === 'left' ? 0.6 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Limit Overlay for Manual Entry */}
                {/* PRO CONSTRAINT REMOVED - Limit overlay disabled */}
                {/* {portfolioCount >= 3 && !isPro && (
                  <div className="absolute inset-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]">
                      <Crown className="w-8 h-8 text-white/50" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Limit Reached</h3>
                    <p className="text-white/40 mb-8 max-w-[200px] mx-auto text-sm font-medium">
                      You've hit the 3-portfolio limit. Upgrade to unlock unlimited manual creation.
                    </p>
                    <Link href="/checkout" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        className="bg-white text-black font-black rounded-xl hover:bg-white/90 shadow-[0_10px_20px_-5px_rgba(255,255,255,0.3)] transition-all"
                      >
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </div>
                )} */}
                {/* Decorative Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
                  <motion.div
                    className="w-40 h-40 border-2 border-white rounded-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Pen className="w-6 h-6 text-white/70" />
                  </motion.div>

                  <motion.h2
                    className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                      {dict.manualCard.title}
                    </span>
                  </motion.h2>
                  <motion.p
                    className="text-base text-white/50 max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {dict.manualCard.description}
                  </motion.p>
                </div>

                {/* Ghost Button - Liquid Glass Style */}
                <motion.button
                  className="relative z-10 mt-8 w-full py-4 rounded-xl liquid-button-ghost text-white font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20"
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

      <ProPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        reason={paywallReason}
      />
    </div>
  );
}
