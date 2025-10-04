import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const freeFeatures = [
  'Generate Portfolio',
  'Live Editor',
  'One-Click Deployment',
  'GitHub Repository Integration',
];

const premiumFeatures = [
  'All features from Free Plan',
  'Download Source Code (ZIP)',
  'Access to Premium Templates',
  'Priority Support',
];

export default function Pricing() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Simple, transparent pricing</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the plan that's right for you. Get started for free, and upgrade when you need more power.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-8 lg:max-w-4xl lg:grid-cols-2">
          
          <Card className="ring-1 ring-border">
            <CardHeader>
              <CardTitle className="font-headline">Free</CardTitle>
              <CardDescription>For personal projects and getting started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight">$0</span>
                <span className="ml-1 text-sm font-semibold leading-6 text-muted-foreground">/forever</span>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {freeFeatures.map(feature => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Get Started</Button>
            </CardFooter>
          </Card>
          
          <Card className="relative ring-2 ring-primary">
            <div className="absolute top-0 right-4 -mt-3">
                <div className="flex items-center justify-center h-6 px-3 text-xs font-semibold tracking-wider text-primary-foreground uppercase bg-primary rounded-full">
                    Most Popular
                </div>
            </div>
            <CardHeader>
              <CardTitle className="font-headline">Premium</CardTitle>
              <CardDescription>For professionals who need full control.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight">$29</span>
                <span className="ml-1 text-sm font-semibold leading-6 text-muted-foreground">/one-time</span>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {premiumFeatures.map(feature => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Upgrade to Premium</Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </section>
  );
}
