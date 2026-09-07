import { Target, CheckCircle, CircleDot } from 'lucide-react';

export default function PlanPage() {
  return (
    <div class="space-y-6">
      <div class="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div class="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
            <Target class="w-3.5 h-3.5" /> Structured Planning
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Goal Hierarchy & Execution Roadmap</h1>
          <p class="text-xs text-zinc-400 mt-1">Primary Goal → Milestones → Weekly Objectives → Daily Tasks</p>
        </div>

        <div class="bg-zinc-900/80 rounded-xl p-5 border border-zinc-800 space-y-4">
          <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span class="text-sm font-bold text-white flex items-center gap-2">
              <Target class="w-4 h-4 text-emerald-400" /> Become a Frontend Developer
            </span>
            <span class="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Target: 3 Months
            </span>
          </div>

          <div class="space-y-4 pl-3 border-l-2 border-zinc-800">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <CheckCircle class="w-4 h-4 text-emerald-400" /> Milestone 1: HTML5 & CSS Grid/Flexbox Fundamentals (Completed)
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CircleDot class="w-4 h-4 text-emerald-400" /> Milestone 2: JavaScript DOM & Event Loop Mastery (In Progress)
              </div>
              <div class="pl-6 space-y-1.5 text-xs text-zinc-300">
                <div class="p-2 rounded bg-zinc-900 border border-zinc-800 flex justify-between">
                  <span>Weekly Objective: Finish JavaScript async/await & DOM manipulation project</span>
                  <span class="text-zinc-500">4 Tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
