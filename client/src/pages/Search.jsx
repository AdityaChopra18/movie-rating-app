import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/movies/search?title=${query}`);
      setResults(res.data.movies || []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = async (imdbID) => {
    // Save movie to our DB when clicked
    try {
      await api.get(`/movies/${imdbID}`);
    } catch (err) {
      console.log(err);
    }
    navigate(`/movie/${imdbID}`);
  };

  return (
    <div style={styles.container}>

      {/* Search Header */}
      <div style={styles.header}>
        <p style={styles.eyebrow}>Find anything</p>
        <h1 style={styles.title}>SEARCH MOVIES</h1>

        <div style={styles.searchRow}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Inception, The Dark Knight, Interstellar..."
            style={styles.input}
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{ ...styles.searchBtn, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '...' : 'SEARCH'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={styles.content}>
        {loading && (
          <div style={styles.center}>
            <p style={styles.loadingText}>SEARCHING...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={styles.center}>
            <p style={styles.noResults}>No movies found for "{query}"</p>
            <p style={styles.noResultsSub}>Try a different title</p>
          </div>
        )}

        {!loading && !searched && (
          <div style={styles.center}>
            <p style={styles.hint}>🎬 Search for any movie above</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p style={styles.resultCount}>
              {results.length} results for "{query}"
            </p>
            <div style={styles.grid}>
              {results.map(movie => (
                <div
                  key={movie.imdbID}
                  onClick={() => handleMovieClick(movie.imdbID)}
                  style={styles.card}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = '#ff2d2d44';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#1a1a1a';
                  }}
                >
                  <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/120x180/111/333?text=?'}
                    alt={movie.Title}
                    style={styles.poster}
                  />
                  <div style={styles.info}>
                    <h3 style={styles.movieTitle}>{movie.Title}</h3>
                    <p style={styles.year}>{movie.Year}</p>
                    <p style={styles.type}>{movie.Type}</p>
                    <span style={styles.viewBtn}>View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a'
  },
  header: {
    padding: '8rem 3rem 3rem',
    borderBottom: '1px solid #1a1a1a',
    background: 'radial-gradient(ellipse at 50% 0%, #1a0505 0%, #0a0a0a 70%)'
  },
  eyebrow: {
    fontSize: '0.75rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#ff2d2d',
    marginBottom: '0.5rem'
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    letterSpacing: '4px',
    color: '#fff',
    marginBottom: '2rem'
  },
  searchRow: {
    display: 'flex',
    gap: '0',
    maxWidth: '600px'
  },
  input: {
    flex: 1,
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRight: 'none',
    borderRadius: '2px 0 0 2px',
    color: '#f0f0f0',
    padding: '0.9rem 1.2rem',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif"
  },
  searchBtn: {
    backgroundColor: '#ff2d2d',
    color: '#fff',
    border: 'none',
    padding: '0.9rem 2rem',
    borderRadius: '0 2px 2px 0',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.85rem',
    letterSpacing: '2px',
    transition: 'opacity 0.2s'
  },
  content: {
    padding: '2rem 3rem'
  },
  center: {
    textAlign: 'center',
    padding: '5rem 0'
  },
  loadingText: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2rem',
    letterSpacing: '8px',
    color: '#ff2d2d'
  },
  hint: {
    color: '#333',
    fontSize: '1.1rem'
  },
  noResults: {
    color: '#666',
    fontSize: '1.2rem',
    marginBottom: '0.5rem'
  },
  noResultsSub: {
    color: '#333',
    fontSize: '0.9rem'
  },
  resultCount: {
    color: '#444',
    fontSize: '0.8rem',
    letterSpacing: '1px',
    marginBottom: '1.5rem',
    textTransform: 'uppercase'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem'
  },
  card: {
    display: 'flex',
    gap: '1rem',
    backgroundColor: '#0d0d0d',
    border: '1px solid #1a1a1a',
    borderRadius: '4px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.25s ease'
  },
  poster: {
    width: '80px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '2px',
    flexShrink: 0
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    flex: 1
  },
  movieTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#f0f0f0',
    lineHeight: 1.3
  },
  year: {
    fontSize: '0.8rem',
    color: '#555'
  },
  type: {
    fontSize: '0.7rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#333'
  },
  viewBtn: {
    color: '#ff2d2d',
    fontSize: '0.8rem',
    marginTop: 'auto',
    fontWeight: '600'
  }
};

export default Search;