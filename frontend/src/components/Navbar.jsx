import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LogOut, Compass } from 'lucide-react';
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
        {user && user.role === 'admin' && (
          <li>
            <NavLink to="/admin" className="nav-link admin-nav">Admin Dashboard</NavLink>
          </li>
        )}
        {user && (user.role === 'staff' || user.role === 'admin') && (
          <li>
            <NavLink to="/staff" className="nav-link staff-nav">Restaurant Owner</NavLink>
          </li>
        )}
      </ul>

      <div className="nav-actions">
        <Link to="/cart" className="cart-badge-btn" title="View Cart">
          <ShoppingBag size={20} />
        </Link>

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
