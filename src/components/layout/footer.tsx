'use client';

import { Github, Twitter, Linkedin } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';

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

  const navigation = {
    product: [
      { name: dict.product.features, href: '/#features' },
      { name: dict.product.templates, href: '/demo-template' },
      { name: dict.product.pricing, href: '/checkout' },
    ],
    company: [
      { name: dict.company.about, href: '/#how-it-works' },
      { name: dict.company.blog, href: '/#testimonials' },
      { name: dict.company.contact, href: 'mailto:support@ultrafolio.dev' },
    ],
    legal: [
      { name: dict.legal.privacy, href: '/privacy' },
      { name: dict.legal.terms, href: '/terms' },
    ],
  };

  const social = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/ultrafolio',
      icon: (props: any) => <Twitter {...props} />,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/ultrafolio',
      icon: (props: any) => <Github {...props} />,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/ultrafolio',
      icon: (props: any) => <Linkedin {...props} />,
    },
  ];

  return (
    <footer className="bg-background border-t border-muted/50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        {dict.title}
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Logo />
            <p className="text-base leading-7 text-muted-foreground/80 max-w-sm">
              {dict.tagline}
            </p>
            <div className="flex space-x-6">
              {social.map((item) => (
                <a key={item.name} href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-lg font-bold leading-6 text-foreground mb-6">{dict.product.title}</h3>
                <ul role="list" className="space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base leading-6 text-muted-foreground hover:text-foreground transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-lg font-bold leading-6 text-foreground mb-6">{dict.company.title}</h3>
                <ul role="list" className="space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base leading-6 text-muted-foreground hover:text-foreground transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-lg font-bold leading-6 text-foreground mb-6">{dict.legal.title}</h3>
                <ul role="list" className="space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base leading-6 text-muted-foreground hover:text-foreground transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-border/50 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm leading-5 text-muted-foreground">&copy; {year || new Date().getFullYear()} {dict.copyright}</p>
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-muted-foreground font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
