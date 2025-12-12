import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature, parseWebhookPayload } from '@/lib/lemonsqueezy';

// Create Supabase admin client for server-side operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-signature') || '';

        // Verify webhook signature
        const isValid = await verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const webhookData = parseWebhookPayload(payload);

        console.log('LemonSqueezy webhook received:', webhookData.eventName, webhookData);

        // Handle different webhook events
        switch (webhookData.eventName) {
            case 'order_created':
                await handleOrderCreated(webhookData);
                break;

            case 'subscription_created':
                await handleSubscriptionCreated(webhookData);
                break;

            case 'subscription_updated':
                await handleSubscriptionUpdated(webhookData);
                break;

            case 'subscription_cancelled':
            case 'subscription_expired':
                await handleSubscriptionEnded(webhookData);
                break;

            case 'subscription_payment_success':
                await handlePaymentSuccess(webhookData);
                break;

            case 'subscription_payment_failed':
                await handlePaymentFailed(webhookData);
                break;

            default:
                console.log('Unhandled webhook event:', webhookData.eventName);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

/**
 * Handle one-time order (lifetime purchase)
 */
async function handleOrderCreated(data: ReturnType<typeof parseWebhookPayload>) {
    if (!data.userId) {
        console.error('Order created but no user_id in custom data');
        return;
    }

    // For lifetime purchases, create a permanent subscription
    if (data.planType === 'pro_lifetime') {
        await supabaseAdmin
            .from('subscriptions')
            .upsert({
                user_id: data.userId,
                plan_type: 'pro_lifetime',
                status: 'active',
                lemonsqueezy_order_id: data.orderId,
                lemonsqueezy_customer_id: data.customerId,
                start_date: new Date().toISOString(),
                end_date: null, // Lifetime = no end date
                is_lifetime: true,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id',
            });

        console.log('Lifetime subscription activated for user:', data.userId);
    }
}

/**
 * Handle new subscription created
 */
async function handleSubscriptionCreated(data: ReturnType<typeof parseWebhookPayload>) {
    if (!data.userId) {
        console.error('Subscription created but no user_id in custom data');
        return;
    }

    await supabaseAdmin
        .from('subscriptions')
        .upsert({
            user_id: data.userId,
            plan_type: data.planType || 'pro_monthly',
            status: 'active',
            lemonsqueezy_subscription_id: data.subscriptionId,
            lemonsqueezy_customer_id: data.customerId,
            start_date: new Date().toISOString(),
            is_first_month: true,
            is_lifetime: false,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id',
        });

    console.log('Monthly subscription activated for user:', data.userId);
}

/**
 * Handle subscription update (plan change, renewal, etc.)
 */
async function handleSubscriptionUpdated(data: ReturnType<typeof parseWebhookPayload>) {
    if (!data.userId && !data.subscriptionId) {
        console.error('Subscription updated but no identifying info');
        return;
    }

    const updateData: Record<string, any> = {
        status: data.status === 'active' ? 'active' : data.status,
        updated_at: new Date().toISOString(),
    };

    // If it's been more than a month, they're no longer in first month
    // (simplified logic - in production you'd check the actual date)
    if (data.status === 'active') {
        updateData.is_first_month = false;
    }

    if (data.userId) {
        await supabaseAdmin
            .from('subscriptions')
            .update(updateData)
            .eq('user_id', data.userId);
    } else if (data.subscriptionId) {
        await supabaseAdmin
            .from('subscriptions')
            .update(updateData)
            .eq('lemonsqueezy_subscription_id', data.subscriptionId);
    }

    console.log('Subscription updated:', data.subscriptionId || data.userId);
}

/**
 * Handle subscription cancellation or expiry
 */
async function handleSubscriptionEnded(data: ReturnType<typeof parseWebhookPayload>) {
    const updateData = {
        status: 'cancelled',
        end_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    if (data.userId) {
        await supabaseAdmin
            .from('subscriptions')
            .update(updateData)
            .eq('user_id', data.userId)
            .eq('is_lifetime', false); // Don't cancel lifetime subscriptions
    } else if (data.subscriptionId) {
        await supabaseAdmin
            .from('subscriptions')
            .update(updateData)
            .eq('lemonsqueezy_subscription_id', data.subscriptionId);
    }

    console.log('Subscription ended:', data.subscriptionId || data.userId);
}

/**
 * Handle successful payment (renewal)
 */
async function handlePaymentSuccess(data: ReturnType<typeof parseWebhookPayload>) {
    // Ensure subscription stays active after successful payment
    if (data.userId) {
        await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'active',
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', data.userId);
    }

    console.log('Payment successful for:', data.userId);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(data: ReturnType<typeof parseWebhookPayload>) {
    // Mark subscription as past_due (gives user time to fix payment)
    if (data.userId) {
        await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'past_due',
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', data.userId);
    }

    console.log('Payment failed for:', data.userId);
}
