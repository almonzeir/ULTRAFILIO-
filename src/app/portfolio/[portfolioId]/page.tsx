'use client';

import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

// Import all templates
import GeneratedModernTemplate from '@/templates/GeneratedModernTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import Cyber3DTemplate from '@/templates/Cyber3DTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import ExecutiveTemplate from '@/templates/ExecutiveTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import MinimalPlusTemplate from '@/templates/MinimalPlusTemplate';
import AuroraTemplate from '@/templates/AuroraTemplate';

// Map all template IDs to their components
const templateMap: { [key: string]: React.ComponentType<{ data: PortfolioData }> } = {
  modern: ModernTemplate,
  generated: GeneratedModernTemplate,
  cyber: Cyber3DTemplate,
  minimalist: MinimalistTemplate,
  basic: BasicTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  'minimal-plus': MinimalPlusTemplate,
  aurora: AuroraTemplate,
};

export default function PortfolioPage() {
  const { portfolioId } = useParams();
  const searchParams = useSearchParams();
  const templateFromUrl = searchParams.get('template');
  const [portfolioData, setPortfolioData] = React.useState<PortfolioData | null>(null);
  const [TemplateComponent, setTemplateComponent] = React.useState<React.ComponentType<{ data: PortfolioData }> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!portfolioId) {
        setLoading(false);
        return;
      };

      try {
        const { data, error: dbError } = await supabase
          .from('portfolios')
          .select('*, users!inner(is_pro)') // Join with users to check Pro status
          .eq('id', portfolioId as string)
          .single();

        if (dbError) throw dbError;

        if (data) {
          // Map database columns to PortfolioData structure
          const mappedData: PortfolioData = {
            personalInfo: {
              fullName: data.title?.replace("'s Portfolio", "") || '',
              title: data.subtitle || '',
              tagline: data.description || '',
              email: data.email || '',
              phone: data.phone || '',
              location: data.location || '',
              website: data.website || '',
              linkedInURL: data.linkedin || '',
              githubURL: data.github || '',
              profilePhotoURL: data.profile_photo_url || '',
            },
            about: {
              extendedBio: data.description || '',
              skills: data.skills || [],
            },
            experience: data.experience || [],
            education: data.education || [],
            projects: data.projects || [],
            certifications: data.certifications || [],
            languages: data.languages || [],
          };
          setPortfolioData(mappedData);

          const ownerIsPro = data.users?.is_pro || false;

          // Handle Template Override Security
          let finalTemplate = data.template_id || 'modern';
          const PRO_TEMPLATES = ['cyber', 'aurora', 'minimal-plus', 'creative', 'modern'];

          if (templateFromUrl && templateMap[templateFromUrl]) {
            const isRequestedTemplatePro = PRO_TEMPLATES.includes(templateFromUrl);

            // Only allow override if the template is not Pro, or if the owner IS a Pro member
            if (!isRequestedTemplatePro || ownerIsPro) {
              finalTemplate = templateFromUrl;
              console.log(`Using overridden template: ${finalTemplate}`);
            } else {
              console.warn(`Unauthorized Pro template requested: ${templateFromUrl}. Reverting to base.`);
            }
          }

          setTemplateComponent(() => templateMap[finalTemplate] || ModernTemplate);

        } else {
          setError('No such portfolio found!');
        }
      } catch (e) {
        console.error('Error fetching portfolio data:', e);
        setError('Failed to load portfolio data.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load portfolio data from the database.'
        });
      }
      setLoading(false);
    };

    fetchPortfolioData();

  }, [portfolioId, toast, templateFromUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="animate-spin mr-4 border-4 border-t-transparent border-primary rounded-full w-12 h-12"></div>
        <p>Loading Portfolio...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-destructive">{error}</div>;
  }

  if (!portfolioData) {
    return <div className="text-center py-20">Portfolio data could not be loaded.</div>;
  }

  return TemplateComponent ? <TemplateComponent data={portfolioData} /> : <div>Invalid template selected.</div>;
}
