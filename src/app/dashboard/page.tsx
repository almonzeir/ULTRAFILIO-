import { createServerSupabaseClient } from '@/lib/supabase/server';
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

import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';

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

export default async function Dashboard() {
    const supabase = createServerSupabaseClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: portfolios, error } = await supabase
        .from('portfolios')
        .select('id, title, subtitle, template_id, updated_at, is_public, slug, profile_photo_url')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching portfolios:', error);
        // In a real app, you might want to show a more user-friendly error page
        return <div>Error loading portfolios.</div>;
    }

    return <DashboardClient initialPortfolios={portfolios || []} />;
}
