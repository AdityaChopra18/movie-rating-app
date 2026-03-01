import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/');
  };

  return (
    <nav style={{
      ...styles.nav,
      backgroundColor: scrolled ? 'rgba(10,10,10,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #1a1a1a' : '1px solid transparent'
    }}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoAccent}>M</span>OVIE
        <span style={styles.logoAccent}>R</span>ATER
      </Link>

      <div style={styles.links}>
        <Link to="/search" style={styles.link}>Search</Link>
        {user ? (
          <>
            <span style={styles.username}>@{user.username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.signupBtn}>Join Free</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 3rem',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease'
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.8rem',
    letterSpacing: '4px',
    color: '#fff'
  },
  logoAccent: { color: 'var(--red)' },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  link: {
    color: '#aaa',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transition: 'color 0.2s',
  },
  username: {
    color: 'var(--muted)',
    fontSize: '0.85rem'
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #333',
    color: '#aaa',
    padding: '0.4rem 1.2rem',
    borderRadius: '2px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  signupBtn: {
    background: 'var(--red)',
    color: '#fff',
    padding: '0.5rem 1.5rem',
    borderRadius: '2px',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  }
};

export default Navbar;