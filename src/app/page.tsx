import Link from 'next/link';
import { Target, CheckCircle2, Video, ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
      
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
          Turn your learning goals into <span className="text-[#18A957]">consistent progress</span>.
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
          People have abundant access to courses and learning resources, but many struggle to turn intention into consistent action. Stride provides the structure, accountability, planning, reporting, and review system around the learning itself.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/apply" className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-[#18A957] hover:bg-[#15944c] text-white shadow-lg transition flex items-center justify-center gap-2">
            Apply to Join Stride <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/today" className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition text-center">
            Explore Member Workspace
          </Link>
        </div>
      </div>

      {/* Core Product Loop Diagram */}
      <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <div className="text-xs font-mono uppercase text-emerald-400">Operating Blueprint</div>
          <h2 className="text-xl font-bold text-white">The Core Product Loop</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">1. Define Goal</div>
            <p className="text-[11px] text-zinc-400">Primary goal & milestone hierarchy</p>
          </div>

          <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">2. Daily Tasks</div>
            <p className="text-[11px] text-zinc-400">Actionable daily commitments</p>
          </div>

          <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">3. Daily Check-in</div>
            <p className="text-[11px] text-zinc-400">11:59 PM timezone deadline report</p>
          </div>

          <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">4. Saturday Review</div>
            <p className="text-[11px] text-zinc-400">Mandatory weekly peer call</p>
          </div>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl space-y-2">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Selective Admission
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Commitment-oriented application form filters for serious learners before admission into member workspaces.
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl space-y-2">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Strict Accountability
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            11:59 PM daily deadline reporting, max 2 emergency passes per month, and structured recovery workflows.
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl space-y-2">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" /> Saturday Reviews
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Data-driven weekly review package generation for Google Meet reviews with group leaders and peers.
          </p>
        </div>
      </div>

    </div>
  );
}
