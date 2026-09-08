'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Video,
  HelpCircle,
  BookOpen,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { INITIAL_RESOURCES } from '@/lib/store';

export default function ApplicationStatusPage() {
  const [appData, setAppData] = useState<any>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('stride_user_application');
    if (saved) {
      try {
        setAppData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved application data', e);
      }
    } else {
      // Demo default application state
      setAppData({
        id: 'app-demo-101',
        userName: 'Applicant',
        primaryAreaOfInterest: 'Frontend Development',
        status: 'SUBMITTED',
        dailyLearningCapacity: '2 hours/day',
        createdAt: new Date().toISOString(),
      });
    }
  }, []);

  const track = appData?.primaryAreaOfInterest || 'Frontend Development';
  const introVideo = INITIAL_RESOURCES.find(
    (r) => r.category === track && r.isIntroVideo
  ) || INITIAL_RESOURCES[0];

  const handleSaveReflection = () => {
    if (reflectionText.trim().length > 5) {
      setReflectionSaved(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">

      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border-l-4 border-l-[#18A957]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-[#18A957] font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Screening Status
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] mt-1">
              Application Submitted & Under Review
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Welcome, <span className="font-semibold text-[var(--text-main)]">{appData?.userName || 'Applicant'}</span>. An admin is currently reviewing your answers and commitment profile.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold font-mono self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Status: SUBMITTED
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-color)]">
          <div>
            <span className="text-[var(--text-muted)] block">Selected Track</span>
            <span className="font-semibold text-[#18A957]">{track}</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block">Daily Commitment</span>
            <span className="font-semibold">{appData?.dailyLearningCapacity || '2 hours/day'}</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block">Expected Admin Review</span>
            <span className="font-semibold">Within 24 Hours</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-600 dark:text-amber-300 flex items-start gap-2.5 mt-2">
          <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <p>
            Need help? Contact the group admins at <span className="font-mono underline">admin@stride.tech</span> or message via WhatsApp.
          </p>
        </div>
      </div>

      {/* PRD Section 9: Introductory Video Orientation */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-[#18A957] font-semibold flex items-center gap-1.5 mb-1">
            <Video className="w-3.5 h-3.5" /> Curated Track Orientation
          </div>
          <h2 className="text-xl font-bold text-[var(--text-main)]">
            While You Wait: Watch Intro Resource for {track}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {introVideo.whyRecommended}
          </p>
        </div>

        <div className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--border-color)] bg-black shadow-md">
          <iframe
            className="w-full h-full"
            src={introVideo.youtubeId
              ? `https://www.youtube-nocookie.com/embed/${introVideo.youtubeId}`
              : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(introVideo.title)}`}
            title={introVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-[var(--text-muted)] space-y-0.5">
            <div className="font-medium text-[var(--text-main)]">{introVideo.title}</div>
            <div>Provider: {introVideo.provider} • Duration: {introVideo.duration} • Level: {introVideo.level}</div>
          </div>
          <a
            href={introVideo.url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] text-[var(--text-main)] border border-[var(--border-color)] transition flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#18A957]" /> Open on YouTube
          </a>
        </div>
      </div>

      {/* Early Reflection Interaction */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#18A957]" /> Optional Pre-onboarding Reflection
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          What is one specific project or goal you are excited to build in your learning track?
        </p>

        {reflectionSaved ? (
          <div className="p-3 rounded-lg bg-[#18A957]/10 border border-[#18A957]/20 text-[#18A957] text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Reflection saved! Admins can view this during application review.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="e.g. Build a SaaS pricing page with dark mode and payment checkout integration..."
              className="flex-1 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#18A957]"
            />
            <button
              type="button"
              onClick={handleSaveReflection}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#18A957] hover:bg-[#15944c] text-white transition"
            >
              Save Note
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
