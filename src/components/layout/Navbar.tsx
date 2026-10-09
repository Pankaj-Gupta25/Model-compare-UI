import { Link } from 'react-router-dom';
import { Layers, Moon } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => (
  <header className="navbar">
    <div className="container navbar__inner">
      {/* Logo */}
      <Link to="/" className="navbar__logo">
        <div className="navbar__logo-icon">
          <Layers size={18} />
        </div>
        <span>Eval</span>
      </Link>

      <nav className="navbar__links">
        <Link to="#" className="navbar__link">How it Works</Link>
        <Link to="#" className="navbar__link">Models</Link>
      </nav>

      {/* Right side */}
      <div className="navbar__right">
        <button className="navbar__icon-btn" aria-label="Toggle dark mode">
          <Moon size={16} />
        </button>
        <button className="navbar__btn">New Eval</button>
        <button className="navbar__btn">Sign in</button>
      </div>
    </div>
  </header>
);
