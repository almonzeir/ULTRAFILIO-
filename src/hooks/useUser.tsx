'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isPro, setIsPro] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('is_pro')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setIsPro(data.is_pro);
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    };

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setUser(session.user);
            await fetchUserProfile(session.user.id);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchUserProfile(currentUser.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchUserProfile(currentUser.id);
            } else {
                setIsPro(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, isPro, loading, supabase, refreshUser };
}
