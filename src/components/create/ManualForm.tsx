
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { sanitizeInput, containsDangerousPattern } from '@/lib/validation';

// Security: Custom refinement to check for dangerous patterns
const safeString = (maxLength: number = 500) => z.string().max(maxLength).refine(
  (val) => !val || !containsDangerousPattern(val),
  { message: 'Invalid characters detected' }
);

// Zod Schema for validation with security checks
// Experience: Job Title and Company Name are required
const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required').max(100).refine(
    (val) => !containsDangerousPattern(val),
    { message: 'Invalid characters' }
  ),
  company: z.string().min(1, 'Company name is required').max(100).refine(
    (val) => !containsDangerousPattern(val),
    { message: 'Invalid characters' }
  ),
  startDate: safeString(50).optional(),
  endDate: safeString(50).optional(),
  description: safeString(2000).optional(),
});

// Education: Degree and Institution are required
const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required').max(100).refine(
    (val) => !containsDangerousPattern(val),
    { message: 'Invalid characters' }
  ),
  institution: z.string().min(1, 'Institution is required').max(100).refine(
    (val) => !containsDangerousPattern(val),
    { message: 'Invalid characters' }
  ),
  startYear: safeString(20).optional(),
  endYear: safeString(20).optional(),
});

// Projects: Title is required
const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(100).refine(
    (val) => !containsDangerousPattern(val),
    { message: 'Invalid characters' }
  ),
  description: safeString(1000).optional(),
  technologies: safeString(200).optional(),
  link: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().optional(),
});

const certificateSchema = z.object({
  name: safeString(100).optional(),
  organization: safeString(100).optional(),
  year: safeString(20).optional(),
});

const languageSchema = z.object({
  language: safeString(50).optional(),
  proficiency: safeString(50).optional(),
});

// MAIN FORM: Fields marked with * are required
const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100).refine(
    (val) => !containsDangerousPattern(val),
    { message: 'Invalid characters in name' }
  ),
  professionalTitle: z.string().min(2, 'Professional title is required').max(100).refine(
    (val) => !containsDangerousPattern(val),
    { message: 'Invalid characters in title' }
  ),
  summary: safeString(500).optional(),
  location: safeString(100).optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email address').max(254),
  phone: z.string().max(30).optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  skills: safeString(500).optional(),
  experience: z.array(experienceSchema).min(1, 'At least one experience entry is required'),
  education: z.array(educationSchema).min(1, 'At least one education entry is required'),
  projects: z.array(projectSchema).min(1, 'At least one project is required'),
  certifications: z.array(certificateSchema),
  languages: z.array(languageSchema),
});

type FormData = z.infer<typeof formSchema>;

const ProgressBar = ({ step }: { step: number }) => (
  <div className="flex-1 w-full bg-white/5 rounded-full h-2">
    <div
      className="bg-gradient-to-r from-white/70 to-white h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
      style={{ width: `${(step / 3) * 100}%` }}
    />
  </div>
);

export default function ManualForm({
  onSubmit: handleFormSubmit,
  onBack,
  dict,
  initialData,
  initialPhotoURL
}: {
  onSubmit: (data: any) => void;
  onBack: () => void;
  dict: Dictionary['createPage']['manualForm'];
  initialData?: Partial<FormData>;
  initialPhotoURL?: string;
}) {
  const [step, setStep] = React.useState(1);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(initialPhotoURL || null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [projectImages, setProjectImages] = React.useState<{ [key: number]: { file: File | null, preview: string | null } }>({});

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectImages(prev => ({
          ...prev,
          [index]: { file, preview: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProjectImage = (index: number) => {
    setProjectImages(prev => {
      const newImages = { ...prev };
      delete newImages[index];
      return newImages;
    });
  };

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      professionalTitle: initialData?.professionalTitle || '',
      summary: initialData?.summary || '',
      location: initialData?.location || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      // REMOVED: website field - users create portfolio first, then get a link!
      linkedin: initialData?.linkedin || '',
      github: initialData?.github || '',
      skills: initialData?.skills || '',
      experience: initialData?.experience || [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
      education: initialData?.education || [{ degree: '', institution: '', startYear: '', endYear: '' }],
      projects: initialData?.projects || [{ title: '', description: '', technologies: '', link: '' }],
      certifications: initialData?.certifications || [{ name: '', organization: '', year: '' }],
      languages: initialData?.languages || [{ language: '', proficiency: 'Intermediate' }]
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
  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({ control, name: 'certifications' });
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control, name: 'languages' });


  const nextStep = async () => {
    // Validate required fields based on current step
    let fieldsToValidate: (keyof FormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ['fullName', 'professionalTitle', 'email'];
    } else if (step === 2) {
      fieldsToValidate = ['experience', 'education'];
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  // Skip to final step (for users who want to rush)
  const skipToEnd = () => {
    setStep(3);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data: FormData) => {
    // Include the photo file and project images in the submission
    handleFormSubmit({
      ...data,
      photoFile: photoFile, // Add the photo file to the form data
      projectImageFiles: projectImages, // Add project images
    });
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-white px-4 sm:px-6 pt-32 sm:pt-40 pb-12">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="flex items-center gap-2 sm:gap-4 mb-8">
            {/* Back Button - Goes back to previous step or exits on step 1 */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={step === 1 ? onBack : prevStep}
              className="shrink-0 h-8 w-8 sm:h-10 sm:w-10 border border-white/10 hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <ProgressBar step={step} />
            <span className="text-xs sm:text-sm text-white/50 shrink-0">{step}/3</span>
          </div>

          {/* Glass Card */}
          <div className="liquid-glass-card p-4 sm:p-6 md:p-8">

            {step === 1 && (
              <div>
                <h3 className="text-2xl font-semibold mb-8">{dict.step1.title}</h3>

                {/* Photo Upload with Preview */}
                <div className="mb-8 p-6 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-white/5 dark:to-white/10 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Preview Circle */}
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-white/20 shadow-xl bg-gradient-to-br from-gray-100 to-slate-100 dark:from-white/10 dark:to-white/5 flex items-center justify-center">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-xs">No Photo</p>
                          </div>
                        )}
                      </div>
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview(null);
                            setPhotoFile(null);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        Profile Photo (Optional)
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Upload your photo to personalize your portfolio
                      </p>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-white dark:to-gray-200 text-white dark:text-black font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        JPG, PNG, or GIF - Max 5MB
                      </p>
                    </div>
                  </div>
                </div>

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
                  {/* REMOVED: Website/Portfolio field - user creates portfolio first, gets link after! */}
                  <div>
                    <Input {...register('linkedin')} type="url" placeholder="LinkedIn" />
                    {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>}
                  </div>
                  <div>
                    <Input {...register('github')} type="url" placeholder="GitHub" />
                    {errors.github && <p className="text-red-500 text-sm mt-1">{errors.github.message}</p>}
                  </div>
                </div>
                {/* Step 1 Navigation */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-white/40 mb-4 text-center sm:text-left">
                    Fields marked with * are required. Fill what you can, skip the rest!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button onClick={skipToEnd} type="button" variant="ghost" className="w-full sm:w-auto text-white/50 hover:text-white">
                      Skip to end
                    </Button>
                    <Button onClick={nextStep} type="button" className="w-full sm:w-auto bg-white text-black hover:bg-white/90">
                      {dict.step1.nextButton}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-2xl font-semibold mb-8">{dict.step2.title}</h3>

                {/* Experience */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4">{dict.step2.experience.title}</h4>
                  {errors.experience && typeof errors.experience === 'object' && 'message' in errors.experience && (
                    <p className="text-red-500 text-sm mb-4">{errors.experience.message as string}</p>
                  )}
                  {experienceFields.map((field, index) => (
                    <div key={field.id} className="grid md:grid-cols-2 gap-4 border border-white/10 p-4 rounded-lg mb-4 relative">
                      <div>
                        <Input {...register(`experience.${index}.jobTitle`)} placeholder={`${dict.step2.experience.jobTitle} *`} />
                        {errors.experience?.[index]?.jobTitle && (
                          <p className="text-red-500 text-sm mt-1">{errors.experience[index]?.jobTitle?.message}</p>
                        )}
                      </div>
                      <div>
                        <Input {...register(`experience.${index}.company`)} placeholder={`${dict.step2.experience.companyName} *`} />
                        {errors.experience?.[index]?.company && (
                          <p className="text-red-500 text-sm mt-1">{errors.experience[index]?.company?.message}</p>
                        )}
                      </div>
                      <Input {...register(`experience.${index}.startDate`)} placeholder={dict.step2.experience.startDate} />
                      <Input {...register(`experience.${index}.endDate`)} placeholder={dict.step2.experience.endDate} />
                      <Textarea {...register(`experience.${index}.description`)} placeholder={dict.step2.experience.description} className="md:col-span-2" rows={3} />
                      {experienceFields.length > 1 && (
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeExperience(index)} className="absolute -top-3 -right-3 h-7 w-7">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendExperience({ jobTitle: '', company: '', startDate: '', endDate: '', description: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                  </Button>
                </div>

                {/* Education */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4">{dict.step2.education.title}</h4>
                  {errors.education && typeof errors.education === 'object' && 'message' in errors.education && (
                    <p className="text-red-500 text-sm mb-4">{errors.education.message as string}</p>
                  )}
                  {educationFields.map((field, index) => (
                    <div key={field.id} className="grid md:grid-cols-2 gap-4 border border-white/10 p-4 rounded-lg mb-4 relative">
                      <div>
                        <Input {...register(`education.${index}.degree`)} placeholder={`${dict.step2.education.degree} *`} />
                        {errors.education?.[index]?.degree && (
                          <p className="text-red-500 text-sm mt-1">{errors.education[index]?.degree?.message}</p>
                        )}
                      </div>
                      <div>
                        <Input {...register(`education.${index}.institution`)} placeholder={`${dict.step2.education.institution} *`} />
                        {errors.education?.[index]?.institution && (
                          <p className="text-red-500 text-sm mt-1">{errors.education[index]?.institution?.message}</p>
                        )}
                      </div>
                      <Input {...register(`education.${index}.startYear`)} placeholder={dict.step2.education.startYear} />
                      <Input {...register(`education.${index}.endYear`)} placeholder={dict.step2.education.endYear} />
                      {educationFields.length > 1 && (
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeEducation(index)} className="absolute -top-3 -right-3 h-7 w-7">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendEducation({ degree: '', institution: '', startYear: '', endYear: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                  </Button>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-xl font-semibold mb-4">{dict.step2.skills.title}</h4>
                  <Input {...register('skills')} placeholder={dict.step2.skills.placeholder} />
                </div>

                {/* Step 2 Navigation */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-white/40 mb-4 text-center sm:text-left">
                    All fields are optional. Add what you have!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button onClick={prevStep} type="button" variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/5">
                      {dict.step2.backButton}
                    </Button>
                    <Button onClick={skipToEnd} type="button" variant="ghost" className="w-full sm:w-auto text-white/50 hover:text-white">
                      Skip to end
                    </Button>
                    <Button onClick={nextStep} type="button" className="w-full sm:w-auto bg-white text-black hover:bg-white/90">
                      {dict.step2.nextButton}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-2xl font-semibold mb-8">{dict.step3.title}</h3>

                {/* Projects */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4">{dict.step3.projects.title}</h4>
                  {errors.projects && typeof errors.projects === 'object' && 'message' in errors.projects && (
                    <p className="text-red-500 text-sm mb-4">{errors.projects.message as string}</p>
                  )}
                  {projectFields.map((field, index) => (
                    <div key={field.id} className="border border-white/10 p-4 rounded-lg mb-4 relative">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Input {...register(`projects.${index}.title`)} placeholder={`${dict.step3.projects.projectTitle} *`} />
                          {errors.projects?.[index]?.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.projects[index]?.title?.message}</p>
                          )}
                        </div>
                        <div>
                          <Input {...register(`projects.${index}.link`)} type="url" placeholder={dict.step3.projects.link} />
                          {errors.projects?.[index]?.link && <p className="text-red-500 text-sm mt-1">{errors.projects?.[index]?.link?.message}</p>}
                        </div>
                        <Textarea {...register(`projects.${index}.description`)} placeholder={dict.step3.projects.description} className="md:col-span-2" rows={2} />
                        <Input {...register(`projects.${index}.technologies`)} placeholder={dict.step3.projects.technologies} className="md:col-span-2" />

                        {/* Project Image Upload */}
                        <div className="md:col-span-2 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-white/5 dark:to-white/10 rounded-lg border border-dashed border-gray-300 dark:border-white/20">
                          <div className="flex items-center gap-4">
                            {/* Image Preview */}
                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center border border-gray-200 dark:border-white/10">
                              {projectImages[index]?.preview ? (
                                <img src={projectImages[index].preview!} alt="Project preview" className="w-full h-full object-cover" />
                              ) : (
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>

                            {/* Upload Button */}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Screenshot (Optional)</p>
                              <div className="flex gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  {projectImages[index]?.preview ? 'Change' : 'Upload'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleProjectImageChange(index, e)}
                                    className="hidden"
                                  />
                                </label>
                                {projectImages[index]?.preview && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeProjectImage(index)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {projectFields.length > 1 && (
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeProject(index)} className="absolute -top-3 -right-3 h-7 w-7">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendProject({ title: '', description: '', technologies: '', link: '', imageUrl: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                </div>

                {/* Certifications */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4">{dict.step3.certifications.title}</h4>
                  {certificationFields.map((field, index) => (
                    <div key={field.id} className="grid md:grid-cols-3 gap-4 border p-4 rounded-lg mb-4 relative">
                      <Input {...register(`certifications.${index}.name`)} placeholder={`${dict.step3.certifications.certificateName} *`} />
                      <Input {...register(`certifications.${index}.organization`)} placeholder={dict.step3.certifications.organization} />
                      <Input {...register(`certifications.${index}.year`)} placeholder={dict.step3.certifications.year} />
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeCertification(index)} className="absolute -top-3 -right-3 h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendCertification({ name: '', organization: '', year: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Certification
                  </Button>
                </div>

                {/* Languages */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4">{dict.step3.languages.title}</h4>
                  {languageFields.map((field, index) => (
                    <div key={field.id} className="grid md:grid-cols-2 gap-4 border p-4 rounded-lg mb-4 relative">
                      <Input {...register(`languages.${index}.language`)} placeholder={`${dict.step3.languages.language} *`} />
                      <Input {...register(`languages.${index}.proficiency`)} placeholder={dict.step3.languages.proficiency.level} />
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeLanguage(index)} className="absolute -top-3 -right-3 h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendLanguage({ language: '', proficiency: 'Intermediate' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Language
                  </Button>
                </div>


                {/* Step 3 Navigation */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                    <Button onClick={prevStep} type="button" variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/5">
                      {dict.step3.backButton}
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto bg-white text-black hover:bg-white/90 font-semibold">
                      {dict.step3.submitButton}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
