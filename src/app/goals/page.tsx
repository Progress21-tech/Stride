'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Target, Calendar, CheckCircle, CircleDot, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createGoal, createMilestone, getGoals } from '@/lib/stride-db';
import { Goal } from '@/lib/types';

const formatDate = (value: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', options).format(new Date(value));

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [milestoneFor, setMilestoneFor] = useState<string | null>(null);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setGoals(await getGoals(user.id));
    }
    load().catch((err) => setError(err.message || 'Unable to load your goals.')).finally(() => setLoading(false));
  }, []);

  async function addGoal(event: FormEvent) {
    event.preventDefault();
    try {
      const goal = await createGoal(userId, goalTitle.trim(), goalDate, goalDescription.trim());
      setGoals((items) => [goal, ...items]);
      setGoalTitle(''); setGoalDescription(''); setGoalDate(''); setShowGoalForm(false);
    } catch (err: any) { setError(err.message || 'Unable to create the goal.'); }
  }

  async function addMilestone(event: FormEvent) {
    event.preventDefault();
    const goal = goals.find((item) => item.id === milestoneFor);
    if (!goal) return;
    try {
      const milestone = await createMilestone(goal.id, milestoneTitle.trim(), milestoneDate, goal.milestones.length + 1);
      setGoals((items) => items.map((item) => item.id === goal.id ? { ...item, milestones: [...item.milestones, milestone] } : item));
      setMilestoneFor(null); setMilestoneTitle(''); setMilestoneDate('');
    } catch (err: any) { setError(err.message || 'Unable to create the milestone.'); }
  }

  return <div className="space-y-6"><div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"><div><div className="text-xs font-mono uppercase text-[#18A957] mb-1 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Strategic Objectives</div><h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Goal Hierarchy</h1><p className="text-xs text-[var(--text-muted)] mt-1">Primary goal to milestones to weekly objectives to daily tasks.</p></div><button onClick={() => setShowGoalForm((visible) => !visible)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white transition flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Goal</button></div>
    {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
    {showGoalForm && <form onSubmit={addGoal} className="grid sm:grid-cols-2 gap-3 rounded-xl border border-[var(--border-color)] p-4 bg-[var(--bg-subtle)]"><input required value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="Goal title" className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm" /><input required type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm" /><input value={goalDescription} onChange={(e) => setGoalDescription(e.target.value)} placeholder="Short description (optional)" className="sm:col-span-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm" /><button className="sm:col-span-2 rounded-lg bg-[#18A957] px-3 py-2 text-xs font-semibold text-white">Save goal</button></form>}
    {loading ? <div className="py-8 text-center text-sm text-[var(--text-muted)]">Loading goals...</div> : goals.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center text-sm text-[var(--text-muted)]">Start by adding the outcome you want to achieve, then break it into milestones.</div> : goals.map((goal) => <section key={goal.id} className="space-y-4 border border-[var(--border-color)] rounded-xl p-5 bg-[var(--card-bg)]"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-[var(--text-main)]">{goal.title}</h2>{goal.description && <p className="text-xs text-[var(--text-muted)] mt-1">{goal.description}</p>}</div><span className="px-2.5 py-1 text-[10px] font-mono font-semibold rounded bg-[#18A957]/10 text-[#18A957] border border-[#18A957]/20">{goal.status}</span></div><div className="text-xs text-[var(--text-muted)]">Target date: <span className="font-semibold text-[var(--text-main)]">{formatDate(goal.targetDate, { month: 'long', day: 'numeric', year: 'numeric' })}</span></div><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-[var(--text-main)]">Milestones</h3><button onClick={() => setMilestoneFor(goal.id)} className="text-xs text-[#18A957] hover:underline flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add milestone</button></div>{milestoneFor === goal.id && <form onSubmit={addMilestone} className="grid sm:grid-cols-3 gap-2"><input required value={milestoneTitle} onChange={(e) => setMilestoneTitle(e.target.value)} placeholder="Milestone title" className="sm:col-span-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm" /><input required type="date" value={milestoneDate} onChange={(e) => setMilestoneDate(e.target.value)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm" /><button className="sm:col-span-3 rounded-lg bg-[#18A957] px-3 py-2 text-xs font-semibold text-white">Save milestone</button></form>}<div className="space-y-3">{goal.milestones.map((milestone) => <div key={milestone.id} className="border border-[var(--border-color)] rounded-xl p-4 space-y-3"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2">{milestone.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 text-[#18A957]" /> : <CircleDot className="w-4 h-4 text-amber-400" />}<h4 className="text-sm font-bold text-[var(--text-main)]">{milestone.title}</h4></div><span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(milestone.targetDate, { month: 'short', day: 'numeric' })}</span></div>{milestone.weeklyObjectives.map((objective) => <div key={objective.id} className="border-l-2 border-[var(--border-color)] pl-3 text-xs text-[var(--text-main)]">{objective.title}</div>)}</div>)}</div></section>)}
  </div></div>;
}
