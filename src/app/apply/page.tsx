'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, FileText } from 'lucide-react';

export default function ApplyPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application submitted successfully! Redirecting to Under Review page...');
    router.push('/today');
  };

  return (
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div class="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
            <FileText class="w-3.5 h-3.5" /> Admission Filter
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Apply to Join Stride</h1>
          <p class="text-sm text-zinc-400 mt-1">
            Stride filters for serious learners who commit to daily execution, 11:59 PM check-ins, and mandatory Saturday reviews.
          </p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1">Full Name *</label>
              <input type="text" required placeholder="e.g. David Okonjo" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1">Email Address *</label>
              <input type="email" required placeholder="david@example.com" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1">WhatsApp Number *</label>
              <input type="text" required placeholder="+234 803 123 4567" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1">Location / Timezone *</label>
              <select required class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                <option value="Africa/Lagos (UTC+1)">Africa/Lagos (UTC+1)</option>
                <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
                <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1">Current Tech Status *</label>
              <select required class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                <option value="Complete Beginner">Complete Beginner</option>
                <option value="Still Exploring">Still Exploring</option>
                <option value="Enrolled in Course">Enrolled in Course</option>
                <option value="Self-Taught">Self-Taught</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1">Primary Area of Interest *</label>
              <select required class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                <option value="Web Development">Web Development</option>
                <option value="Data">Data Analytics</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Product Design">Product Design</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1">Why accountability now? (Minimum 50 words) *</label>
            <textarea required rows={3} placeholder="Explain your current struggle with course completion or consistency..." class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1">Discipline Plan (How will you handle motivation decline?) *</label>
            <textarea required rows={2} placeholder="Specific action plan when momentum drops..." class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"></textarea>
          </div>

          <button type="submit" class="w-full py-3 text-sm font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center justify-center gap-2">
            <Send class="w-4 h-4" /> Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
