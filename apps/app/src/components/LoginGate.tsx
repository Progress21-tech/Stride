'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from './AuthForm';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function LoginGate() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${apiBase}/v1/auth/me`, { credentials: 'include', cache: 'no-store' })
      .then((response) => {
        if (response.ok) router.replace('/app');
      })
      .catch(() => {})
      .finally(() => { if (active) setChecked(true); });
    return () => { active = false; };
  }, [router]);

  if (!checked) return <main className="shell"><p role="status" className="status">Checking your Sylpace session…</p></main>;
  return <AuthForm mode="login" />;
}
