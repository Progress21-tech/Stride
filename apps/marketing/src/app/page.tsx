'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarDays, CheckCircle2, Flame, Target, TrendingUp, Users } from 'lucide-react';
import { WaitlistForm } from '../components/WaitlistForm';

const stories = [
  { eyebrow: '01 / Set direction', title: 'A learning goal is more useful when it has a path.', copy: 'Turn an outcome you care about into milestones and weekly objectives you can act on, with a clear sense of where you are going.', icon: Target, visual: ['Become a frontend developer', 'HTML and CSS foundations', 'JavaScript projects', 'React portfolio'] },
  { eyebrow: '02 / Plan the work', title: 'Make the next step clear before motivation fades.', copy: 'Move from a longer term goal to this week and today, so each learning session has a practical next action.', icon: CalendarDays, visual: ['This month · build foundations', 'This week · practice JavaScript', 'Today · complete one focused task'] },
  { eyebrow: '03 / Show up', title: 'Consistency gets a place to live.', copy: 'Track planned work and daily check-ins, including what you completed, how long you learned, and what got in the way.', icon: CheckCircle2, visual: ['Practice array methods', 'Record learning time', 'Share a blocker and next priority'] },
  { eyebrow: '04 / See the evidence', title: 'Your effort should add up to progress you can see.', copy: 'Review completed work, learning time, reporting streaks, and recommendations that help you choose what to learn next.', icon: TrendingUp, visual: ['Weekly plan completion', 'Learning time and consistency', 'Recommended next resource'] },
  { eyebrow: '05 / Review together', title: 'Accountability makes reflection part of the plan.', copy: 'Bring your progress, blockers, and next steps into a structured group review, with room for community and guided learning.', icon: Users, visual: ['What moved forward?', 'What got in the way?', 'What will you work on next?'] },
];

export default function HomePage() {
  const reducedMotion = useReducedMotion();
  return <div className="marketing-page overflow-hidden bg-[#f7f7f5] text-[#111111] dark:bg-[#080908] dark:text-[#f5f5f5]">
    <main>
      <section className="relative flex min-h-[92vh] items-center px-4 pt-24 sm:px-6 lg:px-8" aria-labelledby="hero-title">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden"><div className="absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-emerald-500/60" /><div className="absolute right-[18%] top-[30%] h-1.5 w-1.5 rounded-full bg-black/20 dark:bg-white/25" /><div className="absolute bottom-[18%] right-[30%] h-3 w-3 rounded-full border border-emerald-500/30" /></div>
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.p initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold uppercase tracking-[0.22em] text-[#18A957]">A learning accountability platform</motion.p>
          <motion.h1 id="hero-title" initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mt-5 text-5xl font-bold tracking-[-0.06em] sm:text-7xl lg:text-8xl">Turn intention<br />into <span className="text-[#18A957]">progress.</span></motion.h1>
          <motion.p initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg">Sylpace helps learners turn a meaningful learning goal into a practical plan, build a steady routine, and stay accountable to the work.</motion.p>
          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-9"><Link href="#waitlist" className="inline-flex items-center gap-2 rounded-full bg-[#18A957] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-[#15944c]">Join the waitlist <ArrowRight className="h-4 w-4" /></Link></motion.div>
          <p className="mt-4 text-xs text-zinc-500">No account needed. Get launch updates by email.</p>
        </div>
      </section>

      <section className="relative z-10 mx-4 rounded-t-[2.5rem] border border-black/10 bg-white px-5 py-20 shadow-2xl dark:border-white/10 dark:bg-[#111211] sm:mx-6 sm:px-10 lg:mx-8 lg:px-16" aria-label="How Sylpace works">
        <div className="mx-auto max-w-6xl space-y-28">
          {stories.map((story, index) => { const Icon = story.icon; return <motion.article key={story.title} initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45 }} className={`grid items-center gap-10 lg:grid-cols-2 ${index % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">{story.eyebrow}</p><h2 className="mt-4 max-w-lg text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{story.title}</h2><p className="mt-5 max-w-md leading-relaxed text-zinc-600 dark:text-zinc-300">{story.copy}</p><Link href="#waitlist" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#18A957] hover:underline">Join the waitlist <ArrowRight className="h-4 w-4" /></Link></div>
            <div className="rounded-3xl border border-black/10 bg-[#f2f3ef] p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900"><div className="mb-6 flex items-center gap-2 text-sm font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#18A957]/15 text-[#18A957]"><Icon className="h-4 w-4" /></span>Sylpace workspace</div><div className="space-y-3">{story.visual.map((item, itemIndex) => <div key={item} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-zinc-950"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${itemIndex === 0 ? 'bg-[#18A957]' : 'bg-zinc-300 dark:bg-zinc-700'}`} />{item}{index === 2 && itemIndex === 0 && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-[#18A957]" />}</div>)}</div>{index === 3 && <div className="mt-5 flex items-end gap-2"><Flame className="h-5 w-5 text-[#18A957]" /><div className="h-2 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-full w-[84%] rounded-full bg-[#18A957]" /></div></div>}</div>
          </motion.article>; })}
        </div>
      </section>

      <motion.section id="waitlist" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="scroll-mt-8 px-5 py-28 text-center sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#18A957]">Coming soon</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-[-0.05em] sm:text-6xl">Build a learning practice that keeps moving.</h2><p className="mx-auto mt-5 max-w-xl leading-relaxed text-zinc-600 dark:text-zinc-300">Join the Sylpace waitlist for launch updates. Joining does not create an account or grant platform access.</p><div className="mx-auto mt-8 max-w-lg text-left"><WaitlistForm /></div>
      </motion.section>
    </main>
    <footer className="border-t border-black/10 px-5 py-16 dark:border-white/10 sm:px-10"><div className="mx-auto max-w-6xl"><div className="text-5xl font-bold tracking-[-0.08em] sm:text-8xl">SYLP<span className="text-[#18A957]">A</span>CE</div><p className="mt-3 text-zinc-600 dark:text-zinc-300">Plan. Show up. Keep moving.</p><div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link><span>© {new Date().getFullYear()} Sylpace</span></div></div></footer>
  </div>;
}
