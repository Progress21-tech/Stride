'use client';

import { useState, useEffect } from 'react';
import { Target, CheckCircle, CircleDot, Plus, Calendar, TrendingUp, Pen, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { INITIAL_GOALS } from '@/lib/store';
import { Goal, Milestone } from '@/lib/types';
import { StrideLogo } from '@/components/StrideLogo';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalTrack, setNewGoalTrack] = useState('Web Development');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadGoals() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setGoals(INITIAL_GOALS);
          setActiveGoal(INITIAL_GOALS[0]);
          setLoading(false);
          return;
        }

        const { data: fetchedGoals, error } = await supabase
          .from('goals')
          .select(`
            *,
            milestones (
              id,
              goal_id,
              title,
              target_date,
              status,
              display_order,
              weekly_objectives (
                id,
                milestone_id,
                title,
                status,
                tasks (
                  id,
                  title,
                  due_date,
                  status,
                  completed_at
                )
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching goals:', error);
          setGoals(INITIAL_GOALS);
          setActiveGoal(INITIAL_GOALS[0]);
        } else if (fetchedGoals && fetchedGoals.length > 0) {
          const mappedGoals: Goal[] = fetchedGoals.map((g: any) => ({
            id: g.id,
            userId: g.user_id,
            title: g.title,
            description: g.description,
            startDate: g.start_date,
            targetDate: g.target_date,
            status: g.status,
            milestones: (g.milestones || []).map((m: any) => ({
              id: m.id,
              goalId: m.goal_id,
              title: m.title,
              targetDate: m.target_date,
              status: m.status,
              order: m.display_order,
              weeklyObjectives: (m.weekly_objectives || []).map((wo: any) => ({
                id: wo.id,
                milestoneId: wo.milestone_id,
                title: wo.title,
                status: wo.status,
                tasks: (wo.tasks || []).map((t: any) => ({
                  id: t.id,
                  userId: user.id,
                  weeklyObjectiveId: wo.id,
                  title: t.title,
                  dueDate: t.due_date,
                  status: t.status,
                  completedAt: t.completed_at,
                })),
              })),
            })),
          }));
          setGoals(mappedGoals);
          setActiveGoal(mappedGoals[0]);
        } else {
          setGoals(INITIAL_GOALS);
          setActiveGoal(INITIAL_GOALS[0]);
        }
      } catch (err) {
        console.error('Error loading goals:', err);
        setGoals(INITIAL_GOALS);
        setActiveGoal(INITIAL_GOALS[0]);
      } finally {
        setLoading(false);
      }
    }
    loadGoals();
  }, []);

  const handleCreateGoal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user.id,
            title: newGoalTitle,
            description: newGoalDesc || null,
            target_date: newGoalTarget,
            status: 'ACTIVE',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newGoal: Goal = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        startDate: data.start_date,
        targetDate: data.target_date,
        status: data.status,
        milestones: [],
      };

      setGoals([newGoal, ...goals]);
      setActiveGoal(newGoal);
      setShowCreateModal(false);
      setNewGoalTitle('');
      setNewGoalDesc('');
      setNewGoalTarget('');
    } catch (err: any) {
      alert(err.message || 'Failed to create goal.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateMilestoneProgress = (milestone: Milestone): number => {
    const allTasks = milestone.weeklyObjectives.flatMap(wo => wo.tasks);
    if (allTasks.length === 0) return 0;
    const completed = allTasks.filter(t => t.status === 'COMPLETED').length;
    return Math.round((completed / allTasks.length) * 100);
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'IN_PROGRESS': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-zinc-400 bg-zinc-800/50 border-zinc-700';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const daysUntil = (targetDate: string) => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const days = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xs text-[var(--text-muted)]">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono uppercase text-[#18A957] font-semibold flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> Strategic Goals
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] mt-1">Goals & Milestone Hierarchy</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Primary Goal → Milestones → Weekly Objectives → Daily Tasks</p>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center space-y-4 border border-[var(--border-color)]">
          <Target className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-main)]">No goals defined yet</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Create your first goal to begin structuring your learning pathway.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white transition flex items-center gap-1.5 mx-auto"
            >
              <Plus className="w-3.5 h-3.5" /> Create Your First Goal
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => setActiveGoal(goal)}
              className={`glass-card rounded-xl p-5 cursor-pointer transition-all ${
                activeGoal?.id === goal.id
                  ? 'border-[#18A957] ring-1 ring-[#18A957]/20'
                  : 'border-[var(--border-color)] hover:border-[var(--border-color)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    goal.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-[#18A957]/10 text-[#18A957]'
                  }`}>
                    <Target className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{goal.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className={`px-2 py-0.5 rounded font-mono ${
                    goal.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : goal.status === 'PAUSED'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-[#18A957]/10 text-[#18A957]'
                  }`}>
                    {goal.status}
                  </span>
                  <div className="text-[var(--text-muted)] mt-1">
                    Target: {formatDate(goal.targetDate)}
                  </div>
                </div>
              </div>

              {goal.milestones && goal.milestones.length > 0 && (
                <div className="mt-4 space-y-2">
                  {goal.milestones.map((milestone, idx) => {
                    const progress = calculateMilestoneProgress(milestone);
                    return (
                      <div key={milestone.id} className="flex items-center gap-3 text-xs">
                        <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${getMilestoneStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                        <span className="text-[var(--text-main)] flex-1">{milestone.title}</span>
                        <span className="text-[var(--text-muted)] w-12 text-right">{progress}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeGoal && (
        <div className="glass-card rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <CircleDot className="w-4 h-4 text-[#18A957]" /> Active: {activeGoal.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {daysUntil(activeGoal.targetDate)} days left
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {activeGoal.milestones.filter(m => m.status === 'COMPLETED').length} / {activeGoal.milestones.length} milestones
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {activeGoal.milestones.length === 0 ? (
              <div className="text-xs text-[var(--text-muted)] italic py-3">No milestones defined yet.</div>
            ) : (
              activeGoal.milestones.map((milestone) => {
                const progress = calculateMilestoneProgress(milestone);
                const totalTasks = milestone.weeklyObjectives.flatMap(wo => wo.tasks).length;
                const completedTasks = milestone.weeklyObjectives.flatMap(wo => wo.tasks).filter(t => t.status === 'COMPLETED').length;
                return (
                  <div key={milestone.id} className="bg-[var(--bg-subtle)] rounded-lg p-3 border border-[var(--border-color)] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          milestone.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : milestone.status === 'IN_PROGRESS'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {milestone.status === 'COMPLETED' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <CircleDot className="w-3 h-3" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-[var(--text-main)]">{milestone.title}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${getMilestoneStatusColor(milestone.status)}`}>
                        {milestone.status}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--text-muted)]">
                      Target: {formatDate(milestone.targetDate)}
                    </div>

                    {totalTasks > 0 && (
                      <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#18A957] transition-all"
                          style={{ width: `${Math.round((completedTasks / totalTasks) * 100)}%` }}
                        />
                      </div>
                    )}

                    <div className="text-[11px] text-[var(--text-muted)]">
                      {completedTasks} of {totalTasks} tasks completed across {milestone.weeklyObjectives.length} weekly objective(s)
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md space-y-4 border border-[var(--border-color)]">
            <h3 className="text-lg font-bold text-[var(--text-main)]">Create New Goal</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-muted)] mb-1">Goal Title *</label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Become a Frontend Developer"
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#18A957]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-muted)] mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newGoalDesc}
                  onChange={(e) => setNewGoalDesc(e.target.value)}
                  placeholder="Outcome and scope..."
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#18A957]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-muted)] mb-1">Target Date *</label>
                <input
                  type="date"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#18A957]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-muted)] mb-1">Track</label>
                <select
                  value={newGoalTrack}
                  onChange={(e) => setNewGoalTrack(e.target.value)}
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#18A957]"
                >
                  <option>Web Development</option>
                  <option>Data Analytics</option>
                  <option>Cybersecurity</option>
                  <option>Product Design</option>
                </select>
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">
                Success Definition: Clearly measurable outcome (e.g., Portfolio with 3 completed projects)
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-xs font-medium rounded-lg border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                disabled={submitting || !newGoalTitle.trim() || !newGoalTarget}
                className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white disabled:opacity-50 transition flex items-center justify-center gap-1"
              >
                {submitting ? 'Creating...' : 'Create Goal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
