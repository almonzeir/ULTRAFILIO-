'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import Header from '@/components/layout/header';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { Loader2, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { validateEmail, checkRateLimit } from '@/lib/validation';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['forgotPasswordPage'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.forgotPasswordPage);
    };
    fetchDictionary();
  }, [language]);


  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Rate limiting check - more strict for password reset
    if (!checkRateLimit('password-reset', 3, 300000)) {
      setError('Too many password reset attempts. Please wait 5 minutes and try again.');
      setLoading(false);
      return;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email');
      setLoading(false);
      return;
    }

    try {
      // Use sanitized email
      const sanitizedEmail = emailValidation.sanitizedValue || email.trim().toLowerCase();

      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) throw error;

      setMessage(dict?.successMessage || 'Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      // Don't expose internal error messages
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050A14]">
        <Loader2 className="h-8 w-8 animate-spin text-[#94a3b8]/50" />
      </div>
    );
  }

  const success = !!message;

  return (
    <div className="min-h-screen w-full liquid-silver-bg flex flex-col relative overflow-hidden">
      {/* Fixed Header */}
      <Header />

      {/* Main Content - Centered with proper spacing */}
      <main className="flex-1 flex items-center justify-center w-full px-4 pt-28 pb-12 relative z-10">

        {/* Ambient Silver Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-slate-400 opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-20"
        >
          {/* Auth Card - Liquid Silver Glass */}
          <div className="liquid-silver-glass">
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-colors ${success
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-white/10 border border-white/20'
                  }`}
              >
                {success ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                ) : (
                  <Mail className="w-7 h-7 text-white/80" />
                )}
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-white">
                {success ? 'Check your inbox' : dict.title}
              </h1>
              <p className="text-white/50 font-medium">
                {success ? (
                  `We've sent a password reset link to ${email}`
                ) : (
                  dict.description
                )}
              </p>
            </div>

            {/* Success Message (Optional extra visual, though header covers it) */}
            {message && (
              <Alert className="mb-6 bg-emerald-500/10 border-emerald-500/20">
                <AlertDescription className="font-medium text-center flex items-center justify-center gap-2 text-emerald-400">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                <p className="text-center">{error}</p>
              </div>
            )}

            {!success && (
              <form onSubmit={handlePasswordReset} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="ml-1 text-xs font-semibold uppercase tracking-widest text-[#94a3b8]/60">
                    {dict.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-12 rounded-xl input-teal placeholder:text-white/30"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl btn-primary-teal text-base font-semibold group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {dict.sendButton}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            )}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#94a3b8]/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f1012] px-4 py-1 text-white/30 font-semibold rounded-full border border-[#94a3b8]/10">
                  OR
                </span>
              </div>
            </div>

            <div className="text-center text-sm">
              <span className="text-white/40">{dict.rememberPassword}{' '}</span>
              <Link href="/login" className="font-semibold text-[#94a3b8] hover:text-[#94a3b8]/80 transition-colors">
                {dict.loginLink}
              </Link>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
