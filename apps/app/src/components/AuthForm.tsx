'use client';

import { useState } from 'react';
import type { Problem } from '@sylpace/contracts';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function csrfToken(): Promise<string> {
  const response = await fetch(`${apiBase}/v1/auth/csrf`, { credentials: 'include', cache: 'no-store' });
  if (!response.ok) throw new Error('Sylpace is temporarily unavailable. Please try again.');
  const data = await response.json() as { csrfToken: string };
  return data.csrfToken;
}

export function AuthForm({ mode }: { mode: 'login' | 'signup' | 'forgot' | 'reset' }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setMessage(''); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const body: Record<string, string> = {};
      for (const [key, value] of form.entries()) if (typeof value === 'string' && value) body[key] = value;
      if (mode === 'reset') body.token = new URLSearchParams(window.location.search).get('token') ?? '';
      const endpoint = mode === 'forgot' ? 'password-reset/request' : mode === 'reset' ? 'password-reset/complete' : mode;
      const token = await csrfToken();
      const response = await fetch(`${apiBase}/v1/auth/${endpoint}`, {
        method: 'POST', credentials: 'include', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token }, body: JSON.stringify(body),
      });
      const payload = await response.json().catch(() => ({})) as { message?: string; detail?: string; title?: string } & Partial<Problem>;
      if (!response.ok) throw new Error(payload.detail ?? payload.title ?? 'Request failed. Please try again.');
      if (mode === 'login') window.location.assign('/today');
      else setMessage(payload.message ?? (mode === 'signup' ? 'Check your email for a verification link.' : 'Request complete.'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Request failed. Please try again.');
    } finally { setBusy(false); }
  }

  const heading = { login: 'Welcome back', signup: 'Create your account', forgot: 'Reset your password', reset: 'Choose a new password' }[mode];
  const description = { login: 'Sign in to continue to your learning workspace.', signup: 'Create an account to start using Sylpace.', forgot: 'If your email matches an account, we’ll send a reset link.', reset: 'Use a password you have not used elsewhere.' }[mode];
  const fields: Record<typeof mode, Array<{ name: string; label: string; type: string; autoComplete: string }>> = {
    login: [{ name: 'email', label: 'Email', type: 'email', autoComplete: 'email' }, { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' }],
    signup: [{ name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' }, { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' }, { name: 'password', label: 'Password (10 characters minimum)', type: 'password', autoComplete: 'new-password' }],
    forgot: [{ name: 'email', label: 'Email', type: 'email', autoComplete: 'email' }],
    reset: [{ name: 'password', label: 'New password (10 characters minimum)', type: 'password', autoComplete: 'new-password' }],
  };

  return <main className="page"><div className="auth-wrap"><a className="brand" href="/" aria-label="Sylpace"><span className="mark" aria-hidden="true">s</span>Sylpace</a><section className="card" aria-labelledby="form-heading"><h1 id="form-heading">{heading}</h1><p className="sub">{description}</p><form className="form" onSubmit={submit}>{fields[mode].map((field) => <label className="field" key={field.name}>{field.label}<input required name={field.name} type={field.type} autoComplete={field.autoComplete} minLength={field.name === 'password' && mode !== 'login' ? 10 : undefined} maxLength={field.name === 'password' ? 128 : field.name === 'name' ? 80 : undefined} /></label>)}<button className="button" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Reset password'}</button></form>{error && <p role="alert" className="status error">{error}</p>}{message && <p role="status" className="status">{message}</p>}<div className="links">{mode === 'login' && <><a className="link" href="/signup">Create account</a><a className="link" href="/forgot-password">Forgot password?</a></>}{mode === 'signup' && <a className="link" href="/login">Already have an account? Sign in</a>}{(mode === 'forgot' || mode === 'reset') && <a className="link" href="/login">Back to sign in</a>}</div></section></div></main>;
}
