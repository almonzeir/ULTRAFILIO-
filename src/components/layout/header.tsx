'use client';

import * as React from 'react';
import Logo from '@/components/shared/logo';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import en from '@/locales/en.json';
import type { Dictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import Link from 'next/link';
import UserProfileButton from '../auth/user-profile-button';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Header() {
  const { language } = useLanguage();
  const [dict, setDict] = React.useState<Dictionary['header']>(en.header);
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { user } = useUser();


  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const fetchDict = async () => {
      try {
        const d = await getDictionary(language);
        if (d && d.header) setDict(d.header);
      } catch (err) {
        console.error("Header translation error:", err);
      }
    };
    fetchDict();
  }, [language]);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: dict.features, href: '/#how-it-works' },
    { name: dict.templates, href: '/demo-template' },
    { name: dict.pricing, href: '/#pricing' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-700',
        scrolled
          ? 'py-3 px-4 sm:px-6 lg:px-8'
          : 'py-6 px-4 sm:px-6 lg:px-8'
      )}
    >
      {/* The Floating Glass Capsule */}
      <div className={cn(
        "mx-auto flex items-center justify-between transition-all duration-700 rounded-full",
        scrolled
          ? "liquid-glass-pill max-w-5xl px-4 sm:px-6 py-2"
          : "max-w-7xl px-2 py-2"
      )}>
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5 transition-all"
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5 transition-all"
            >
              {dict.dashboard || 'My Portfolios'}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop Auth Buttons */}
          {user ? (
            <UserProfileButton />
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Button asChild variant="ghost" className="liquid-button-ghost">
                <Link href="/login">{dict.login}</Link>
              </Button>
              <Button asChild className="liquid-button h-11 px-8 text-[10px] tracking-[0.2em] uppercase shadow-2xl">
                <Link href="/signup">{dict.getStarted}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-11 h-11 rounded-full liquid-glass">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 liquid-glass p-0">
                <div className="flex flex-col h-full p-8">
                  <div className="flex justify-between items-center mb-12">
                    <Logo />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="w-11 h-11 rounded-full liquid-glass">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  <nav className="flex flex-col gap-4 mb-12">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link
                          href={link.href}
                          className="text-2xl font-bold tracking-tight text-black dark:text-white hover:text-neutral-500 transition-colors py-2"
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                    {user && (
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="text-2xl font-bold tracking-tight text-black dark:text-white hover:text-neutral-500 transition-colors py-2"
                        >
                          {dict.dashboard || 'My Portfolios'}
                        </Link>
                      </SheetClose>
                    )}
                  </nav>

                  {!user && (
                    <div className="mt-auto flex flex-col gap-4">
                      <SheetClose asChild>
                        <Button asChild className="liquid-button-ghost h-14 rounded-2xl text-lg font-bold">
                          <Link href="/login">{dict.login}</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="liquid-button h-14 rounded-2xl text-lg font-bold">
                          <Link href="/signup">{dict.getStarted}</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
