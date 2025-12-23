'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { ArrowLeft, Mail, MessageSquare, Send, Globe, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { validateEmail, validateDisplayName, validateTextInput, checkRateLimit, sanitizeInput } from '@/lib/validation';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        // Rate limiting check
        if (!checkRateLimit('contact-form', 3, 60000)) {
            setStatus('error');
            setErrorMessage('Too many submissions. Please wait a minute and try again.');
            return;
        }

        // Validate first name
        const firstNameValidation = validateDisplayName(formData.firstName);
        if (!firstNameValidation.isValid) {
            setStatus('error');
            setErrorMessage(firstNameValidation.error || 'Invalid first name');
            return;
        }

        // Validate last name
        const lastNameValidation = validateDisplayName(formData.lastName);
        if (!lastNameValidation.isValid) {
            setStatus('error');
            setErrorMessage(lastNameValidation.error || 'Invalid last name');
            return;
        }

        // Validate email
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            setStatus('error');
            setErrorMessage(emailValidation.error || 'Invalid email');
            return;
        }

        // Validate message
        const messageValidation = validateTextInput(formData.message, 'Message', {
            required: true,
            minLength: 10,
            maxLength: 2000,
            allowHtml: false,
        });
        if (!messageValidation.isValid) {
            setStatus('error');
            setErrorMessage(messageValidation.error || 'Invalid message');
            return;
        }

        setStatus('loading');

        try {
            // Use sanitized values
            const sanitizedData = {
                firstName: firstNameValidation.sanitizedValue || sanitizeInput(formData.firstName),
                lastName: lastNameValidation.sanitizedValue || sanitizeInput(formData.lastName),
                email: emailValidation.sanitizedValue || formData.email.trim().toLowerCase(),
                message: messageValidation.sanitizedValue || sanitizeInput(formData.message),
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sanitizedData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        } catch (error) {
            setStatus('error');
            setErrorMessage('Failed to send message. Please try again.');
        }
    };

    return (
        <main className="relative min-h-screen bg-[#030014] text-white overflow-hidden selection:bg-white/20">
            <MeshGradientBackground />

            {/* Ambient Lighting */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider uppercase text-white/60 mb-8 backdrop-blur-sm">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Contact Us
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
                            Let's Start a
                        </span>
                        <br />
                        <span className="text-white/40">Conversation.</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
                        Have a question about UltraFolio? Our team is here to help you build the perfect portfolio.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
                    {/* Contact Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="relative group flex-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative h-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-md">
                                <h2 className="text-2xl font-bold text-white mb-2">Get in touch</h2>
                                <p className="text-white/50 mb-10">
                                    We'd love to hear from you. Fill out the form or reach us directly.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-white/80" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-white/40 font-medium uppercase tracking-wider mb-0.5">Email Support</div>
                                            <a href="mailto:support@ultrafolio.app" className="text-white hover:text-white/80 transition-colors">support@ultrafolio.app</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <Globe className="w-5 h-5 text-white/80" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-white/40 font-medium uppercase tracking-wider mb-0.5">Socials</div>
                                            <div className="flex gap-4">
                                                <a href="https://www.linkedin.com/company/ultrafolio/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">LinkedIn</a>
                                                <a href="https://instagram.com/ultrafolio.app" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">Instagram</a>
                                                <a href="https://x.com/ultrafolioapp" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">Twitter/X</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-md">
                            {status === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-white/50 mb-6">We'll get back to you as soon as possible.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="text-white/60 hover:text-white transition-colors text-sm underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="text-sm font-medium text-white/70 ml-1">First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="lastName" className="text-sm font-medium text-white/70 ml-1">Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-white/70 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium text-white/70 ml-1">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full liquid-button-primary group relative h-14 rounded-xl font-semibold text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="pt-8 border-t border-white/10 text-center"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}

