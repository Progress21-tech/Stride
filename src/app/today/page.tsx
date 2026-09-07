'use client';

import { useState } from 'react';
import { Target, CheckCircle2, Flame, ShieldAlert, Plus } from 'lucide-react';
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
              <span>Week 3 of 12</span>
              <span>•</span>
              <span className="text-zinc-300">Milestone: JavaScript DOM & Event Loop Mastery</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-zinc-400">Daily Deadline</div>
              <div className="text-xs font-mono font-semibold text-zinc-200">11:59 PM (UTC-5)</div>
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
                {Math.round((completedCount / tasks.length) * 100)}%
              </span>
            </div>
          </div>
          <div className="bg-zinc-900/60 rounded-lg p-3.5 border border-zinc-800/80">
            <div className="text-xs text-zinc-400 font-medium">3. Daily Check-in Status</div>
            <div className="text-sm font-semibold text-amber-400 mt-1 flex items-center justify-between">
              <span>Pending submission</span>
              <span className="text-[11px] text-zinc-400 font-normal">Due in 5h 30m</span>
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
            <button onClick={addTask} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.map(task => (
              <div key={task.id} className="bg-zinc-900/80 rounded-xl p-3.5 border border-zinc-800/80 flex items-center justify-between hover:border-zinc-700 transition">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 rounded accent-[#18A957] cursor-pointer"
                  />
                  <span className={`text-xs font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {task.title}
                  </span>
                </div>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${task.completed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
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
                <span className="text-4xl font-bold text-white tracking-tight">12</span>
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
            <div className="text-xs text-zinc-400">0 of 2 emergency passes used this calendar month.</div>
          </div>
        </div>

      </div>

    </div>
  );
}
