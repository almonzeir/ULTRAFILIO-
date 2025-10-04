'use client';

import * as React from 'react';
import Logo from '@/components/shared/logo';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import Link from 'next/link';
import UserProfileButton from '../auth/user-profile-button';
import { useUser } from '@/firebase';

export default function Header() {
  const { language, toggleLanguage } = useLanguage();
  const [dict, setDict] = React.useState<Dictionary['header'] | null>(null);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { user } = useUser();

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.header);
    };
    fetchDictionary();
  }, [language]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!dict) return null;

  const navLinks = [
    { name: dict.features, href: '#' },
    { name: dict.templates, href: '#' },
    { name: dict.pricing, href: '#' },
  ];

  const NavMenu = () => (
    <nav className="flex items-center space-x-6">
      {navLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.name}
        </a>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <div>
                  <Menu />
                  <span className="sr-only">{dict.toggleNavigation}</span>
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <SheetClose asChild>
                  <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                    <Logo />
                  </Link>
                </SheetClose>
                {navLinks.map((link) => (
                   <SheetClose asChild key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                      {link.name}
                    </Link>
                   </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex flex-1 items-center">
          <NavMenu />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <UserProfileButton />
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">{dict.login}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{dict.getStarted}</Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Languages className="h-5 w-5" />
            <span className="sr-only">{dict.toggleLanguage}</span>
          </Button>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">{dict.toggleTheme}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
