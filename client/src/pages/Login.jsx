import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.top}>
          <p style={styles.eyebrow}>Welcome back</p>
          <h1 style={styles.title}>LOGIN</h1>
        </div>

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={styles.input}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </div>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#0d0d0d',
    border: '1px solid #1a1a1a',
    borderRadius: '4px',
    padding: '3rem'
  },
  top: {
    marginBottom: '2.5rem'
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
    fontSize: '3.5rem',
    letterSpacing: '4px',
    color: '#fff',
    lineHeight: 1
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.7rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#444'
  },
  input: {
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRadius: '2px',
    color: '#f0f0f0',
    padding: '0.8rem 1rem',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s'
  },
  btn: {
    backgroundColor: '#ff2d2d',
    color: '#fff',
    border: 'none',
    padding: '0.9rem',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginTop: '0.5rem',
    transition: 'opacity 0.2s'
  },
  footer: {
    textAlign: 'center',
    color: '#444',
    fontSize: '0.85rem'
  },
  link: {
    color: '#ff2d2d'
  }
};

export default Login;