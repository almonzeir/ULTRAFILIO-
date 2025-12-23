// LemonSqueezy Integration for UltraFolio Pro Payments
// Documentation: https://docs.lemonsqueezy.com/api

const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

/**
 * LemonSqueezy API client for server-side operations
 */
export class LemonSqueezy {
    private apiKey: string;
    private storeId: string;

    constructor() {
        this.apiKey = process.env.LEMONSQUEEZY_API_KEY || '';
        this.storeId = process.env.LEMONSQUEEZY_STORE_ID || '';

        if (!this.apiKey) {
            console.warn('LemonSqueezy API key not configured');
        }
    }

    /**
     * Make authenticated request to LemonSqueezy API
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const response = await fetch(`${LEMONSQUEEZY_API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(`LemonSqueezy API Error: ${response.status} - ${JSON.stringify(error)}`);
        }

        return response.json();
    }

    /**
     * Create a checkout session for a product variant
     * This returns a URL to redirect the user to
     */
    async createCheckout(params: {
        variantId: string;
        userId: string;
        userEmail: string;
        userName?: string;
        customData?: Record<string, string>;
    }): Promise<{ checkoutUrl: string; checkoutId: string }> {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL
            || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9003');

        const response = await this.request<any>('/checkouts', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    type: 'checkouts',
                    attributes: {
                        checkout_data: {
                            email: params.userEmail,
                            name: params.userName,
                            custom: {
                                user_id: params.userId,
                                ...params.customData,
                            },
                        },
                        product_options: {
                            redirect_url: `${baseUrl}/checkout/success`,
                            receipt_button_text: 'Go to UltraFolio',
                            receipt_link_url: `${baseUrl}/create`,
                        },
                    },
                    relationships: {
                        store: {
                            data: {
                                type: 'stores',
                                id: this.storeId,
                            },
                        },
                        variant: {
                            data: {
                                type: 'variants',
                                id: params.variantId,
                            },
                        },
                    },
                },
            }),
        });

        return {
            checkoutUrl: response.data.attributes.url,
            checkoutId: response.data.id,
        };
    }

    /**
     * Get subscription details by ID
     */
    async getSubscription(subscriptionId: string): Promise<any> {
        return this.request(`/subscriptions/${subscriptionId}`);
    }

    /**
     * Cancel a subscription
     */
    async cancelSubscription(subscriptionId: string): Promise<any> {
        return this.request(`/subscriptions/${subscriptionId}`, {
            method: 'DELETE',
        });
    }

    /**
     * Get customer by email
     */
    async getCustomerByEmail(email: string): Promise<any> {
        return this.request(`/customers?filter[email]=${encodeURIComponent(email)}`);
    }
}

// Singleton instance
export const lemonSqueezy = new LemonSqueezy();

/**
 * Variant IDs for different plans
 */
export const LEMONSQUEEZY_VARIANTS = {
    pro_monthly: 'cb97e4f6-b3cd-4f75-ae11-75eab6155eeb',
    pro_lifetime: 'd7d38afa-79e6-4ad9-8fdf-9ce2f04f76ee',
} as const;

/**
 * Verify webhook signature from LemonSqueezy
 */
export async function verifyWebhookSignature(
    payload: string,
    signature: string
): Promise<boolean> {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

    if (!secret) {
        console.warn('LemonSqueezy webhook secret not configured');
        return false;
    }

    // LemonSqueezy uses HMAC-SHA256 for webhook signatures
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
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
 * Webhook event types from LemonSqueezy
 */
export type LemonSqueezyWebhookEvent =
    | 'order_created'
    | 'order_refunded'
    | 'subscription_created'
    | 'subscription_updated'
    | 'subscription_cancelled'
    | 'subscription_resumed'
    | 'subscription_expired'
    | 'subscription_paused'
    | 'subscription_unpaused'
    | 'subscription_payment_success'
    | 'subscription_payment_failed'
    | 'subscription_payment_recovered';

/**
 * Parse webhook payload to extract relevant data
 */
export function parseWebhookPayload(payload: any): {
    eventName: LemonSqueezyWebhookEvent;
    orderId?: string;
    subscriptionId?: string;
    customerId?: string;
    userId?: string;
    userEmail?: string;
    planType?: 'pro_monthly' | 'pro_lifetime';
    variantId?: string;
    status?: string;
} {
    const eventName = payload.meta?.event_name as LemonSqueezyWebhookEvent;
    const data = payload.data?.attributes || {};
    const customData = data.custom_data || payload.meta?.custom_data || {};

    return {
        eventName,
        orderId: payload.data?.id,
        subscriptionId: data.subscription_id?.toString(),
        customerId: data.customer_id?.toString(),
        userId: customData.user_id,
        userEmail: data.user_email || customData.email,
        variantId: data.variant_id?.toString() || data.first_order_item?.variant_id?.toString(),
        status: data.status,
        planType: determinePlanType(data.variant_id?.toString() || data.first_order_item?.variant_id?.toString()),
    };
}

/**
 * Determine plan type from variant ID
 */
function determinePlanType(variantId?: string): 'pro_monthly' | 'pro_lifetime' | undefined {
    if (!variantId) return undefined;

    if (variantId === LEMONSQUEEZY_VARIANTS.pro_monthly) {
        return 'pro_monthly';
    }
    if (variantId === LEMONSQUEEZY_VARIANTS.pro_lifetime) {
        return 'pro_lifetime';
    }

    return undefined;
}
