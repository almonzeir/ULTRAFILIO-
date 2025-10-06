
'use client';

import * as React from 'react';
import type { PortfolioData } from '@/templates/types';
import type { Dictionary } from '@/lib/dictionaries';

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

const Step1 = ({ nextStep, handleChange, values, dict }: { nextStep: () => void; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; values: any; dict: Dictionary['createPage']['manualForm']['step1'] }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-8">{dict.title}</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <input name="name" value={values.name || ''} onChange={handleChange} type="text" placeholder={`${dict.fullName} *`} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input name="title" value={values.title || ''} onChange={handleChange} type="text" placeholder={`${dict.professionalTitle} *`} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <textarea name="summary" value={values.summary || ''} onChange={handleChange} placeholder={dict.summary} maxLength={250} className="md:col-span-2 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={4}></textarea>
        <input name="location" value={values.location || ''} onChange={handleChange} type="text" placeholder={dict.location} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input name="email" value={values.email || ''} onChange={handleChange} type="email" placeholder={`${dict.email} *`} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input name="phone" value={values.phone || ''} onChange={handleChange} type="tel" placeholder={dict.phone} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input name="website" value={values.website || ''} onChange={handleChange} type="url" placeholder={dict.website} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input name="linkedin" value={values.linkedin || ''} onChange={handleChange} type="url" placeholder="LinkedIn" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <input name="github" value={values.github || ''} onChange={handleChange} type="url" placeholder="GitHub" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">{dict.profilePicture}</label>
          <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
      </div>
      <div className="mt-10 flex justify-end">
        <button onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition">
          {dict.nextButton}
        </button>
      </div>
    </div>
  );
};

const Step2 = ({ nextStep, prevStep, handleChange, values, dict }: { nextStep: () => void, prevStep: () => void, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; values: any; dict: Dictionary['createPage']['manualForm']['step2'] }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-8">{dict.title}</h3>
      {/* Experience Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4">{dict.experience.title}</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <input name="exp_role" value={values.exp_role || ''} onChange={handleChange} type="text" placeholder={`${dict.experience.jobTitle} *`} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input name="exp_company" value={values.exp_company || ''} onChange={handleChange} type="text" placeholder={`${dict.experience.companyName} *`} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input name="exp_start" value={values.exp_start || ''} onChange={handleChange} type="text" placeholder={dict.experience.startDate} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input name="exp_end" value={values.exp_end || ''} onChange={handleChange} type="text" placeholder={dict.experience.endDate} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <textarea name="exp_description" value={values.exp_description || ''} onChange={handleChange} placeholder={dict.experience.description} className="md:col-span-2 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={3}></textarea>
        </div>
      </div>

      {/* Education Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4">{dict.education.title}</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <input name="edu_degree" value={values.edu_degree || ''} onChange={handleChange} type="text" placeholder={dict.education.degree} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input name="edu_institution" value={values.edu_institution || ''} onChange={handleChange} type="text" placeholder={dict.education.institution} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input name="edu_start_year" value={values.edu_start_year || ''} onChange={handleChange} type="text" placeholder={dict.education.startYear} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input name="edu_end_year" value={values.edu_end_year || ''} onChange={handleChange} type="text" placeholder={dict.education.endYear} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <textarea name="edu_details" value={values.edu_details || ''} onChange={handleChange} placeholder={dict.education.additionalInfo} className="md:col-span-2 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={2}></textarea>
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h4 className="text-xl font-semibold mb-4">{dict.skills.title}</h4>
        <input name="skills" value={values.skills || ''} onChange={handleChange} type="text" placeholder={dict.skills.placeholder} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
      </div>

      <div className="mt-10 flex justify-between">
        <button onClick={prevStep} className="px-8 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition">
          {dict.backButton}
        </button>
        <button onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition">
          {dict.nextButton}
        </button>
      </div>
    </div>
  );
};

const Step3 = ({ prevStep, handleSubmit, handleChange, values, dict }: { prevStep: () => void; handleSubmit: () => void; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; values: any; dict: Dictionary['createPage']['manualForm']['step3'] }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-8">{dict.title}</h3>
      {/* Projects Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4">{dict.projects.title}</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <input name="proj_title" value={values.proj_title || ''} onChange={handleChange} type="text" placeholder={`${dict.projects.projectTitle} *`} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <textarea name="proj_description" value={values.proj_description || ''} onChange={handleChange} placeholder={dict.projects.description} className="md:col-span-2 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={2}></textarea>
          <input name="proj_tech" value={values.proj_tech || ''} onChange={handleChange} type="text" placeholder={dict.projects.technologies} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input name="proj_link" value={values.proj_link || ''} onChange={handleChange} type="url" placeholder={dict.projects.link} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        </div>
      </div>

      {/* Certifications Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4">{dict.certifications.title}</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <input name="cert_name" value={values.cert_name || ''} onChange={handleChange} type="text" placeholder={dict.certifications.certificateName} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input name="cert_org" value={values.cert_org || ''} onChange={handleChange} type="text" placeholder={dict.certifications.organization} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <input name="cert_year" value={values.cert_year || ''} onChange={handleChange} type="text" placeholder={dict.certifications.year} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
        </div>
      </div>

      {/* Languages Section */}
      <div>
        <h4 className="text-xl font-semibold mb-4">{dict.languages.title}</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <input name="lang_name" value={values.lang_name || ''} onChange={handleChange} type="text" placeholder={dict.languages.language} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" />
          <select name="lang_proficiency" value={values.lang_proficiency || 'Beginner'} onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <option>{dict.languages.proficiency.beginner}</option>
            <option>{dict.languages.proficiency.intermediate}</option>
            <option>{dict.languages.proficiency.advanced}</option>
            <option>{dict.languages.proficiency.native}</option>
          </select>
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <button onClick={prevStep} className="px-8 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition">
          {dict.backButton}
        </button>
        <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition">
          {dict.submitButton}
        </button>
      </div>
    </div>
  );
};

type OnSubmitCallback = (formData: Omit<PortfolioData, 'skills' | 'projects' | 'education' | 'experience' > & { skills: string;[key: string]: any }) => void;


export default function ManualForm({ onSubmit, dict }: { onSubmit: OnSubmitCallback, dict: Dictionary['createPage']['manualForm'] }) {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<any>({});

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white px-6 py-20">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="max-w-5xl mx-auto p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
              <ProgressBar step={step} />
              {step === 1 && <Step1 nextStep={nextStep} handleChange={handleChange} values={formData} dict={dict.step1} />}
              {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} dict={dict.step2} />}
              {step === 3 && <Step3 prevStep={prevStep} handleSubmit={handleSubmit} handleChange={handleChange} values={formData} dict={dict.step3} />}
          </div>
        </form>
    </div>
  );
}
