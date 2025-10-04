'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

const ProgressBar = ({ step }: { step: number }) => {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 mb-12">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${(step / 3) * 100}%` }}
      ></div>
    </div>
  );
};

const Step1 = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-8">Step 1: Personal Information</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <input type="text" placeholder="Full Name *" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input type="text" placeholder="Professional Title *" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <textarea placeholder="Short Bio / Summary (max 250 chars)" maxLength={250} className="md:col-span-2 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={4}></textarea>
        <input type="text" placeholder="Location (City, Country)" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input type="email" placeholder="Email *" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input type="tel" placeholder="Phone" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input type="url" placeholder="Website / Portfolio" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input type="url" placeholder="LinkedIn" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input type="url" placeholder="GitHub" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Profile Picture (Optional)</label>
          <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
      </div>
      <div className="mt-10 flex justify-end">
        <button onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition">
          Next Step → Experience
        </button>
      </div>
    </div>
  );
};

const Step2 = ({ nextStep, prevStep }: { nextStep: () => void, prevStep: () => void }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-8">Step 2: Experience, Education, Skills</h3>
      {/* Experience Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4">Experience</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <input type="text" placeholder="Job Title *" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input type="text" placeholder="Company Name *" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input type="text" placeholder="Start Date" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input type="text" placeholder="End Date (or Present)" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <textarea placeholder="Description" className="md:col-span-2 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={3}></textarea>
        </div>
        <button className="mt-4 text-sm font-semibold text-blue-500">+ Add More Experience</button>
      </div>

      {/* Education Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4">Education</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <input type="text" placeholder="Degree" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input type="text" placeholder="Institution" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input type="text" placeholder="Start Year" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input type="text" placeholder="End Year" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <textarea placeholder="Additional Info" className="md:col-span-2 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={2}></textarea>
        </div>
        <button className="mt-4 text-sm font-semibold text-blue-500">+ Add More Education</button>
      </div>

      {/* Skills Section */}
      <div>
        <h4 className="text-xl font-semibold mb-4">Skills</h4>
        <input type="text" placeholder="Comma-separated skills (e.g., React, Node.js, Python)" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
      </div>

      <div className="mt-10 flex justify-between">
        <button onClick={prevStep} className="px-8 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition">
          ← Back
        </button>
        <button onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition">
          Next Step → Projects
        </button>
      </div>
    </div>
  );
};

const Step3 = ({ prevStep, onSubmit }: { prevStep: () => void; onSubmit: () => void; }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-8">Step 3: Projects, Certificates, Languages</h3>
      {/* Projects Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4">Projects</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <input type="text" placeholder="Project Title *" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <textarea placeholder="Description" className="md:col-span-2 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={2}></textarea>
          <input type="text" placeholder="Technologies Used (comma-separated)" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input type="url" placeholder="Link" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        </div>
        <button className="mt-4 text-sm font-semibold text-blue-500">+ Add More Projects</button>
      </div>

      {/* Certifications Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4">Certifications (Optional)</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <input type="text" placeholder="Certificate Name" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input type="text" placeholder="Organization" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input type="text" placeholder="Year" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        </div>
        <button className="mt-4 text-sm font-semibold text-blue-500">+ Add More Certifications</button>
      </div>

      {/* Languages Section */}
      <div>
        <h4 className="text-xl font-semibold mb-4">Languages (Optional)</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <input type="text" placeholder="Language" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <select className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Native</option>
          </select>
        </div>
        <button className="mt-4 text-sm font-semibold text-blue-500">+ Add More Languages</button>
      </div>

      <div className="mt-10 flex justify-between">
        <button onClick={prevStep} className="px-8 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition">
          ← Back
        </button>
        <button onClick={onSubmit} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition">
          Generate My Portfolio
        </button>
      </div>
    </div>
  );
};

export default function ManualForm({ onSubmit }: { onSubmit: () => void }) {
  const [step, setStep] = React.useState(1);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white px-6 py-20">
        <div className="max-w-5xl mx-auto p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
            <ProgressBar step={step} />
            {step === 1 && <Step1 nextStep={nextStep} />}
            {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} />}
            {step === 3 && <Step3 prevStep={prevStep} onSubmit={onSubmit} />}
        </div>
    </div>
  );
}
