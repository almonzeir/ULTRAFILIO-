
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import GeneratedModernTemplate from '@/templates/GeneratedModernTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function PortfolioPage() {
    const { portfolioId } = useParams();
    const [portfolioData, setPortfolioData] = React.useState<PortfolioData | null>(null);
    const [template, setTemplate] = React.useState<string>('modern');
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
            const docRef = doc(db, 'portfolios', portfolioId as string);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              setPortfolioData(docSnap.data() as PortfolioData);
              // You might want to store the template choice in the document as well
              // For now, we'll just use the default 'modern'
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

    const TemplateComponent = {
        modern: GeneratedModernTemplate,
        minimalist: MinimalistTemplate,
        basic: BasicTemplate,
    }[template];

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
