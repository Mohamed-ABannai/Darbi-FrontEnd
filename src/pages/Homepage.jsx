import { Link } from "react-router";

function HomePage() {
  return <div className="home-page">
    <section className="home-hero">
      <div className="hero-copy">
        <span className="hero-eyebrow">A clearer road ahead · Bahrain</span>
        <h1>Confidence comes <em>one drive</em> at a time.</h1>
        <p>Meet your instructor, plan your practice, and keep every lesson in view. DARBI brings your driving journey together in one calm, simple place.</p>
        <div className="hero-actions"><Link to="/sign-up">Start your journey</Link><Link to="/sign-in">I already have an account</Link></div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="road-orbit"><div className="hero-car"><svg viewBox="0 0 100 70" fill="none"><path d="M15 43 23 25c2-5 6-8 12-8h28c6 0 10 3 13 8l9 18 5 4v12H10V47l5-4Z" stroke="currentColor" strokeWidth="3" /><path d="m27 27-6 15h58L72 27c-2-4-5-6-10-6H38c-5 0-9 2-11 6Z" stroke="currentColor" strokeWidth="3" /><circle cx="27" cy="57" r="7" fill="#183e38" /><circle cx="73" cy="57" r="7" fill="#183e38" /><path d="M11 46h13m52 0h13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></div></div><span className="hero-note note-one">Your pace. Your progress.</span><span className="hero-note note-two">Practice, made clearer</span></div>
    </section>
    <section className="home-section"><span className="section-kicker">Everything in one place</span><h2>More focus on the road. Less chasing the details.</h2><div className="home-features">
      {[['01', 'Find your instructor', 'Explore instructor profiles and request a training plan that works for you.'], ['02', 'Plan each lesson', 'Keep your schedule and training plan close at hand.'], ['03', 'Track your progress', 'See completed hours and the next steps in your learning journey.'], ['04', 'Stay ready', 'Keep test bookings, payments, and receipts together.']].map(([n, title, copy]) => <article className="feature-item" key={n}><span className="feature-index">{n} / 04</span><h3>{title}</h3><p>{copy}</p></article>)}
    </div></section>
    <section className="home-section home-steps"><span className="section-kicker">A simple start</span><h2>Your next step is already within reach.</h2><div className="steps-row"><article className="step-item"><span className="step-number">1</span><h3>Create your account</h3><p>Join as a learner and set up your DARBI profile.</p></article><article className="step-item"><span className="step-number">2</span><h3>Choose an instructor</h3><p>Review available instructors and send a training request.</p></article><article className="step-item"><span className="step-number">3</span><h3>Build your confidence</h3><p>Manage lessons and follow your progress toward test day.</p></article></div></section>
    <footer className="home-footer"><p><strong>DARBI</strong> · Your driving journey, in good hands.</p><p>Made for learners and instructors across Bahrain.</p></footer>
  </div>;
}

export default HomePage;
