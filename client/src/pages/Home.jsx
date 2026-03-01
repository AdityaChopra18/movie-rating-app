import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, trendRes] = await Promise.all([
          api.get('/recommendations/toprated'),
          api.get('/recommendations/trending')
        ]);
        setTopRated(topRes.data.movies);
        setTrending(trendRes.data.movies);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.loadingText}>LOADING</div>
    </div>
  );

  return (
    <div style={styles.container}>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroNoise} />
        <div style={styles.heroContent}>
          <p style={styles.heroEyebrow}>The honest review platform</p>
          <h1 style={styles.heroTitle}>MOVIES RATED<br />BY REAL PEOPLE</h1>
          <p style={styles.heroSub}>
            No paid reviews. No manipulation.<br />Protected against review bombing.
          </p>
          <div style={styles.heroBtns}>
            <Link to="/search" style={styles.primaryBtn}>Explore Movies</Link>
            <Link to="/signup" style={styles.secondaryBtn}>Join Free →</Link>
          </div>
        </div>
        {/* Decorative lines */}
        <div style={styles.decorLine1} />
        <div style={styles.decorLine2} />
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.stat}>
          <span style={styles.statNum}>{topRated.length + trending.length}</span>
          <span style={styles.statLabel}>Movies Rated</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <span style={styles.statNum}>100%</span>
          <span style={styles.statLabel}>Verified Reviews</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <span style={styles.statNum}>0</span>
          <span style={styles.statLabel}>Paid Promotions</span>
        </div>
      </div>

      {/* Trending */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionAccent} />
          <h2 style={styles.sectionTitle}>TRENDING THIS WEEK</h2>
        </div>
        {trending.length === 0 ? (
          <p style={styles.empty}>No trending movies yet — start rating!</p>
        ) : (
          <div style={styles.scrollRow}>
            {trending.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Top Rated */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionAccent} />
          <h2 style={styles.sectionTitle}>ALL TIME TOP RATED</h2>
        </div>
        {topRated.length === 0 ? (
          <p style={styles.empty}>No rated movies yet — be the first!</p>
        ) : (
          <div style={styles.scrollRow}>
            {topRated.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a'
  },
  loading: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a'
  },
  loadingText: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2rem',
    letterSpacing: '8px',
    color: '#ff2d2d',
    animation: 'pulse 1s infinite'
  },
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: 'radial-gradient(ellipse at 20% 50%, #1a0505 0%, #0a0a0a 60%)'
  },
  heroNoise: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
    opacity: 0.4,
    pointerEvents: 'none'
  },
  heroContent: {
    textAlign: 'center',
    zIndex: 2,
    padding: '2rem'
  },
  heroEyebrow: {
    fontSize: '0.8rem',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    color: '#ff2d2d',
    marginBottom: '1.5rem'
  },
  heroTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(3.5rem, 10vw, 8rem)',
    lineHeight: 0.95,
    letterSpacing: '2px',
    color: '#fff',
    marginBottom: '1.5rem'
  },
  heroSub: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: 1.8,
    marginBottom: '3rem'
  },
  heroBtns: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    backgroundColor: '#ff2d2d',
    color: '#fff',
    padding: '0.9rem 2.5rem',
    borderRadius: '2px',
    fontWeight: '600',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  secondaryBtn: {
    color: '#aaa',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    borderBottom: '1px solid #333',
    paddingBottom: '2px'
  },
  decorLine1: {
    position: 'absolute',
    top: '20%',
    right: '-5%',
    width: '40%',
    height: '1px',
    background: 'linear-gradient(to left, transparent, #ff2d2d22)',
    transform: 'rotate(-30deg)'
  },
  decorLine2: {
    position: 'absolute',
    bottom: '25%',
    left: '-5%',
    width: '35%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #ff2d2d22)',
    transform: 'rotate(-20deg)'
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
    padding: '2rem',
    borderTop: '1px solid #1a1a1a',
    borderBottom: '1px solid #1a1a1a',
    backgroundColor: '#0d0d0d'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem'
  },
  statNum: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2rem',
    color: '#ff2d2d',
    letterSpacing: '2px'
  },
  statLabel: {
    fontSize: '0.7rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#444'
  },
  statDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: '#1a1a1a'
  },
  section: {
    padding: '3rem 2rem'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  sectionAccent: {
    width: '4px',
    height: '24px',
    backgroundColor: '#ff2d2d',
    borderRadius: '2px'
  },
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.8rem',
    letterSpacing: '3px',
    color: '#fff'
  },
  scrollRow: {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    paddingBottom: '1rem',
    scrollbarWidth: 'thin'
  },
  empty: {
    color: '#444',
    fontStyle: 'italic',
    fontSize: '0.9rem'
  }
};

export default Home;