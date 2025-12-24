'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import Header from '@/components/layout/header';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { Loader2, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { validateEmail, validatePassword, checkRateLimit, sanitizeInput } from '@/lib/validation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['loginPage'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.loginPage);
    };
    fetchDictionary();
  }, [language]);

  useEffect(() => {
    const verificationMessage = searchParams.get('message');
    if (verificationMessage) {
      setMessage(verificationMessage);
    }
  }, [searchParams]);

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/create');
      }
    };
    checkSession();
  }, [router]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/create');
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Rate limiting check
    if (!checkRateLimit('login-attempt', 5, 60000)) {
      setError('Too many login attempts. Please wait a minute and try again.');
      return;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'Invalid password');
      return;
    }

    setLoading(true);

    try {
      // Use sanitized email
      const sanitizedEmail = emailValidation.sanitizedValue || email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email before logging in. Check your inbox for a verification link.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError('An error occurred during login. Please try again.');
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        // Redirect immediately
        router.push('/create');
        router.refresh();
      }
    } catch (error: any) {
      // Don't expose internal error messages
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    setMessage('Redirecting to Google...');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      setMessage(null);
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
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-colors ${loginSuccess
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-white/10 border border-white/20'
                  }`}
              >
                {loginSuccess ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                ) : (
                  <KeyRound className="w-7 h-7 text-white/80" />
                )}
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-white">
                {loginSuccess ? 'Welcome Back!' : dict.title}
              </h1>
              <p className="text-white/50 font-medium">
                {loginSuccess ? 'Redirecting to your dashboard...' : dict.description}
              </p>
            </div>

            {/* Success Message */}
            {message && (
              <Alert className={`mb-6 ${loginSuccess ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-[#94a3b8]/10 border-[#94a3b8]/20'}`}>
                <AlertDescription className={`font-medium text-center flex items-center justify-center gap-2 ${loginSuccess ? 'text-emerald-400' : 'text-[#94a3b8]'}`}>
                  {loginSuccess && <Loader2 className="w-4 h-4 animate-spin" />}
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                <p className="text-center">{error}</p>
                {error.includes('verify your email') && (
                  <p className="text-center mt-2 text-red-400/70 text-xs">
                    Didn't receive the email? Check your spam folder or try signing up again.
                  </p>
                )}
              </div>
            )}

            {!loginSuccess && (
              <>
                <form onSubmit={handleEmailLogin} className="space-y-5">
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

                  <div className="space-y-2">
                    <Label htmlFor="password" className="ml-1 text-xs font-semibold uppercase tracking-widest text-[#94a3b8]/60">
                      {dict.password}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 rounded-xl input-teal"
                    />
                    <div className="flex justify-end pt-1">
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-white/50 hover:text-[#94a3b8] transition-colors"
                      >
                        {dict.forgotPassword}
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl btn-primary-teal text-base font-semibold group"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {dict.loginButton}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#94a3b8]/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0f1012] px-4 py-1 text-white/30 font-semibold rounded-full border border-[#94a3b8]/10">
                      {dict.orContinueWith}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-white/5 border-[#94a3b8]/15 hover:bg-white/10 hover:border-[#94a3b8]/30 text-white font-semibold transition-all flex items-center gap-3"
                >
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {dict.googleButton}
                </Button>

                <div className="mt-8 text-center text-sm">
                  <span className="text-white/40">{dict.noAccount}{' '}</span>
                  <Link href="/signup" className="font-semibold text-[#94a3b8] hover:text-[#94a3b8]/80 transition-colors">
                    {dict.signupLink}
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
