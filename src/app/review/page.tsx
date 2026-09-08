'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Video } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ReviewPage() {
    const [meetingUrl, setMeetingUrl] = useState('');
    const [meetingTitle, setMeetingTitle] = useState('Saturday Review');
    const [schedule, setSchedule] = useState('The admin has not added the next review link yet.');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMeeting() {
            const { data } = await supabase.from('meetings').select('title, meet_url, schedule').eq('active', true).order('updated_at', { ascending: false }).limit(1).maybeSingle();
            if (data) {
                setMeetingTitle(data.title);
                setMeetingUrl(data.meet_url);
                setSchedule(data.schedule);
            }
            setLoading(false);
        }
        loadMeeting();
    }, []);

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <header className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#18A957]"><Video className="h-3.5 w-3.5" /> Weekly review</div>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">{meetingTitle}</h1>
                <p className="text-sm text-[var(--text-muted)]">Bring your completed work, blockers, and next step to the group review.</p>
            </header>
            <section className="glass-card rounded-2xl p-5 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-xs font-mono uppercase text-[var(--text-muted)]">Schedule</p><p className="mt-1 text-sm font-semibold text-[var(--text-main)]">{loading ? 'Loading...' : schedule}</p></div>
                    {meetingUrl ? <a href={meetingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18A957] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#15944c]">Join review <ExternalLink className="h-3.5 w-3.5" /></a> : <span className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] px-4 py-2.5 text-xs text-[var(--text-muted)]">Link pending from admin</span>}
                </div>
            </section>
            <section className="glass-card rounded-2xl p-5 sm:p-8"><h2 className="text-sm font-semibold text-[var(--text-main)]">Prepare your reflection</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-main)]">What moved forward?</div><div className="rounded-xl bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-main)]">What got in the way?</div><div className="rounded-xl bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-main)]">What happens next?</div></div></section>
        </div>
    );
}
