import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { lemonSqueezy, LEMONSQUEEZY_VARIANTS } from '@/lib/lemonsqueezy';

// Create Supabase admin client for server-side operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { plan, userId, userEmail, userName } = body;

        // Validate required fields
        if (!plan || !userId || !userEmail) {
            return NextResponse.json(
                { error: 'Missing required fields: plan, userId, userEmail' },
                { status: 400 }
            );
        }

        // Validate plan type
        if (plan !== 'monthly' && plan !== 'lifetime') {
            return NextResponse.json(
                { error: 'Invalid plan type. Must be "monthly" or "lifetime"' },
                { status: 400 }
            );
        }

        // Get the correct variant ID
        const variantId = plan === 'monthly'
            ? LEMONSQUEEZY_VARIANTS.pro_monthly
            : LEMONSQUEEZY_VARIANTS.pro_lifetime;

        if (!variantId) {
            console.error('LemonSqueezy variant ID not configured for plan:', plan);
            return NextResponse.json(
                { error: 'Payment configuration error. Please contact support.' },
                { status: 500 }
            );
        }

        // Create checkout session with LemonSqueezy
        const { checkoutUrl, checkoutId } = await lemonSqueezy.createCheckout({
            variantId,
            userId,
            userEmail,
            userName,
            customData: {
                plan_type: plan === 'monthly' ? 'pro_monthly' : 'pro_lifetime',
            },
        });

        // Log the checkout attempt (optional - for analytics)
        try {
            await supabaseAdmin
                .from('checkout_logs')
                .insert({
                    user_id: userId,
                    checkout_id: checkoutId,
                    plan_type: plan === 'monthly' ? 'pro_monthly' : 'pro_lifetime',
                    status: 'created',
                    created_at: new Date().toISOString(),
                });
        } catch (logError) {
            // Don't fail the checkout if logging fails
            console.warn('Failed to log checkout:', logError);
        }

        return NextResponse.json({
            success: true,
            checkoutUrl,
            checkoutId,
        });

    } catch (error) {
        console.error('Checkout creation error:', error);

        return NextResponse.json(
            {
                error: 'Failed to create checkout session',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
