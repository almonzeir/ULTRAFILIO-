'use client';

import React, { useState, useEffect } from 'react';
import { Check, Copy, ExternalLink, Link2, Twitter, Linkedin, Facebook, Sparkles, Edit3, Globe, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    portfolioId: string;
    portfolioName?: string;
}

export function ShareDialog({ open, onOpenChange, portfolioId, portfolioName }: ShareDialogProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [customSlug, setCustomSlug] = useState('');
    const [savedSlug, setSavedSlug] = useState('');
    const [isEditingSlug, setIsEditingSlug] = useState(false);
    const [isSavingSlug, setIsSavingSlug] = useState(false);
    const [slugError, setSlugError] = useState('');

    // Get the base URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    // The public URL - use slug if available, otherwise ID
    const publicUrl = savedSlug
        ? `${baseUrl}/p/${savedSlug}`
        : `${baseUrl}/p/${portfolioId}`;

    // Fetch existing slug on open
    useEffect(() => {
        if (open && portfolioId) {
            fetchSlug();
        }
    }, [open, portfolioId]);

    const fetchSlug = async () => {
        const { data, error } = await supabase
            .from('portfolios')
            .select('slug')
            .eq('id', portfolioId)
            .single();

        if (data?.slug) {
            setSavedSlug(data.slug);
            setCustomSlug(data.slug);
        } else {
            // Generate default slug from portfolio name
            const defaultSlug = portfolioName
                ? portfolioName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                : '';
            setCustomSlug(defaultSlug);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        toast({ title: '✅ Copied!', description: 'Link copied to clipboard' });
        setTimeout(() => setCopied(false), 2000);
    };

    const validateSlug = (slug: string): boolean => {
        if (slug.length < 3) {
            setSlugError('Slug must be at least 3 characters');
            return false;
        }
        if (slug.length > 50) {
            setSlugError('Slug must be less than 50 characters');
            return false;
        }
        if (!/^[a-z0-9-]+$/.test(slug)) {
            setSlugError('Only lowercase letters, numbers, and hyphens allowed');
            return false;
        }
        if (slug.startsWith('-') || slug.endsWith('-')) {
            setSlugError('Slug cannot start or end with a hyphen');
            return false;
        }
        setSlugError('');
        return true;
    };

    const handleSaveSlug = async () => {
        const normalizedSlug = customSlug.toLowerCase().trim();

        if (!validateSlug(normalizedSlug)) return;

        setIsSavingSlug(true);
        try {
            // Check if slug is already taken
            const { data: existing } = await supabase
                .from('portfolios')
                .select('id')
                .eq('slug', normalizedSlug)
                .neq('id', portfolioId)
                .single();

            if (existing) {
                setSlugError('This URL is already taken');
                setIsSavingSlug(false);
                return;
            }

            // Save the slug
            const { error } = await supabase
                .from('portfolios')
                .update({ slug: normalizedSlug })
                .eq('id', portfolioId);

            if (error) {
                // If column doesn't exist, show friendly message
                if (error.code === '42703') {
                    toast({
                        variant: 'destructive',
                        title: 'Setup Required',
                        description: 'Please add a "slug" column to your portfolios table.'
                    });
                } else {
                    throw error;
                }
            } else {
                setSavedSlug(normalizedSlug);
                setIsEditingSlug(false);
                toast({ title: '✅ URL Saved!', description: 'Your custom URL is now active.' });
            }
        } catch (err: any) {
            console.error('Error saving slug:', err);
            setSlugError('Failed to save. Try again.');
        } finally {
            setIsSavingSlug(false);
        }
    };

    const shareOnTwitter = () => {
        const text = encodeURIComponent(`Check out my portfolio! 🚀`);
        const url = encodeURIComponent(publicUrl);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        const url = encodeURIComponent(publicUrl);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    const shareOnFacebook = () => {
        const url = encodeURIComponent(publicUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-gradient-to-b from-neutral-900 to-neutral-950 border-neutral-800 text-white p-0 overflow-hidden">

                {/* Celebration Header */}
                <div className="relative bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 px-6 pt-8 pb-6 border-b border-green-500/20">
                    {/* Animated sparkles */}
                    <motion.div
                        className="absolute top-3 right-6"
                        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Sparkles className="text-green-400 w-6 h-6" />
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Your Portfolio is Live! 🎉</h2>
                                <p className="text-sm text-green-300/80">Share it with the world</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="p-6 space-y-5">

                    {/* Main Link Card */}
                    <motion.div
                        className="bg-black/40 rounded-2xl p-4 border border-neutral-800/50"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Link2 className="w-3 h-3" />
                            Your Public Link
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-neutral-800/60 rounded-xl px-4 py-3 border border-neutral-700/50 overflow-hidden">
                                <span className="text-sm text-violet-300 font-medium truncate block">{publicUrl}</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCopy}
                                className={`p-3 rounded-xl font-semibold transition-all duration-300 ${copied
                                        ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                                        : 'bg-violet-600 hover:bg-violet-500 text-white'
                                    }`}
                            >
                                <AnimatePresence mode="wait">
                                    {copied ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Check className="w-5 h-5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="copy"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Copy className="w-5 h-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Custom URL Editor */}
                    <motion.div
                        className="bg-neutral-800/30 rounded-2xl p-4 border border-neutral-800/30"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                <Edit3 className="w-3 h-3" />
                                Custom URL
                            </label>
                            {!isEditingSlug && savedSlug && (
                                <button
                                    onClick={() => setIsEditingSlug(true)}
                                    className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {isEditingSlug || !savedSlug ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-1 bg-neutral-800/50 rounded-xl overflow-hidden border border-neutral-700/50">
                                    <span className="text-sm text-neutral-500 pl-3 whitespace-nowrap">{baseUrl}/p/</span>
                                    <Input
                                        value={customSlug}
                                        onChange={(e) => {
                                            setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                                            setSlugError('');
                                        }}
                                        placeholder="your-name"
                                        className="flex-1 bg-transparent border-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                                {slugError && (
                                    <p className="text-xs text-red-400 flex items-center gap-1">⚠️ {slugError}</p>
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleSaveSlug}
                                        disabled={isSavingSlug || !customSlug}
                                        className="bg-violet-600 hover:bg-violet-500 text-sm"
                                    >
                                        {isSavingSlug ? 'Saving...' : '✓ Save'}
                                    </Button>
                                    {savedSlug && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-neutral-400 hover:text-white"
                                            onClick={() => {
                                                setIsEditingSlug(false);
                                                setCustomSlug(savedSlug);
                                                setSlugError('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-violet-300 bg-violet-600/10 px-3 py-2 rounded-lg border border-violet-500/20">
                                {baseUrl}/p/<span className="font-bold text-violet-200">{savedSlug}</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Social Share */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Share2 className="w-3 h-3" />
                            Share On
                        </label>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={shareOnTwitter}
                                className="flex-1 p-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-all border border-[#1DA1F2]/20 flex items-center justify-center gap-2"
                            >
                                <Twitter className="w-5 h-5" />
                                <span className="text-sm font-medium hidden sm:inline">Twitter</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={shareOnLinkedIn}
                                className="flex-1 p-3 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] transition-all border border-[#0A66C2]/20 flex items-center justify-center gap-2"
                            >
                                <Linkedin className="w-5 h-5" />
                                <span className="text-sm font-medium hidden sm:inline">LinkedIn</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={shareOnFacebook}
                                className="flex-1 p-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition-all border border-[#1877F2]/20 flex items-center justify-center gap-2"
                            >
                                <Facebook className="w-5 h-5" />
                                <span className="text-sm font-medium hidden sm:inline">Facebook</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-800/50 bg-black/20">
                    <Button
                        variant="ghost"
                        className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.open(publicUrl, '_blank')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Visit Site
                    </motion.button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
