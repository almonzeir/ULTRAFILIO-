'use client';

import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/logo';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { Github, Twitter, Linkedin } from 'lucide-react';


export default function Footer() {
  const [year, setYear] = useState<number | null>(null);
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['footer'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.footer);
    };
    fetchDictionary();
  }, [language]);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (!dict) return null;
  
  const navItems = [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Templates', href: '#' },
    { name: 'About', href: '#' },
  ];

  const socialItems = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navItems.map((item) => (
            <div key={item.name} className="pb-6">
              <a href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {socialItems.map((item) => (
            <a key={item.name} href={item.href} className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between">
          <Logo />
          <p className="text-sm text-muted-foreground">
            &copy; {year || new Date().getFullYear()} {dict.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
