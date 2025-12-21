import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { parsePaddleWebhookPayload, verifyPaddleWebhook } from '@/lib/paddle';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('paddle-signature') || '';

        // Verify webhook signature (optional but recommended)
        // const isValid = await verifyPaddleWebhook(rawBody, signature);
        // if (!isValid) {
        //     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        // }

        const payload = JSON.parse(rawBody);
        const webhookData = parsePaddleWebhookPayload(payload);

        console.log('Paddle webhook received:', webhookData.eventType, webhookData);

        switch (webhookData.eventType) {
            case 'subscription.created':
            case 'subscription.activated':
                // User subscribed - upgrade to Pro
                if (webhookData.userId) {
                    await supabaseAdmin
                        .from('users')
                        .update({
                            subscription_status: 'active',
                            subscription_plan: webhookData.planType || 'pro_monthly',
                            subscription_id: webhookData.subscriptionId,
                            paddle_customer_id: webhookData.customerId,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', webhookData.userId);

                    console.log(`User ${webhookData.userId} upgraded to ${webhookData.planType}`);
                }
                break;

            case 'subscription.updated':
                // Subscription updated (plan change, etc.)
                if (webhookData.userId) {
                    await supabaseAdmin
                        .from('users')
                        .update({
                            subscription_plan: webhookData.planType,
                            subscription_status: webhookData.status === 'active' ? 'active' : 'inactive',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', webhookData.userId);
                }
                break;

            case 'subscription.canceled':
                // User canceled - downgrade to free
                if (webhookData.userId) {
                    await supabaseAdmin
                        .from('users')
                        .update({
                            subscription_status: 'canceled',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', webhookData.userId);

                    console.log(`User ${webhookData.userId} canceled subscription`);
                }
                break;

            case 'subscription.paused':
                if (webhookData.userId) {
                    await supabaseAdmin
                        .from('users')
                        .update({
                            subscription_status: 'paused',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', webhookData.userId);
                }
                break;

            case 'subscription.resumed':
                if (webhookData.userId) {
                    await supabaseAdmin
                        .from('users')
                        .update({
                            subscription_status: 'active',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', webhookData.userId);
                }
                break;

            case 'transaction.completed':
                // One-time payment or subscription payment succeeded
                console.log('Transaction completed:', webhookData.transactionId);

                // For lifetime purchases
                if (webhookData.planType === 'pro_lifetime' && webhookData.userId) {
                    await supabaseAdmin
                        .from('users')
                        .update({
                            subscription_status: 'lifetime',
                            subscription_plan: 'pro_lifetime',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', webhookData.userId);

                    console.log(`User ${webhookData.userId} purchased lifetime access`);
                }
                break;

            case 'transaction.payment_failed':
                // Payment failed
                console.log('Payment failed for:', webhookData.userId);
                break;

            default:
                console.log('Unhandled webhook event:', webhookData.eventType);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Paddle webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Paddle sends GET to verify the endpoint
export async function GET() {
    return NextResponse.json({ status: 'Paddle webhook endpoint active' });
}
