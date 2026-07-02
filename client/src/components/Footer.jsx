import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.brand}>
          <span style={styles.logoRed}>M</span>OVIE<span style={styles.logoRed}>R</span>ATER
        </div>
        <p style={styles.tagline}>
          Honest ratings by real people. No ads, no paid promotions.
        </p>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/search" style={styles.link}>Search Movies</Link>
          <Link to="/signup" style={styles.link}>Sign Up</Link>
          <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
        </div>
        <p style={styles.copyright}>
          &copy; {new Date().getFullYear()} MovieRater. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#0a0a0a',
    borderTop: '1px solid #1a1a1a',
    padding: '3rem 2rem 2rem',
    marginTop: 'auto'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem'
  },
  brand: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2rem',
    letterSpacing: '6px',
    color: '#fff',
    lineHeight: 1
  },
  logoRed: {
    color: '#ff2d2d'
  },
  tagline: {
    color: '#888',
    fontSize: '0.9rem',
    maxWidth: '400px',
    margin: '0 auto'
  },
  links: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  link: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transition: 'color 0.2s ease'
  },
  copyright: {
    color: '#444',
    fontSize: '0.75rem',
    marginTop: '1rem'
  }
};

export default Footer;
