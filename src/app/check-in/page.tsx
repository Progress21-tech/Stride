'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle, ShieldAlert, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { submitCheckIn, useEmergencyPass } from '@/lib/stride-db';

type CheckInStatus = 'YES' | 'PARTIAL' | 'NO' | 'EMERGENCY_PASS';

export default function CheckinPage() {
  const router = useRouter();
  const [status, setStatus] = useState<CheckInStatus>('YES');
  const [learnings, setLearnings] = useState('');
  const [completedWork, setCompletedWork] = useState('');
  const [minutes, setMinutes] = useState(90);
  const [blockers, setBlockers] = useState('');
  const [nextPriority, setNextPriority] = useState('');
  const [passReason, setPassReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [passesRemaining, setPassesRemaining] = useState<number | null>(null);

  const isPassMode = status === 'EMERGENCY_PASS';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to submit a daily check-in.');
      }

      if (isPassMode) {
        if (!passReason.trim()) {
          throw new Error('Please provide a brief reason for the emergency pass request.');
        }
        await useEmergencyPass(user.id, passReason);
        alert('Emergency pass logged for today. Your attendance is now excused.');
      } else {
        await submitCheckIn({
          userId: user.id,
          completionStatus: status,
          learnings,
          completedWork,
          learningTimeMinutes: Number(minutes),
          blockers,
          nextPriority,
        });
        alert('Daily check-in submitted successfully! Your streak has been updated.');
      }

      router.push('/today');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit daily check-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-[#18A957] mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Daily Accountability Report
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Submit Today's Check-in</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Deadline: 11:59 PM in your local timezone (<span className="font-mono text-[var(--text-main)]">Local Cutoff</span>).
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">1. Did you complete today's commitment? *</label>
            <div className="grid grid-cols-4 gap-2">
              <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${status === 'YES' ? 'border-[#18A957] bg-[#18A957]/10' : 'border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[#18A957]/50'}`}>
                <input type="radio" name="status" value="YES" checked={status === 'YES'} onChange={() => setStatus('YES')} className="hidden" />
                <div className="text-xs font-semibold text-[#18A957]">Yes</div>
                <div className="text-[11px] text-[var(--text-muted)]">All planned tasks</div>
              </label>
              <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${status === 'PARTIAL' ? 'border-amber-500 bg-amber-500/10' : 'border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[#18A957]/50'}`}>
                <input type="radio" name="status" value="PARTIAL" checked={status === 'PARTIAL'} onChange={() => setStatus('PARTIAL')} className="hidden" />
                <div className="text-xs font-semibold text-amber-400">Partial</div>
                <div className="text-[11px] text-[var(--text-muted)]">Some progress</div>
              </label>
              <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${status === 'NO' ? 'border-zinc-600 bg-zinc-800' : 'border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[#18A957]/50'}`}>
                <input type="radio" name="status" value="NO" checked={status === 'NO'} onChange={() => setStatus('NO')} className="hidden" />
                <div className="text-xs font-semibold text-[var(--text-muted)]">No</div>
                <div className="text-[11px] text-[var(--text-muted)]">Missed today</div>
              </label>
              <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${status === 'EMERGENCY_PASS' ? 'border-[#18A957] bg-[#18A957]/10' : 'border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[#18A957]/50'}`}>
                <input type="radio" name="status" value="EMERGENCY_PASS" checked={status === 'EMERGENCY_PASS'} onChange={() => setStatus('EMERGENCY_PASS')} className="hidden" />
                <ShieldAlert className="w-4 h-4 text-[#18A957] mx-auto mb-0.5" />
                <div className="text-xs font-semibold text-[#18A957]">Pass</div>
                <div className="text-[11px] text-[var(--text-muted)]">Emergency pass</div>
              </label>
            </div>
            {isPassMode && (
              <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>You have 2 emergency passes per month. Use one to excuse today's check-in.</span>
              </div>
            )}
          </div>

          {isPassMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Reason for emergency pass *</label>
                <textarea
                  rows={3}
                  value={passReason}
                  onChange={(e) => setPassReason(e.target.value)}
                  placeholder="Briefly describe the situation that prevented you from reporting today..."
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
                  required
                ></textarea>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">2. What did you learn today? *</label>
                <textarea
                  required
                  rows={2}
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  placeholder="Key concepts or insights gained..."
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">3. What did you complete today? *</label>
                <textarea
                  required
                  rows={2}
                  value={completedWork}
                  onChange={(e) => setCompletedWork(e.target.value)}
                  placeholder="Specific code written, lessons finished..."
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">4. Time spent (Minutes) *</label>
                <input
                  type="number"
                  required
                  min={15}
                  max={720}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">5. What blocked you today? (Optional)</label>
                <input
                  type="text"
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  placeholder="e.g. CSS Grid alignment..."
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">6. Tomorrow's priority (Optional)</label>
                <input
                  type="text"
                  value={nextPriority}
                  onChange={(e) => setNextPriority(e.target.value)}
                  placeholder="e.g. Master React hooks..."
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold rounded-xl bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> {loading ? 'Submitting...' : (isPassMode ? 'Use Emergency Pass' : 'Submit Daily Check-in')}
          </button>
        </form>
      </div>
    </div>
  );
}
