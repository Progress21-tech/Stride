import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

type WaitlistEntry = { id: string; email: string; consent_version: string; consent_at: string; created_at: string };

export default async function WaitlistAdminPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase authentication is not configured.');

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Server components cannot write cookies; middleware refreshes the session. */ }
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email_confirmed_at) redirect('/login');

  const { data: ownerAccess, error: accessError } = await supabase
    .from('waitlist_admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (accessError || !ownerAccess) notFound();

  const { data, error } = await supabase
    .from('waitlist_entries')
    .select('id,email,consent_version,consent_at,created_at')
    .order('created_at', { ascending: false })
    .limit(500);
  const entries = (data ?? []) as WaitlistEntry[];

  return <section className="space-y-6">
    <header className="border-b border-[var(--border-color)] pb-4">
      <p className="text-xs font-mono uppercase text-emerald-500">Temporary owner-only view</p>
      <h1 className="mt-2 text-2xl font-bold text-[var(--text-main)]">Waitlist submissions</h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Signed in as {user.email}. Only the verified account explicitly registered in Supabase can view these records.</p>
    </header>
    {error && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">Waitlist records could not be loaded.</p>}
    {!error && <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="border-b border-[var(--border-color)] text-xs uppercase text-[var(--text-muted)]"><tr><th className="p-4">Email</th><th className="p-4">Joined</th><th className="p-4">Consent version</th></tr></thead>
        <tbody>{entries.map((entry) => <tr key={entry.id} className="border-b border-[var(--border-color)] last:border-0"><td className="p-4 text-[var(--text-main)]">{entry.email}</td><td className="p-4 text-[var(--text-muted)]">{new Date(entry.created_at).toLocaleString()}</td><td className="p-4 text-[var(--text-muted)]">{entry.consent_version}</td></tr>)}
          {entries.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-[var(--text-muted)]">No one has joined yet.</td></tr>}
        </tbody>
      </table>
    </div>}
    <p className="text-xs text-[var(--text-muted)]">Showing up to the 500 most recent submissions. The table is protected by Supabase row-level security.</p>
  </section>;
}
