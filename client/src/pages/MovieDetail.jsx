import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MovieDetail = () => {
  const { imdbId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [movieRes, reviewRes, similarRes] = await Promise.all([
          api.get(`/movies/${imdbId}`),
          api.get(`/reviews/${imdbId}`),
          api.get(`/recommendations/genre/${imdbId}`)
        ]);
        setMovie(movieRes.data);
        setReviews(reviewRes.data.reviews || []);
        setSimilar(similarRes.data.recommendations || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [imdbId]);

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to post a review!');
      navigate('/login');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a star rating!');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/reviews/${imdbId}`, { rating, reviewText });
      toast.success('Review posted!');
      // Refresh reviews
      const res = await api.get(`/reviews/${imdbId}`);
      setReviews(res.data.reviews || []);
      setRating(0);
      setReviewText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error posting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={styles.loading}>
      <p style={styles.loadingText}>LOADING</p>
    </div>
  );

  if (!movie) return (
    <div style={styles.loading}>
      <p style={{ color: '#666' }}>Movie not found.</p>
    </div>
  );

  return (
    <div style={styles.container}>

      {/* Backdrop */}
      <div style={{
        ...styles.backdrop,
        backgroundImage: `url(${movie.posterUrl})`
      }} />
      <div style={styles.backdropOverlay} />

      {/* Hero Section */}
      <div style={styles.hero}>
        <img
          src={movie.posterUrl !== 'N/A' ? movie.posterUrl : 'https://via.placeholder.com/300x450/111/333?text=?'}
          alt={movie.title}
          style={styles.poster}
        />
        <div style={styles.heroInfo}>
          <div style={styles.genreRow}>
            {movie.genre?.map(g => (
              <span key={g} style={styles.genreTag}>{g}</span>
            ))}
          </div>
          <h1 style={styles.title}>{movie.title}</h1>
          <p style={styles.meta}>
            {movie.director && <span>Dir. {movie.director}</span>}
            {movie.releaseYear && <span> · {movie.releaseYear}</span>}
          </p>
          <div style={styles.ratingRow}>
            <span style={styles.bigRating}>
              {movie.averageRating > 0 ? `⭐ ${movie.averageRating}` : 'Not rated yet'}
            </span>
            {movie.totalRatings > 0 && (
              <span style={styles.ratingCount}>{movie.totalRatings} ratings</span>
            )}
          </div>
          {movie.isFlaggedForBombing && (
            <div style={styles.flagWarning}>
              ⚠️ This movie's ratings are under review due to unusual activity
            </div>
          )}
          <p style={styles.description}>{movie.description}</p>
        </div>
      </div>

      <div style={styles.content}>

        {/* Rating Distribution */}
        {movie.totalRatings > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>RATING BREAKDOWN</h2>
            <div style={styles.distribution}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = movie.ratingDistribution?.[star] || 0;
                const pct = movie.totalRatings > 0 ? (count / movie.totalRatings) * 100 : 0;
                return (
                  <div key={star} style={styles.distRow}>
                    <span style={styles.distLabel}>{'⭐'.repeat(star)}</span>
                    <div style={styles.distBarBg}>
                      <div style={{ ...styles.distBarFill, width: `${pct}%` }} />
                    </div>
                    <span style={styles.distCount}>{count}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Write Review */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>WRITE A REVIEW</h2>
          {!user ? (
            <div style={styles.loginPrompt}>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                You need an account to post reviews. Viewing is always free!
              </p>
              <button onClick={() => navigate('/signup')} style={styles.loginBtn}>
                Sign Up to Review
              </button>
            </div>
          ) : (
            <div style={styles.reviewForm}>
              {/* Star Selector */}
              <div style={styles.starRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      ...styles.star,
                      color: star <= (hoverRating || rating) ? '#f5c518' : '#333',
                      transform: star <= (hoverRating || rating) ? 'scale(1.2)' : 'scale(1)'
                    }}
                  >
                    ★
                  </span>
                ))}
                {rating > 0 && (
                  <span style={styles.ratingLabel}>
                    {['', 'Terrible', 'Bad', 'Okay', 'Good', 'Amazing'][rating]}
                  </span>
                )}
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your thoughts... (optional)"
                style={styles.textarea}
                rows={4}
                maxLength={1000}
              />
              <div style={styles.formFooter}>
                <span style={styles.charCount}>{reviewText.length}/1000</span>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  style={{
                    ...styles.submitBtn,
                    opacity: submitting ? 0.6 : 1
                  }}
                >
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Reviews List */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            REVIEWS {reviews.length > 0 && `(${reviews.length})`}
          </h2>
          {reviews.length === 0 ? (
            <p style={styles.empty}>No reviews yet. Be the first!</p>
          ) : (
            <div style={styles.reviewsList}>
              {reviews.map(review => (
                <div key={review._id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <span style={styles.reviewUser}>@{review.user?.username}</span>
                    <span style={styles.reviewRating}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <span style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.reviewText && (
                    <p style={styles.reviewText}>{review.reviewText}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Similar Movies */}
        {similar.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>MORE LIKE THIS</h2>
            <div style={styles.similarGrid}>
              {similar.slice(0, 6).map(m => (
                <div
                  key={m._id}
                  onClick={() => navigate(`/movie/${m.tmdbId}`)}
                  style={styles.similarCard}
                >
                  <img
                    src={m.posterUrl !== 'N/A' ? m.posterUrl : 'https://via.placeholder.com/120x180/111/333?text=?'}
                    alt={m.title}
                    style={styles.similarPoster}
                  />
                  <p style={styles.similarTitle}>{m.title}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    position: 'relative'
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
    color: '#ff2d2d'
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(40px) brightness(0.15)',
    transform: 'scale(1.1)',
    zIndex: 0
  },
  backdropOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(to bottom, #0a0a0a44, #0a0a0a)',
    zIndex: 1
  },
  hero: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    gap: '3rem',
    padding: '8rem 3rem 3rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  poster: {
    width: '220px',
    borderRadius: '4px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
    flexShrink: 0
  },
  heroInfo: {
    flex: 1,
    minWidth: '280px'
  },
  genreRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1rem'
  },
  genreTag: {
    fontSize: '0.7rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#ff2d2d',
    border: '1px solid #ff2d2d44',
    padding: '2px 8px',
    borderRadius: '2px'
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    letterSpacing: '2px',
    lineHeight: 1,
    marginBottom: '0.5rem',
    color: '#fff'
  },
  meta: {
    color: '#555',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    letterSpacing: '1px'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  bigRating: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2rem',
    color: '#f5c518',
    letterSpacing: '2px'
  },
  ratingCount: {
    color: '#444',
    fontSize: '0.85rem'
  },
  flagWarning: {
    backgroundColor: '#2a1500',
    border: '1px solid #ff6b00',
    color: '#ff6b00',
    padding: '0.5rem 1rem',
    borderRadius: '2px',
    fontSize: '0.8rem',
    marginBottom: '1rem'
  },
  description: {
    color: '#888',
    lineHeight: 1.8,
    fontSize: '0.95rem',
    maxWidth: '600px'
  },
  content: {
    position: 'relative',
    zIndex: 2,
    padding: '0 3rem 4rem'
  },
  section: {
    marginBottom: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid #1a1a1a'
  },
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.4rem',
    letterSpacing: '4px',
    color: '#fff',
    marginBottom: '1.5rem'
  },
  distribution: {
    maxWidth: '400px'
  },
  distRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '0.5rem'
  },
  distLabel: {
    fontSize: '0.75rem',
    width: '80px',
    flexShrink: 0
  },
  distBarBg: {
    flex: 1,
    height: '6px',
    backgroundColor: '#1a1a1a',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  distBarFill: {
    height: '100%',
    backgroundColor: '#f5c518',
    borderRadius: '3px',
    transition: 'width 0.5s ease'
  },
  distCount: {
    fontSize: '0.8rem',
    color: '#444',
    width: '20px',
    textAlign: 'right'
  },
  loginPrompt: {
    backgroundColor: '#111',
    border: '1px solid #1a1a1a',
    padding: '2rem',
    borderRadius: '4px',
    textAlign: 'center'
  },
  loginBtn: {
    backgroundColor: '#ff2d2d',
    color: '#fff',
    border: 'none',
    padding: '0.7rem 2rem',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontSize: '0.85rem'
  },
  reviewForm: {
    backgroundColor: '#0d0d0d',
    border: '1px solid #1a1a1a',
    padding: '1.5rem',
    borderRadius: '4px',
    maxWidth: '600px'
  },
  starRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  star: {
    fontSize: '2rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    userSelect: 'none'
  },
  ratingLabel: {
    color: '#f5c518',
    fontSize: '0.85rem',
    marginLeft: '0.5rem',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  textarea: {
    width: '100%',
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRadius: '2px',
    color: '#f0f0f0',
    padding: '0.8rem',
    fontSize: '0.9rem',
    resize: 'vertical',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none'
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.8rem'
  },
  charCount: {
    color: '#333',
    fontSize: '0.75rem'
  },
  submitBtn: {
    backgroundColor: '#ff2d2d',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.8rem',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transition: 'opacity 0.2s'
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '700px'
  },
  reviewCard: {
    backgroundColor: '#0d0d0d',
    border: '1px solid #1a1a1a',
    padding: '1.2rem',
    borderRadius: '4px'
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
    flexWrap: 'wrap'
  },
  reviewUser: {
    color: '#ff2d2d',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  reviewRating: {
    color: '#f5c518',
    fontSize: '0.9rem',
    letterSpacing: '2px'
  },
  reviewDate: {
    color: '#333',
    fontSize: '0.75rem',
    marginLeft: 'auto'
  },
  reviewText: {
    color: '#888',
    fontSize: '0.9rem',
    lineHeight: 1.7
  },
  similarGrid: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  similarCard: {
    width: '120px',
    cursor: 'pointer'
  },
  similarPoster: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '0.4rem'
  },
  similarTitle: {
    fontSize: '0.75rem',
    color: '#666',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};

export default MovieDetail;