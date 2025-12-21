import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata = {
    title: 'Terms of Service - UltraFolio',
    description: 'Terms of Service for UltraFolio portfolio builder',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050A14]">
            <Header />
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto prose prose-invert prose-lg">
                    <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
                    <p className="text-white/60 mb-8">Last updated: December 2024</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-white/70 leading-relaxed">
                            By accessing and using UltraFolio ("Service"), you accept and agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p className="text-white/70 leading-relaxed">
                            UltraFolio is a web application that allows users to create professional portfolio websites
                            from their resumes/CVs using AI technology. We offer both free and paid subscription plans.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                        <p className="text-white/70 leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account credentials.
                            You agree to notify us immediately of any unauthorized use of your account.
                            You must provide accurate and complete information when creating an account.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription & Payments</h2>
                        <p className="text-white/70 leading-relaxed">
                            Paid subscriptions are billed in advance on a monthly or one-time basis depending on the plan selected.
                            All payments are processed securely through Paddle, our payment provider.
                            Prices are subject to change with reasonable notice.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Refund Policy</h2>
                        <p className="text-white/70 leading-relaxed">
                            We offer a 14-day money-back guarantee for all paid plans. If you are not satisfied with our Service,
                            you may request a full refund within 14 days of your purchase. To request a refund,
                            please contact us at support@ultrafolio.ai. Refund requests after 14 days will be considered on a case-by-case basis.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">6. User Content</h2>
                        <p className="text-white/70 leading-relaxed">
                            You retain ownership of all content you upload to UltraFolio. By uploading content,
                            you grant us a license to use, store, and process your content solely for the purpose of providing the Service.
                            You are solely responsible for the content you upload and must ensure it does not violate any laws or third-party rights.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Prohibited Uses</h2>
                        <p className="text-white/70 leading-relaxed">
                            You agree not to use the Service to: upload illegal, harmful, or offensive content;
                            impersonate others; distribute malware; violate intellectual property rights;
                            or engage in any activity that disrupts or interferes with the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Termination</h2>
                        <p className="text-white/70 leading-relaxed">
                            We may terminate or suspend your account at any time for violations of these terms.
                            You may cancel your account at any time through your account settings.
                            Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                        <p className="text-white/70 leading-relaxed">
                            UltraFolio is provided "as is" without warranties of any kind. We shall not be liable for any
                            indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
                        <p className="text-white/70 leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify users of significant changes
                            via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Contact</h2>
                        <p className="text-white/70 leading-relaxed">
                            For questions about these Terms of Service, please contact us at: support@ultrafolio.ai
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
