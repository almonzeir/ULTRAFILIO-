'use client';

import * as React from 'react';
import UploadCVCard from '@/components/create/UploadCVCard';
import ManualForm from '@/components/create/ManualForm';

export default function CreatePortfolioPage() {
  const [showManualForm, setShowManualForm] = React.useState(false);

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold font-display tracking-tight">Create Your Portfolio</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Choose how you’d like to start building your portfolio.</p>
      </div>

      {!showManualForm ? (
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <UploadCVCard />
          <div 
            className="p-8 bg-gradient-to-b from-black to-gray-900 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border border-gray-800 cursor-pointer"
            onClick={() => setShowManualForm(true)}
          >
            <h2 className="text-3xl font-semibold mb-4">Fill Your Details Manually</h2>
            <p className="text-gray-400 mb-8">Don’t have a CV? Fill in your information to build your portfolio.</p>
            <button className="w-full py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-200 transition-colors duration-300">
              Start Manual Form
            </button>
          </div>
        </div>
      ) : (
        <ManualForm />
      )}
    </section>
  );
}
