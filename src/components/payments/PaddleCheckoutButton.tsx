'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { usePaddle } from '@/hooks/use-paddle';

interface PaddleCheckoutButtonProps {
    priceId?: string;
    planType?: 'pro_monthly' | 'pro_yearly' | 'pro_lifetime';
    buttonText?: string;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
}

export function PaddleCheckoutButton({
    priceId,
    planType = 'pro_monthly',
    buttonText = 'Upgrade to Pro',
    className = '',
    variant = 'default',
    size = 'default',
}: PaddleCheckoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const { openCheckout, isLoaded } = usePaddle();

    const handleCheckout = async () => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }

        setLoading(true);

        try {
            const finalPriceId = priceId || (planType === 'pro_lifetime'
                ? process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID
                : process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID);

            if (!finalPriceId) {
                console.error('Price ID missing');
                setLoading(false);
                return;
            }

            openCheckout({
                priceId: finalPriceId,
                customerEmail: user.email || '',
                customData: { userId: user.id },
                onSuccess: () => {
                    router.push('/dashboard?success=true');
                },
                onClose: () => setLoading(false)
            });
        } catch (error) {
            console.error('Checkout error:', error);
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCheckout}
            disabled={loading || userLoading || !isLoaded}
            variant={variant}
            size={size}
            className={className}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Opening checkout...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {buttonText}
                </>
            )}
        </Button>
    );
}
