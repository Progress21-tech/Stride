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
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div class="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
            <Calendar class="w-3.5 h-3.5" /> Daily Accountability Report
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Submit Today's Check-in</h1>
          <p class="text-xs text-zinc-400 mt-1">
            Deadline: 11:59 PM in your local timezone (<span class="font-mono text-zinc-300">UTC-5</span>).
          </p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-5">
          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1.5">1. Did you complete today's commitment? *</label>
            <div class="grid grid-cols-3 gap-3">
              <label class="border border-zinc-800 rounded-lg p-3 text-center cursor-pointer hover:border-emerald-500 transition">
                <input type="radio" name="status" value="YES" defaultChecked class="hidden" />
                <div class="text-xs font-semibold text-emerald-400">Yes</div>
                <div class="text-[11px] text-zinc-500">All planned tasks</div>
              </label>
              <label class="border border-zinc-800 rounded-lg p-3 text-center cursor-pointer hover:border-amber-500 transition">
                <input type="radio" name="status" value="PARTIAL" class="hidden" />
                <div class="text-xs font-semibold text-amber-400">Partial</div>
                <div class="text-[11px] text-zinc-500">Some progress</div>
              </label>
              <label class="border border-zinc-800 rounded-lg p-3 text-center cursor-pointer hover:border-zinc-700 transition">
                <input type="radio" name="status" value="NO" class="hidden" />
                <div class="text-xs font-semibold text-zinc-400">No</div>
                <div class="text-[11px] text-zinc-500">Missed today</div>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1">2. What did you learn today? *</label>
            <textarea required rows={2} placeholder="Key concepts or insights..." class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1">3. What did you complete today? *</label>
            <textarea required rows={2} placeholder="Specific work done..." class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1">4. Time spent (Minutes) *</label>
            <input type="number" required defaultValue={90} min={15} max={720} class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1">5. What blocked you today? (Optional)</label>
            <input type="text" placeholder="e.g. CSS Grid alignment..." class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1">6. Tomorrow's priority (Optional)</label>
            <input type="text" placeholder="e.g. Master React hooks..." class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <button type="submit" class="w-full py-3 text-sm font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center justify-center gap-2">
            <CheckCircle class="w-4 h-4" /> Submit Check-in
          </button>
        </form>
      </div>
    </div>
  );
}
