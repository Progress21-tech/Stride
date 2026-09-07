'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { submitCheckIn } from '@/lib/stride-db';

export default function CheckinPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'YES' | 'PARTIAL' | 'NO'>('YES');
  const [learnings, setLearnings] = useState('');
  const [completedWork, setCompletedWork] = useState('');
  const [minutes, setMinutes] = useState(90);
  const [blockers, setBlockers] = useState('');
  const [nextPriority, setNextPriority] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to submit a daily check-in.');
      }

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
          <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Daily Accountability Report
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Submit Today's Check-in</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Deadline: 11:59 PM in your local timezone (<span className="font-mono text-zinc-300">Local Cutoff</span>).
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">1. Did you complete today's commitment? *</label>
            <div className="grid grid-cols-3 gap-3">
              <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${status === 'YES' ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800'}`}>
                <input type="radio" name="status" value="YES" checked={status === 'YES'} onChange={() => setStatus('YES')} className="hidden" />
                <div className="text-xs font-semibold text-emerald-400">Yes</div>
                <div className="text-[11px] text-zinc-500">All planned tasks</div>
              </label>
              <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${status === 'PARTIAL' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800'}`}>
                <input type="radio" name="status" value="PARTIAL" checked={status === 'PARTIAL'} onChange={() => setStatus('PARTIAL')} className="hidden" />
                <div className="text-xs font-semibold text-amber-400">Partial</div>
                <div className="text-[11px] text-zinc-500">Some progress</div>
              </label>
              <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${status === 'NO' ? 'border-zinc-700 bg-zinc-800' : 'border-zinc-800'}`}>
                <input type="radio" name="status" value="NO" checked={status === 'NO'} onChange={() => setStatus('NO')} className="hidden" />
                <div className="text-xs font-semibold text-zinc-400">No</div>
                <div className="text-[11px] text-zinc-500">Missed today</div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">2. What did you learn today? *</label>
            <textarea
              required
              rows={2}
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              placeholder="Key concepts or insights gained..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">3. What did you complete today? *</label>
            <textarea
              required
              rows={2}
              value={completedWork}
              onChange={(e) => setCompletedWork(e.target.value)}
              placeholder="Specific code written, lessons finished..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">4. Time spent (Minutes) *</label>
            <input
              type="number"
              required
              min={15}
              max={720}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">5. What blocked you today? (Optional)</label>
            <input
              type="text"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="e.g. CSS Grid alignment..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">6. Tomorrow's priority (Optional)</label>
            <input
              type="text"
              value={nextPriority}
              onChange={(e) => setNextPriority(e.target.value)}
              placeholder="e.g. Master React hooks..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> {loading ? 'Submitting...' : 'Submit Daily Check-in'}
          </button>
        </form>
      </div>
    </div>
  );
}
