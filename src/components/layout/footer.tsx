import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/logo';

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="bg-card rounded-2xl p-8 sm:p-10">
          <div className="relative isolate overflow-hidden">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Ready to Build Your UltraFolio?
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Start for free and create a portfolio that truly represents you. No credit card required.
              </p>
              <div className="mt-8 flex items-center justify-center gap-x-6">
                <Button size="lg">
                  Get Started for Free
                </Button>
                <Button size="lg" variant="ghost">
                  Learn more <span aria-hidden="true">→</span>
                </Button>
              </div>
            </div>
            <div
              className="absolute-filter"
              aria-hidden="true"
            >
              <div
                className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-primary/30 to-primary/10 opacity-20"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UltraFolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}