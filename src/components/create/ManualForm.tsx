
'use client';

import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import type { Dictionary } from '@/lib/dictionaries';

// Zod Schema for validation
const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  technologies: z.string().optional(),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  professionalTitle: z.string().min(2, 'Title is required'),
  summary: z.string().max(250, 'Summary must be 250 characters or less').optional(),
  location: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  skills: z.string().optional(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
});

type FormData = z.infer<typeof formSchema>;

const ProgressBar = ({ step }: { step: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 mb-12">
    <div
      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${(step / 3) * 100}%` }}
    />
  </div>
);

export default function ManualForm({
  onSubmit: handleFormSubmit,
  onBack,
  dict,
}: {
  onSubmit: (data: any) => void;
  onBack: () => void;
  dict: Dictionary['createPage']['manualForm'];
}) {
  const [step, setStep] = React.useState(1);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience: [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
      education: [{ degree: '', institution: '', startYear: '', endYear: '' }],
      projects: [{ title: '', description: '', technologies: '', link: '' }],
    },
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: 'experience' });
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: 'education' });
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({ control, name: 'projects' });

  const nextStep = async () => {
    const fieldsToValidate: (keyof FormData)[] =
      step === 1
        ? ['fullName', 'professionalTitle', 'email', 'website', 'linkedin', 'github']
        : step === 2
        ? ['experience', 'education', 'skills']
        : [];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => setStep((s) => s - 1);
  
  const onSubmit = (data: FormData) => {
    handleFormSubmit(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white px-6 py-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-5xl mx-auto p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center mb-4">
             {step === 1 && (
                <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              )}
            <ProgressBar step={step} />
          </div>

          {step === 1 && (
            <div>
              <h3 className="text-2xl font-semibold mb-8">{dict.step1.title}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Input {...register('fullName')} placeholder={`${dict.step1.fullName} *`} />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Input {...register('professionalTitle')} placeholder={`${dict.step1.professionalTitle} *`} />
                  {errors.professionalTitle && <p className="text-red-500 text-sm mt-1">{errors.professionalTitle.message}</p>}
                </div>
                <div className="md:col-span-2">
                    <Textarea {...register('summary')} placeholder={dict.step1.summary} maxLength={250} rows={4} />
                    {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary.message}</p>}
                </div>
                <Input {...register('location')} placeholder={dict.step1.location} />
                <div>
                  <Input {...register('email')} type="email" placeholder={`${dict.step1.email} *`} />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <Input {...register('phone')} type="tel" placeholder={dict.step1.phone} />
                <div>
                    <Input {...register('website')} type="url" placeholder={dict.step1.website} />
                    {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
                </div>
                <div>
                    <Input {...register('linkedin')} type="url" placeholder="LinkedIn" />
                    {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>}
                </div>
                <div>
                    <Input {...register('github')} type="url" placeholder="GitHub" />
                    {errors.github && <p className="text-red-500 text-sm mt-1">{errors.github.message}</p>}
                </div>
              </div>
              <div className="mt-10 flex justify-end">
                <Button onClick={nextStep} type="button">
                  {dict.step1.nextButton}
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
             <div>
                <h3 className="text-2xl font-semibold mb-8">{dict.step2.title}</h3>
                
                {/* Experience */}
                <div className="mb-8">
                    <h4 className="text-xl font-semibold mb-4">{dict.step2.experience.title}</h4>
                    {experienceFields.map((field, index) => (
                        <div key={field.id} className="grid md:grid-cols-2 gap-4 border p-4 rounded-lg mb-4 relative">
                            <Input {...register(`experience.${index}.jobTitle`)} placeholder={`${dict.step2.experience.jobTitle} *`} />
                            <Input {...register(`experience.${index}.company`)} placeholder={`${dict.step2.experience.companyName} *`} />
                            <Input {...register(`experience.${index}.startDate`)} placeholder={dict.step2.experience.startDate} />
                            <Input {...register(`experience.${index}.endDate`)} placeholder={dict.step2.experience.endDate} />
                            <Textarea {...register(`experience.${index}.description`)} placeholder={dict.step2.experience.description} className="md:col-span-2" rows={3}/>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeExperience(index)} className="absolute -top-3 -right-3 h-7 w-7">
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendExperience({ jobTitle: '', company: '', startDate: '', endDate: '', description: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Experience
                    </Button>
                </div>

                {/* Education */}
                <div className="mb-8">
                    <h4 className="text-xl font-semibold mb-4">{dict.step2.education.title}</h4>
                    {educationFields.map((field, index) => (
                        <div key={field.id} className="grid md:grid-cols-2 gap-4 border p-4 rounded-lg mb-4 relative">
                             <Input {...register(`education.${index}.degree`)} placeholder={`${dict.step2.education.degree} *`} />
                             <Input {...register(`education.${index}.institution`)} placeholder={`${dict.step2.education.institution} *`} />
                             <Input {...register(`education.${index}.startYear`)} placeholder={dict.step2.education.startYear} />
                             <Input {...register(`education.${index}.endYear`)} placeholder={dict.step2.education.endYear} />
                             <Button type="button" variant="destructive" size="icon" onClick={() => removeEducation(index)} className="absolute -top-3 -right-3 h-7 w-7">
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendEducation({ degree: '', institution: '', startYear: '', endYear: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Education
                    </Button>
                </div>

                {/* Skills */}
                <div>
                    <h4 className="text-xl font-semibold mb-4">{dict.step2.skills.title}</h4>
                    <Input {...register('skills')} placeholder={dict.step2.skills.placeholder} />
                </div>

                <div className="mt-10 flex justify-between">
                    <Button onClick={prevStep} type="button" variant="outline">{dict.step2.backButton}</Button>
                    <Button onClick={nextStep} type="button">{dict.step2.nextButton}</Button>
                </div>
            </div>
          )}

          {step === 3 && (
            <div>
                 <h3 className="text-2xl font-semibold mb-8">{dict.step3.title}</h3>

                {/* Projects */}
                <div className="mb-8">
                    <h4 className="text-xl font-semibold mb-4">{dict.step3.projects.title}</h4>
                    {projectFields.map((field, index) => (
                        <div key={field.id} className="grid md:grid-cols-2 gap-4 border p-4 rounded-lg mb-4 relative">
                            <Input {...register(`projects.${index}.title`)} placeholder={`${dict.step3.projects.projectTitle} *`} />
                             <div>
                                <Input {...register(`projects.${index}.link`)} type="url" placeholder={dict.step3.projects.link} />
                                {errors.projects?.[index]?.link && <p className="text-red-500 text-sm mt-1">{errors.projects?.[index]?.link?.message}</p>}
                            </div>
                            <Textarea {...register(`projects.${index}.description`)} placeholder={dict.step3.projects.description} className="md:col-span-2" rows={2}/>
                            <Input {...register(`projects.${index}.technologies`)} placeholder={dict.step3.projects.technologies} className="md:col-span-2"/>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeProject(index)} className="absolute -top-3 -right-3 h-7 w-7">
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendProject({ title: '', description: '', technologies: '', link: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Project
                    </Button>
                </div>

                <div className="mt-10 flex justify-between">
                    <Button onClick={prevStep} type="button" variant="outline">{dict.step3.backButton}</Button>
                    <Button type="submit">{dict.step3.submitButton}</Button>
                </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
