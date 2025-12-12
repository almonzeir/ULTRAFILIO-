// Plan definitions and feature gating logic

export type PlanType = 'free' | 'pro_monthly' | 'pro_lifetime';

export interface PlanDetails {
    id: PlanType;
    name: string;
    price: number;
    priceFirstMonth?: number; // For promotional pricing
    period: 'month' | 'lifetime' | 'free';
    features: string[];
    limits: {
        dailyGenerations: number; // -1 = unlimited
        canPublishProTemplates: boolean;
    };
}

export const PLANS: Record<PlanType, PlanDetails> = {
    free: {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'free',
        features: [
            '3 portfolio generations per day',
            '7 beautiful templates',
            'AI-powered content generation',
            'Live preview & editing',
            'Basic analytics',
        ],
        limits: {
            dailyGenerations: 3,
            canPublishProTemplates: false,
        },
    },
    pro_monthly: {
        id: 'pro_monthly',
        name: 'Pro Monthly',
        price: 5,
        priceFirstMonth: 3, // Special first month pricing
        period: 'month',
        features: [
            'Unlimited portfolio generations',
            'ALL 9 premium templates',
            'Aurora & Cyber 3D templates',
            'Priority AI processing',
            'Advanced analytics',
            'Custom domain support',
            'Remove UltraFolio branding',
            'Priority support',
        ],
        limits: {
            dailyGenerations: -1, // Unlimited
            canPublishProTemplates: true,
        },
    },
    pro_lifetime: {
        id: 'pro_lifetime',
        name: 'Pro Lifetime',
        price: 15,
        period: 'lifetime',
        features: [
            'Everything in Pro Monthly',
            'One-time payment, forever access',
            'All future templates included',
            'Lifetime updates',
            'VIP support',
            'Early access to new features',
        ],
        limits: {
            dailyGenerations: -1, // Unlimited
            canPublishProTemplates: true,
        },
    },
};

// Pro-only templates that free users can preview but not publish
export const PRO_TEMPLATES = ['aurora', 'cyber'] as const;

export function isProTemplate(templateId: string): boolean {
    return PRO_TEMPLATES.includes(templateId as any);
}

export function canUserPublishTemplate(userPlan: PlanType, templateId: string): boolean {
    if (!isProTemplate(templateId)) return true; // Free templates can always be published
    return PLANS[userPlan].limits.canPublishProTemplates;
}

export function getUserDailyLimit(userPlan: PlanType): number {
    return PLANS[userPlan].limits.dailyGenerations;
}

export function isPro(userPlan: PlanType): boolean {
    return userPlan === 'pro_monthly' || userPlan === 'pro_lifetime';
}
