'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
    interface Window {
        Paddle: any;
    }
}

interface PaddleCheckoutProps {
    priceId: string;
    discountId?: string;
    customerEmail?: string;
    customerId?: string;
    customData?: any;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
}

export function usePaddle() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (window.Paddle) {
            setIsLoaded(true);
        }
    }, []);

    const initializePaddle = () => {
        const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (!window.Paddle || !token) return;

        // Detect sandbox based on token prefix
        if (token.startsWith('test_')) {
            window.Paddle.Environment.set('sandbox');
        }

        window.Paddle.Initialize({
            token,
            eventCallback: (event: any) => {
                console.log('Paddle Event:', event.name, event);
            }
        });
        setIsLoaded(true);
    };

    const openCheckout = ({
        priceId,
        discountId,
        customerEmail,
        customData,
        onSuccess,
        onClose,
    }: PaddleCheckoutProps) => {
        if (!window.Paddle) {
            console.error('Paddle not loaded');
            return;
        }

        const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

        // Re-initialize with environment and callbacks
        if (token?.startsWith('test_')) {
            window.Paddle.Environment.set('sandbox');
        }

        window.Paddle.Initialize({
            token,
            eventCallback: (event: any) => {
                if (event.name === 'checkout.completed') {
                    onSuccess?.(event.data);
                } else if (event.name === 'checkout.closed') {
                    onClose?.();
                }
            }
        });

        window.Paddle.Checkout.open({
            settings: {
                displayMode: 'overlay',
                theme: 'dark',
                locale: 'en',
                successUrl: `${window.location.origin}/dashboard?success=true`,
            },
            items: [{ priceId, quantity: 1 }],
            customer: customerEmail ? { email: customerEmail } : undefined,
            customData: customData || undefined,
            discountId: discountId || undefined,
        });
    };

    return {
        isLoaded,
        initializePaddle,
        openCheckout,
    };
}

export function PaddleScript() {
    return (
        <Script
            src="https://cdn.paddle.com/paddle/v2/paddle.js"
            onLoad={() => {
                const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
                if (window.Paddle && token) {
                    if (token.startsWith('test_')) {
                        window.Paddle.Environment.set('sandbox');
                    }
                    window.Paddle.Initialize({ token });
                }
            }}
        />
    );
}
