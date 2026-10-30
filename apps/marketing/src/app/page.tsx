import { WaitlistForm } from '../components/WaitlistForm';

export default function HomePage() {
  return <main className="shell waitlist-home">
    <div className="wrap">
      <header className="nav"><a className="brand" href="/" aria-label="Sylpace home"><span className="mark" aria-hidden="true">s</span>Sylpace</a><nav className="nav-links" aria-label="Main navigation"><a href="#about">About</a></nav></header>
      <section className="waitlist-hero" aria-labelledby="waitlist-title">
        <div className="waitlist-copy"><span className="eyebrow"><i className="pulse"/>Launching soon</span><h1 id="waitlist-title">A steadier way to learn starts here.</h1><p className="lead">Sylpace brings tutor-led university courses and a simple learning routine together. Join the waitlist for launch updates.</p><WaitlistForm /><p className="subnote">No account needed to join. We’ll only use your email for Sylpace launch updates.</p></div>
        <div className="waitlist-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-card"><span className="art-mark">s</span><span className="art-line long"/><span className="art-line"/><span className="art-line short"/><div className="art-check">✓</div></div><div className="art-caption">Learn with a plan.<br/><strong>Keep showing up.</strong></div></div>
      </section>
    </div>
    <section className="section waitlist-about" id="about"><div className="wrap"><span className="kicker">Made for university learning</span><h2>Course structure, learning resources, and follow-through in one place.</h2><div className="waitlist-points"><article><span>01</span><h3>Learn course by course</h3><p>Tutor-led lessons and resources organized around university courses.</p></article><article><span>02</span><h3>Build a steady routine</h3><p>Goals, daily check-ins, and weekly reviews designed to help you keep going.</p></article><article><span>03</span><h3>Start with science</h3><p>Sylpace is being prepared for university science students, with more areas planned over time.</p></article></div></div></section>
    <footer className="wrap footer"><div className="footer-row"><a className="brand" href="/"><span className="mark" aria-hidden="true">s</span>Sylpace</a><nav className="footer-links" aria-label="Footer"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></nav></div><div className="copyright"><span>© {new Date().getFullYear()} Sylpace</span><span>University learning, with a plan.</span></div></footer>
  </main>;
}
