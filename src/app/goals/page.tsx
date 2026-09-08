import { Target, Calendar, CheckCircle, CircleDot, ChevronRight, Plus } from 'lucide-react';
import { INITIAL_GOALS } from '@/lib/store';

export default function GoalsPage() {
  const goal = INITIAL_GOALS[0];

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-[#18A957] mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> Strategic Objectives
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Goal Hierarchy</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Primary Goal to Milestones to Weekly Objectives to Daily Tasks
          </p>
        </div>

        <div className="border border-[var(--border-color)] rounded-xl p-5 space-y-4 bg-[var(--card-bg)]">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[var(--text-main)]">{goal.title}</h2>
              <p className="text-xs text-[var(--text-muted)]">{goal.description}</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-mono font-semibold rounded bg-[#18A957]/10 text-[#18A957] border border-[#18A957]/20">
              {goal.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[var(--text-muted)] block">Target Date</span>
              <span className="font-semibold text-[var(--text-main)]">
                {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Start Date</span>
              <span className="font-semibold text-[var(--text-main)]">
                {new Date(goal.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Track</span>
              <span className="font-semibold text-[#18A957]">Web Development</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-main)]">Milestones</h3>
            <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white transition flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Milestone
            </button>
          </div>

          <div className="space-y-3">
            {goal.milestones.map((milestone) => (
              <div key={milestone.id} className="border border-[var(--border-color)] rounded-xl p-4 space-y-3 bg-[var(--card-bg)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {milestone.status === 'COMPLETED' ? (
                      <CheckCircle className="w-4 h-4 text-[#18A957]" />
                    ) : (
                      <CircleDot className="w-4 h-4 text-amber-400" />
                    )}
                    <h4 className="text-sm font-bold text-[var(--text-main)]">{milestone.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-muted)]">
                      Target: {new Date(milestone.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono ${
                      milestone.status === 'COMPLETED'
                        ? 'bg-[#18A957]/10 text-[#18A957] border border-[#18A957]/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {milestone.status}
                    </span>
                  </div>
                </div>

                {milestone.weeklyObjectives && milestone.weeklyObjectives.length > 0 && (
                  <div className="pl-2 border-l-2 border-[var(--border-color)] space-y-2">
                    {milestone.weeklyObjectives.map((wo) => (
                      <div key={wo.id} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-[var(--text-main)]">{wo.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          wo.status === 'COMPLETED'
                            ? 'bg-[#18A957]/10 text-[#18A957]'
                            : 'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {wo.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
