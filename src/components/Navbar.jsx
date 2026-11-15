import { Link } from "react-router";
import logo from "../assets/Darbi.png";

function Navbar() {
  return (
    <header className="public-header">
      <Link className="public-brand" to="/" aria-label="Darbi home">
        <img src={logo} alt="DARBI" />
        <span aria-hidden="true">DARBI</span>
      </Link>
      <nav className="public-nav" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/sign-in">Sign In</Link>
        <Link className="public-nav-cta" to="/sign-up">Get Started</Link>
      </nav>
    </header>
  );
}

export default Navbar;
