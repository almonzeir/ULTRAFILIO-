'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModernTemplate from '@/templates/ModernTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import BasicTemplate from '@/templates/BasicTemplate';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import type { PortfolioData } from '@/templates/types';

export default function TemplatePreviewPage() {
  const router = useRouter();
  const [template, setTemplate] = useState<string | null>(null);
  const [userData, setUserData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('selectedTemplate');
    const d = localStorage.getItem('userData');
    if (!t) {
        // If no template is selected, we can't show a preview. Redirect back.
        router.push('/choose-template');
        return;
    }
    setTemplate(t);

    if (d) {
        try {
            setUserData(JSON.parse(d));
        } catch(e) {
            console.error("Failed to parse user data from localStorage", e);
            // Handle corrupted data, maybe redirect or show an error
            router.push('/upload-cv');
        }
    } else {
        // If there's no user data, we can't show a meaningful preview.
        router.push('/upload-cv');
    }
  }, [router]);

  const handleContinue = () => {
    router.push('/choose-profile-type');
  };

  const TemplateComponent = {
    modern: ModernTemplate,
    minimalist: MinimalistTemplate,
    basic: BasicTemplate,
  }[template || 'modern'];

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
        <div className="text-center pt-10">
          <h1 className="text-3xl font-bold mb-3">Preview Your Portfolio</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            You can explore your chosen design before continuing.
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-4 pt-8">
          {userData && TemplateComponent && <TemplateComponent data={userData} />}
        </div>

        <div className="text-center my-16">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 mr-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
          >
            Continue →
          </button>
        </div>
        <ThemeSwitcher />
      </main>
    </ThemeProvider>
  );
}
