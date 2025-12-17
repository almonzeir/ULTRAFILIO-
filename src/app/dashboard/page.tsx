'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Edit, ExternalLink, MoreVertical, LayoutTemplate } from 'lucide-react';
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

export default function Dashboard() {
    const { user, loading: authLoading } = useUser();
    const router = useRouter();
    const [portfolios, setPortfolios] = React.useState<Portfolio[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();
    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchPortfolios = React.useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('portfolios')
                .select('id, title, subtitle, template_id, updated_at, is_public, slug, profile_photo_url')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setPortfolios(data || []);
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load your portfolios.',
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    React.useEffect(() => {
        fetchPortfolios();
    }, [fetchPortfolios]);

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

    if (authLoading || (loading && !portfolios.length)) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Portfolios</h1>
                    <p className="text-muted-foreground">
                        Manage your portfolios, edit content, or create new ones.
                    </p>
                </div>
                <Button asChild size="lg">
                    <Link href="/create">
                        <Plus className="mr-2 h-4 w-4" /> Create New Portfolio
                    </Link>
                </Button>
            </div>

            {portfolios.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 md:p-16 text-center animate-in fade-in-50">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <LayoutTemplate className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No portfolios yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        You haven't created any portfolios. Start building your personal brand today by creating your first portfolio.
                    </p>
                    <Button asChild>
                        <Link href="/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Portfolio
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {portfolios.map((portfolio) => (
                        <Card key={portfolio.id} className="group overflow-hidden transition-all hover:shadow-md">
                            <div className="aspect-video w-full bg-muted relative overflow-hidden">
                                {/* Visual Placeholder for Template Preview */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                                    <LayoutTemplate className="h-10 w-10 text-primary/20" />
                                </div>
                                {/* TODO: Add actual screenshot if available */}
                                {portfolio.profile_photo_url && (
                                    <img
                                        src={portfolio.profile_photo_url}
                                        alt="Profile"
                                        className="absolute bottom-4 right-4 h-12 w-12 rounded-full border-2 border-background object-cover shadow-sm"
                                    />
                                )}

                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button asChild variant="secondary" size="sm">
                                        <Link href={`/edit/${portfolio.id}`}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </Link>
                                    </Button>
                                    <Button asChild variant="secondary" size="sm">
                                        <Link href={`/portfolio/${portfolio.id}`} target="_blank">
                                            <ExternalLink className="mr-2 h-4 w-4" /> View
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <CardTitle className="truncate text-lg">{portfolio.title || 'Untitled Portfolio'}</CardTitle>
                                <p className="text-xs text-muted-foreground truncate">
                                    Template: <span className="capitalize">{portfolio.template_id}</span> • Edited {new Date(portfolio.updated_at).toLocaleDateString()}
                                </p>
                            </CardHeader>

                            <CardFooter className="flex justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex h-2 w-2 rounded-full ${portfolio.is_public ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <span className="text-xs text-muted-foreground">{portfolio.is_public ? 'Published' : 'Draft'}</span>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                            <span className="sr-only">Menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/edit/${portfolio.id}`}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/portfolio/${portfolio.id}`} target="_blank">
                                                <ExternalLink className="mr-2 h-4 w-4" /> Preview
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuTrigger asChild>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setDeleteId(portfolio.id); }}>
                                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                        <span className="text-destructive">Delete</span>
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your portfolio "{portfolio.title}".
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
