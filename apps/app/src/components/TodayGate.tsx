'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from './AuthForm';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type User = { id: string; name: string; email: string; roles: string[] };

export function TodayGate() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${apiBase}/v1/auth/me`, { credentials: 'include', cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401) { router.replace('/login'); return; }
        if (!response.ok) throw new Error('API unavailable');
        const result = await response.json() as { user: User };
        setUser(result.user);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoaded(true));
  }, [router]);

  async function signOut() {
    try {
      const csrf = await fetch(`${apiBase}/v1/auth/csrf`, { credentials: 'include', cache: 'no-store' }).then((r) => r.json()) as { csrfToken: string };
      await fetch(`${apiBase}/v1/auth/logout`, { method: 'POST', credentials: 'include', headers: { 'X-CSRF-Token': csrf.csrfToken } });
    } finally { router.replace('/login'); }
  }

  if (!loaded) return <main className="shell"><p role="status" className="status">Opening your Sylpace workspace…</p></main>;
  if (failed) return <main className="shell"><div className="card"><h1>Can’t connect right now</h1><p className="sub">Check your connection and try again.</p><button className="button" onClick={() => router.refresh()}>Try again</button></div></main>;
  if (!user) return <AuthForm mode="login" />;
  return <main className="shell"><header className="app-header"><a className="brand" href="/app"><span className="mark" aria-hidden="true">s</span>Sylpace</a><button className="button" onClick={signOut}>Sign out</button></header><section className="card"><p className="sub">YOUR LEARNING WORKSPACE</p><h1>Welcome, {user.name}</h1><p className="sub">Your Sylpace account is ready. Learning goals, course catalog, and member tools will be added in the next implementation milestones.</p></section></main>;
}
