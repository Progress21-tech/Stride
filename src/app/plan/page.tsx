import { Target, CheckCircle, CircleDot } from 'lucide-react';

export default function PlanPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> Structured Planning
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Goal Hierarchy & Execution Roadmap</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Primary Goal → Milestones → Weekly Objectives → Daily Tasks</p>
        </div>

        <div className="bg-zinc-900/80 rounded-xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" /> Become a Frontend Developer
            </span>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Target: 3 Months
            </span>
          </div>

          <div className="space-y-4 pl-3 border-l-2 border-zinc-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Milestone 1: HTML5 & CSS Grid/Flexbox Fundamentals (Completed)
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CircleDot className="w-4 h-4 text-emerald-400" /> Milestone 2: JavaScript DOM & Event Loop Mastery (In Progress)
              </div>
              <div className="pl-6 space-y-1.5 text-xs text-zinc-300">
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800 flex justify-between">
                  <span>Weekly Objective: Finish JavaScript async/await & DOM manipulation project</span>
                  <span className="text-zinc-500">4 Tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
