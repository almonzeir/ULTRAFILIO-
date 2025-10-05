'use client';

import * as React from 'react';
import GeneratedModernTemplate from '@/templates/GeneratedModernTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = React.useState<PortfolioData | null>(null);
  const [template, setTemplate] = React.useState<string>('modern');
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const router = useRouter();


  React.useEffect(() => {
    try {
      const storedData = localStorage.getItem('portfolioData');
      const storedTemplate = localStorage.getItem('selectedTemplate');

      if (storedData) {
        setPortfolioData(JSON.parse(storedData));
      } else {
         toast({
            variant: 'destructive',
            title: 'Portfolio Data Not Found',
            description: 'Please create your portfolio first.',
         });
         router.push('/create');
      }

      if (storedTemplate) {
        setTemplate(storedTemplate);
      }
      
    } catch (error) {
      console.error('Failed to parse data from localStorage', error);
       toast({
          variant: 'destructive',
          title: 'Error Loading Data',
          description: 'There was a problem loading your portfolio. Please try creating it again.',
       });
       router.push('/create');
    }
    setLoading(false);
  }, [router, toast]);


  const TemplateComponent = {
    modern: GeneratedModernTemplate,
    minimalist: MinimalistTemplate,
    basic: BasicTemplate,
  }[template];


  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <div className="animate-spin mr-4 border-4 border-t-transparent border-primary rounded-full w-12 h-12"></div>
            <p>Loading Your Portfolio...</p>
        </div>
    );
  }

  if (!portfolioData) {
    // This case should be handled by the redirect in useEffect, but it's a good fallback.
    return <div>Portfolio data not found. Please create your portfolio first.</div>;
  }
  
  if (!TemplateComponent) {
      return <div>Invalid template selected. Please go back and choose a template.</div>;
  }

  return <TemplateComponent data={portfolioData} />;
}
