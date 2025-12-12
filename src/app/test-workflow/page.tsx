'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadCVCard from '@/components/create/UploadCVCard';
import { useUser } from '@/hooks/useUser';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { supabase } from '@/lib/supabase/client';

export default function TestWorkflowPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['createPage'] | null>(null);

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.createPage);
    };
    fetchDictionary();
  }, [language]);

  const handleGeneratePortfolio = async (cvFile: File, photoFile: File | null) => {
    if (!user) {
      alert('You must be logged in to create a portfolio.');
      return;
    }

    setIsProcessing(true);

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error('No auth token found');

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
        throw new Error(errorData.error || 'Failed to generate portfolio.');
      }

      const { portfolioId } = await response.json();
      alert('Success! Portfolio generated with ID: ' + portfolioId);

      // Redirect to template selection
      router.push(`/choose-template?portfolioId=${portfolioId}`);

    } catch (error: any) {
      console.error('Portfolio generation failed:', error);
      alert('Error: ' + (error.message || 'Failed to generate portfolio.'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!dict) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Test Workflow</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UploadCVCard
            onContinue={handleGeneratePortfolio}
            isProcessing={isProcessing}
            dict={dict.uploadCard}
          />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">How to Test</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Upload a CV file (PDF, DOC, or DOCX)</li>
              <li>Optionally upload a profile photo</li>
              <li>Click "Continue" to process</li>
              <li>Check the console for results</li>
            </ol>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
              <h3 className="font-medium text-blue-800 dark:text-blue-200">Note</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Make sure you have set up your environment variables (.env.local) with the required API keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}