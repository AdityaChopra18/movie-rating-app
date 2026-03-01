import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    const id = movie.imdbID || movie.tmdbId;
    navigate(`/movie/${id}`);
  };

  const title = movie.Title || movie.title;
  const year = movie.Year || movie.releaseYear;
  const poster = movie.Poster || movie.posterUrl;
  const rating = movie.averageRating;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.3)'
      }}
    >
      <div style={styles.posterWrap}>
        <img
          src={poster !== 'N/A' && poster ? poster : 'https://via.placeholder.com/200x300/111/333?text=?'}
          alt={title}
          style={styles.poster}
        />
        {/* Overlay on hover */}
        <div style={{
          ...styles.overlay,
          opacity: hovered ? 1 : 0
        }}>
          <span style={styles.viewBtn}>View Details</span>
        </div>
        {rating > 0 && (
          <div style={styles.ratingBadge}>
            ⭐ {rating}
          </div>
        )}
      </div>
      <div style={styles.info}>
        <p style={styles.title}>{title}</p>
        <p style={styles.year}>{year}</p>
        {movie.Type && (
  <p style={{
    fontSize: '0.65rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#ff2d2d',
    marginTop: '2px'
  }}>
    {movie.Type}
  </p>
)}
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: '160px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#111',
    flexShrink: 0
  },
  posterWrap: {
    position: 'relative',
    width: '100%',
    height: '240px'
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255,45,45,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s ease'
  },
  viewBtn: {
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  ratingBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#f5c518',
    fontSize: '0.75rem',
    padding: '2px 6px',
    borderRadius: '2px',
    fontWeight: '600'
  },
  info: {
    padding: '0.6rem 0.5rem'
  },
  title: {
    fontSize: '0.82rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#f0f0f0',
    marginBottom: '2px'
  },
  year: {
    fontSize: '0.72rem',
    color: '#555'
  }
  
};

export default MovieCard;