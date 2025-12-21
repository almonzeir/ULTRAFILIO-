import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'UltraFolio privacy policy and data handling practices',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#0a0612] text-white py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>

                <div className="prose prose-invert prose-lg max-w-none space-y-6">
                    <p className="text-white/70">
                        <strong>Effective Date:</strong> December 2024
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
                        <p className="text-white/70">
                            We collect information you provide directly to us, including:
                        </p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>Account information (email, name)</li>
                            <li>CV/resume content you upload</li>
                            <li>Portfolio customization preferences</li>
                            <li>Payment information (processed securely by Paddle)</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
                        <p className="text-white/70">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>Generate and host your portfolio</li>
                            <li>Process payments and manage subscriptions</li>
                            <li>Send important service updates</li>
                            <li>Improve our AI and services</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">3. Data Storage and Security</h2>
                        <p className="text-white/70">
                            Your data is stored securely using industry-standard encryption. We use Supabase
                            for data storage and implement appropriate security measures to protect your information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">4. Third-Party Services</h2>
                        <p className="text-white/70">
                            We use the following third-party services:
                        </p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li><strong>Paddle</strong> - Payment processing</li>
                            <li><strong>Supabase</strong> - Database and authentication</li>
                            <li><strong>Google AI (Gemini)</strong> - CV parsing and content generation</li>
                            <li><strong>Vercel</strong> - Hosting</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">5. Your Rights</h2>
                        <p className="text-white/70">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>Access your personal data</li>
                            <li>Request deletion of your data</li>
                            <li>Export your portfolio data</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">6. Cookies</h2>
                        <p className="text-white/70">
                            We use essential cookies for authentication and session management. We do not
                            use tracking cookies for advertising purposes.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">7. Contact Us</h2>
                        <p className="text-white/70">
                            For privacy-related questions, contact us at{' '}
                            <a href="mailto:support@ultrafolio.app" className="text-violet-400 hover:underline">
                                support@ultrafolio.app
                            </a>
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                    <a href="/" className="text-violet-400 hover:underline">
                        ← Back to Home
                    </a>
                </div>
            </div>
        </main>
    );
}
