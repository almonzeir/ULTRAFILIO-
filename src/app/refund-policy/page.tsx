import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Refund Policy',
    description: 'UltraFolio refund and cancellation policy',
};

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-[#0a0612] text-white py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Refund Policy
                </h1>

                <div className="prose prose-invert prose-lg max-w-none space-y-6">
                    <p className="text-white/70">
                        <strong>Effective Date:</strong> December 2024
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">30-Day Money-Back Guarantee</h2>
                        <p className="text-white/70">
                            We offer a <strong>30-day money-back guarantee</strong> on all paid subscriptions.
                            If you're not satisfied with UltraFolio for any reason, you can request a full refund
                            within 30 days of your initial purchase.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Free Trial</h2>
                        <p className="text-white/70">
                            Our Annual plan includes a <strong>30-day free trial</strong>. You won't be charged
                            until the trial period ends. You can cancel anytime during the trial at no cost.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">How to Request a Refund</h2>
                        <p className="text-white/70">
                            To request a refund, please contact us at:
                        </p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>Email: <a href="mailto:support@ultrafolio.app" className="text-violet-400 hover:underline">support@ultrafolio.app</a></li>
                            <li>Include your account email and reason for refund</li>
                        </ul>
                        <p className="text-white/70">
                            Refunds are typically processed within <strong>5-10 business days</strong>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Subscription Cancellation</h2>
                        <p className="text-white/70">
                            You can cancel your subscription at any time from your dashboard. Upon cancellation:
                        </p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>You'll retain access to Pro features until the end of your billing period</li>
                            <li>Your portfolios will remain accessible but limited to Free plan features</li>
                            <li>No further charges will be made</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Exceptions</h2>
                        <p className="text-white/70">
                            Refunds may not be granted in cases of:
                        </p>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                            <li>Violation of our Terms of Service</li>
                            <li>Fraudulent activity</li>
                            <li>Requests made after the 30-day period</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
                        <p className="text-white/70">
                            If you have any questions about our refund policy, please contact us at{' '}
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
