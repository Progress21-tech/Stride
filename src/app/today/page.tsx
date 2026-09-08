'use client';

import { useState, useEffect } from 'react';
import { Target, CheckCircle2, Flame, ShieldAlert, Plus } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getTodayTasks, createDailyTask, updateTaskStatus, calculateUserStreak, useEmergencyPass } from '@/lib/stride-db';
import { Task } from '@/lib/types';

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [passesUsed, setPassesUsed] = useState<number>(0);
  const [isCheckedInToday, setIsCheckedInToday] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('UTC');

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        setUserEmail(user.email || '');
        setCurrentUserId(user.id);

        const { data: profile } = await supabase.from('users').select('timezone').eq('id', user.id).single();
        const userTimezone = profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        setTimezone(userTimezone);

        const fetchedTasks = await getTodayTasks(user.id, userTimezone);
        setTasks(fetchedTasks);

        const currentStreak = await calculateUserStreak(user.id, userTimezone);
        setStreak(currentStreak);

        // Check if user checked in today
        const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: userTimezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
        const { data: chk } = await supabase
          .from('check_ins')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', todayStr)
          .single();

        if (chk) setIsCheckedInToday(true);

        // Count emergency passes used this month
        const monthStr = todayStr.slice(0, 7);
        const { count } = await supabase
          .from('emergency_passes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('month', monthStr);

        setPassesUsed(count || 0);
      } catch (err) {
        console.error('Error loading Today workspace data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: Task['status']) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PLANNED' : 'COMPLETED';
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleAddTask = async () => {
    const title = prompt('Enter new daily task title:');
    if (!title || !currentUserId) return;

    try {
      const newTask = await createDailyTask(currentUserId, title, timezone);
      setTasks([...tasks, newTask]);
    } catch (err: any) {
      alert(err.message || 'Failed to add task.');
    }
  };

  const handlePass = async () => {
    if (!currentUserId) return;
    if (confirm('Record emergency pass for today? (Monthly limit: 2)')) {
      try {
        await useEmergencyPass(currentUserId, 'Member self-requested emergency pass', timezone);
        setPassesUsed(passesUsed + 1);
        setIsCheckedInToday(true);
        alert('Emergency pass logged for today.');
      } catch (err: any) {
        alert(err.message || 'Failed to use emergency pass.');
      }
    }
  };

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Primary Goal Focus */}
      <div className="glass-card rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              <Target className="w-3.5 h-3.5" /> Primary Goal Focus
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Become a Frontend Developer
            </h1>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
              <span>Member: {userEmail || 'Alex Chen'}</span>
              <span>•</span>
              <span className="text-zinc-300">Milestone: JavaScript DOM & Event Loop Mastery</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-zinc-400">Daily Deadline</div>
              <div className="text-xs font-mono font-semibold text-zinc-200">11:59 PM (Local)</div>
            </div>
            <Link href="/check-in" className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Submit Today's Check-in
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          <div className="bg-zinc-900/60 rounded-lg p-3.5 border border-zinc-800/80">
            <div className="text-xs text-zinc-400 font-medium">1. What am I achieving?</div>
            <div className="text-sm font-semibold text-zinc-100 mt-1">Master Modern React & UI Engineering</div>
          </div>
          <div className="bg-zinc-900/60 rounded-lg p-3.5 border border-zinc-800/80">
            <div className="text-xs text-zinc-400 font-medium">2. Today's Execution</div>
            <div className="text-sm font-semibold text-emerald-400 mt-1 flex items-center justify-between">
              <span>{completedCount} of {tasks.length} tasks completed</span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                {completionPercentage}%
              </span>
            </div>
          </div>
          <div className="bg-zinc-900/60 rounded-lg p-3.5 border border-zinc-800/80">
            <div className="text-xs text-zinc-400 font-medium">3. Daily Check-in Status</div>
            <div className="text-sm font-semibold mt-1 flex items-center justify-between">
              {isCheckedInToday ? (
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Submitted Today</span>
              ) : (
                <span className="text-amber-400">Pending submission</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tasks Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Today's Daily Commitments
            </h2>
            <button onClick={handleAddTask} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>

          <div className="space-y-2.5">
            {loading && <div className="text-xs text-zinc-400 py-4 text-center">Loading workspace...</div>}
            
            {!loading && tasks.length === 0 && (
              <div className="bg-zinc-900/40 rounded-xl p-6 text-center text-xs text-zinc-400 border border-zinc-800/60 space-y-2">
                <div>No daily tasks scheduled for today yet.</div>
                <button onClick={handleAddTask} className="text-emerald-400 hover:underline font-medium">
                  + Add your first task for today
                </button>
              </div>
            )}

            {tasks.map(task => (
              <div key={task.id} className="bg-zinc-900/80 rounded-xl p-3.5 border border-zinc-800/80 flex items-center justify-between hover:border-zinc-700 transition">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'COMPLETED'}
                    onChange={() => handleToggleTask(task.id, task.status)}
                    className="w-4 h-4 rounded accent-[#18A957] cursor-pointer"
                  />
                  <span className={`text-xs font-medium ${task.status === 'COMPLETED' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {task.title}
                  </span>
                </div>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400" /> Reporting Streak
              </span>
              <span className="text-xs text-zinc-400 font-mono">Qualifying Days</span>
            </div>
            
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-4xl font-bold text-white tracking-tight">{streak}</span>
                <span className="text-sm text-zinc-400 ml-1">days streak</span>
              </div>
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded font-medium">
                Active Streak
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-zinc-400" /> Emergency Passes
              </span>
              <span className="text-xs text-zinc-400 font-mono">2 / Month</span>
            </div>
            <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
              <div>
                <div className="text-xs text-zinc-300 font-medium">{passesUsed} of 2 passes used</div>
                <div className="text-[11px] text-zinc-500">Resets monthly</div>
              </div>
              <button
                onClick={handlePass}
                disabled={passesUsed >= 2}
                className="px-2.5 py-1 text-xs font-medium rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 border border-zinc-700 transition"
              >
                Use Pass
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
