import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: Request) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set() { },
                remove() { },
            },
        },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (isAdmin !== true) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const email = String(body.email || '').trim();
    const name = String(body.name || 'there').trim();
    if (!email) return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY is not configured' }, { status: 500 });

    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin}/login`;
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Stride <onboarding@resend.dev>',
            to: [email],
            subject: 'Your Stride application has been approved',
            html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;background:#f7f7f5;padding:32px">
          <div style="font-size:24px;font-weight:700;letter-spacing:4px;color:#18A957">STRIDE</div>
          <h1 style="font-size:24px;margin:28px 0 12px">Welcome to Stride, ${name}.</h1>
          <p style="font-size:16px;line-height:1.6">Your application has been approved. Your learning accountability workspace is ready.</p>
          <a href="${loginUrl}" style="display:inline-block;margin:16px 0;padding:13px 20px;background:#18A957;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Log in to your workspace</a>
          <p style="font-size:13px;line-height:1.5;color:#666">If the button does not work, copy this link into your browser: ${loginUrl}</p>
        </div>
      `,
        }),
    });

    if (!response.ok) {
        const details = await response.text();
        console.error('Resend error:', details);
        return NextResponse.json({ error: 'Email provider rejected the message' }, { status: 502 });
    }

    return NextResponse.json({ sent: true });
}
