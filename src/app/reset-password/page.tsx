'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import Header from '@/components/layout/header';
import { Loader2, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { validatePassword, getPasswordStrength } from '@/lib/validation';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
    const router = useRouter();

    // Check if there's a valid session
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setIsValidSession(true);
            } else {
                setIsValidSession(false);
                setError('Invalid or expired password reset link. Please request a new one.');
            }
        };

        // Listen for auth state changes (for when code is exchanged)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsValidSession(true);
            } else if (event === 'SIGNED_IN' && session) {
                setIsValidSession(true);
            }
        });

        checkSession();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

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
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setSuccess(true);

            // Sign out and redirect to login after 3 seconds
            setTimeout(async () => {
                await supabase.auth.signOut();
                router.push('/login?message=' + encodeURIComponent('Password reset successful! Please login with your new password.'));
            }, 2000);
        } catch (error: any) {
            console.error('Password reset error:', error);
            setError(error.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Loading state while checking session
    if (isValidSession === null) {
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
                                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-colors ${success
                                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                                        : !isValidSession
                                            ? 'bg-red-500/20 border border-red-500/30'
                                            : 'bg-white/10 border border-white/20'
                                    }`}
                            >
                                {success ? (
                                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                ) : !isValidSession ? (
                                    <AlertCircle className="w-7 h-7 text-red-400" />
                                ) : (
                                    <Lock className="w-7 h-7 text-white/80" />
                                )}
                            </motion.div>
                            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-white">
                                {success ? 'Password Updated!' : !isValidSession ? 'Link Expired' : 'Reset Password'}
                            </h1>
                            <p className="text-white/50 font-medium">
                                {success
                                    ? 'Your password has been successfully reset.'
                                    : !isValidSession
                                        ? 'This reset link is no longer valid.'
                                        : 'Enter your new password below.'
                                }
                            </p>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <Alert className="mb-6 bg-emerald-500/10 border-emerald-500/20">
                                <AlertDescription className="font-medium text-center flex items-center justify-center gap-2 text-emerald-400">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Redirecting to login...
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                                <p className="text-center">{error}</p>
                            </div>
                        )}

                        {/* Form - Only show if valid session and not success */}
                        {isValidSession && !success && (
                            <form onSubmit={handlePasswordReset} className="space-y-5">
                                {/* New Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="ml-1 text-xs font-semibold uppercase tracking-widest text-[#94a3b8]/60">
                                        New Password
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

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="ml-1 text-xs font-semibold uppercase tracking-widest text-[#94a3b8]/60">
                                        Confirm New Password
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
                                    {/* Password Requirements */}
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
                                            Resetting password...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Reset Password
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* Invalid link - Show request new link button */}
                        {!isValidSession && (
                            <div className="text-center">
                                <Link href="/forgot-password">
                                    <Button className="w-full h-12 rounded-xl btn-primary-teal text-base font-semibold group">
                                        <span className="flex items-center gap-2">
                                            Request New Reset Link
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Back to Login Link */}
                        <div className="mt-8 text-center text-sm">
                            <span className="text-white/40">Remember your password?{' '}</span>
                            <Link href="/login" className="font-semibold text-[#94a3b8] hover:text-[#94a3b8]/80 transition-colors">
                                Back to Login
                            </Link>
                        </div>

                    </div>
                </motion.div>
            </main>
        </div>
    );
}
