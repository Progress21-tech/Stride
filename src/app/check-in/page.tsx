'use client';

import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle } from 'lucide-react';

export default function CheckinPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Check-in submitted! Your daily streak has been updated.');
    router.push('/today');
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
            Deadline: 11:59 PM in your local timezone (<span className="font-mono text-zinc-300">UTC-5</span>).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">1. Did you complete today's commitment? *</label>
            <div className="grid grid-cols-3 gap-3">
              <label className="border border-zinc-800 rounded-lg p-3 text-center cursor-pointer hover:border-emerald-500 transition">
                <input type="radio" name="status" value="YES" defaultChecked className="hidden" />
                <div className="text-xs font-semibold text-emerald-400">Yes</div>
                <div className="text-[11px] text-zinc-500">All planned tasks</div>
              </label>
              <label className="border border-zinc-800 rounded-lg p-3 text-center cursor-pointer hover:border-amber-500 transition">
                <input type="radio" name="status" value="PARTIAL" className="hidden" />
                <div className="text-xs font-semibold text-amber-400">Partial</div>
                <div className="text-[11px] text-zinc-500">Some progress</div>
              </label>
              <label className="border border-zinc-800 rounded-lg p-3 text-center cursor-pointer hover:border-zinc-700 transition">
                <input type="radio" name="status" value="NO" className="hidden" />
                <div className="text-xs font-semibold text-zinc-400">No</div>
                <div className="text-[11px] text-zinc-500">Missed today</div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">2. What did you learn today? *</label>
            <textarea required rows={2} placeholder="Key concepts or insights..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">3. What did you complete today? *</label>
            <textarea required rows={2} placeholder="Specific work done..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">4. Time spent (Minutes) *</label>
            <input type="number" required defaultValue={90} min={15} max={720} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">5. What blocked you today? (Optional)</label>
            <input type="text" placeholder="e.g. CSS Grid alignment..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">6. Tomorrow's priority (Optional)</label>
            <input type="text" placeholder="e.g. Master React hooks..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <button type="submit" className="w-full py-3 text-sm font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> Submit Check-in
          </button>
        </form>
      </div>
    </div>
  );
}
