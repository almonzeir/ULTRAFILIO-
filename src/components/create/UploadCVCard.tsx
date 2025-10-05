'use client';

import * as React from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadCVCardProps {
    onContinue: (cvFile: File, photoFile: File | null) => Promise<void>;
    isParsing: boolean;
}

export default function UploadCVCard({ onContinue, isParsing }: UploadCVCardProps) {
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  const cvFileInputRef = React.useRef<HTMLInputElement>(null);
  const photoFileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'cv' | 'photo') => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const maxSize = fileType === 'cv' ? 15 * 1024 * 1024 : 10 * 1024 * 1024;
      const acceptedTypes = fileType === 'cv' 
        ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        : ['image/jpeg', 'image/png', 'image/webp'];

      if (file.size > maxSize) {
        toast({ variant: 'destructive', title: 'File too large', description: `Please select a file smaller than ${maxSize / 1024 / 1024}MB.` });
        return;
      }

      if (!acceptedTypes.includes(file.type)) {
         toast({ variant: 'destructive', title: 'Invalid file type', description: fileType === 'cv' ? 'Please upload a PDF or DOCX file.' : 'Please upload a JPG, PNG, or WebP file.' });
        return;
      }

      if (fileType === 'cv') {
        setCvFile(file);
      } else {
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleDropAreaClick = () => {
    cvFileInputRef.current?.click();
  };

  const handleContinueClick = () => {
    if (cvFile) {
      onContinue(cvFile, photoFile);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-semibold mb-4">Upload Your CV / Resume</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Upload your CV and we’ll automatically generate your portfolio.</p>
        <input
          type="file"
          ref={cvFileInputRef}
          onChange={(e) => handleFileChange(e, 'cv')}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <div 
          onClick={handleDropAreaClick}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-16 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 cursor-pointer flex flex-col items-center justify-center"
        >
          <UploadCloud className="w-10 h-10 text-gray-400 mb-4" />
          {cvFile ? (
            <p className="text-gray-700 dark:text-gray-300 font-medium">{cvFile.name}</p>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400">Click to upload or drag & drop</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">PDF, DOCX (max 15MB)</p>
            </>
          )}
        </div>
        <div className="mt-8">
          <label className="block text-gray-700 dark:text-gray-300 mb-3 font-medium">Profile Picture (Recommended)</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {photoPreview ? (
                    <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                ): <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800"></div>}
            </div>
            <input type="file" ref={photoFileInputRef} onChange={(e) => handleFileChange(e, 'photo')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept="image/png, image/jpeg, image/webp" />
          </div>
        </div>
      </div>
      <button 
        onClick={handleContinueClick} 
        disabled={!cvFile || isParsing}
        className="mt-10 w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isParsing ? (
            <>
                <Loader2 className="animate-spin" />
                Parsing CV...
            </>
        ) : "Continue to Generate Portfolio"}
      </button>
    </div>
  );
}
