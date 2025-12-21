import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'UltraFolio terms of service and user agreement',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#0a0612] text-white py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Terms of Service
                </h1>

                <div className="prose prose-invert prose-lg max-w-none space-y-6">
                    <p className="text-white/70">
                        <strong>Effective Date:</strong> December 2024
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
                        <p className="text-white/70">
                            By accessing and using UltraFolio ("the Service"), you agree to be bound by these
                            Terms of Service. If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
                        <p className="text-white/70">
                            UltraFolio is an AI-powered portfolio generator that transforms your CV/resume into
                            a professional portfolio website. The service includes:
                        </p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>AI-powered CV parsing and data extraction</li>
                            <li>Professional portfolio templates</li>
                            <li>Portfolio hosting on ultrafolio.app subdomains</li>
                            <li>Live editing and customization tools</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
                        <p className="text-white/70">
                            You are responsible for maintaining the confidentiality of your account credentials
                            and for all activities that occur under your account.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">4. Subscriptions and Payments</h2>
                        <p className="text-white/70">
                            Paid subscriptions are billed in advance on a monthly or annual basis. Payments are
                            processed securely through Paddle, our payment provider. See our{' '}
                            <a href="/refund-policy" className="text-violet-400 hover:underline">Refund Policy</a> for
                            cancellation and refund information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">5. User Content</h2>
                        <p className="text-white/70">
                            You retain ownership of all content you upload to UltraFolio. By using our service,
                            you grant us a license to process and display your content for the purpose of
                            providing the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">6. Prohibited Uses</h2>
                        <p className="text-white/70">
                            You may not use the service to:
                        </p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>Upload illegal, harmful, or offensive content</li>
                            <li>Impersonate others or misrepresent your identity</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">7. Limitation of Liability</h2>
                        <p className="text-white/70">
                            UltraFolio is provided "as is" without warranties of any kind. We are not liable
                            for any indirect, incidental, or consequential damages arising from your use of
                            the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">8. Changes to Terms</h2>
                        <p className="text-white/70">
                            We reserve the right to modify these terms at any time. Continued use of the
                            service after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">9. Contact</h2>
                        <p className="text-white/70">
                            For questions about these terms, contact us at{' '}
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
