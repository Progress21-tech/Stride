import { Video, ExternalLink } from 'lucide-react';

export default function ReviewPage() {
  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div class="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
              <Video class="w-3.5 h-3.5" /> Weekly Group Review
            </div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Saturday Review Package</h1>
            <p class="text-xs text-zinc-400 mt-1">Auto-generated summary for Saturday group review call</p>
          </div>

          <a href="https://meet.google.com/abc-defg-hij" target="_blank" rel="noreferrer" class="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center gap-2">
            <Video class="w-4 h-4" /> Join Google Meet Room <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>

        <div class="bg-zinc-900/90 rounded-xl p-6 border border-zinc-800 space-y-4">
          <div class="text-sm font-bold text-white border-b border-zinc-800 pb-2">
            Member: Alex Chen | Week Ending Saturday
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span class="text-zinc-400">Weekly Objective:</span>
              <div class="font-medium text-white mt-0.5">Finish JavaScript async/await & DOM project</div>
            </div>
            <div>
              <span class="text-zinc-400">Tasks Planned vs Done:</span>
              <div class="font-medium text-emerald-400 mt-0.5">15 of 18 completed (83%)</div>
            </div>
            <div>
              <span class="text-zinc-400">Check-ins Submitted:</span>
              <div class="font-medium text-emerald-400 mt-0.5">6 / 7 days</div>
            </div>
            <div>
              <span class="text-zinc-400">Learning Time:</span>
              <div class="font-medium text-white mt-0.5">8h 40m</div>
            </div>
          </div>

          <div class="text-xs border-t border-zinc-800 pt-3">
            <span class="text-zinc-400">Main Blocker Discussed:</span>
            <div class="text-zinc-200 mt-0.5 font-mono">DOM Event Delegation Bubbling edge cases</div>
          </div>
        </div>
      </div>
    </div>
  );
}
