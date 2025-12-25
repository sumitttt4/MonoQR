import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch QR code
    const { data: qr, error } = await supabase
        .from('qr_codes')
        .select('content, scan_count')
        .eq('id', id)
        .single();

    if (error || !qr || !qr.content) {
        // Redirect to home if QR not found
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Try to increment scan count (will work if RPC is set up, otherwise silently fails)
    try {
        await supabase.rpc('increment_scan_count', { row_id: id });
    } catch {
        // Silently ignore - analytics increment failed but redirect should still work
    }

    // Ensure content is a valid URL
    let redirectUrl = qr.content;
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
        redirectUrl = 'https://' + redirectUrl;
    }

    return NextResponse.redirect(redirectUrl);
}
