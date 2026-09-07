'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { submitApplication } from '@/lib/stride-db';

export default function ApplyPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [timezone, setTimezone] = useState('Africa/Lagos (UTC+1)');
  const [techStatus, setTechStatus] = useState('Complete Beginner');
  const [interest, setInterest] = useState('Web Development');
  const [capacity, setCapacity] = useState('2 hours/day');
  const [why, setWhy] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [commit1, setCommit1] = useState(true);
  const [commit2, setCommit2] = useState(true);
  const [commit3, setCommit3] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in or create an account before submitting your application.');
      }

      await submitApplication({
        userId: user.id,
        userName: fullName || user.email || 'Applicant',
        userEmail: email || user.email || '',
        whatsappNumber: whatsapp,
        timezone,
        currentTechStatus: techStatus,
        primaryAreaOfInterest: interest,
        dailyLearningCapacity: capacity,
        whyAccountabilityNow: why,
        dailyReportsCommitment: commit1,
        saturdayCallCommitment: commit2,
        emergencyPassAcceptance: commit3,
        disciplinePlan: discipline,
      });

      alert('Application submitted successfully! Moving to Under Review page...');
      router.push('/application-status');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Admission Filter
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Apply to Join Stride</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Stride filters for serious learners who commit to daily execution, 11:59 PM check-ins, and mandatory Saturday reviews.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. David Okonjo"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="david@example.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">WhatsApp Number *</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+234 803 123 4567"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Location / Timezone *</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Africa/Lagos (UTC+1)">Africa/Lagos (UTC+1)</option>
                <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
                <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
                <option value="America/Los_Angeles (UTC-8)">America/Los_Angeles (UTC-8)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Current Tech Status *</label>
              <select
                value={techStatus}
                onChange={(e) => setTechStatus(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Complete Beginner">Complete Beginner</option>
                <option value="Still Exploring">Still Exploring</option>
                <option value="Enrolled in Course">Enrolled in Course</option>
                <option value="Self-Taught">Self-Taught</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Primary Area of Interest *</label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Web Development">Web Development</option>
                <option value="Data">Data Analytics</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Product Design">Product Design</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Daily Learning Capacity *</label>
            <input
              type="text"
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 2 hours/day"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Why accountability now? (Minimum 50 words) *</label>
            <textarea
              required
              rows={3}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Explain your current struggle with course completion or consistency..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <div className="space-y-2 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800 text-xs">
            <div className="font-semibold text-zinc-200 mb-1">Community Commitments *</div>
            <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
              <input type="checkbox" checked={commit1} onChange={(e) => setCommit1(e.target.checked)} className="rounded accent-emerald-500" />
              I commit to logging daily progress reports by 11:59 PM in my local timezone.
            </label>
            <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
              <input type="checkbox" checked={commit2} onChange={(e) => setCommit2(e.target.checked)} className="rounded accent-emerald-500" />
              I commit to attending mandatory Saturday group review calls.
            </label>
            <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
              <input type="checkbox" checked={commit3} onChange={(e) => setCommit3(e.target.checked)} className="rounded accent-emerald-500" />
              I accept the policy of 2 emergency passes maximum per calendar month.
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Discipline Plan (How will you handle motivation decline?) *</label>
            <textarea
              required
              rows={2}
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              placeholder="Specific action plan when momentum drops..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> {loading ? 'Submitting Application...' : 'Submit Application & Enter Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
