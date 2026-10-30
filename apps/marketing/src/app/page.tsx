import { WaitlistForm } from '../components/WaitlistForm';

const pillars = [
  { icon: '↗', title: 'Learn', text: 'Tutor-led academic courses, arranged around each university’s course structure.' },
  { icon: '✓', title: 'Practise', text: 'Notes, quizzes, and past questions are planned for later releases.' },
  { icon: '◎', title: 'Follow through', text: 'Goals, daily check-ins, and weekly reviews help make learning consistent.' },
  { icon: '＋', title: 'Grow', text: 'Personal development courses are part of the longer-term plan.' },
];

const faqs = [
  ['When will Sylpace launch?', 'Sylpace is in development. Join the waitlist when registration opens to receive launch updates.'],
  ['Who is Sylpace for?', 'The initial plan is to serve university science students, then expand to engineering.'],
  ['Are courses available now?', 'No. Course content is not live yet. Examples and visuals on this page are descriptions of planned work, not live courses.'],
  ['Can tutors apply?', 'Tutor intake details are being decided. We will publish the process when it is ready.'],
];

export default function HomePage() {
  return <main className="shell">
    <div className="wrap">
      <header className="nav"><a className="brand" href="#top" aria-label="Sylpace home"><span className="mark" aria-hidden="true">s</span>Sylpace</a><nav className="nav-links" aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#students">For students</a><a className="nav-cta" href="#waitlist">Join the waitlist <span aria-hidden="true">↗</span></a></nav></header>
      <section className="hero" id="top"><div><span className="eyebrow"><i className="pulse"/> Coming soon</span><h1>Learn with a plan.<br/><em>Keep showing up.</em></h1><p className="lead">Sylpace is a learning platform in development for university students. Follow tutor-led courses and build a steady learning routine, one day at a time.</p><div id="waitlist"><WaitlistForm /></div><p className="subnote">No account needed. We’ll only use your email for Sylpace launch updates.</p></div><div className="visual"><div className="image-placeholder" role="img" aria-label="Placeholder for a licensed photo of university students studying"><div className="placeholder-label"><strong>Image placeholder</strong>Student study photo supplied by Sylpace</div></div><div className="float-card"><b>One step at a time</b><span>A plan you can return to.</span></div><div className="float-card top"><b>Coming soon</b><span>Courses · practice · progress</span></div></div></section>
    </div>

    <section className="section problem"><div className="wrap" style={{display:'contents'}}><div><span className="kicker">Why Sylpace</span><h2 className="section-title">Good intentions need a system.</h2></div><p>University learning can be difficult to organize across lectures, course materials, and busy weeks. Sylpace is being built to bring learning resources and practical accountability into one place, so students can see what to study and keep track of the effort they put in.</p></div></section>

    <section className="section" id="how-it-works"><div className="wrap"><div className="section-head"><span className="kicker">Four connected parts</span><h2>Learn, practise, follow through, grow.</h2><p>These are the product pillars planned for Sylpace. Some features will arrive in later releases.</p></div><div className="grid4">{pillars.map((item) => <article className="pillar" key={item.title}><span className="icon" aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>

    <section className="section"><div className="wrap feature-split"><div><span className="kicker">Built around your courses</span><h2>Study materials with a clear next step.</h2><p style={{color:'var(--muted)',lineHeight:1.75}}>The plan is to organize tutor-made video lessons, notes, and practice by university course, then connect study sessions to goals, daily check-ins, and weekly reflection.</p><ul className="check-list"><li><span className="check">✓</span><span>Courses organized per university</span></li><li><span className="check">✓</span><span>Lessons and notes from tutors</span></li><li><span className="check">✓</span><span>Goals and check-ins for steady progress</span></li><li><span className="check">✓</span><span>A lightweight app designed for mobile use</span></li></ul></div><div className="image-placeholder" style={{height:330}} role="img" aria-label="Placeholder for a licensed image of the Sylpace app in use"><div className="placeholder-label"><strong>Image placeholder</strong>App or tutor photo supplied by Sylpace</div></div></div></section>

    <section className="section who" id="students"><div className="wrap"><div className="section-head"><span className="kicker">Who it is for</span><h2>A focused start, with room to expand.</h2><p>The initial launch sequence is planned around university students.</p></div><div className="audience-grid"><article className="audience"><span>First planned audience</span><h3>Science students</h3><p>Academic courses organized around each participating university, with tutor-led lessons and learning resources.</p></article><article className="audience"><span>Next in the sequence</span><h3>Engineering students</h3><p>Engineering follows after the science launch, with course structures added for each university.</p></article></div></div></section>

    <section className="section" id="tutors"><div className="wrap"><div className="audience"><span>For tutors</span><h3>Help students learn course by course.</h3><p>Sylpace is planned to support tutor-led lessons, notes, and course materials. Tutor intake and application details are still being decided; applications are not open yet.</p></div></div></section>

    <section className="section"><div className="wrap"><div className="section-head"><span className="kicker">The roadmap</span><h2>Building the learning loop in stages.</h2></div><div className="roadmap"><div className="step"><i className="step-num"/><h3>Waitlist</h3><p>Collect interest and share launch updates with early subscribers.</p></div><div className="step"><i className="step-num"/><h3>Science launch</h3><p>Start with university science courses.</p></div><div className="step"><i className="step-num"/><h3>Engineering</h3><p>Expand course coverage to engineering.</p></div><div className="step"><i className="step-num"/><h3>Growth courses</h3><p>Explore personal development topics later.</p></div></div></div></section>

    <section className="section"><div className="wrap"><div className="section-head"><span className="kicker">Questions</span><h2>What to know before launch.</h2></div><div className="faq">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

    <footer className="wrap footer"><div className="footer-row"><a className="brand" href="#top"><span className="mark" aria-hidden="true">s</span>Sylpace</a><nav className="footer-links" aria-label="Footer"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></nav></div><div className="copyright"><span>© {new Date().getFullYear()} Sylpace</span><span>University learning, with a plan.</span></div></footer>
  </main>;
}
