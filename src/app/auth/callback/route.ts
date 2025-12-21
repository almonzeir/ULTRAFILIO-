import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const redirectTo = requestUrl.searchParams.get('redirectTo') || '/create';

    if (code) {
        const supabase = createServerSupabaseClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Auth callback error:', error.message);
            // Redirect to login with error message
            return NextResponse.redirect(
                `${requestUrl.origin}/login?message=${encodeURIComponent('Authentication failed. Please try again.')}`
            );
        }
    }

    // Redirect to the desired page after successful auth
    return NextResponse.redirect(requestUrl.origin + redirectTo);
}
