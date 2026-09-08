'use client';

import { useEffect, useState } from 'react';
import { Target, CheckCircle, CircleDot } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PlanPage() {
  const [goal, setGoal] = useState<any>(null);

  useEffect(() => {
    async function loadGoal() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('goals')
        .select('title, target_date, milestones(title, status, weekly_objectives(title, status, tasks(id)))')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setGoal(data);
    }
    loadGoal();
  }, []);

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

        <div className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <span className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" /> {goal?.title || 'No active goal yet'}
            </span>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {goal ? `Target: ${new Date(goal.target_date).toLocaleDateString()}` : 'Create a goal'}
            </span>
          </div>

          <div className="space-y-4 pl-3 border-l-2 border-[var(--border-color)]">
            {goal?.milestones?.length ? goal.milestones.map((milestone: any) => (
              <div key={milestone.title} className="space-y-2">
                <div className={`flex items-center gap-2 text-xs font-semibold ${milestone.status === 'COMPLETED' ? 'text-emerald-400' : 'text-[var(--text-main)]'}`}>
                  {milestone.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <CircleDot className="w-4 h-4 text-emerald-400" />}
                  {milestone.title} ({milestone.status.replace('_', ' ')})
                </div>
                {milestone.weekly_objectives?.map((objective: any) => (
                  <div key={objective.title} className="ml-6 rounded border border-[var(--border-color)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-main)] flex justify-between gap-3">
                    <span>{objective.title}</span>
                    <span className="shrink-0 text-[var(--text-muted)]">{objective.tasks?.length || 0} Tasks</span>
                  </div>
                ))}
              </div>
            )) : <div className="text-sm text-[var(--text-muted)]">No milestones have been added yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
