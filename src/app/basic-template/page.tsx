'use client';

import React, { useState } from 'react';
import BasicTemplate from '@/templates/BasicTemplate';
import { PortfolioData } from '@/templates/types';
import { ThemeContext } from '@/context/ThemeContext'; // Assuming ThemeContext is correctly exported

const dummyPortfolioData: PortfolioData = {
  personalInfo: {
    fullName: 'John Doe',
    portfolioNameAbbr: 'JD',
    title: 'Software Engineer',
    tagline: 'Building amazing web applications',
    profilePhotoURL: '',
    email: 'john.doe@example.com',
    linkedInURL: 'https://www.linkedin.com/in/johndoe',
    location: 'San Francisco, CA',
  },
  about: {
    extendedBio:
      'Experienced software engineer with a passion for creating robust and scalable solutions. Proficient in various programming languages and frameworks.',
    stats: [
      { icon: 'code', value: '5+', label: 'Years Experience' },
      { icon: 'project', value: '20+', label: 'Projects Completed' },
    ],
    skills: [
      { icon: 'react', category: 'Frontend', tags: ['React', 'Next.js', 'TypeScript'] },
      { icon: 'node', category: 'Backend', tags: ['Node.js', 'Express.js', 'Python', 'FastAPI'] },
    ],
  },
  experience: [
    {
      dates: 'Jan 2022 - Present',
      location: 'San Francisco, CA',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      responsibilities: [
        'Developed and maintained web applications using React and Node.js.',
        'Collaborated with cross-functional teams to deliver high-quality software.',
      ],
      tags: ['React', 'Node.js', 'TypeScript', 'AWS'],
    },
    {
      dates: 'Jan 2019 - Dec 2021',
      location: 'Seattle, WA',
      jobTitle: 'Software Engineer',
      company: 'Innovate Corp.',
      responsibilities: [
        'Designed and implemented new features for the company\'s flagship product.',
        'Participated in code reviews and mentored junior developers.',
      ],
      tags: ['Angular', 'Java', 'Spring Boot'],
    },
  ],
  projects: [
    {
      imageURL: '',
      name: 'E-commerce Platform',
      category: 'Web Development',
      description: 'Built a full-stack e-commerce platform with secure payment processing.',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      detailsURL: '#',
    },
    {
      imageURL: '',
      name: 'Task Management App',
      category: 'Mobile Development',
      description: 'Developed a mobile task management application for iOS and Android.',
      tags: ['React Native', 'Firebase'],
      detailsURL: '#',
    },
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      institution: 'University of Example',
      startDate: 'Sep 2017',
      endDate: 'May 2019',
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Another University',
      startDate: 'Sep 2013',
      endDate: 'May 2017',
    },
  ],
};

export default function BasicTemplatePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Default theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BasicTemplate data={dummyPortfolioData} />
    </ThemeContext.Provider>
  );
}
