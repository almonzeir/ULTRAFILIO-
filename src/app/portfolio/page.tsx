'use client';

import * as React from 'react';
import GeneratedModernTemplate from '@/templates/GeneratedModernTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import type { PortfolioData } from '@/templates/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = React.useState<PortfolioData | null>(null);
  const [chosenTemplate, setChosenTemplate] = React.useState<string>('modern');
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false); // New state for inline editing
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    try {
      const storedPortfolioData = localStorage.getItem('portfolioData');
      const storedChosenTemplate = localStorage.getItem('chosenTemplate');

      if (storedPortfolioData) {
        setPortfolioData(JSON.parse(storedPortfolioData));
      } else {
        toast({
          variant: 'destructive',
          title: 'Portfolio Data Not Found',
          description: 'Please create your portfolio first.',
        });
        router.push('/upload-cv'); // Redirect to upload-cv
        return;
      }

      if (storedChosenTemplate) {
        setChosenTemplate(storedChosenTemplate);
      } else {
        // Default to modern if no template was chosen (shouldn't happen with proper flow)
        setChosenTemplate('modern');
      }
    } catch (error) {
      console.error('Failed to parse data from localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error Loading Data',
        description: 'There was a problem loading your portfolio. Please try creating it again.',
      });
      router.push('/upload-cv'); // Redirect to upload-cv
      return;
    }
    setLoading(false);
  }, [router, toast]);

  const TemplateComponent = {
    modern: GeneratedModernTemplate,
    minimalist: MinimalistTemplate,
    basic: BasicTemplate,
  }[chosenTemplate]; // Use chosenTemplate

  const handleTemplateChange = (value: string) => {
    setChosenTemplate(value);
    localStorage.setItem('chosenTemplate', value); // Persist template change
  };

  const handleExport = () => {
    toast({
      title: 'Export Feature',
      description: 'Export to HTML/PDF is not yet implemented.',
    });
    // Implement export logic here
  };

  // Placeholder for inline editing
  const handleInlineEdit = (field: string, value: string) => {
    toast({
      title: 'Inline Edit',
      description: `Editing field: ${field} with value: ${value} (Not fully implemented)`,
    });
    // This would involve updating the portfolioData state and potentially localStorage
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="animate-spin mr-4 border-4 border-t-transparent border-primary rounded-full w-12 h-12"></div>
        <p>Loading Your Portfolio...</p>
      </div>
    );
  }

  if (!portfolioData) {
    return <div>Portfolio data not found. Please create your portfolio first.</div>;
  }

  if (!TemplateComponent) {
    return <div>Invalid template selected. Please go back and choose a template.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex justify-end gap-4 mb-4">
        <Select onValueChange={handleTemplateChange} value={chosenTemplate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Switch Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="minimalist">Minimalist</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleExport}>Export (HTML/PDF)</Button>
      </div>
      <TemplateComponent data={portfolioData} />
    </div>
  );
}
