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
        if (window.Paddle) {
            window.Paddle.Initialize({
                token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
            });
            setIsLoaded(true);
        }
    };

    const openCheckout = ({
        priceId,
        discountId,
        customerEmail,
        customerId,
        onSuccess,
        onClose,
    }: PaddleCheckoutProps) => {
        if (!window.Paddle) {
            console.error('Paddle not loaded');
            return;
        }

        const checkoutSettings: any = {
            items: [{ priceId, quantity: 1 }],
            settings: {
                displayMode: 'overlay',
                theme: 'dark',
                locale: 'en',
                successUrl: `${window.location.origin}/dashboard?success=true`,
            },
        };

        if (discountId) {
            checkoutSettings.discountId = discountId;
        }

        if (customerEmail) {
            checkoutSettings.customer = { email: customerEmail };
        }

        if (customerId) {
            checkoutSettings.customer = { id: customerId };
        }

        window.Paddle.Checkout.open(checkoutSettings);
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
                if (window.Paddle) {
                    window.Paddle.Initialize({
                        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                    });
                }
            }}
        />
    );
}
