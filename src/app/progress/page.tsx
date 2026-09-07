import { TrendingUp } from 'lucide-react';

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Historical Evidence
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Progress Analytics & Accountability History</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400">Check-in Rate</div>
            <div className="text-3xl font-bold text-emerald-400 mt-1">100%</div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400">Task Completion</div>
            <div className="text-3xl font-bold text-emerald-400 mt-1">83%</div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400">Self-Reported Learning Time</div>
            <div className="text-3xl font-bold text-white mt-1">8h 40m</div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400">Milestones Completed</div>
            <div className="text-3xl font-bold text-white mt-1">1 of 4</div>
          </div>
        </div>
      </div>
    </div>
  );
}
