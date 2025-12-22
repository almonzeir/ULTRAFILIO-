'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Edit, ExternalLink, MoreVertical, LayoutTemplate, Sparkles, Globe, Eye } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { motion } from 'framer-motion';

interface Portfolio {
    id: string;
    title: string;
    subtitle: string;
    template_id: string;
    updated_at: string;
    is_public: boolean;
    slug: string | null;
    profile_photo_url: string | null;
}

export default function DashboardClient({ initialPortfolios }: { initialPortfolios: Portfolio[] }) {
    const router = useRouter();
    const [portfolios, setPortfolios] = React.useState<Portfolio[]>(initialPortfolios);
    const { toast } = useToast();
    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase
                .from('portfolios')
                .delete()
                .eq('id', deleteId);

            if (error) throw error;

            setPortfolios((prev) => prev.filter((p) => p.id !== deleteId));
            toast({
                title: 'Portfolio Deleted',
                description: 'Your portfolio has been permanently removed.',
            });
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not delete portfolio.',
            });
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden">
            {/* Living Background */}
            <div className="fixed inset-0 z-0">
                <MeshGradientBackground />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[150px]" />
                    <div className="absolute bottom-[20%] left-[10%] w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[150px]" />
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                            <span className="silver-text relative inline-block">
                                My Portfolios
                                <Sparkles className="absolute -top-6 -right-8 w-6 h-6 text-white/40 animate-pulse" />
                            </span>
                        </h1>
                        <p className="text-lg text-white/50 font-medium max-w-lg">
                            Manage your personal websites, track performance, and create stunning new designs.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Link href="/create">
                            <button className="liquid-silver-button group flex items-center gap-3 px-8 py-4 rounded-full font-semibold tracking-wide">
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                Create New Portfolio
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Content Grid */}
                {portfolios.length === 0 ? (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col items-center justify-center rounded-[2.5rem] liquid-silver-glass p-16 text-center border border-white/5"
                    >
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 ring-1 ring-white/10 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]">
                            <LayoutTemplate className="h-10 w-10 text-white/60" />
                        </div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-3">No portfolios yet</h2>
                        <p className="text-white/40 mb-10 max-w-md text-lg">
                            You haven't created any portfolios. Start building your personal brand today by creating your first website.
                        </p>
                        <Link href="/create">
                            <button className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all duration-300">
                                Start from Template
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    // Portfolio Grid
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {portfolios.map((portfolio, index) => (
                            <motion.div
                                key={portfolio.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative liquid-silver-glass rounded-[2rem] overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500"
                            >
                                {/* Card Preview Section */}
                                <div className="aspect-[16/10] w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden group">

                                    {/* Abstract Geometric BG for Preview */}
                                    <div className="absolute inset-0 opacity-30">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                                    </div>

                                    {/* Template Icon / Fallback */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <LayoutTemplate className="h-12 w-12 text-white/10" />
                                    </div>

                                    {/* User Avatar */}
                                    {portfolio.profile_photo_url && (
                                        <div className="absolute bottom-5 left-6 z-10 w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-white/20 to-transparent shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <img
                                                src={portfolio.profile_photo_url}
                                                alt="Profile"
                                                className="w-full h-full rounded-full object-cover bg-slate-950"
                                            />
                                        </div>
                                    )}

                                    {/* Template Badge */}
                                    <div className="absolute top-5 right-5 z-10">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-md border border-white/10 text-white/70 shadow-lg">
                                            <Sparkles className="w-3 h-3" />
                                            {portfolio.template_id}
                                        </span>
                                    </div>

                                    {/* Hover Actions Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                                        <Link href={`/edit/${portfolio.id}`}>
                                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform duration-300">
                                                <Edit className="w-4 h-4" /> Edit
                                            </button>
                                        </Link>
                                        <Link href={`/portfolio/${portfolio.id}`} target="_blank">
                                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white border border-white/20 font-semibold text-sm hover:bg-white/20 hover:scale-105 transition-all duration-300">
                                                <Eye className="w-4 h-4" /> View
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Card Info Section */}
                                <div className="p-6 relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className="text-xl font-bold text-white truncate group-hover:text-white/90 transition-colors">
                                                {portfolio.title || 'Untitled Portfolio'}
                                            </h3>
                                            <p className="text-xs text-white/40 mt-1 flex items-center gap-2">
                                                <span>Last edited {new Date(portfolio.updated_at).toLocaleDateString()}</span>
                                            </p>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors outline-none">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1a1b1e] border-white/10 text-white">
                                                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                                                    <Link href={`/edit/${portfolio.id}`}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                                                    <Link href={`/portfolio/${portfolio.id}`} target="_blank">
                                                        <ExternalLink className="mr-2 h-4 w-4" /> Preview
                                                    </Link>
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setDeleteId(portfolio.id); }} className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-[#1a1b1e] border-white/10 text-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Portfolio?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-white/60">
                                                                This action cannot be undone. This will permanently delete your portfolio "{portfolio.title}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel onClick={() => setDeleteId(null)} className="bg-transparent border-white/10 hover:bg-white/10 text-white">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${portfolio.is_public ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'}`} />
                                            <span className="text-xs font-medium text-white/50 tracking-wide uppercase">
                                                {portfolio.is_public ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        {portfolio.is_public && (
                                            <a
                                                href={`/portfolio/${portfolio.id}`}
                                                target="_blank"
                                                className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1 group/link"
                                            >
                                                <Globe className="w-3 h-3" />
                                                <span className="group-hover/link:underline">Visit Site</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
