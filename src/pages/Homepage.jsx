import { Link } from "react-router";

function HomePage() {
  return (
    <div>
      <h1>Welcome to DARBI</h1>

      <h2>Your Driving Journey Starts Here</h2>

      <p>
        DARBI helps learners find driving instructors,
        manage training lessons, track their progress,
        and prepare for driving tests in Bahrain.
      </p>

      <Link to="/sign-up">
        <button>Get Started</button>
      </Link>

      <h2>Our Services</h2>

      <div>
        <h3>Find Instructors</h3>
        <p>Find approved driving instructors.</p>
      </div>

      <div>
        <h3>Training Lessons</h3>
        <p>Manage your lessons and training schedules.</p>
      </div>

      <div>
        <h3>Driving Tests</h3>
        <p>Track your training progress and driving tests.</p>
      </div>

      <div>
        <h3>Payments</h3>
        <p>Manage payments and view invoices.</p>
      </div>
    </div>
  );
}

export default HomePage;
