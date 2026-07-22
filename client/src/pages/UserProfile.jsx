import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Carousel from '../components/Carousel';
import MovieCard from '../components/MovieCard';

const UserProfile = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile/${username}`);
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <div style={styles.container}>Loading profile...</div>;

  if (!data || !data.user) return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>USER NOT FOUND</h1>
        <p style={styles.text}>The user @{username} does not exist.</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <Helmet>
        <title>{data.user.username}'s Movie Reviews & Watchlist - MovieRater</title>
        <meta name="description" content={`Check out ${data.user.username}'s favorite movies, reviews, and ratings on MovieRater.`} />
      </Helmet>
      <div style={styles.content}>
        <h1 style={styles.title}>@{data.user.username.toUpperCase()}'S PROFILE</h1>
        
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Profile Information</h2>
          <p style={styles.text}>
            <strong>Member Since:</strong> {new Date(data.user.createdAt).toLocaleDateString()}
          </p>
          <p style={styles.text}><strong>Total Reviews Posted:</strong> {data.stats?.totalReviews}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Favorites</h2>
          {(!data.user.favorites || data.user.favorites.length === 0) ? (
            <p style={styles.text}>No favorites yet.</p>
          ) : (
            <Carousel>
              {data.user.favorites.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </Carousel>
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Watchlist</h2>
          {(!data.user.watchlist || data.user.watchlist.length === 0) ? (
            <p style={styles.text}>Watchlist is empty.</p>
          ) : (
            <Carousel>
              {data.user.watchlist.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </Carousel>
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Recent Reviews</h2>
          {(!data.recentReviews || data.recentReviews.length === 0) ? (
            <p style={styles.text}>No reviews posted yet.</p>
          ) : (
            <ul style={styles.list}>
              {data.recentReviews.map(review => (
                <li key={review._id} style={styles.listItem}>
                  <span>
                    Rated <strong>{review.rating}/5</strong> for <Link to={`/movie/${review.movie?.tmdbId}`} style={styles.link}>{review.movie?.title}</Link>
                  </span>
                  <span style={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    padding: '6rem 2rem 4rem',
    color: '#fff'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '3rem',
    letterSpacing: '3px',
    color: '#fff',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: '#0d0d0d',
    padding: '2rem',
    borderRadius: '4px',
    border: '1px solid #1a1a1a',
    marginBottom: '1.5rem'
  },
  cardTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.5rem',
    letterSpacing: '2px',
    marginBottom: '1rem',
    color: '#ccc'
  },
  text: {
    color: '#aaa',
    marginBottom: '0.5rem',
    fontSize: '0.95rem'
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #1a1a1a',
    color: '#ccc',
    fontSize: '0.9rem'
  },
  date: {
    color: '#666',
    fontSize: '0.8rem'
  },
  link: {
    color: '#ff2d2d',
    textDecoration: 'none'
  }
};

export default UserProfile;
