'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Clock3, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';

type PhonePlatform = 'android' | 'ios' | 'other';

const cards = [
  { title: 'Choose the distractions', body: 'Pick the apps or categories that most often interrupt your study time. Keep calls, maps, and anything needed for safety available.' },
  { title: 'Set a study window', body: 'Start with one focused block that fits your day, such as 25–50 minutes. Add a schedule if you want the block to repeat.' },
  { title: 'Protect the limit', body: 'Use the phone’s focus or downtime controls while you study. A Screen Time passcode or app-limit PIN can make the limit harder to dismiss.' },
];

export default function FocusPage() {
  const [platform, setPlatform] = useState<PhonePlatform>('other');

  useEffect(() => {
    const ua = navigator.userAgent;
    setPlatform(/Android/i.test(ua) ? 'android' : /iPhone|iPad|iPod/i.test(ua) ? 'ios' : 'other');
  }, []);

  return <div className="mx-auto max-w-4xl space-y-6">
    <header className="space-y-2"><div className="flex items-center gap-2 text-xs font-mono uppercase text-[#18A957]"><ShieldCheck className="h-4 w-4"/> Focus setup</div><h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">Make space for your goals.</h1><p className="max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">Set app limits on your phone so distracting apps are paused during learning time. Stride will guide you through your phone’s built-in controls.</p></header>

    <section className="glass-card rounded-2xl p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="rounded-xl bg-[#18A957]/10 p-3 text-[#18A957]"><Smartphone className="h-5 w-5"/></span><div><h2 className="text-base font-bold text-[var(--text-main)]">{platform === 'android' ? 'Android Digital Wellbeing' : platform === 'ios' ? 'iPhone Screen Time' : 'Use your phone’s focus controls'}</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Detected device: {platform === 'android' ? 'Android' : platform === 'ios' ? 'iPhone or iPad' : 'Desktop or unsupported device'}</p></div></div>
      {platform === 'android' && <a href="intent:#Intent;action=android.settings.DIGITAL_WELLBEING_SETTINGS;end" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18A957] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#15944c]">Open Digital Wellbeing <ArrowUpRight className="h-3.5 w-3.5"/></a>}
      {platform === 'ios' && <a href="https://support.apple.com/en-ae/guide/iphone/iphb0c7313c9/ios" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18A957] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#15944c]">View Apple’s setup guide <ArrowUpRight className="h-3.5 w-3.5"/></a>}
      {platform === 'other' && <a href="https://support.google.com/android/answer/9346420" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18A957] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#15944c]">Android guide <ArrowUpRight className="h-3.5 w-3.5"/></a>}
    </div>
    {platform === 'android' && <p className="mt-4 rounded-lg bg-[var(--bg-subtle)] p-3 text-xs text-[var(--text-muted)]">If the button doesn’t open Settings, go to <strong className="text-[var(--text-main)]">Settings → Digital Wellbeing & parental controls → Focus mode</strong>. Menu names vary by phone.</p>}
    {platform === 'ios' && <p className="mt-4 rounded-lg bg-[var(--bg-subtle)] p-3 text-xs text-[var(--text-muted)]">On iPhone, open <strong className="text-[var(--text-main)]">Settings → Screen Time → App Limits</strong> to set daily limits, or use <strong className="text-[var(--text-main)]">Downtime</strong> for a scheduled block. Enable “Block at Downtime” when available.</p>}
    {platform === 'other' && <p className="mt-4 rounded-lg bg-[var(--bg-subtle)] p-3 text-xs text-[var(--text-muted)]">On a phone, look in Settings for <strong className="text-[var(--text-main)]">Digital Wellbeing</strong> (Android) or <strong className="text-[var(--text-main)]">Screen Time</strong> (iPhone).</p>}
    </section>

    <section className="grid gap-3 md:grid-cols-3">{cards.map((card, index) => <article key={card.title} className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4"><span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-subtle)] text-xs font-bold text-[#18A957]">{index + 1}</span><h3 className="text-sm font-semibold text-[var(--text-main)]">{card.title}</h3><p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{card.body}</p></article>)}</section>

    <section className="rounded-2xl border border-[#18A957]/20 bg-[#18A957]/5 p-5"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#18A957]"/><div><h2 className="text-sm font-semibold text-[var(--text-main)]">A simple focus routine</h2><p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">Before a study session, open your phone’s Focus mode, pause distracting apps, and start one task from your Stride planner. Take a short break between blocks.</p><a href="/plan" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#18A957] hover:underline"><Clock3 className="h-3.5 w-3.5"/> Choose a task in your planner</a></div></div></section>

    <p className="flex items-start gap-2 text-[11px] leading-relaxed text-[var(--text-muted)]"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#18A957]"/>These settings are controlled by your phone. Stride cannot read, change, or enforce app limits from a web browser. Exact steps and available controls vary by device and OS version.</p>
  </div>;
}
