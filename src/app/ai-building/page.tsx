'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { PortfolioData } from '@/templates/types';
import {
  sleep,
  cvFileTypeToMime,
  parseCvWithGemini,
  normalizePortfolioData,
  mapToTemplate,
} from '@/lib/portfolio-builder';

// Define UploadMeta type based on the prompt
interface UploadMeta {
  cvFileUrl: string;
  cvFileType: 'pdf' | 'doc' | 'docx';
  profilePhotoURL?: string;
  fileSizeBytes: number;
}

type BuildState = 'idle' | 'uploaded' | 'template_selected' | 'parsing' | 'mapping' | 'building' | 'ready';

const messages = [
  'Reading your CV…',
  'Extracting your achievements…',
  'Detecting your top skills…',
  'Mapping experience to impact…',
  'Designing your value story…',
  'Placing your photo & branding…',
  'Final checks…',
];

export default function AIBuildingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [buildState, setBuildState] = useState<BuildState>('idle');
  const [extractedData, setExtractedData] = useState<PortfolioData | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Rotate messages every 2 seconds

    const startBuild = async () => {
      setBuildState('template_selected'); // Initial state before parsing

      const storedUploadMeta = localStorage.getItem('uploadMeta');
      const chosenTemplate = localStorage.getItem('chosenTemplate');
      const storedProfilePhotoURL = localStorage.getItem('profilePhotoURL');

      if (!storedUploadMeta || !chosenTemplate) {
        toast({
          variant: 'destructive',
          title: 'Missing Information',
          description: 'Could not find CV or template. Please start over.',
        });
        router.push('/upload-cv');
        return;
      }

      const uploadMeta: UploadMeta = JSON.parse(storedUploadMeta);
      const profilePhotoURL = storedProfilePhotoURL || undefined;

      let currentExtractedData: PortfolioData | null = null;

      // Check if extracted data already exists in localStorage (for persistence on refresh)
      const storedExtracted = localStorage.getItem('extracted');
      if (storedExtracted) {
        currentExtractedData = JSON.parse(storedExtracted);
        setExtractedData(currentExtractedData);
        setBuildState('mapping'); // Skip parsing if already extracted
      } else {
        // 1) PARSE
        setBuildState('parsing');
        try {
          const mimeType = cvFileTypeToMime(uploadMeta.cvFileType);
          currentExtractedData = await parseCvWithGemini(uploadMeta.cvFileUrl, mimeType);
          setExtractedData(currentExtractedData);
          localStorage.setItem('extracted', JSON.stringify(currentExtractedData)); // Persist extracted data
        } catch (e: any) {
          console.error('Gemini parsing failed:', e);
          toast({
            title: 'Parsing Failed',
            description: e.message || 'We encountered an issue reading your CV. Please try again or upload a DOCX version.',
            variant: 'destructive',
          });
          // Fallback: if PDF failed because non-extractable, prompt to upload DOCX
          if (uploadMeta.cvFileType === 'pdf') {
            toast({
              title: 'PDF Issue',
              description: 'We couldn’t read this PDF. Please upload a DOCX version for best results.',
              variant: 'destructive',
            });
          }
          router.push('/upload-cv');
          return;
        }
      }

      if (!currentExtractedData) {
        toast({
          variant: 'destructive',
          title: 'Extraction Error',
          description: 'Could not extract data from your CV.',
        });
        router.push('/upload-cv');
        return;
      }

      // 2) NORMALIZE + MAP
      setBuildState('mapping');
      const normalized = normalizePortfolioData(currentExtractedData, profilePhotoURL);
      const mapped = mapToTemplate(normalized, chosenTemplate as 'basic' | 'minimalist' | 'modern');
      setPortfolioData(mapped);
      localStorage.setItem('portfolioData', JSON.stringify(mapped)); // Persist final portfolio data

      // 3) BUILD
      setBuildState('building');
      await sleep(300); // tiny cushion to complete UI composition

      // 4) READY
      setBuildState('ready');
      router.push('/portfolio'); // Navigate to final portfolio page
    };

    startBuild();

    return () => {
      clearInterval(messageInterval);
    };
  }, [router, toast]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-inter">
      <div className="animate-spin mb-8 border-4 border-t-transparent border-white rounded-full w-16 h-16"></div>
      <h1 className="text-3xl font-bold mb-6">Preparing your portfolio...</h1>
      <div className="text-center space-y-2 opacity-80" style={{ height: '50px' }}>
        <p className="text-sm transition-opacity duration-500 opacity-100">
          {messages[currentMessageIndex]}
        </p>
      </div>
      <p className="mt-8 text-xs text-gray-400">This usually takes 10–30 seconds depending on document size.</p>
    </main>
  );
}