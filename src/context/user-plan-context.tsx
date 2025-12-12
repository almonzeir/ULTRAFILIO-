'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PlanType, PLANS, isPro, canUserPublishTemplate, getUserDailyLimit } from '@/lib/plans';

interface UserPlanContextType {
    // User's current plan
    plan: PlanType;
    isPro: boolean;
    isLoading: boolean;

    // Generation limits
    dailyGenerationsUsed: number;
    dailyLimit: number;
    canGenerate: boolean;

    // Template access
    canPublishTemplate: (templateId: string) => boolean;

    // Actions
    incrementGenerationCount: () => Promise<void>;
    refreshPlanStatus: () => Promise<void>;

    // Subscription info
    subscriptionEndDate: Date | null;
    isFirstMonth: boolean;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined);

export function UserPlanProvider({ children }: { children: React.ReactNode }) {
    const [plan, setPlan] = useState<PlanType>('free');
    const [isLoading, setIsLoading] = useState(true);
    const [dailyGenerationsUsed, setDailyGenerationsUsed] = useState(0);
    const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date | null>(null);
    const [isFirstMonth, setIsFirstMonth] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const dailyLimit = getUserDailyLimit(plan);
    const canGenerate = dailyLimit === -1 || dailyGenerationsUsed < dailyLimit;

    // Fetch user's plan and usage
    const refreshPlanStatus = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setPlan('free');
                setIsLoading(false);
                return;
            }

            setUserId(user.id);

            // Get user's subscription status
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .single();

            if (subscription) {
                setPlan(subscription.plan_type as PlanType);
                setSubscriptionEndDate(subscription.end_date ? new Date(subscription.end_date) : null);
                setIsFirstMonth(subscription.is_first_month || false);
            } else {
                setPlan('free');
            }

            // Get today's generation count
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const { data: usage } = await supabase
                .from('daily_usage')
                .select('generation_count')
                .eq('user_id', user.id)
                .eq('date', today)
                .single();

            setDailyGenerationsUsed(usage?.generation_count || 0);
        } catch (error) {
            console.error('Error fetching plan status:', error);
            setPlan('free');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Increment generation count
    const incrementGenerationCount = useCallback(async () => {
        if (!userId) return;

        const today = new Date().toISOString().split('T')[0];

        try {
            // Upsert the daily usage record
            const { error } = await supabase
                .from('daily_usage')
                .upsert({
                    user_id: userId,
                    date: today,
                    generation_count: dailyGenerationsUsed + 1,
                }, {
                    onConflict: 'user_id,date',
                });

            if (!error) {
                setDailyGenerationsUsed(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error incrementing generation count:', error);
        }
    }, [userId, dailyGenerationsUsed]);

    // Check if user can publish a specific template
    const canPublishTemplateHandler = useCallback((templateId: string): boolean => {
        return canUserPublishTemplate(plan, templateId);
    }, [plan]);

    // Initial load
    useEffect(() => {
        refreshPlanStatus();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            refreshPlanStatus();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [refreshPlanStatus]);

    const value: UserPlanContextType = {
        plan,
        isPro: isPro(plan),
        isLoading,
        dailyGenerationsUsed,
        dailyLimit,
        canGenerate,
        canPublishTemplate: canPublishTemplateHandler,
        incrementGenerationCount,
        refreshPlanStatus,
        subscriptionEndDate,
        isFirstMonth,
    };

    return (
        <UserPlanContext.Provider value={value}>
            {children}
        </UserPlanContext.Provider>
    );
}

export function useUserPlan() {
    const context = useContext(UserPlanContext);
    if (!context) {
        throw new Error('useUserPlan must be used within a UserPlanProvider');
    }
    return context;
}

// Hook for quick access to pro status
export function useIsPro() {
    const { isPro, isLoading } = useUserPlan();
    return { isPro, isLoading };
}

// Hook for generation limits
export function useGenerationLimit() {
    const { canGenerate, dailyGenerationsUsed, dailyLimit, incrementGenerationCount } = useUserPlan();
    return { canGenerate, used: dailyGenerationsUsed, limit: dailyLimit, increment: incrementGenerationCount };
}
