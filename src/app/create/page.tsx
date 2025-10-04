'use client';

import * as React from 'react';

export default function CreatePortfolioPage() {
  const [formVisible, setFormVisible] = React.useState(false);
  const [personalInfo, setPersonalInfo] = React.useState({
    fullName: '',
    professionalTitle: '',
    shortSummary: '',
    profilePicture: null,
    location: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
  });
  const [experience, setExperience] = React.useState([
    { jobTitle: '', companyName: '', startDate: '', endDate: '', description: '' },
  ]);
  const [education, setEducation] = React.useState([
    { degree: '', institution: '', startYear: '', endYear: '', additionalInfo: '' },
  ]);
  const [skills, setSkills] = React.useState('');
  const [projects, setProjects] = React.useState([
    { projectTitle: '', description: '', technologiesUsed: '', link: '' },
  ]);
  const [certifications, setCertifications] = React.useState([
    { certificateName: '', organization: '', year: '' },
  ]);
  const [languages, setLanguages] = React.useState([
    { language: '', proficiency: '' },
  ]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPersonalInfo(prevState => ({ ...prevState, [id]: value }));
  };

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [id]: value };
    setExperience(newExperience);
  };

  const addExperience = () => {
    setExperience([...experience, { jobTitle: '', companyName: '', startDate: '', endDate: '', description: '' }]);
  };

  const removeExperience = (index: number) => {
    const newExperience = [...experience];
    newExperience.splice(index, 1);
    setExperience(newExperience);
  };

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [id]: value };
    setEducation(newEducation);
  };

  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', startYear: '', endYear: '', additionalInfo: '' }]);
  };

  const removeEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const handleProjectsChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [id]: value };
    setProjects(newProjects);
  };

  const addProject = () => {
    setProjects([...projects, { projectTitle: '', description: '', technologiesUsed: '', link: '' }]);
  };

  const removeProject = (index: number) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  };

  const handleCertificationsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const newCertifications = [...certifications];
    newCertifications[index] = { ...newCertifications[index], [id]: value };
    setCertifications(newCertifications);
  };

  const addCertification = () => {
    setCertifications([...certifications, { certificateName: '', organization: '', year: '' }]);
  };

  const removeCertification = (index: number) => {
    const newCertifications = [...certifications];
    newCertifications.splice(index, 1);
    setCertifications(newCertifications);
  };

  const handleLanguagesChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const newLanguages = [...languages];
    newLanguages[index] = { ...newLanguages[index], [id]: value };
    setLanguages(newLanguages);
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: '', proficiency: '' }]);
  };

  const removeLanguage = (index: number) => {
    const newLanguages = [...languages];
    newLanguages.splice(index, 1);
    setLanguages(newLanguages);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold">Create Your Portfolio</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">Choose how you’d like to start building your portfolio.</p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Option 1: Upload CV */}
        <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg hover:shadow-2xl transition border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Upload Your CV</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Upload your CV and we’ll generate your portfolio automatically.</p>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-12 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition">
            <p className="text-gray-600 dark:text-gray-400">Click to upload or drag & drop<br /><span className="text-sm text-gray-400 dark:text-gray-500">PDF, DOCX (max 5MB)</span></p>
          </div>
          <div className="mt-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Profile Picture (Optional)</label>
            <input type="file" className="block w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2" />
          </div>
          <button className="mt-8 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition">
            Continue to Generate
          </button>
        </div>

        {/* Option 2: Fill Manually */}
        <div className="p-8 bg-gradient-to-b from-black to-gray-900 text-white rounded-2xl shadow-lg hover:shadow-2xl transition border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Fill Manually</h2>
          <p className="text-gray-400 mb-6">Don’t have a CV? Fill your details manually to create your portfolio.</p>
          <button 
            onClick={() => setFormVisible(!formVisible)}
            className="w-full py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition"
          >
            {formVisible ? 'Hide Form' : 'Start Manual Form'}
          </button>
        </div>
      </div>

      {formVisible && (
        <div className="max-w-5xl mx-auto mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Fill in Your Details</h2>
          <form className="space-y-8">
            {/* Personal Information */}
            <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-semibold mb-6">1. Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input type="text" id="fullName" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={personalInfo.fullName} onChange={handlePersonalInfoChange} />
                </div>
                <div>
                  <label htmlFor="professionalTitle" className="block text-gray-700 dark:text-gray-300 mb-2">Professional Title</label>
                  <input type="text" id="professionalTitle" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={personalInfo.professionalTitle} onChange={handlePersonalInfoChange} />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="shortSummary" className="block text-gray-700 dark:text-gray-300 mb-2">Short Summary</label>
                  <textarea id="shortSummary" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={3} value={personalInfo.shortSummary} onChange={handlePersonalInfoChange}></textarea>
                </div>
                <div>
                  <label htmlFor="profilePicture" className="block text-gray-700 dark:text-gray-300 mb-2">Profile Picture (Optional)</label>
                  <input type="file" id="profilePicture" className="block w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2" />
                </div>
                <div>
                  <label htmlFor="location" className="block text-gray-700 dark:text-gray-300 mb-2">Location</label>
                  <input type="text" id="location" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={personalInfo.location} onChange={handlePersonalInfoChange} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input type="email" id="email" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={personalInfo.email} onChange={handlePersonalInfoChange} />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">Phone (Optional)</label>
                  <input type="tel" id="phone" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={personalInfo.phone} onChange={handlePersonalInfoChange} />
                </div>
                <div>
                  <label htmlFor="website" className="block text-gray-700 dark:text-gray-300 mb-2">Website / Portfolio (Optional)</label>
                  <input type="url" id="website" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={personalInfo.website} onChange={handlePersonalInfoChange} />
                </div>
                <div>
                  <label htmlFor="linkedin" className="block text-gray-700 dark:text-gray-300 mb-2">LinkedIn (Optional)</label>
                  <input type="url" id="linkedin" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={personalInfo.linkedin} onChange={handlePersonalInfoChange} />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="github" className="block text-gray-700 dark:text-gray-300 mb-2">GitHub (Optional)</label>
                  <input type="url" id="github" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={personalInfo.github} onChange={handlePersonalInfoChange} />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-semibold mb-6">2. Experience</h3>
              {experience.map((exp, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
                  <div>
                    <label htmlFor={`jobTitle-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                    <input type="text" id="jobTitle" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`companyName-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                    <input type="text" id="companyName" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={exp.companyName} onChange={(e) => handleExperienceChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`startDate-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                    <input type="text" id="startDate" placeholder="Month/Year" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={exp.startDate} onChange={(e) => handleExperienceChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`endDate-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                    <input type="text" id="endDate" placeholder="Month/Year or Present" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={exp.endDate} onChange={(e) => handleExperienceChange(index, e)} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`description-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea id="description" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={3} value={exp.description} onChange={(e) => handleExperienceChange(index, e)}></textarea>
                  </div>
                  {experience.length > 1 && (
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeExperience(index)} className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addExperience} className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                + Add More Experience
              </button>
            </div>

            {/* Education */}
            <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-semibold mb-6">3. Education</h3>
              {education.map((edu, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
                  <div>
                    <label htmlFor={`degree-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Degree</label>
                    <input type="text" id="degree" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`institution-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Institution</label>
                    <input type="text" id="institution" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`startYear-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Start Year</label>
                    <input type="text" id="startYear" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={edu.startYear} onChange={(e) => handleEducationChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`endYear-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">End Year</label>
                    <input type="text" id="endYear" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={edu.endYear} onChange={(e) => handleEducationChange(index, e)} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`additionalInfo-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Additional Info (Optional)</label>
                    <textarea id="additionalInfo" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={2} value={edu.additionalInfo} onChange={(e) => handleEducationChange(index, e)}></textarea>
                  </div>
                  {education.length > 1 && (
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addEducation} className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                + Add More Education
              </button>
            </div>

            {/* Skills */}
            <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-semibold mb-6">4. Skills</h3>
              <div>
                <label htmlFor="skills" className="block text-gray-700 dark:text-gray-300 mb-2">List your skills or tools (comma-separated)</label>
                <input type="text" id="skills" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
            </div>

            {/* Projects */}
            <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-semibold mb-6">5. Projects</h3>
              {projects.map((project, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
                  <div>
                    <label htmlFor={`projectTitle-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Project Title</label>
                    <input type="text" id="projectTitle" required className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={project.projectTitle} onChange={(e) => handleProjectsChange(index, e)} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`description-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea id="description" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" rows={2} value={project.description} onChange={(e) => handleProjectsChange(index, e)}></textarea>
                  </div>
                  <div>
                    <label htmlFor={`technologiesUsed-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Technologies Used (comma-separated)</label>
                    <input type="text" id="technologiesUsed" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={project.technologiesUsed} onChange={(e) => handleProjectsChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`link-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Link (Optional)</label>
                    <input type="url" id="link" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={project.link} onChange={(e) => handleProjectsChange(index, e)} />
                  </div>
                  {projects.length > 1 && (
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeProject(index)} className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addProject} className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                + Add More Projects
              </button>
            </div>

            {/* Certifications */}
            <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-semibold mb-6">6. Certifications (Optional)</h3>
              {certifications.map((cert, index) => (
                <div key={index} className="grid md:grid-cols-3 gap-6 border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
                  <div>
                    <label htmlFor={`certificateName-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Certificate Name</label>
                    <input type="text" id="certificateName" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={cert.certificateName} onChange={(e) => handleCertificationsChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`organization-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Organization</label>
                    <input type="text" id="organization" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={cert.organization} onChange={(e) => handleCertificationsChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`year-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Year</label>
                    <input type="text" id="year" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={cert.year} onChange={(e) => handleCertificationsChange(index, e)} />
                  </div>
                  {certifications.length > 1 && (
                    <div className="md:col-span-3 flex justify-end">
                      <button type="button" onClick={() => removeCertification(index)} className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addCertification} className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                + Add More Certifications
              </button>
            </div>

            {/* Languages */}
            <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-semibold mb-6">7. Languages (Optional)</h3>
              {languages.map((lang, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
                  <div>
                    <label htmlFor={`language-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <input type="text" id="language" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={lang.language} onChange={(e) => handleLanguagesChange(index, e)} />
                  </div>
                  <div>
                    <label htmlFor={`proficiency-${index}`} className="block text-gray-700 dark:text-gray-300 mb-2">Proficiency</label>
                    <select id="proficiency" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg" value={lang.proficiency} onChange={(e) => handleLanguagesChange(index, e)}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Native</option>
                    </select>
                  </div>
                  {languages.length > 1 && (
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeLanguage(index)} className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addLanguage} className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                + Add More Languages
              </button>
            </div>

            {/* Final Step */}
            <div className="p-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-center">
              <h3 className="text-2xl font-semibold mb-4">All set! Click below to generate your portfolio.</h3>
              <button className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition">
                Generate My Portfolio
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

    