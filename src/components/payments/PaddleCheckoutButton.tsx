'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { initializePaddle, openPaddleCheckout, PADDLE_PRICES } from '@/lib/paddle';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

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
    const [paddleReady, setPaddleReady] = useState(false);
    const { user, loading: userLoading } = useUser();
    const router = useRouter();

    // Initialize Paddle on mount
    useEffect(() => {
        initializePaddle().then(() => {
            setPaddleReady(true);
        });
    }, []);

    const handleCheckout = async () => {
        if (!user) {
            // Redirect to login if not authenticated
            router.push('/login?redirect=/pricing');
            return;
        }

        if (!paddleReady) {
            console.error('Paddle not ready');
            return;
        }

        setLoading(true);

        try {
            // Determine price ID
            const finalPriceId = priceId || PADDLE_PRICES[planType];

            await openPaddleCheckout({
                priceId: finalPriceId,
                userId: user.id,
                userEmail: user.email || '',
                userName: user.user_metadata?.display_name || user.email?.split('@')[0],
            });
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCheckout}
            disabled={loading || userLoading || !paddleReady}
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
