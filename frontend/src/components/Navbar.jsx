import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Activity, Briefcase, Shield } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <Activity className="nav-icon" />
        <Link to="/">TaskFlow Pro</Link>
      </div>
      
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">
              <Briefcase size={18} /> Dashboard
            </Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="nav-link admin-link">
                <Shield size={18} /> Admin
              </Link>
            )}
            <button onClick={handleLogout} className="btn btn-secondary logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
