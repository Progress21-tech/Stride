'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ExternalLink, MessageSquare, Send, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Message = { id: string; user_id: string; body: string; created_at: string };

export default function CommunityPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [body, setBody] = useState('');
    const [userId, setUserId] = useState('');
    const [meetingUrl, setMeetingUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCommunity() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);
            const [{ data: messagesData }, { data: meeting }] = await Promise.all([
                supabase.from('community_messages').select('*').order('created_at', { ascending: true }).limit(100),
                supabase.from('meetings').select('meet_url').eq('active', true).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
            ]);
            setMessages(messagesData || []);
            setMeetingUrl(meeting?.meet_url || '');
            setLoading(false);
        }
        loadCommunity();
        const channel = supabase.channel('community-messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_messages' }, (payload) => {
            setMessages((current) => [...current, payload.new as Message]);
        }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    async function sendMessage(event: FormEvent) {
        event.preventDefault();
        const trimmed = body.trim();
        if (!trimmed || !userId) return;
        const { error } = await supabase.from('community_messages').insert({ user_id: userId, body: trimmed });
        if (!error) setBody('');
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <header className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#18A957]"><Users className="h-3.5 w-3.5" /> Community</div>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Talk with your cohort.</h1>
                <p className="text-sm text-[var(--text-muted)]">Ask questions, share progress, and hear important updates from admins.</p>
            </header>

            <section className="glass-card rounded-2xl p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]"><MessageSquare className="h-4 w-4 text-[#18A957]" /> Cohort chat</h2>
                    {meetingUrl ? <a href={meetingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18A957] hover:underline">Saturday review <ExternalLink className="h-3 w-3" /></a> : <span className="text-xs text-[var(--text-muted)]">Review link not added yet</span>}
                </div>
                <div className="min-h-80 space-y-3 rounded-xl bg-[var(--bg-subtle)] p-3">
                    {loading && <p className="p-4 text-center text-sm text-[var(--text-muted)]">Loading conversation...</p>}
                    {!loading && messages.length === 0 && <p className="p-4 text-center text-sm text-[var(--text-muted)]">No messages yet. Start the conversation.</p>}
                    {messages.map((message) => <div key={message.id} className={`max-w-[85%] rounded-xl border border-[var(--border-color)] p-3 text-sm ${message.user_id === userId ? 'ml-auto bg-[#18A957]/10' : 'bg-[var(--card-bg)]'}`}><p className="text-[var(--text-main)]">{message.body}</p><time className="mt-1 block text-[10px] text-[var(--text-muted)]">{new Date(message.created_at).toLocaleString()}</time></div>)}
                </div>
                <form onSubmit={sendMessage} className="mt-3 flex gap-2">
                    <input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a message to the cohort..." aria-label="Message" className="min-w-0 flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[#18A957]" />
                    <button type="submit" aria-label="Send message" className="rounded-xl bg-[#18A957] px-3 text-white hover:bg-[#15944c]"><Send className="h-4 w-4" /></button>
                </form>
            </section>
        </div>
    );
}
