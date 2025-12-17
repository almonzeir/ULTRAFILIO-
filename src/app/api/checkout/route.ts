import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { lemonSqueezy } from '@/lib/lemonsqueezy';

// Create Supabase admin client for server-side auth check
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const body = await req.json();
        const { variantId } = body;

        if (!variantId) {
            return NextResponse.json({ error: 'Missing variantId' }, { status: 400 });
        }

        console.log(`Creating checkout for user ${user.id} (${user.email}) for variant ${variantId}`);

        // 2. Create Checkout Session
        // 2. Create Checkout Session
        let checkoutUrl = '';

        // Check if variantId is a UUID (Link ID) or a Number (Variant ID)
        // UUIDs (e.g., 'cb97e4f6-b3cd-4f75-ae11-75eab6155eeb') meant for direct links
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(variantId);

        if (isUUID) {
            // Construct Direct Checkout URL with pre-filled data
            const baseUrl = `https://almonzer.lemonsqueezy.com/buy/${variantId}`;
            const params = new URLSearchParams();
            params.append('checkout[email]', user.email);
            if (user.user_metadata?.display_name || user.user_metadata?.full_name) {
                params.append('checkout[name]', user.user_metadata?.display_name || user.user_metadata?.full_name);
            }
            params.append('checkout[custom][user_id]', user.id);
            params.append('checkout[custom][email]', user.email);

            checkoutUrl = `${baseUrl}?${params.toString()}`;
        } else {
            // Use API for numeric IDs (Legacy / Full API Method)
            const result = await lemonSqueezy.createCheckout({
                variantId: variantId,
                userId: user.id,
                userEmail: user.email,
                userName: user.user_metadata?.display_name || user.user_metadata?.full_name,
                customData: {
                    user_id: user.id,
                    email: user.email
                }
            });
            checkoutUrl = result.checkoutUrl;
        }

        // 3. Return URL
        return NextResponse.json({ url: checkoutUrl });

    } catch (error: any) {
        console.error('Checkout API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
