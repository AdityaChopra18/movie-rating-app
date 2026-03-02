import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav style={{
        ...styles.nav,
        backgroundColor: scrolled || menuOpen ? 'rgba(10,10,10,0.97)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid #1a1a1a' : '1px solid transparent'
      }}>
        {/* Logo */}
        <Link to="/" onClick={closeMenu} style={styles.logo}>
          <span style={styles.logoAccent}>M</span>OVIE
          <span style={styles.logoAccent}>R</span>ATER
        </Link>

        {/* Desktop Links */}
        <div style={styles.desktopLinks}>
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

        {/* Hamburger Button — mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={styles.hamburger}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/search" onClick={closeMenu} style={styles.mobileLink}>
            Search
          </Link>
          {user ? (
            <>
              <span style={styles.mobileUsername}>@{user.username}</span>
              <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} style={styles.mobileLink}>
                Login
              </Link>
              <Link to="/signup" onClick={closeMenu} style={styles.mobileSignupBtn}>
                Join Free
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 1.5rem',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease'
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.6rem',
    letterSpacing: '4px',
    color: '#fff'
  },
  logoAccent: { color: 'var(--red)' },

  // Desktop
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  link: {
    color: '#aaa',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    textTransform: 'uppercase'
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
  },

  // Hamburger
  hamburger: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.2rem 0.5rem',
    // shown via media query in CSS below
  },

  // Mobile menu
  mobileMenu: {
    position: 'fixed',
    top: '64px',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10,10,10,0.97)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1a1a1a',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 2rem',
    gap: '1.5rem'
  },
  mobileLink: {
    color: '#f0f0f0',
    fontSize: '1.2rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontFamily: "'Bebas Neue', sans-serif"
  },
  mobileUsername: {
    color: '#555',
    fontSize: '0.85rem'
  },
  mobileLogoutBtn: {
    background: 'transparent',
    border: '1px solid #333',
    color: '#aaa',
    padding: '0.8rem',
    borderRadius: '2px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textAlign: 'left'
  },
  mobileSignupBtn: {
    background: '#ff2d2d',
    color: '#fff',
    padding: '0.8rem 1.5rem',
    borderRadius: '2px',
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textAlign: 'center'
  }
};

// Inject responsive CSS
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @media (max-width: 768px) {
    .desktop-links { display: none !important; }
    .hamburger-btn { display: block !important; }
  }
  @media (min-width: 769px) {
    .mobile-menu { display: none !important; }
  }
`;
document.head.appendChild(styleTag);

export default Navbar;