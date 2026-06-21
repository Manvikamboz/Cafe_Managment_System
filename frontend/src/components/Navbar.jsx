import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Compass } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Explore Spots' },
    { to: '/feedback', label: 'Help & Feedback' },
    { to: '/reviews', label: 'Wall of Fame' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="logo-wrap">
        <div className="logo-circle">
          <Compass size={22} />
        </div>
        <strong className="logo-text">Food<span className="logo-highlight">Spot</span></strong>
      </Link>
      
      <ul className="nav-list">
        {navLinks.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          </li>
        ))}

      </ul>

      <div className="nav-actions">


        {user ? (
          <div className="user-profile-nav">
            <span className="user-role-badge">{user.role}</span>
            <span className="user-name-tag">{user.name}</span>
            <button onClick={handleLogout} className="btn-logout" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="auth-btns">
            <Link to="/login" className="nav-login-btn">Login</Link>
            <Link to="/register" className="nav-register-btn">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
