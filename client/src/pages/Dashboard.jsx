import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/users/me/dashboard');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboard();
  }, [user]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action will erase your profile and all your reviews forever. This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await api.delete('/users/me');
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  if (loading) return <div style={styles.container}>Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>MY DASHBOARD</h1>
        
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Profile Information</h2>
          <p style={styles.text}><strong>Username:</strong> {data?.user?.username}</p>
          <p style={styles.text}><strong>Email:</strong> {data?.user?.email}</p>
          <p style={styles.text}>
            <strong>Member Since:</strong> {new Date(data?.user?.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your Stats</h2>
          <p style={styles.text}><strong>Total Reviews Posted:</strong> {data?.stats?.totalReviews}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Recent Activity</h2>
          {data?.recentReviews?.length === 0 ? (
            <p style={styles.text}>No reviews posted yet.</p>
          ) : (
            <ul style={styles.list}>
              {data?.recentReviews?.map(review => (
                <li key={review._id} style={styles.listItem}>
                  <span>Rated <strong>{review.rating}/5</strong> for {review.movie?.title}</span>
                  <span style={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ ...styles.card, borderColor: '#ff2d2d', marginTop: '3rem' }}>
          <h2 style={{ ...styles.cardTitle, color: '#ff2d2d' }}>Danger Zone</h2>
          <p style={{ ...styles.text, marginBottom: '1rem' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button onClick={handleDelete} style={styles.deleteBtn}>
            Delete Account
          </button>
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
  deleteBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ff2d2d',
    color: '#ff2d2d',
    padding: '0.75rem 1.5rem',
    borderRadius: '2px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease'
  }
};

export default Dashboard;
