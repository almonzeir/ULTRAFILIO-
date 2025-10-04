'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun, Languages } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { useTheme } from 'next-themes';

const navLinks = [
  { name: 'Features', href: '#' },
  { name: 'Templates', href: '#' },
  { name: 'Pricing', href: '#' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    setMounted(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavMenu = () => (
    <>
      {navLinks.map((link) => (
        <a key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          {link.name}
        </a>
      ))}
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'border-b border-border/40 bg-background/80 backdrop-blur-lg' : ''
      }`}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        <div className="hidden md:flex flex-1 items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <NavMenu />
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between md:justify-end space-x-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Languages className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>
            {mounted && (
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-2">
             <Button variant="ghost">Login</Button>
             <Button>Get Started</Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-8 flex flex-col space-y-4">
                <NavMenu />
                <div className="border-t pt-4 flex flex-col space-y-2">
                    <Button variant="ghost">Login</Button>
                    <Button>Get Started</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
