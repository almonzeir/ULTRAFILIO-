'use client';

import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import GeneratedModernTemplate from '@/templates/GeneratedModernTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import Cyber3DTemplate from '@/templates/Cyber3DTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

const templateMap: { [key: string]: React.ComponentType<{ data: PortfolioData }> } = {
  modern: ModernTemplate,
  generated: GeneratedModernTemplate,
  cyber: Cyber3DTemplate,
  minimalist: MinimalistTemplate,
  basic: BasicTemplate,
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
          .select('*')
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

  }, [portfolioId, toast]);

  React.useEffect(() => {
    if (templateFromUrl) {
      if (templateFromUrl.startsWith('AIGenerated_')) {
        // FIXME: Re-enable this when we have actual generated templates and the directory is not empty
        // const Component = dynamic(() => import(`@/templates/generated/${templateFromUrl.replace('.tsx', '')}`), { ssr: false }) as React.ComponentType<{ data: PortfolioData }>;
        // setTemplateComponent(() => Component);
        console.warn('AI Generated templates are currently disabled in build.');
        setTemplateComponent(null);
      } else {
        setTemplateComponent(() => templateMap[templateFromUrl]);
      }
    }
  }, [templateFromUrl]);

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
