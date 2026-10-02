'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Circle, CheckCircle2, Plus, Target } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Task = { id: string; title: string; due_date: string; status: string };
type Goal = { id: string; title: string };
type PlannerView = 'day' | 'week' | 'month';

export default function PlanPage() {
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [view, setView] = useState<PlannerView>('month');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [userId, setUserId] = useState('');
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      const from = format(startOfWeek(startOfMonth(month)), 'yyyy-MM-dd');
      const to = format(endOfWeek(endOfMonth(month)), 'yyyy-MM-dd');
      const [taskResult, goalResult] = await Promise.all([
        supabase.from('tasks').select('id,title,due_date,status').eq('user_id', user.id).gte('due_date', from).lte('due_date', to).order('due_date').order('created_at'),
        supabase.from('goals').select('id,title').eq('user_id', user.id).eq('status', 'ACTIVE').order('created_at', { ascending: false }),
      ]);
      if (!active) return;
      if (taskResult.error) setError(taskResult.error.message);
      setTasks(taskResult.data || []);
      setGoals(goalResult.data || []);
      setLoading(false);
    }
    setLoading(true);
    load();
    return () => { active = false; };
  }, [month]);

  const days = useMemo(() => view === 'day' ? [selectedDay] : view === 'week' ? eachDayOfInterval({ start: startOfWeek(selectedDay), end: endOfWeek(selectedDay) }) : eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) }), [month, selectedDay, view]);
  const selectedTasks = tasks.filter((task) => task.due_date === format(selectedDay, 'yyyy-MM-dd'));
  const visibleTaskCount = tasks.filter((task) => days.some((day) => task.due_date === format(day, 'yyyy-MM-dd'))).length;

  function navigate(direction: -1 | 1) {
    if (view === 'month') {
      const next = direction < 0 ? subMonths(month, 1) : addMonths(month, 1);
      setMonth(next);
    } else {
      const next = addDays(selectedDay, view === 'week' ? direction * 7 : direction);
      setSelectedDay(next);
      setMonth(next);
    }
  }

  async function addTask(event: FormEvent) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title || !userId) return;
    const { data, error: insertError } = await supabase.from('tasks').insert({ user_id: userId, title, due_date: format(selectedDay, 'yyyy-MM-dd'), status: 'PLANNED' }).select('id,title,due_date,status').single();
    if (insertError) { setError(insertError.message); return; }
    setTasks((current) => [...current, data]);
    setNewTask('');
  }

  async function toggleTask(task: Task) {
    const status = task.status === 'COMPLETED' ? 'PLANNED' : 'COMPLETED';
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, status } : item));
    const { error: updateError } = await supabase.from('tasks').update({ status, completed_at: status === 'COMPLETED' ? new Date().toISOString() : null }).eq('id', task.id);
    if (updateError) {
      setError(updateError.message);
      setTasks((current) => current.map((item) => item.id === task.id ? task : item));
    }
  }

  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="mb-1 flex items-center gap-2 text-xs font-mono uppercase text-[#18A957]"><CalendarDays className="h-4 w-4"/> Personal planner</div><h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">Make your goals part of every day.</h1><p className="mt-1 text-sm text-[var(--text-muted)]">Plan tasks on a calendar and keep your goals moving week by week.</p></div>
      <div className="flex flex-wrap items-center gap-2"><div className="flex items-center gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-1">{(['day','week','month'] as const).map((item) => <button key={item} onClick={() => setView(item)} aria-pressed={view === item} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize ${view === item ? 'bg-[#18A957]/10 text-[#18A957]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'}`}>{item}</button>)}</div><div className="flex items-center gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-1"><button aria-label="Previous" onClick={() => navigate(-1)} className="rounded-lg p-2 hover:bg-[var(--bg-subtle)]"><ChevronLeft className="h-4 w-4"/></button><span className="min-w-28 text-center text-sm font-semibold text-[var(--text-main)]">{view === 'day' ? format(selectedDay, 'MMM d, yyyy') : view === 'week' ? `${format(days[0], 'MMM d')} – ${format(days[6], 'MMM d')}` : format(month, 'MMMM yyyy')}</span><button aria-label="Next" onClick={() => navigate(1)} className="rounded-lg p-2 hover:bg-[var(--bg-subtle)]"><ChevronRight className="h-4 w-4"/></button><button onClick={() => { const now = new Date(); setMonth(now); setSelectedDay(now); }} className="rounded-lg px-3 py-2 text-xs font-semibold text-[#18A957] hover:bg-[#18A957]/10">Today</button></div></div>
    </header>
    {goals.length > 0 && <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{goals.slice(0, 3).map((goal) => <div key={goal.id} className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-3"><span className="rounded-lg bg-[#18A957]/10 p-2 text-[#18A957]"><Target className="h-4 w-4"/></span><div className="min-w-0"><div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Active goal</div><div className="truncate text-sm font-semibold text-[var(--text-main)]">{goal.title}</div></div></div>)}</section>}
    {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-xs text-red-500">{error}</p>}
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
      <div className="glass-card rounded-2xl p-3 sm:p-5">
        {view !== 'day' && <div className="grid grid-cols-7 pb-2">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => <div key={day} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)] sm:text-xs">{day}</div>)}</div>}
        <div className="grid overflow-hidden rounded-xl border-l border-t border-[var(--border-color)]" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>{days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = tasks.filter((task) => task.due_date === dateKey);
          const selected = isSameDay(day, selectedDay);
          return <button key={dateKey} onClick={() => setSelectedDay(day)} aria-pressed={selected} className={`min-h-[76px] border-b border-r border-[var(--border-color)] p-1.5 text-left transition sm:min-h-24 sm:p-2 ${selected ? 'bg-[#18A957]/10' : 'bg-[var(--card-bg)] hover:bg-[var(--bg-subtle)]'} ${view === 'month' && !isSameMonth(day, month) ? 'opacity-45' : ''}`}><span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs ${isSameDay(day, new Date()) ? 'bg-[#18A957] font-bold text-white' : 'text-[var(--text-main)]'}`}>{view === 'day' ? format(day, 'EEEE, MMMM d') : format(day, 'd')}</span><span className="mt-1 hidden space-y-1 sm:block">{dayTasks.slice(0, 2).map((task) => <span key={task.id} className={`block truncate rounded px-1 py-0.5 text-[10px] ${task.status === 'COMPLETED' ? 'bg-[var(--bg-subtle)] text-[var(--text-muted)] line-through' : 'bg-[#18A957]/10 text-[#18A957]'}`}>{task.title}</span>)}{dayTasks.length > 2 && <span className="block px-1 text-[9px] text-[var(--text-muted)]">+{dayTasks.length - 2} more</span>}</span><span className="mx-auto mt-1 flex w-fit gap-0.5 sm:hidden">{dayTasks.slice(0, 3).map((task) => <span key={task.id} className="h-1 w-1 rounded-full bg-[#18A957]" />)}</span></button>;
        })}</div>
        <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-muted)]"><span>{visibleTaskCount} task{visibleTaskCount === 1 ? '' : 's'} in this {view}</span><span>Choose a day to plan</span></div>
      </div>
      <aside className="glass-card rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4"><div><div className="text-xs font-mono uppercase text-[#18A957]">Daily plan</div><h2 className="mt-1 text-lg font-bold text-[var(--text-main)]">{format(selectedDay, 'EEEE, MMM d')}</h2></div><span className="rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 text-xs text-[var(--text-muted)]">{selectedTasks.length} tasks</span></div>
        <form onSubmit={addTask} className="mt-4 flex gap-2"><input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task for this day" aria-label="New task" className="min-w-0 flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[#18A957]"/><button aria-label="Add task" className="rounded-lg bg-[#18A957] px-3 text-white hover:bg-[#15944c]"><Plus className="h-4 w-4"/></button></form>
        <div className="mt-4 space-y-2">{loading ? <p className="py-5 text-center text-sm text-[var(--text-muted)]">Loading your calendar…</p> : selectedTasks.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--border-color)] p-5 text-center text-sm text-[var(--text-muted)]">Nothing planned yet. Add one small step toward your goal.</div> : selectedTasks.map((task) => <button key={task.id} onClick={() => toggleTask(task)} className="flex w-full items-start gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-3 text-left hover:border-[#18A957]/50">{task.status === 'COMPLETED' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#18A957]"/> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]"/>}<span className={`text-sm ${task.status === 'COMPLETED' ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-main)]'}`}>{task.title}</span></button>)}</div>
        <div className="mt-5 rounded-xl bg-[var(--bg-subtle)] p-3 text-xs leading-relaxed text-[var(--text-muted)]">Break your goal into small, dated actions. Your daily plan also appears on the Today page.</div>
      </aside>
    </section>
  </div>;
}
