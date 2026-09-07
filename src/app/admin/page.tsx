'use client';

import { useState } from 'react';
import { Shield, Inbox, Users, Scroll } from 'lucide-react';

export default function AdminPage() {
  const [apps, setApps] = useState([
    {
      id: 'app-101',
      userName: 'David Okonjo',
      userEmail: 'david.o@example.com',
      interest: 'Web Development',
      techStatus: 'Complete Beginner',
      capacity: '2 hours/day',
      timezone: 'Africa/Lagos (UTC+1)',
      why: 'I have started 3 different Udemy courses in the last 6 months but dropped out after week 2 every single time due to lack of structure and isolation.',
      score: 92,
      status: 'SUBMITTED'
    },
    {
      id: 'app-102',
      userName: 'Amina Yusuf',
      userEmail: 'amina.yusuf@example.com',
      interest: 'Data',
      techStatus: 'Self-Taught',
      capacity: '1.5 hours/day',
      timezone: 'Africa/Lagos (UTC+1)',
      why: 'I am transitioning from accounting into Data Analytics. I need a clear goal hierarchy and weekly review feedback.',
      score: 88,
      status: 'UNDER_REVIEW'
    }
  ]);

  const [members] = useState([
    { id: '1', name: 'Alex Chen', track: 'Web Development', goal: 'Become a Frontend Developer', streak: 12, completionRate: 83, checkinToday: false, risk: 'Normal' },
    { id: '2', name: 'Sarah Kante', track: 'Data Analytics', goal: 'Master SQL & Data Science', streak: 7, completionRate: 90, checkinToday: true, risk: 'Normal' }
  ]);

  const approveApp = (id: string) => {
    const target = apps.find(a => a.id === id);
    if (target) {
      alert(`Approved application for ${target.userName}! Workspace created & welcome email dispatched.`);
      setApps(apps.filter(a => a.id !== id));
    }
  };

  const rejectApp = (id: string) => {
    setApps(apps.filter(a => a.id !== id));
  };

  return (
    <div class="space-y-6">
      
      <div class="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <div class="text-xs font-mono uppercase text-amber-400 flex items-center gap-1.5">
            <Shield class="w-3.5 h-3.5" /> Operations Console
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Admin Overview Dashboard</h1>
        </div>
        <div class="text-xs text-zinc-400">
          Logged as Admin: <span class="text-white font-medium">Marcus Vance</span>
        </div>
      </div>

      <!-- Widgets Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div class="glass-card rounded-xl p-4 space-y-1">
          <div class="text-[11px] text-zinc-400">Applications Pending</div>
          <div class="text-2xl font-bold text-amber-400">{apps.length}</div>
        </div>
        <div class="glass-card rounded-xl p-4 space-y-1">
          <div class="text-[11px] text-zinc-400">Today's Check-ins</div>
          <div class="text-2xl font-bold text-emerald-400">1 / 2</div>
        </div>
        <div class="glass-card rounded-xl p-4 space-y-1">
          <div class="text-[11px] text-zinc-400">At-Risk Members</div>
          <div class="text-2xl font-bold text-zinc-200">0</div>
        </div>
        <div class="glass-card rounded-xl p-4 space-y-1">
          <div class="text-[11px] text-zinc-400">Group Completion Rate</div>
          <div class="text-2xl font-bold text-emerald-400">83%</div>
        </div>
        <div class="glass-card rounded-xl p-4 space-y-1">
          <div class="text-[11px] text-zinc-400">Saturday Review</div>
          <div class="text-sm font-bold text-white mt-1">Ready</div>
        </div>
        <div class="glass-card rounded-xl p-4 space-y-1">
          <div class="text-[11px] text-zinc-400">Passes Used</div>
          <div class="text-2xl font-bold text-zinc-400">0</div>
        </div>
      </div>

      <!-- Queue Section -->
      <div class="glass-card rounded-xl p-6 space-y-4">
        <h2 class="text-base font-semibold text-white flex items-center gap-2">
          <Inbox class="w-4 h-4 text-amber-400" /> Applications Awaiting Review ({apps.length})
        </h2>

        <div class="space-y-4">
          {apps.map(app => (
            <div key={app.id} class="bg-zinc-900/90 rounded-xl p-5 border border-zinc-800 space-y-3">
              <div class="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div>
                  <span class="text-sm font-bold text-white">{app.userName}</span>
                  <span class="text-xs text-zinc-400 ml-2">({app.userEmail})</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                    Score: {app.score}/100
                  </span>
                  <span class="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                    {app.status}
                  </span>
                </div>
              </div>

              <p class="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded border border-zinc-800/60 font-mono">
                "{app.why}"
              </p>

              <div class="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => rejectApp(app.id)} class="px-3 py-1.5 text-xs font-medium rounded bg-zinc-800 hover:bg-zinc-700 text-red-400 border border-zinc-700 transition">
                  Reject
                </button>
                <button onClick={() => approveApp(app.id)} class="px-4 py-1.5 text-xs font-semibold rounded bg-[#18A957] hover:bg-[#15944c] text-white shadow-sm transition">
                  Approve & Provision Workspace
                </button>
              </div>
            </div>
          ))}
          {apps.length === 0 && (
            <div class="text-xs text-zinc-400 italic">No applications currently pending in queue.</div>
          )}
        </div>
      </div>

      <!-- Member Directory Table -->
      <div class="glass-card rounded-xl p-6 space-y-4">
        <h2 class="text-base font-semibold text-white flex items-center gap-2">
          <Users class="w-4 h-4 text-emerald-400" /> Member Directory & Risk Flags
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-zinc-900/90 text-zinc-400 uppercase font-mono border-b border-zinc-800">
              <tr>
                <th class="p-3">Member</th>
                <th class="p-3">Track</th>
                <th class="p-3">Primary Goal</th>
                <th class="p-3">Streak</th>
                <th class="p-3">Completion Rate</th>
                <th class="p-3">Today Status</th>
                <th class="p-3">Risk Level</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-800/60">
              {members.map(m => (
                <tr key={m.id} class="hover:bg-zinc-900/50 transition">
                  <td class="p-3 font-semibold text-white">{m.name}</td>
                  <td class="p-3 text-zinc-300">{m.track}</td>
                  <td class="p-3 text-zinc-300">{m.goal}</td>
                  <td class="p-3 font-mono font-bold text-emerald-400">{m.streak} days</td>
                  <td class="p-3 font-mono text-zinc-200">{m.completionRate}%</td>
                  <td class="p-3">
                    <span class={`px-2 py-0.5 rounded text-[10px] font-semibold ${m.checkinToday ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {m.checkinToday ? 'Submitted' : 'Pending'}
                    </span>
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {m.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
