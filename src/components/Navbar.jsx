import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const LINKS = [
  ['/', 'Home'], ['/destinations', 'Destinations'], ['/plan-trip', 'Plan Trip'],
  ['/guides', 'Guides'], ['/vehicles', 'Vehicles'], ['/about', 'About'], ['/contact', 'Contact']
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>Sylhet<span>Trails</span></Link>

        <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>

        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          {LINKS.map(([to, label]) => (
            <li key={to}><Link to={to} onClick={() => setOpen(false)}>{label}</Link></li>
          ))}
          <li className="navbar-actions-mobile">
            {user ? (
              <button className="btn btn-outline" onClick={() => { logout(); setOpen(false); }}>Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
          </li>
        </ul>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">{user.role}: {user.name}</span>
              <button className="btn btn-outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
