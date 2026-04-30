import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cookbook', label: 'Menu' },
    { to: '/cart', label: 'Cart' },
    { to: '/feedback', label: 'Feedback' },
    { to: '/reviews', label: 'Reviews' },
  ];

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><strong className="logo">Smart Café</strong></li>
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
        
        {user ? (
          <>
            {user.role === 'admin' && (
              <li><NavLink to="/admin" className="nav-link">Admin</NavLink></li>
            )}
            {(user.role === 'staff' || user.role === 'admin') && (
              <li><NavLink to="/staff" className="nav-link">Staff</NavLink></li>
            )}
            <li><button onClick={handleLogout} className="btn-logout">Logout ({user.name})</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
            <li><NavLink to="/register" className="nav-link">Register</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}
