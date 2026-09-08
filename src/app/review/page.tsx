import { Video, ExternalLink } from 'lucide-react';

export default function ReviewPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> Weekly Group Review
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Saturday Review Package</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">Auto-generated summary for Saturday group review call</p>
          </div>

          <a href="https://meet.google.com/abc-defg-hij" target="_blank" rel="noreferrer" className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center gap-2">
            <Video className="w-4 h-4" /> Join Google Meet Room <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="bg-zinc-900/90 rounded-xl p-6 border border-zinc-800 space-y-4">
          <div className="text-sm font-bold text-white border-b border-zinc-800 pb-2">
            Member: Alex Chen | Week Ending Saturday
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-zinc-400">Weekly Objective:</span>
              <div className="font-medium text-white mt-0.5">Finish JavaScript async/await & DOM project</div>
            </div>
            <div>
              <span className="text-zinc-400">Tasks Planned vs Done:</span>
              <div className="font-medium text-emerald-400 mt-0.5">15 of 18 completed (83%)</div>
            </div>
            <div>
              <span className="text-zinc-400">Check-ins Submitted:</span>
              <div className="font-medium text-emerald-400 mt-0.5">6 / 7 days</div>
            </div>
            <div>
              <span className="text-zinc-400">Learning Time:</span>
              <div className="font-medium text-white mt-0.5">8h 40m</div>
            </div>
          </div>

          <div className="text-xs border-t border-zinc-800 pt-3">
            <span className="text-zinc-400">Main Blocker Discussed:</span>
            <div className="text-zinc-200 mt-0.5 font-mono">DOM Event Delegation Bubbling edge cases</div>
          </div>
        </div>
      </div>
    </div>
  );
}
