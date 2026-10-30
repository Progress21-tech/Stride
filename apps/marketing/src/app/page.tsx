import { WaitlistForm } from '../components/WaitlistForm';

const pillars = [
  { icon: '↗', title: 'Choose a direction', text: 'Turn a learning ambition into a clear goal with a meaningful outcome.' },
  { icon: '✓', title: 'Plan the work', text: 'Break goals into milestones, weekly objectives, and daily tasks.' },
  { icon: '◎', title: 'Show up', text: 'Use your Today plan and daily check-ins to keep moving, even when motivation changes.' },
  { icon: '＋', title: 'Review your progress', text: 'See the work you have done, reflect on what got in the way, and decide what comes next.' },
];

const faqs = [
  ['When will Sylpace launch?', 'Sylpace is in development. Join the waitlist and we will email you when there are launch updates to share.'],
  ['What is Sylpace?', 'Sylpace is a structured learning accountability platform that helps you turn a learning goal into a plan, follow through day by day, and review your progress.'],
  ['Who is Sylpace for?', 'Sylpace is for learners who want more structure and accountability as they work toward a meaningful learning goal.'],
  ['Can I use the platform now?', 'The platform is being built. The waitlist is open for launch updates; joining does not create an account or grant platform access.'],
  ['Can tutors or mentors apply?', 'Tutor and mentor intake details are still being decided. We will share the process when it is ready.'],
];

export default function HomePage() {
  return <main className="shell">
    <div className="wrap">
      <header className="nav"><a className="brand" href="#top" aria-label="Sylpace home"><span className="mark" aria-hidden="true">s</span>Sylpace</a><nav className="nav-links" aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#students">Who it’s for</a><a className="nav-cta" href="#waitlist">Join the waitlist <span aria-hidden="true">↗</span></a></nav></header>
      <section className="hero" id="top"><div><span className="eyebrow"><i className="pulse"/> Coming soon</span><h1>Turn intention into <em>progress.</em></h1><p className="lead">Sylpace helps you turn a learning ambition into goals, weekly plans, and daily actions—with accountability and guidance to help you keep going.</p><div id="waitlist"><WaitlistForm /></div><p className="subnote">No account needed. We’ll only use your email for Sylpace launch updates.</p></div><div className="visual"><div className="image-placeholder" role="img" aria-label="Illustration placeholder for a Sylpace learning plan"><div className="placeholder-label"><strong>A plan you can return to</strong>Goals · daily actions · progress</div></div><div className="float-card"><b>One step at a time</b><span>Make the next action clear.</span></div><div className="float-card top"><b>Keep showing up</b><span>Plan · act · reflect</span></div></div></section>
    </div>

    <section className="section problem"><div className="wrap" style={{display:'contents'}}><div><span className="kicker">Why Sylpace</span><h2 className="section-title">Good intentions need a system.</h2></div><p>Big learning goals can feel hard to act on when the next step is unclear and progress is difficult to see. Sylpace brings planning, daily follow-through, and honest reflection together so you can focus on the work in front of you and learn from the work you have done.</p></div></section>

    <section className="section" id="how-it-works"><div className="wrap"><div className="section-head"><span className="kicker">A learning loop</span><h2>Set direction. Plan the work. Keep moving.</h2><p>Sylpace connects the small steps of learning to the outcome you are working toward.</p></div><div className="grid4">{pillars.map((item) => <article className="pillar" key={item.title}><span className="icon" aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>

    <section className="section"><div className="wrap feature-split"><div><span className="kicker">From ambition to action</span><h2>Know what to work on next.</h2><p style={{color:'var(--muted)',lineHeight:1.75}}>Start with an outcome you care about, then shape it into milestones, weekly objectives, and daily tasks. Use your plan to guide each study session and your check-ins to keep an honest record of the effort.</p><ul className="check-list"><li><span className="check">✓</span><span>Goals with milestones and target dates</span></li><li><span className="check">✓</span><span>Weekly objectives and daily tasks</span></li><li><span className="check">✓</span><span>Daily check-ins for work, learning time, and blockers</span></li><li><span className="check">✓</span><span>Progress reviews and curated learning resources</span></li></ul></div><div className="image-placeholder" style={{height:330}} role="img" aria-label="Placeholder for a Sylpace planning and progress screen"><div className="placeholder-label"><strong>Your learning, made visible</strong>Plan · check in · review</div></div></div></section>

    <section className="section who" id="students"><div className="wrap"><div className="section-head"><span className="kicker">Who it is for</span><h2>A focused start, with room to grow.</h2><p>Sylpace is being developed for learners who want a practical structure for making progress on a meaningful goal.</p></div><div className="audience-grid"><article className="audience"><span>For learners</span><h3>Make progress with a plan</h3><p>Turn a broad learning ambition into manageable work, build a routine, and see the evidence of your progress.</p></article><article className="audience"><span>For learning communities</span><h3>Accountability with people</h3><p>Use regular reflection and group review to share progress, surface blockers, and keep learning moving.</p></article></div></div></section>

    <section className="section" id="tutors"><div className="wrap"><div className="audience"><span>For tutors and mentors</span><h3>Help learners keep moving.</h3><p>Sylpace is designed to make room for curated guidance and human accountability alongside a learner’s plan. Tutor and mentor participation details are still being decided; applications are not open yet.</p></div></div></section>

    <section className="section"><div className="wrap"><div className="section-head"><span className="kicker">The roadmap</span><h2>Building the learning loop in stages.</h2></div><div className="roadmap"><div className="step"><i className="step-num"/><h3>Join the waitlist</h3><p>Get launch updates as Sylpace takes shape.</p></div><div className="step"><i className="step-num"/><h3>Set your direction</h3><p>Choose a learning outcome worth working toward.</p></div><div className="step"><i className="step-num"/><h3>Work the plan</h3><p>Turn weekly objectives into daily actions and check-ins.</p></div><div className="step"><i className="step-num"/><h3>Review and grow</h3><p>Use progress evidence and reflection to plan what comes next.</p></div></div></div></section>

    <section className="section"><div className="wrap"><div className="section-head"><span className="kicker">Questions</span><h2>What to know before launch.</h2></div><div className="faq">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

    <footer className="wrap footer"><div className="footer-row"><a className="brand" href="#top"><span className="mark" aria-hidden="true">s</span>Sylpace</a><nav className="footer-links" aria-label="Footer"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></nav></div><div className="copyright"><span>© {new Date().getFullYear()} Sylpace</span><span>Learning accountability, with a plan.</span></div></footer>
  </main>;
}
