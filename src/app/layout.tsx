import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { ColorThemeProvider } from '@/context/color-theme-context';
import { LanguageProvider } from '@/context/language-context';
import ErrorBoundary from '@/components/error-boundary';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "UltraFolio - AI-Powered Portfolio Generator",
    template: "%s | UltraFolio"
  },
  description: "Transform your CV into a stunning professional portfolio website using AI. Upload your resume and let Google's Gemini AI create a beautiful, responsive portfolio in minutes.",
  keywords: [
    "portfolio generator",
    "AI portfolio",
    "CV to portfolio",
    "resume website",
    "professional portfolio",
    "AI-powered",
    "Google Gemini",
    "portfolio builder",
    "online portfolio",
    "web portfolio"
  ],
  authors: [{ name: "UltraFolio Team" }],
  creator: "UltraFolio",
  publisher: "UltraFolio",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9003'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "UltraFolio - AI-Powered Portfolio Generator",
    description: "Transform your CV into a stunning professional portfolio website using AI",
    siteName: "UltraFolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "UltraFolio - AI-Powered Portfolio Generator",
    description: "Transform your CV into a stunning professional portfolio website using AI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  icons: {
    icon: '/image.png',
    shortcut: '/image.png',
    apple: '/image.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ColorThemeProvider>
                {children}
                <Toaster />
              </ColorThemeProvider>
            </ThemeProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
