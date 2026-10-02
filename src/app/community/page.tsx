'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { ExternalLink, MessageSquare, Send, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Message = { id: string; user_id: string; body: string; created_at: string; author_name?: string };
const shortTime = (value: string) => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value));

export default function CommunityPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState('');
  const [names, setNames] = useState<Record<string, string>>({});
  const [meetingUrl, setMeetingUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef(new Set<string>());

  useEffect(() => {
    let active = true;
    const hydrateNames = async (items: Message[]) => {
      const ids = items.map((item) => item.user_id).filter((id, index, all) => all.indexOf(id) === index && !names[id]);
      if (!ids.length) return;
      const { data } = await supabase.rpc('community_member_names', { member_ids: ids });
      if (!active || !data) return;
      setNames((current) => ({ ...current, ...Object.fromEntries(data.map((user) => [user.id, user.name])) }));
    };
    async function loadCommunity() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) { setLoading(false); return; }
      setUserId(user.id);
      const [{ data: messageRows }, { data: meeting }] = await Promise.all([
        supabase.from('community_messages').select('id,user_id,body,created_at').order('created_at', { ascending: false }).limit(100),
        supabase.from('meetings').select('meet_url').eq('active', true).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (!active) return;
      const chronological = (messageRows || []).reverse() as Message[];
      chronological.forEach((item) => seenIds.current.add(item.id));
      setMessages(chronological);
      setMeetingUrl(meeting?.meet_url || '');
      await hydrateNames(chronological);
      setLoading(false);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'instant' }));
    }
    loadCommunity();
    const channel = supabase.channel('community-messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_messages' }, (payload) => {
      const incoming = payload.new as Message;
      if (seenIds.current.has(incoming.id)) return;
      seenIds.current.add(incoming.id);
      setMessages((current) => {
        const pendingIndex = current.findIndex((message) => message.id.startsWith('pending-') && message.user_id === incoming.user_id && message.body === incoming.body);
        if (pendingIndex >= 0) return current.map((message, index) => index === pendingIndex ? incoming : message).slice(-100);
        return [...current, incoming].slice(-100);
      });
      void hydrateNames([incoming]);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
    }).subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, []);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || !userId || sending) return;
    setSending(true);
    const optimistic: Message = { id: `pending-${Date.now()}`, user_id: userId, body: trimmed, created_at: new Date().toISOString(), author_name: names[userId] };
    setMessages((current) => [...current, optimistic].slice(-100));
    setBody('');
    const { data, error } = await supabase.from('community_messages').insert({ user_id: userId, body: trimmed }).select('id,user_id,body,created_at').single();
    setSending(false);
    if (error) {
      setMessages((current) => current.filter((message) => message.id !== optimistic.id));
      setBody(trimmed);
      return;
    }
    seenIds.current.add(data.id);
    setMessages((current) => current.map((message) => message.id === optimistic.id ? { ...data, author_name: names[userId] } : message));
  }

  return <div className="mx-auto flex h-[calc(100dvh-2rem)] max-w-5xl flex-col gap-4 sm:h-[calc(100dvh-3rem)]">
    <header className="flex flex-wrap items-end justify-between gap-3"><div><div className="mb-1 flex items-center gap-2 text-xs font-mono uppercase text-[#18A957]"><Users className="h-3.5 w-3.5"/> Community</div><h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">Your cohort, in one conversation.</h1><p className="mt-1 text-sm text-[var(--text-muted)]">Share progress, ask for help, and keep each other moving.</p></div>{meetingUrl && <a href={meetingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-xs font-semibold text-[#18A957] hover:bg-[#18A957]/10">Saturday review <ExternalLink className="h-3 w-3"/></a>}</header>
    <section className="glass-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3 sm:px-5"><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#18A957]/10 text-[#18A957]"><MessageSquare className="h-4 w-4"/></span><div><h2 className="text-sm font-semibold text-[var(--text-main)]">Cohort chat</h2><p className="text-[11px] text-[var(--text-muted)]">Live conversation</p></div></div><span className="rounded-full bg-[#18A957]/10 px-2.5 py-1 text-[10px] font-semibold text-[#18A957]">Realtime</span></div>
      <div aria-live="polite" className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[var(--bg-subtle)]/60 p-4 sm:p-6">
        {loading && <p className="p-4 text-center text-sm text-[var(--text-muted)]">Loading conversation…</p>}
        {!loading && messages.length === 0 && <div className="grid h-full place-items-center text-center"><div><span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#18A957]/10 text-[#18A957]"><Users className="h-5 w-5"/></span><p className="text-sm font-semibold text-[var(--text-main)]">Start the conversation</p><p className="mt-1 text-xs text-[var(--text-muted)]">Say hello to your cohort.</p></div></div>}
        {messages.map((message) => { const mine = message.user_id === userId; const name = message.author_name || names[message.user_id] || (mine ? 'You' : 'Community member'); return <article key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] sm:max-w-[75%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}><div className={`mb-1 flex items-center gap-2 px-1 ${mine ? 'flex-row-reverse' : ''}`}><span className="text-[11px] font-semibold text-[var(--text-main)]">{mine ? 'You' : name}</span><time className="text-[10px] text-[var(--text-muted)]">{shortTime(message.created_at)}</time></div><div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${mine ? 'rounded-tr-sm bg-[#18A957] text-white' : 'rounded-tl-sm border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)]'}`}>{message.body}</div></div></article>; })}<div ref={bottomRef}/>
      </div>
      <form onSubmit={sendMessage} className="flex items-end gap-2 border-t border-[var(--border-color)] bg-[var(--card-bg)] p-3 sm:p-4"><label className="sr-only" htmlFor="community-message">Message</label><textarea id="community-message" rows={1} value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="Write a message…" className="max-h-28 min-h-11 min-w-0 flex-1 resize-y rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3.5 py-3 text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)] focus:border-[#18A957]"/><button type="submit" disabled={!body.trim() || sending} aria-label="Send message" className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#18A957] px-4 text-sm font-semibold text-white transition hover:bg-[#15944c] disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4"/><span className="hidden sm:inline">Send</span></button></form>
    </section>
  </div>;
}
