import { UploadCloud, Edit2, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  name: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    name: 'Upload Your Resume',
    description: 'Simply upload your existing CV or fill out our guided form. We parse the data for you.',
    icon: UploadCloud,
  },
  {
    name: 'Customize Your Design',
    description: 'Choose from premium templates, adjust colors, and re-order sections with our live editor.',
    icon: Edit2,
  },
  {
    name: 'Deploy with One Click',
    description: 'Publish your portfolio to a public URL. Download the code with our premium plan.',
    icon: Rocket,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-base font-semibold leading-7 text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Three steps to a perfect portfolio
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            From your resume to a live website in minutes. It's that simple.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <span className="pl-16">{step.name}</span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto pl-16">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
