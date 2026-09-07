'use client';

import { useState } from 'react';
import { Target, CheckCircle2, Flame, ShieldAlert, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TodayPage() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Implement mobile navigation drawer with accessible ARIA attributes', completed: true, status: 'COMPLETED' },
    { id: '2', title: 'Refactor fetch API handling to include error try/catch boundaries', completed: true, status: 'COMPLETED' },
    { id: '3', title: 'Write custom hook for window resize breakpoint detection', completed: false, status: 'PLANNED' },
    { id: '4', title: 'Review JS Event Bubbling vs Capturing documentation', completed: false, status: 'PLANNED' }
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'COMPLETED' : 'PLANNED' } : t));
  };

  const addTask = () => {
    const title = prompt('Enter new daily task title:');
    if (title) {
      setTasks([...tasks, { id: Date.now().toString(), title, completed: false, status: 'PLANNED' }]);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div class="space-y-6">
      
      <!-- Top Banner: Primary Goal Focus -->
      <div class="glass-card rounded-xl p-6 relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div>
            <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              <Target class="w-3.5 h-3.5" /> Primary Goal Focus
            </div>
            <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Become a Frontend Developer
            </h1>
            <p class="text-xs text-zinc-400 mt-1 flex items-center gap-3">
              <span>Week 3 of 12</span>
              <span>•</span>
              <span class="text-zinc-300">Milestone: JavaScript DOM & Event Loop Mastery</span>
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <div class="text-xs text-zinc-400">Daily Deadline</div>
              <div class="text-xs font-mono font-semibold text-zinc-200">11:59 PM (UTC-5)</div>
            </div>
            <Link href="/check-in" class="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4" /> Submit Today's Check-in
            </Link>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          <div class="bg-zinc-900/60 rounded-lg p-3.5 border border-zinc-800/80">
            <div class="text-xs text-zinc-400 font-medium">1. What am I achieving?</div>
            <div class="text-sm font-semibold text-zinc-100 mt-1">Master Modern React & UI Engineering</div>
          </div>
          <div class="bg-zinc-900/60 rounded-lg p-3.5 border border-zinc-800/80">
            <div class="text-xs text-zinc-400 font-medium">2. Today's Execution</div>
            <div class="text-sm font-semibold text-emerald-400 mt-1 flex items-center justify-between">
              <span>{completedCount} of {tasks.length} tasks completed</span>
              <span class="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                {Math.round((completedCount / tasks.length) * 100)}%
              </span>
            </div>
          </div>
          <div class="bg-zinc-900/60 rounded-lg p-3.5 border border-zinc-800/80">
            <div class="text-xs text-zinc-400 font-medium">3. Daily Check-in Status</div>
            <div class="text-sm font-semibold text-amber-400 mt-1 flex items-center justify-between">
              <span>Pending submission</span>
              <span class="text-[11px] text-zinc-400 font-normal">Due in 5h 30m</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Tasks Column -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-white flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400" /> Today's Daily Commitments
            </h2>
            <button onClick={addTask} class="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
              <Plus class="w-3.5 h-3.5" /> Add Task
            </button>
          </div>

          <div class="space-y-2.5">
            {tasks.map(task => (
              <div key={task.id} class="bg-zinc-900/80 rounded-xl p-3.5 border border-zinc-800/80 flex items-center justify-between hover:border-zinc-700 transition">
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    class="w-4 h-4 rounded accent-[#18A957] cursor-pointer"
                  />
                  <span class={`text-xs font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {task.title}
                  </span>
                </div>
                <span class={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${task.completed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <!-- Sidebar Column -->
        <div class="space-y-4">
          <div class="glass-card rounded-xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span class="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame class="w-4 h-4 text-emerald-400" /> Reporting Streak
              </span>
              <span class="text-xs text-zinc-400 font-mono">Qualifying Days</span>
            </div>
            
            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-4xl font-bold text-white tracking-tight">12</span>
                <span class="text-sm text-zinc-400 ml-1">days streak</span>
              </div>
              <div class="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded font-medium">
                Active Streak
              </div>
            </div>
          </div>

          <div class="glass-card rounded-xl p-5 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert class="w-4 h-4 text-zinc-400" /> Emergency Passes
              </span>
              <span class="text-xs text-zinc-400 font-mono">2 / Month</span>
            </div>
            <div class="text-xs text-zinc-400">0 of 2 emergency passes used this calendar month.</div>
          </div>
        </div>

      </div>

    </div>
  );
}
