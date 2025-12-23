'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import Header from '@/components/layout/header';
import { useLanguage } from '@/context/language-context';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/lib/dictionaries';
import { Loader2, ArrowRight, UserPlus, CheckCircle2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateEmail, validatePassword, validateDisplayName, checkRateLimit, sanitizeInput, getPasswordStrength } from '@/lib/validation';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const [dict, setDict] = useState<Dictionary['signupPage'] | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(language);
      setDict(dictionary.signupPage);
    };
    fetchDictionary();
  }, [language]);

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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Rate limiting check
    if (!checkRateLimit('signup-attempt', 3, 60000)) {
      setError('Too many signup attempts. Please wait a minute and try again.');
      return;
    }

    // Validate display name
    const nameValidation = validateDisplayName(displayName);
    if (!nameValidation.isValid) {
      setError(nameValidation.error || 'Invalid name');
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

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // Use sanitized values
      const sanitizedEmail = emailValidation.sanitizedValue || email.trim().toLowerCase();
      const sanitizedName = nameValidation.sanitizedValue || sanitizeInput(displayName.trim());

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            display_name: sanitizedName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please login instead.');
        } else {
          setError('An error occurred during signup. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation is required
        setSignupSuccess(true);
      } else if (data.session) {
        // User is automatically logged in (email confirmation disabled)
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user!.id,
            display_name: sanitizedName,
          });

        if (profileError) console.error('Profile creation error:', profileError);

        router.push('/create');
      }
    } catch (error: any) {
      // Don't expose internal error messages
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);

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
      setLoading(false);
    }
  };

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen liquid-silver-bg">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
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
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-slate-400 opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />

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
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-colors ${signupSuccess
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-white/10 border border-white/20'
                  }`}
              >
                {signupSuccess ? (
                  <Mail className="w-7 h-7 text-emerald-400" />
                ) : (
                  <UserPlus className="w-7 h-7 text-white/80" />
                )}
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-white">
                {signupSuccess ? 'Check Your Email!' : dict.title}
              </h1>
              <p className="text-white/50 font-medium">
                {signupSuccess
                  ? `We've sent a verification link to ${email}`
                  : dict.description
                }
              </p>
            </div>

            {/* Success State */}
            {signupSuccess ? (
              <div className="space-y-6">
                <Alert className="bg-emerald-500/10 border-emerald-500/20">
                  <AlertDescription className="text-emerald-400 font-medium text-center">
                    <CheckCircle2 className="w-5 h-5 inline-block mr-2" />
                    Account created successfully!
                  </AlertDescription>
                </Alert>

                <div className="text-center space-y-4">
                  <p className="text-white/60 text-sm">
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                  <p className="text-white/40 text-xs">
                    Didn't receive the email? Check your spam folder.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-[#94a3b8] font-semibold hover:text-[#94a3b8]/80 transition-colors"
                  >
                    Go to Login
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    <p className="text-center">{error}</p>
                    {error.includes('already registered') && (
                      <p className="text-center mt-2">
                        <Link href="/login" className="underline hover:text-red-300">
                          Click here to login
                        </Link>
                      </p>
                    )}
                  </div>
                )}

                <form onSubmit={handleEmailSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="display-name" className="ml-1 text-xs font-semibold uppercase tracking-widest text-[#94a3b8]/60">
                      {dict.displayName}
                    </Label>
                    <Input
                      id="display-name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={loading}
                      className="h-12 rounded-xl input-teal placeholder:text-white/30"
                    />
                  </div>

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
                      placeholder="Create a strong password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 rounded-xl input-teal placeholder:text-white/30"
                    />
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-2 pt-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${getPasswordStrength(password).score >= level
                                ? getPasswordStrength(password).score <= 2
                                  ? 'bg-red-500'
                                  : getPasswordStrength(password).score <= 3
                                    ? 'bg-yellow-500'
                                    : 'bg-emerald-500'
                                : 'bg-white/10'
                                }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${getPasswordStrength(password).score <= 2
                          ? 'text-red-400'
                          : getPasswordStrength(password).score <= 3
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                          }`}>
                          {getPasswordStrength(password).label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="ml-1 text-xs font-semibold uppercase tracking-widest text-[#94a3b8]/60">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 rounded-xl input-teal placeholder:text-white/30"
                    />
                    {/* Password Match Indicator */}
                    {confirmPassword && (
                      <p className={`text-xs font-medium ${password === confirmPassword ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                    {/* Password Requirements - Under Confirm Password */}
                    <div className="text-xs text-white/40 space-y-1 pt-2">
                      <p className={password.length >= 8 ? 'text-emerald-400' : ''}>
                        • At least 8 characters
                      </p>
                      <p className={/[A-Z]/.test(password) ? 'text-emerald-400' : ''}>
                        • One uppercase letter (A-Z)
                      </p>
                      <p className={/[a-z]/.test(password) ? 'text-emerald-400' : ''}>
                        • One lowercase letter (a-z)
                      </p>
                      <p className={/[0-9]/.test(password) ? 'text-emerald-400' : ''}>
                        • One number (0-9)
                      </p>
                      <p className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) ? 'text-emerald-400' : ''}>
                        • One special character (!@#$%...)
                      </p>
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
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {dict.createButton}
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
                  onClick={handleGoogleSignup}
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
                  <span className="text-white/40">{dict.hasAccount}{' '}</span>
                  <Link href="/login" className="font-semibold text-[#94a3b8] hover:text-[#94a3b8]/80 transition-colors">
                    {dict.loginLink}
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
