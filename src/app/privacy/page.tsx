import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-6">
                        Last updated: December 2024
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                        <p className="text-muted-foreground mb-4">
                            We collect information you provide directly to us, including your name, email address,
                            and any portfolio content you choose to upload or create using our service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground mb-4">
                            We use the information we collect to provide, maintain, and improve our services,
                            process transactions, and communicate with you about your account.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Security</h2>
                        <p className="text-muted-foreground mb-4">
                            We implement appropriate security measures to protect your personal information
                            against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">4. Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:support@ultrafolio.dev" className="text-primary hover:underline">
                                support@ultrafolio.dev
                            </a>
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
