import { Link } from 'react-router-dom';
import { Layers, GitFork, X } from 'lucide-react';
import { APP_NAME, APP_SUBTITLE } from '../../data/imagebench';
import './Footer.css';

export const Footer = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <Link to="/" className="footer__logo">
          <div className="footer__logo-icon"><Layers size={16} /></div>
          {APP_NAME}
        </Link>
        <p className="footer__tagline">{APP_SUBTITLE}</p>
      </div>

      <div className="footer__links-group">
        <p className="footer__heading">Platform</p>
        <Link to="/?tab=leaderboard">Leaderboard</Link>
        <Link to="/?tab=compare">Compare Models</Link>
      </div>

      <div className="footer__links-group">
        <p className="footer__heading">About</p>
        <a href="#">Methodology</a>
        <a href="#">Pilot Report</a>
        <a href="#">Contact</a>
      </div>

      <div className="footer__social">
        <a href="#" aria-label="GitHub" id="footer-github"><GitFork size={20} /></a>
        <a href="#" aria-label="Twitter" id="footer-twitter"><X size={20} /></a>
      </div>
    </div>
  </footer>
);
