'use client';

import { useEffect, useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function VerifyPage() {
  const [message, setMessage] = useState('Verifying your email…');
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) { setMessage('This verification link is invalid or expired.'); return; }
    void (async () => {
      try {
        const csrf = await fetch(`${apiBase}/v1/auth/csrf`, { credentials: 'include', cache: 'no-store' }).then((r) => r.json()) as { csrfToken: string };
        const response = await fetch(`${apiBase}/v1/auth/verify`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf.csrfToken }, body: JSON.stringify({ token }) });
        const data = await response.json() as { message?: string; title?: string };
        setMessage(data.message ?? data.title ?? 'Verification could not be completed.'); setOk(response.ok);
      } catch { setMessage('Sylpace is temporarily unavailable. Please try again later.'); }
    })();
  }, []);
  return <main className="page"><div className="auth-wrap"><a className="brand" href="/"><span className="mark">s</span>Sylpace</a><section className="card"><h1>{ok ? 'Email verified' : 'Email verification'}</h1><p role="status" className="sub">{message}</p>{ok && <a className="link" href="/login">Sign in</a>}</section></div></main>;
}
