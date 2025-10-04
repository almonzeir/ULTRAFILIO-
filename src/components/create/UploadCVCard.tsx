'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function UploadCVCard() {
  const router = useRouter();

  const handleContinue = () => {
    // In a real app, you would parse the CV here.
    // For now, we'll just navigate to the next step.
    router.push('/choose-template');
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-semibold mb-4">Upload Your CV / Resume</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Upload your CV and we’ll automatically generate your portfolio.</p>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-16 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 cursor-pointer">
          <p className="text-gray-600 dark:text-gray-400">Click to upload or drag & drop</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">PDF, DOCX (max 5MB)</p>
        </div>
        <div className="mt-8">
          <label className="block text-gray-700 dark:text-gray-300 mb-3 font-medium">Profile Picture (Optional)</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800"></div>
            <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>
      </div>
      <button onClick={handleContinue} className="mt-10 w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300">
        Continue to Generate Portfolio
      </button>
    </div>
  );
}
