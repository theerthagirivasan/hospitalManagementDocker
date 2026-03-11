import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.roles.includes('ROLE_ADMIN')) return '/admin';
    if (user.roles.includes('ROLE_DOCTOR')) return '/doctor';
    return '/patient';
  };

  return (
    <nav className="glass" style={{
      position: 'fixed', top: '1rem', left: '1rem', right: '1rem', zIndex: 50,
      padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>
        <Link to={getDashboardLink()} style={{ textDecoration: 'none', color: 'var(--text)' }}>
          <span style={{color: 'var(--primary)'}}>☤</span> CareBridge
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Welcome, <strong style={{color: 'var(--text)'}}>{user.name}</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
