import { Users, Video, ExternalLink, Calendar, MessageSquare } from 'lucide-react';
import { INITIAL_MEMBERS } from '@/lib/store';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-[#18A957] mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Accountability Cohort
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Group Community</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Small accountability groups with structured peer support and weekly review cadence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] space-y-3">
              <h2 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                <Video className="w-4 h-4 text-[#18A957]" /> Saturday Review Call
              </h2>
              <div className="text-xs text-[var(--text-muted)] space-y-1">
                <div>Every Saturday at 4:00 PM UTC via Google Meet</div>
                <Link
                  href="https://meet.google.com/abc-defg-hij"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#18A957] hover:underline text-xs font-medium"
                >
                  Join Meeting <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] space-y-3">
              <h2 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#18A957]" /> Recent Group Updates
              </h2>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <div className="font-medium text-[var(--text-main)] mb-0.5">Group admin</div>
                  <div className="text-[var(--text-muted)]">
                    Please review your weekly objectives before Saturday's call. The agenda will focus on completion rates and blocker resolution.
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">Posted 3 hours ago</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <div className="font-medium text-[var(--text-main)] mb-0.5">Alex Chen (Member)</div>
                  <div className="text-[var(--text-muted)]">
                    Completed all tasks for today. Working on JavaScript async/await DOM project.
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">Posted 5 hours ago</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] space-y-3">
              <h2 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18A957]" /> Accountability Partner
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Partner pairing activates once your first weekly review is complete.
              </p>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
                  ?
                </div>
                <div>
                  <div className="text-xs font-medium text-[var(--text-main)]">Not yet paired</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Assigned within 48 hours of first review</div>
                </div>
              </div>
            </div>

            <div className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] space-y-3">
              <h2 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#18A957]" /> Upcoming Schedule
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Daily check-in deadline</span>
                  <span className="text-[var(--text-main)] font-mono">11:59 PM (Local)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Saturday review</span>
                  <span className="text-[var(--text-main)] font-mono">4:00 PM UTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#18A957]" /> Member Directory
          </h2>
          <div className="text-xs text-[var(--text-muted)] mb-2">
            {INITIAL_MEMBERS.filter((m) => m.role === 'MEMBER').length} active members shown
          </div>
          <div className="divide-y divide-[var(--border-color)] text-xs">
            {INITIAL_MEMBERS.filter((m) => m.role !== 'ADMIN').map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-[#18A957]">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-[var(--text-main)]">{m.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{m.email}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#18A957]/10 text-[#18A957] border border-[#18A957]/20 font-mono text-[10px]">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
