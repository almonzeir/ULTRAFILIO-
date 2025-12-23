// Paddle API Configuration (server-side only)
export const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
export const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;
export const PADDLE_API_URL = 'https://api.paddle.com';

// Price IDs - exported for server-side or configuration use
export const PADDLE_PRICES = {
    pro_monthly: process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID || '',
    pro_annual: process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID || '',
};

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
