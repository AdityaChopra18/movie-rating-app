import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [step, setStep] = useState(1); // 1 = form, 2 = otp
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { username, email, password });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      login(res.data.user, res.data.token);
      toast.success('Account created! Welcome 🎬');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Step indicator */}
        <div style={styles.steps}>
          <div style={{ ...styles.step, backgroundColor: '#ff2d2d' }}>1</div>
          <div style={styles.stepLine} />
          <div style={{
            ...styles.step,
            backgroundColor: step === 2 ? '#ff2d2d' : '#1a1a1a',
            color: step === 2 ? '#fff' : '#444'
          }}>2</div>
        </div>

        <div style={styles.top}>
          <p style={styles.eyebrow}>
            {step === 1 ? 'Create account' : 'Verify email'}
          </p>
          <h1 style={styles.title}>
            {step === 1 ? 'SIGN UP' : 'CHECK\nYOUR EMAIL'}
          </h1>
        </div>

        {step === 1 ? (
          <div style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="cooluser123"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="min 6 characters"
                style={styles.input}
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Sending OTP...' : 'Continue →'}
            </button>
          </div>
        ) : (
          <div style={styles.form}>
            <p style={styles.otpHint}>
              We sent a 6-digit code to <strong style={{ color: '#fff' }}>{email}</strong>
            </p>
            <div style={styles.field}>
              <label style={styles.label}>OTP CODE</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                style={{ ...styles.input, fontSize: '1.5rem', letterSpacing: '8px', textAlign: 'center' }}
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Verifying...' : 'Verify & Join →'}
            </button>
            <button
              onClick={() => setStep(1)}
              style={styles.backBtn}
            >
              ← Go back
            </button>
          </div>
        )}

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login</Link>
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
  steps: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  step: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0
  },
  stepLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#1a1a1a',
    margin: '0 0.5rem'
  },
  top: { marginBottom: '2rem' },
  eyebrow: {
    fontSize: '0.75rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#ff2d2d',
    marginBottom: '0.5rem'
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '3rem',
    letterSpacing: '4px',
    color: '#fff',
    lineHeight: 1,
    whiteSpace: 'pre-line'
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
    fontFamily: "'DM Sans', sans-serif"
  },
  otpHint: {
    color: '#555',
    fontSize: '0.85rem',
    lineHeight: 1.6
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
    marginTop: '0.5rem'
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#444',
    cursor: 'pointer',
    fontSize: '0.85rem',
    textAlign: 'center'
  },
  footer: {
    textAlign: 'center',
    color: '#444',
    fontSize: '0.85rem'
  },
  link: { color: '#ff2d2d' }
};

export default Signup;