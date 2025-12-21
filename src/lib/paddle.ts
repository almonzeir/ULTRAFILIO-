// Paddle Integration for UltraFolio Pro Payments
// Documentation: https://developer.paddle.com/

/**
 * Paddle Client Token (for frontend checkout)
 */
export const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
export const PADDLE_ENVIRONMENT = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox'; // 'sandbox' or 'production'

/**
 * Paddle Price IDs for different plans
 * Replace these with your actual Paddle Price IDs after creating products
 */
export const PADDLE_PRICES = {
    pro_monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY || 'pri_XXXXXX', // Replace with your monthly price ID
    pro_yearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_YEARLY || 'pri_YYYYYY',   // Replace with your yearly price ID
    pro_lifetime: process.env.NEXT_PUBLIC_PADDLE_PRICE_LIFETIME || 'pri_ZZZZZZ', // Replace with your lifetime price ID
} as const;

/**
 * Initialize Paddle on the client side
 * Call this in your layout or app component
 */
export function initializePaddle(): Promise<void> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve();
            return;
        }

        // Check if already loaded
        if ((window as any).Paddle) {
            (window as any).Paddle.Environment.set(PADDLE_ENVIRONMENT);
            (window as any).Paddle.Initialize({
                token: PADDLE_CLIENT_TOKEN,
            });
            resolve();
            return;
        }

        // Load Paddle.js script
        const script = document.createElement('script');
        script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
        script.async = true;
        script.onload = () => {
            (window as any).Paddle.Environment.set(PADDLE_ENVIRONMENT);
            (window as any).Paddle.Initialize({
                token: PADDLE_CLIENT_TOKEN,
            });
            resolve();
        };
        document.head.appendChild(script);
    });
}

/**
 * Open Paddle checkout overlay
 */
export async function openPaddleCheckout(params: {
    priceId: string;
    userId: string;
    userEmail: string;
    userName?: string;
    successUrl?: string;
}): Promise<void> {
    if (typeof window === 'undefined' || !(window as any).Paddle) {
        throw new Error('Paddle not initialized');
    }

    await (window as any).Paddle.Checkout.open({
        items: [{ priceId: params.priceId, quantity: 1 }],
        customer: {
            email: params.userEmail,
        },
        customData: {
            user_id: params.userId,
            user_name: params.userName || '',
        },
        settings: {
            displayMode: 'overlay',
            theme: 'dark',
            locale: 'en',
            successUrl: params.successUrl || `${window.location.origin}/checkout/success`,
        },
    });
}

/**
 * Server-side: Verify Paddle webhook signature
 */
export async function verifyPaddleWebhook(
    payload: string,
    signature: string
): Promise<boolean> {
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || '';

    if (!webhookSecret) {
        console.warn('Paddle webhook secret not configured');
        return false;
    }

    // Paddle uses HMAC-SHA256 for webhook signatures
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(payload)
    );

    const computedSignature = Buffer.from(signatureBuffer).toString('hex');
    return computedSignature === signature;
}

/**
 * Paddle webhook event types
 */
export type PaddleWebhookEvent =
    | 'subscription.created'
    | 'subscription.updated'
    | 'subscription.canceled'
    | 'subscription.paused'
    | 'subscription.resumed'
    | 'subscription.activated'
    | 'transaction.completed'
    | 'transaction.payment_failed';

/**
 * Parse Paddle webhook payload
 */
export function parsePaddleWebhookPayload(payload: any): {
    eventType: PaddleWebhookEvent;
    subscriptionId?: string;
    customerId?: string;
    transactionId?: string;
    userId?: string;
    userEmail?: string;
    priceId?: string;
    status?: string;
    planType?: 'pro_monthly' | 'pro_yearly' | 'pro_lifetime';
} {
    const eventType = payload.event_type as PaddleWebhookEvent;
    const data = payload.data || {};
    const customData = data.custom_data || {};

    // Determine plan type from price ID
    let planType: 'pro_monthly' | 'pro_yearly' | 'pro_lifetime' | undefined;
    const priceId = data.items?.[0]?.price?.id;

    if (priceId === PADDLE_PRICES.pro_monthly) {
        planType = 'pro_monthly';
    } else if (priceId === PADDLE_PRICES.pro_yearly) {
        planType = 'pro_yearly';
    } else if (priceId === PADDLE_PRICES.pro_lifetime) {
        planType = 'pro_lifetime';
    }

    return {
        eventType,
        subscriptionId: data.id,
        customerId: data.customer_id,
        transactionId: data.transaction_id,
        userId: customData.user_id,
        userEmail: data.customer?.email || customData.email,
        priceId,
        status: data.status,
        planType,
    };
}

/**
 * Server-side: Get subscription details from Paddle API
 */
export async function getPaddleSubscription(subscriptionId: string): Promise<any> {
    const apiKey = process.env.PADDLE_API_KEY || '';
    const baseUrl = PADDLE_ENVIRONMENT === 'production'
        ? 'https://api.paddle.com'
        : 'https://sandbox-api.paddle.com';

    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to get subscription: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Server-side: Cancel a subscription
 */
export async function cancelPaddleSubscription(subscriptionId: string): Promise<any> {
    const apiKey = process.env.PADDLE_API_KEY || '';
    const baseUrl = PADDLE_ENVIRONMENT === 'production'
        ? 'https://api.paddle.com'
        : 'https://sandbox-api.paddle.com';

    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            effective_from: 'next_billing_period', // or 'immediately'
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.statusText}`);
    }

    return response.json();
}
