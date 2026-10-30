'use client';

import { useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';

export function WaitlistForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch(`${apiBase}/api/v1/waitlist/join`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), consent: form.get('consent') === 'on', website: form.get('website') ?? '' }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? 'Could not submit right now. Please try again.');
      setMessage(result.message ?? 'Thanks for joining the Sylpace launch list.');
      formElement.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not submit right now. Please try again.');
    } finally { setBusy(false); }
  }

  return <form className="waitlist-form" onSubmit={submit}>
    <label className="waitlist-email">Email address<input name="email" type="email" autoComplete="email" maxLength={320} placeholder="you@example.com" required /></label>
    <label className="waitlist-consent"><input name="consent" type="checkbox" required /><span>Email me occasional updates about the Sylpace launch. Read our <a href="/privacy">privacy notice</a>.</span></label>
    <label className="waitlist-trap" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <button className="button primary" type="submit" disabled={busy}>{busy ? 'Joining…' : 'Join the waitlist'} <span aria-hidden="true">→</span></button>
    {error && <p className="waitlist-feedback error" role="alert">{error}</p>}
    {message && <p className="waitlist-feedback" role="status">{message}</p>}
  </form>;
}
