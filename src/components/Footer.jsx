import { Link } from 'react-router-dom';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4>Sylhet Trails</h4>
          <p>Plan trips, book local guides and vehicles, and explore Sylhet's
             tea gardens, waterfalls and hills - all in one place.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/guides">Guides</Link></li>
            <li><Link to="/vehicles">Vehicles</Link></li>
            <li><Link to="/plan-trip">Plan a Trip</Link></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul className="footer-links">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Sylhet Smart Tourism Planner — University Final Year Project
      </div>
    </footer>
  );
}
