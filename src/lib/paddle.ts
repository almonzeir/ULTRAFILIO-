// Paddle API Configuration (server-side only)
export const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
export const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;
export const PADDLE_API_URL = 'https://api.paddle.com';

// Price IDs - exported for client-side use
export const PADDLE_PRICES = {
    monthly: process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID || '',
    annual: process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID || '',
    pro_monthly: process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID || '',
    pro_lifetime: process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID || '',
};

export const PADDLE_DISCOUNT_ID = process.env.PADDLE_DISCOUNT_ID;

// Check if Paddle is loaded
function isPaddleLoaded(): boolean {
    return typeof window !== 'undefined' && !!(window as any).Paddle;
}

// Wait for Paddle to be ready
function waitForPaddle(maxWait = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
        if (isPaddleLoaded()) {
            resolve();
            return;
        }

        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (isPaddleLoaded()) {
                clearInterval(checkInterval);
                resolve();
            } else if (Date.now() - startTime > maxWait) {
                clearInterval(checkInterval);
                reject(new Error('Paddle script load timeout'));
            }
        }, 100);
    });
}

// Initialize Paddle (client-side only)
export async function initializePaddle(): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        await waitForPaddle();

        const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (token && (window as any).Paddle) {
            (window as any).Paddle.Initialize({ token });
        }
    } catch (error) {
        console.warn('Paddle initialization skipped:', error);
    }
}

// Open Paddle checkout (client-side only)
export async function openPaddleCheckout({
    priceId,
    userId,
    userEmail,
    userName,
    discountId,
}: {
    priceId: string;
    userId?: string;
    userEmail?: string;
    userName?: string;
    discountId?: string;
}): Promise<void> {
    if (typeof window === 'undefined') {
        throw new Error('Paddle only works in browser');
    }

    // Wait for Paddle to load
    await waitForPaddle();

    if (!(window as any).Paddle) {
        throw new Error('Paddle not available');
    }

    const checkoutSettings: any = {
        items: [{ priceId, quantity: 1 }],
        settings: {
            displayMode: 'overlay',
            theme: 'dark',
            locale: 'en',
            successUrl: `${window.location.origin}/dashboard?subscription=success`,
        },
        customData: {
            userId,
        },
    };

    if (userEmail) {
        checkoutSettings.customer = { email: userEmail };
    }

    const discountToUse = discountId || PADDLE_DISCOUNT_ID;
    if (discountToUse) {
        checkoutSettings.discountId = discountToUse;
    }

    (window as any).Paddle.Checkout.open(checkoutSettings);
}

// Server-side only functions below
// Only import 'crypto' on server
let crypto: typeof import('crypto') | null = null;
if (typeof window === 'undefined') {
    crypto = require('crypto');
}

// Verify Paddle webhook signature (server-side only)
export function verifyPaddleWebhook(
    rawBody: string,
    signature: string,
    ts: string
): boolean {
    if (!crypto) return false;

    const secret = PADDLE_WEBHOOK_SECRET;
    if (!secret) {
        console.error('PADDLE_WEBHOOK_SECRET not configured');
        return false;
    }

    const payload = `${ts}:${rawBody}`;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    const actualSignature = signature.replace('h1=', '');

    try {
        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(actualSignature)
        );
    } catch {
        return false;
    }
}

// Paddle API helper (server-side only)
export async function paddleApiRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    body?: object
) {
    const response = await fetch(`${PADDLE_API_URL}${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${PADDLE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Paddle API error: ${error}`);
    }

    return response.json();
}

// Get customer subscriptions
export async function getCustomerSubscriptions(customerId: string) {
    return paddleApiRequest(`/customers/${customerId}/subscriptions`);
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
    return paddleApiRequest(`/subscriptions/${subscriptionId}/cancel`, 'POST');
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
    return paddleApiRequest(`/subscriptions/${subscriptionId}`);
}
