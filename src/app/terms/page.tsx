import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-6">
                        Last updated: December 2024
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground mb-4">
                            By accessing or using UltraFolio, you agree to be bound by these Terms of Service
                            and all applicable laws and regulations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use of Service</h2>
                        <p className="text-muted-foreground mb-4">
                            You may use our service to create and host professional portfolio websites.
                            You are responsible for all content you upload and ensuring it does not violate
                            any third-party rights.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Responsibilities</h2>
                        <p className="text-muted-foreground mb-4">
                            You are responsible for maintaining the confidentiality of your account credentials
                            and for all activities that occur under your account.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
                        <p className="text-muted-foreground mb-4">
                            You retain ownership of all content you create using our service.
                            UltraFolio retains ownership of the platform, templates, and underlying technology.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">5. Contact</h2>
                        <p className="text-muted-foreground">
                            For questions about these terms, contact us at{' '}
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
