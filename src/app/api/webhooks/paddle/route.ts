import { NextRequest, NextResponse } from 'next/server';
import { verifyPaddleWebhook } from '@/lib/paddle';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('paddle-signature') || '';
        const ts = signature.split(';').find(s => s.startsWith('ts='))?.replace('ts=', '') || '';
        const h1 = signature.split(';').find(s => s.startsWith('h1=')) || '';

        // Verify webhook signature
        if (!verifyPaddleWebhook(rawBody, h1, ts)) {
            console.error('Invalid Paddle webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(rawBody);
        const eventType = event.event_type;
        const data = event.data;

        console.log(`Paddle webhook received: ${eventType}`);

        const supabase = await createServerSupabaseClient();

        switch (eventType) {
            case 'subscription.created':
            case 'subscription.activated':
                await handleSubscriptionCreated(supabase, data);
                break;

            case 'subscription.updated':
                await handleSubscriptionUpdated(supabase, data);
                break;

            case 'subscription.canceled':
                await handleSubscriptionCanceled(supabase, data);
                break;

            case 'subscription.past_due':
                await handleSubscriptionPastDue(supabase, data);
                break;

            case 'transaction.completed':
                await handleTransactionCompleted(supabase, data);
                break;

            case 'transaction.payment_failed':
                await handlePaymentFailed(supabase, data);
                break;

            default:
                console.log(`Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Paddle webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

async function handleSubscriptionCreated(supabase: any, data: any) {
    const customerId = data.customer_id;
    const subscriptionId = data.id;
    const status = data.status;
    const priceId = data.items?.[0]?.price?.id;
    const userId = data.custom_data?.userId;

    // Determine plan type
    let planType = 'monthly';
    if (priceId === process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID) {
        planType = 'annual';
    } else if (priceId === process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID) {
        planType = 'monthly';
    }

    if (userId) {
        await supabase
            .from('users')
            .update({
                paddle_customer_id: customerId,
                paddle_subscription_id: subscriptionId,
                subscription_status: status,
                subscription_plan: planType,
                is_pro: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        console.log(`Subscription created for user ${userId} via customData`);
    } else {
        // Fallback to email lookup
        const customerEmail = data.customer?.email;
        if (customerEmail) {
            const { data: user } = await supabase
                .from('users')
                .select('id')
                .eq('email', customerEmail)
                .single();

            if (user) {
                await supabase
                    .from('users')
                    .update({
                        paddle_customer_id: customerId,
                        paddle_subscription_id: subscriptionId,
                        subscription_status: status,
                        subscription_plan: planType,
                        is_pro: true,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', user.id);

                console.log(`Subscription created for user ${user.id} via email lookup`);
            }
        }
    }
}

async function handleSubscriptionUpdated(supabase: any, data: any) {
    const subscriptionId = data.id;
    const status = data.status;

    await supabase
        .from('users')
        .update({
            subscription_status: status,
            updated_at: new Date().toISOString(),
        })
        .eq('paddle_subscription_id', subscriptionId);

    console.log(`Subscription ${subscriptionId} updated to ${status}`);
}

async function handleSubscriptionCanceled(supabase: any, data: any) {
    const subscriptionId = data.id;

    await supabase
        .from('users')
        .update({
            subscription_status: 'canceled',
            is_pro: false,
            updated_at: new Date().toISOString(),
        })
        .eq('paddle_subscription_id', subscriptionId);

    console.log(`Subscription ${subscriptionId} canceled`);
}

async function handleSubscriptionPastDue(supabase: any, data: any) {
    const subscriptionId = data.id;

    await supabase
        .from('users')
        .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
        })
        .eq('paddle_subscription_id', subscriptionId);

    console.log(`Subscription ${subscriptionId} is past due`);
}

async function handleTransactionCompleted(supabase: any, data: any) {
    const customerId = data.customer_id;
    const userId = data.custom_data?.userId;
    const priceId = data.items?.[0]?.price?.id;

    console.log(`Transaction completed for customer ${customerId}`);

    if (userId) {
        // Determine plan type
        let planType = 'monthly';
        if (priceId === process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID) {
            planType = 'annual';
        } else if (priceId === process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID) {
            planType = 'monthly';
        }

        await supabase
            .from('users')
            .update({
                paddle_customer_id: customerId,
                is_pro: true,
                subscription_plan: planType,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        console.log(`User ${userId} upgraded via transaction.completed`);
    }
}

async function handlePaymentFailed(supabase: any, data: any) {
    const customerId = data.customer_id;

    // Log failed payment
    console.log(`Payment failed for customer ${customerId}`);
}
