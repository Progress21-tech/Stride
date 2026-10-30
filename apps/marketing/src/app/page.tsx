'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown, ArrowRight, BookOpen, Check, CheckCircle2, ClipboardCheck,
  GraduationCap, LineChart, Play, Target, Users, Video,
} from 'lucide-react';
import { WaitlistForm } from '../components/WaitlistForm';

const learningFlow = [
  {
    number: '01', eyebrow: 'Find your courses', title: 'Start with what you study.',
    copy: 'Choose your university, faculty, department and level. Sylpace organizes courses around your studies, so you can find the right place to begin.',
    visual: 'courses',
  },
  {
    number: '02', eyebrow: 'Learn one topic at a time', title: 'Courses become clear lessons.',
    copy: 'Tutor-created video lessons, notes and materials follow course topics, helping you learn in order instead of searching through unrelated videos.',
    visual: 'lesson',
  },
  {
    number: '03', eyebrow: 'Practise what you learn', title: 'Turn lessons into understanding.',
    copy: 'Use practice and quizzes to check what you understand as you go. Past questions are planned for a later stage as the platform grows.',
    visual: 'practice',
  },
  {
    number: '04', eyebrow: 'See your progress', title: 'Know where you stand.',
    copy: 'Keep track of lessons completed, course progress, learning time and practice, so it is easier to see what you have covered and what comes next.',
    visual: 'progress',
  },
  {
    number: '05', eyebrow: 'Stay on track', title: 'Make a study plan you can follow.',
    copy: 'Set weekly objectives, choose daily tasks and check in on your study. Accountability supports the learning you are already doing.',
    visual: 'plan',
  },
];

const features = [
  { title: 'Learn', subtitle: 'Structured courses built around your university.', text: 'Tutor-created video lessons organized by course, topic and lesson.', icon: BookOpen, className: 'md:col-span-2' },
  { title: 'Practise', subtitle: 'Turn lessons into understanding.', text: 'Quizzes and practice help you check what you know. Past questions are planned for a later release.', icon: CheckCircle2, className: 'md:col-span-2' },
  { title: 'Progress', subtitle: 'See what you have learned.', text: 'Follow lessons completed, course progress, learning time and weekly activity.', icon: LineChart, className: '' },
  { title: 'Stay on track', subtitle: 'Build a study routine that lasts.', text: 'Goals, tasks, check-ins, streaks and weekly reviews help you follow through.', icon: Target, className: '' },
];

function LearningPreview({ kind }: { kind: string }) {
  const reducedMotion = useReducedMotion();
  const panel = 'rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6';
  const label = 'text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500';
  if (kind === 'courses') return <div className={panel}>
    <div className="flex items-start justify-between gap-4"><div><p className={label}>Your learning space</p><h3 className="mt-2 text-lg font-semibold tracking-tight">Your university</h3><p className="mt-1 text-sm text-zinc-500">100 Level · Science</p></div><GraduationCap className="h-5 w-5 text-[#18A957]" /></div>
    <div className="mt-5 grid grid-cols-2 gap-3">{['Biology', 'Chemistry', 'Physics', 'Mathematics'].map((course, i) => <div key={course} className="rounded-xl border border-black/5 bg-[#f7f7f5] p-3"><span className="text-[10px] font-medium text-zinc-500">COURSE 0{i + 1}</span><p className="mt-1 text-sm font-semibold">{course}</p></div>)}</div>
    <p className="mt-4 text-xs text-zinc-500">Course availability depends on your university and level.</p>
  </div>;
  if (kind === 'lesson') return <div className={panel}>
    <div className="flex flex-wrap items-center justify-between gap-2"><div><p className={label}>BIO101 · Cell Biology</p><h3 className="mt-2 text-lg font-semibold tracking-tight">Introduction to Cell Structure</h3></div><span className="rounded-full bg-[#e8f7ee] px-3 py-1 text-xs font-semibold text-[#0d5c30]">Lesson 1</span></div>
    <div role="img" aria-label="Illustrative video lesson player" className="relative mt-5 grid aspect-video place-items-center overflow-hidden rounded-2xl bg-[#f2f3ef]"><div className="absolute inset-0 grid place-items-center"><div className="h-32 w-32 rounded-full border border-[#18A957]/20" /><div className="absolute h-20 w-20 rounded-full border border-[#18A957]/30" /></div><span className="relative grid h-12 w-12 place-items-center rounded-full bg-[#18A957] text-white shadow-lg"><Play className="ml-0.5 h-5 w-5 fill-current" /></span><span className="absolute bottom-3 left-4 text-xs font-medium text-zinc-600">Video lesson preview</span></div>
    <div className="mt-4 flex items-center justify-between rounded-xl border border-black/5 px-4 py-3"><div className="flex items-center gap-3"><BookOpen className="h-4 w-4 text-[#18A957]" /><span className="text-sm font-medium">Lesson notes</span></div><span className="text-xs text-zinc-500">Read and review</span></div>
  </div>;
  if (kind === 'practice') return <div className={panel}>
    <div className="flex items-center justify-between"><div><p className={label}>BIO101 · Cell Biology</p><h3 className="mt-2 text-lg font-semibold tracking-tight">Quick practice</h3></div><span className="rounded-full bg-[#f7f7f5] px-3 py-1 text-xs text-zinc-600">Question 1</span></div>
    <p className="mt-5 text-sm font-medium leading-relaxed">Which part of the cell contains most of its genetic material?</p>
    <div className="mt-4 space-y-2">{['Cell membrane', 'Nucleus', 'Cytoplasm'].map((answer, i) => <div key={answer} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${i === 1 ? 'border-[#18A957]/40 bg-[#e8f7ee]/60' : 'border-black/5 bg-white'}`}><span className="grid h-5 w-5 place-items-center rounded-full border border-zinc-300 text-[10px] text-zinc-500">{String.fromCharCode(65 + i)}</span>{answer}</div>)}</div>
    <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 text-xs text-zinc-500"><span>Practice helps you check your understanding</span><span>1 / 10</span></div>
  </div>;
  if (kind === 'progress') return <div className={panel}>
    <p className={label}>Your learning progress</p><h3 className="mt-2 text-lg font-semibold tracking-tight">BIO101 · Cell Biology</h3>
    <div className="mt-5 flex items-end justify-between"><span className="text-sm text-zinc-600">Course progress</span><span className="text-2xl font-bold tracking-tight">72%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100"><motion.div initial={reducedMotion ? { width: "72%" } : { width: 0 }} whileInView={{ width: "72%" }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-[#18A957]" /></div>
    <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#f7f7f5] p-4"><p className={label}>Lessons completed</p><p className="mt-2 text-lg font-semibold">18 <span className="text-sm font-normal text-zinc-500">/ 25</span></p></div><div className="rounded-xl bg-[#f7f7f5] p-4"><p className={label}>This week</p><p className="mt-2 text-lg font-semibold">4 lessons</p></div></div>
    <p className="mt-4 text-[11px] text-zinc-500">Illustrative product preview</p>
  </div>;
  return <div className={panel}>
    <div className="flex items-center justify-between"><div><p className={label}>Goal · Pass my BIO101 exam</p><h3 className="mt-2 text-lg font-semibold tracking-tight">This week’s study plan</h3></div><ClipboardCheck className="h-5 w-5 text-[#18A957]" /></div>
    <div className="mt-5 space-y-3">{[['Complete Biology Topic 3', true], ['Practise Chemistry questions', true], ['Review Physics notes', false]].map(([task, done]) => <div key={String(task)} className="flex items-center gap-3 rounded-xl border border-black/5 px-4 py-3"><span className={`grid h-5 w-5 place-items-center rounded-full ${done ? 'bg-[#18A957] text-white' : 'border border-zinc-300'}`}>{done && <Check className="h-3 w-3" />}</span><span className={`text-sm ${done ? 'text-zinc-500 line-through' : 'font-medium'}`}>{task}</span></div>)}</div>
    <div className="mt-4 rounded-xl bg-[#f7f7f5] p-4"><p className={label}>Today</p><p className="mt-1 text-sm font-medium">Complete Topic 4 lesson</p></div>
  </div>;
}

export default function HomePage() {
  const reducedMotion = useReducedMotion();
  const reveal = reducedMotion ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.45 } };

  return <div className="overflow-hidden bg-[#f7f7f5] text-[#111111]">
    <main>
      <section id="top" className="relative px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.92fr_1.08fr]">
          <div className="relative z-10">
            <motion.p initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-[#18A957]/20 bg-[#e8f7ee] px-3 py-2 text-xs font-semibold text-[#0d5c30]"><span className="h-2 w-2 rounded-full bg-[#18A957]" /> A learning platform for university students</motion.p>
            <motion.h1 id="hero-title" initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mt-6 max-w-xl text-5xl font-bold leading-[1.02] tracking-[-0.065em] sm:text-6xl lg:text-7xl">Learn your courses.<br /><span className="text-[#18A957]">Stay on track.</span></motion.h1>
            <motion.p initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg">Sylpace brings university courses, lessons, practice and progress tracking together — with accountability built in to help you keep going.</motion.p>
            <motion.div initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 flex flex-wrap items-center gap-4"><Link href="#waitlist" className="inline-flex items-center gap-2 rounded-full bg-[#18A957] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-[#15944c]">Join the waitlist <ArrowRight className="h-4 w-4" /></Link><span className="text-xs text-zinc-500">Coming soon for university students.</span></motion.div>
          </div>
          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [18, 0, -5, 0] }} transition={reducedMotion ? { delay: 0.25, duration: 0.55 } : { delay: 0.25, duration: 2.2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[#e8f7ee]" />
            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl shadow-black/5">
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-4"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#18A957] text-sm font-bold text-white">s</span><span className="font-semibold tracking-tight">Sylpace</span></div><span className="text-xs text-zinc-500">My learning</span></div>
              <div className="grid gap-4 p-5 sm:grid-cols-[1.05fr_.95fr] sm:p-6">
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">My courses</p><h2 className="mt-2 text-lg font-semibold tracking-tight">Continue learning</h2><div className="mt-4 rounded-2xl border border-black/5 bg-[#f7f7f5] p-4"><div className="flex items-center justify-between"><div><span className="text-[10px] font-semibold text-[#0d5c30]">BIO101</span><p className="mt-1 text-sm font-semibold">Cell Biology</p></div><BookOpen className="h-4 w-4 text-[#18A957]" /></div><p className="mt-4 text-xs text-zinc-600">Next: Introduction to Cell Structure</p><div className="mt-3 h-1.5 rounded-full bg-zinc-200"><motion.div initial={reducedMotion ? { width: "42%" } : { width: 0 }} animate={{ width: "42%" }} transition={{ delay: 0.45, duration: 0.9, ease: "easeOut" }} className="h-full rounded-full bg-[#18A957]" /></div></div><div className="mt-3 rounded-2xl border border-black/5 p-4"><span className="text-[10px] font-semibold text-zinc-500">CHM101</span><p className="mt-1 text-sm font-semibold">General Chemistry</p><p className="mt-1 text-xs text-zinc-500">Your next course</p></div></div>
                <div className="space-y-4"><div className="rounded-2xl bg-[#f7f7f5] p-4"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Today's task</p><CheckCircle2 className="h-4 w-4 text-[#18A957]" /></div><p className="mt-3 text-sm font-medium">Watch the next BIO101 lesson</p><p className="mt-1 text-xs text-zinc-500">Cell Biology · Topic 1</p></div><div className="rounded-2xl border border-black/5 p-4"><div className="flex items-center gap-2"><LineChart className="h-4 w-4 text-[#18A957]" /><p className="text-sm font-semibold">Weekly progress</p></div><div className="mt-4 flex items-end gap-1.5">{[30, 52, 40, 76, 58, 88, 46].map((height, i) => <motion.div key={i} initial={reducedMotion ? { height } : { height: 0 }} animate={{ height }} transition={{ delay: 0.35 + i * 0.08, duration: 0.55, ease: "easeOut" }} className="flex-1 rounded-t bg-[#18A957]/70" />)}</div><div className="mt-2 flex justify-between text-[9px] text-zinc-400"><span>Mon</span><span>Sun</span></div></div></div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-black/5 px-5 py-3 text-xs text-zinc-500"><span className="flex items-center gap-2"><Video className="h-3.5 w-3.5 text-[#18A957]" /> Courses · Lessons · Practice · Progress</span><span>Illustrative product preview</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section {...reveal} className="border-y border-black/5 bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[.8fr_1.2fr] md:items-center md:gap-16"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">The challenge</p><h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Learning is easier when everything connects.</h2></div><div><p className="text-base leading-relaxed text-zinc-600">Students often move between different places to find course materials, watch lessons, practise, track what they have completed and decide what to study next. Knowing what to learn is only the beginning.</p><p className="mt-4 text-base font-medium leading-relaxed text-zinc-800">Sylpace connects course material to practice, progress and consistent study in one learning experience.</p></div></div>
      </motion.section>

      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-labelledby="how-title">
        <div className="mx-auto max-w-6xl"><div className="mx-auto mb-14 max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">How Sylpace works</p><h2 id="how-title" className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">From course to confident practice.</h2><p className="mt-4 leading-relaxed text-zinc-600">Learn in a clear order, practise what you understand and see your progress as you go.</p></div>
          <div className="space-y-10 sm:space-y-14">{learningFlow.map((step, index) => <motion.article {...reveal} key={step.number} className={`grid items-center gap-7 lg:grid-cols-2 lg:gap-14 ${index % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}><div className="max-w-lg"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#18A957]">{step.number} / {step.eyebrow}</p><h3 className="mt-3 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">{step.title}</h3><p className="mt-4 leading-relaxed text-zinc-600">{step.copy}</p></div><LearningPreview kind={step.visual} /></motion.article>)}</div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="features-title"><div className="mx-auto max-w-6xl"><div className="mb-10 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">The learning experience</p><h2 id="features-title" className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Everything you need to keep learning moving.</h2></div><div className="grid gap-4 md:grid-cols-4">{features.map((feature, i) => { const Icon = feature.icon; return <motion.article {...reveal} key={feature.title} className={`rounded-3xl border border-black/10 p-6 ${i < 2 ? 'bg-[#f7f7f5]' : 'bg-white'} ${feature.className}`}><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e8f7ee] text-[#18A957]"><Icon className="h-5 w-5" /></span><p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#18A957]">{feature.title}</p><h3 className="mt-2 text-xl font-bold tracking-tight">{feature.subtitle}</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">{feature.text}</p></motion.article>; })}</div></div></section>

      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">Starting with science</p><h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Built around the way university students study.</h2><p className="mt-5 max-w-xl leading-relaxed text-zinc-600">Sylpace is beginning with university science students and the courses they take. Students can find learning organized around their university, faculty, department and level.</p><div className="mt-7 flex flex-wrap gap-3">{['Biology', 'Chemistry', 'Physics', 'Mathematics'].map((name) => <span key={name} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">{name}</span>)}</div></div><div className="grid gap-4 sm:grid-cols-2"><article className="rounded-3xl border border-black/10 bg-white p-6"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#18A957]">Now</span><h3 className="mt-3 text-xl font-bold">Science students first</h3><p className="mt-3 text-sm leading-relaxed text-zinc-600">Structured academic learning for students studying science-related courses.</p></article><article className="rounded-3xl border border-black/10 bg-[#f2f3ef] p-6"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">As Sylpace grows</span><h3 className="mt-3 text-xl font-bold">Engineering next</h3><p className="mt-3 text-sm leading-relaxed text-zinc-600">Engineering courses will be introduced as the platform expands.</p></article></div></div></section>

      <section className="border-y border-black/5 bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">For tutors</p><h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Built with tutors, for students.</h2><p className="mt-5 leading-relaxed text-zinc-600">Tutors can create structured lessons for the courses they teach, helping students access learning organized around their university and curriculum.</p><p className="mt-5 inline-flex rounded-full border border-black/10 bg-[#f7f7f5] px-4 py-2 text-xs font-medium text-zinc-600">Tutor applications coming soon</p></div><div className="grid gap-3 sm:grid-cols-4">{[['01', 'Create lesson'], ['02', 'Add video and materials'], ['03', 'Submit for review'], ['04', 'Students learn']].map(([number, title], i) => <div key={number} className="relative rounded-2xl border border-black/10 bg-[#f7f7f5] p-4"><span className="text-xs font-semibold text-[#18A957]">{number}</span><p className="mt-5 text-sm font-semibold leading-snug">{title}</p>{i < 3 && <ArrowRight className="absolute right-3 top-4 hidden h-4 w-4 text-zinc-400 sm:block" />}</div>)}</div></div></section>

      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8"><div className="mx-auto max-w-6xl"><div className="mb-10 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">Accountability supports learning</p><h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Consistency shouldn’t depend on motivation alone.</h2><p className="mt-4 leading-relaxed text-zinc-600">Once you know what you need to learn, Sylpace helps you turn it into a plan you can actually follow.</p></div><div className="grid gap-5 lg:grid-cols-2"><LearningPreview kind="plan" /><div className="rounded-3xl border border-black/10 bg-[#f2f3ef] p-6 sm:p-8"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#18A957]">A quick check-in</span><h3 className="mt-3 text-2xl font-bold tracking-tight">How did studying go today?</h3><div className="mt-6 space-y-3">{['What did you learn?', 'What did you complete?', 'What got in the way?', 'What’s next?'].map((question) => <div key={question} className="rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-zinc-700">{question}</div>)}</div><p className="mt-5 text-sm leading-relaxed text-zinc-600">Goals, tasks, check-ins, streaks and weekly reviews help make room for consistent study.</p></div></div></div></section>

      <section className="border-y border-black/5 bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">Learning together</p><h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Don’t learn completely alone.</h2><p className="mt-5 leading-relaxed text-zinc-600">Students will be able to review their progress together, discuss what made studying difficult and take part in structured learning communities. The focus stays on learning, not on another social feed.</p></div><div className="rounded-3xl border border-black/10 bg-[#f7f7f5] p-6 sm:p-8"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#e8f7ee] text-[#18A957]"><Users className="h-5 w-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Weekly review</p><h3 className="mt-1 font-semibold">Study group reflection</h3></div></div><div className="mt-6 space-y-3">{['What moved forward?', 'What got in the way?', 'What will you work on next?'].map((question, i) => <div key={question} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white px-4 py-3 text-sm"><span className="text-xs font-semibold text-[#18A957]">0{i + 1}</span>{question}</div>)}</div></div></div></section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl border border-black/10 bg-[#f2f3ef] p-7 sm:p-10 md:flex-row md:items-center md:justify-between"><div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">The road ahead</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.05em]">We’re starting with learning. There’s more ahead.</h2><p className="mt-3 text-sm leading-relaxed text-zinc-600">Sylpace is beginning with university learning, then expanding practice and assessment and, over time, adding more ways to support students.</p></div><div className="flex shrink-0 flex-wrap gap-2 text-xs font-medium"><span className="rounded-full bg-white px-4 py-2">Now · University learning</span><ArrowDown className="h-4 w-4 rotate-[-90deg] self-center text-[#18A957]" /><span className="rounded-full bg-white px-4 py-2">Next · More practice</span></div></div></section>

      <motion.section {...reveal} id="waitlist" className="scroll-mt-8 border-y border-black/5 bg-[#f2f3ef] px-5 py-20 text-[#111111] sm:px-8 sm:py-24"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18A957]">Coming soon for university students</p><h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Be among the first to learn with Sylpace.</h2><p className="mt-5 max-w-xl leading-relaxed text-zinc-600">Join the waitlist to get launch updates and be among the first students to experience the platform.</p><p className="mt-5 text-xs text-zinc-500">Joining the waitlist does not create an account or grant platform access.</p></div><div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-7"><WaitlistForm /></div></div></motion.section>
    </main>
    <footer className="bg-[#f7f7f5] px-5 py-12 sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-6 border-b border-black/10 pb-7 sm:flex-row sm:items-center sm:justify-between"><Link href="#top" className="text-2xl font-bold tracking-[-0.08em]">SYLP<span className="text-[#18A957]">A</span>CE</Link><nav className="flex gap-6 text-sm text-zinc-600" aria-label="Footer"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></nav></div><div className="flex flex-col gap-2 pt-5 text-xs text-zinc-500 sm:flex-row sm:justify-between"><span>Learn. Practise. Progress.</span><span>© 2026 Sylpace</span></div></div></footer>
  </div>;
}
