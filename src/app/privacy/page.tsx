import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata = {
    title: 'Privacy Policy - UltraFolio',
    description: 'Privacy Policy for UltraFolio portfolio builder',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#050A14]">
            <Header />
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto prose prose-invert prose-lg">
                    <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                    <p className="text-white/60 mb-8">Last updated: December 2024</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                        <p className="text-white/70 leading-relaxed">
                            UltraFolio ("we", "our", or "us") is committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                            when you use our portfolio builder service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                        <p className="text-white/70 leading-relaxed mb-4">We collect information you provide directly:</p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>Account information (email, name, password)</li>
                            <li>Resume/CV content you upload</li>
                            <li>Portfolio content you create</li>
                            <li>Payment information (processed securely by Paddle)</li>
                            <li>Communications with us</li>
                        </ul>
                        <p className="text-white/70 leading-relaxed mt-4">We automatically collect:</p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>Device and browser information</li>
                            <li>IP address and location data</li>
                            <li>Usage data and analytics</li>
                            <li>Cookies and similar technologies</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                        <p className="text-white/70 leading-relaxed">We use your information to:</p>
                        <ul className="list-disc list-inside text-white/70 space-y-2 mt-2">
                            <li>Provide and maintain the Service</li>
                            <li>Process your resume and generate portfolios using AI</li>
                            <li>Process payments and subscriptions</li>
                            <li>Send you updates and marketing communications (with consent)</li>
                            <li>Improve and personalize the Service</li>
                            <li>Respond to your inquiries and support requests</li>
                            <li>Detect and prevent fraud or abuse</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. AI Processing</h2>
                        <p className="text-white/70 leading-relaxed">
                            When you upload your resume/CV, we process it using AI services to extract information
                            and generate your portfolio. This processing is essential to provide our Service.
                            Your resume data is processed securely and is not used to train AI models without your explicit consent.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing</h2>
                        <p className="text-white/70 leading-relaxed">We may share your information with:</p>
                        <ul className="list-disc list-inside text-white/70 space-y-2 mt-2">
                            <li>Service providers (hosting, analytics, payment processing)</li>
                            <li>Legal authorities when required by law</li>
                            <li>Business partners with your consent</li>
                        </ul>
                        <p className="text-white/70 leading-relaxed mt-4">
                            We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
                        <p className="text-white/70 leading-relaxed">
                            We implement appropriate security measures to protect your data, including encryption,
                            secure servers, and access controls. However, no method of transmission over the Internet
                            is 100% secure.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
                        <p className="text-white/70 leading-relaxed">
                            We retain your data for as long as your account is active or as needed to provide the Service.
                            You can request deletion of your account and data at any time by contacting us.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
                        <p className="text-white/70 leading-relaxed">Depending on your location, you may have rights to:</p>
                        <ul className="list-disc list-inside text-white/70 space-y-2 mt-2">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Delete your data</li>
                            <li>Export your data</li>
                            <li>Object to or restrict processing</li>
                            <li>Withdraw consent</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Cookies</h2>
                        <p className="text-white/70 leading-relaxed">
                            We use cookies and similar technologies to enhance your experience, analyze usage,
                            and provide personalized content. You can control cookies through your browser settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
                        <p className="text-white/70 leading-relaxed">
                            Our Service is not intended for children under 13. We do not knowingly collect
                            personal information from children under 13.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
                        <p className="text-white/70 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes
                            via email or through the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
                        <p className="text-white/70 leading-relaxed">
                            For questions about this Privacy Policy, please contact us at: privacy@ultrafolio.ai
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
