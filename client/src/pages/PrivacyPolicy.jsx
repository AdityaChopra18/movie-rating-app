import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>PRIVACY POLICY</h1>
        <p style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section style={styles.section}>
          <h2 style={styles.heading}>1. Information We Collect</h2>
          <p style={styles.text}>
            When you register for MovieRater, we collect your username, email address, and a hashed version of your password. We also collect the ratings and text reviews you submit for movies.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>2. How We Use Your Information</h2>
          <p style={styles.text}>
            We use your email address solely for authentication purposes and sending account verification codes. We use your ratings to power our recommendation engine and provide personalized movie suggestions. Your public username is displayed alongside your reviews.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>3. Data Protection</h2>
          <p style={styles.text}>
            Your security is important to us. Passwords are securely hashed using bcrypt before being stored in our database. We use JSON Web Tokens (JWT) for secure authentication sessions.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>4. Information Sharing</h2>
          <p style={styles.text}>
            We do not sell, trade, or rent your personal identification information to others. We are an ad-free platform, meaning your data is never used for targeted advertising.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>5. Contact Us</h2>
          <p style={styles.text}>
            If you have any questions about this Privacy Policy, please contact us at support@movierater.com.
          </p>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    padding: '4rem 2rem'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#0d0d0d',
    padding: '3rem',
    borderRadius: '4px',
    border: '1px solid #1a1a1a'
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '3rem',
    letterSpacing: '3px',
    color: '#fff',
    marginBottom: '0.5rem'
  },
  lastUpdated: {
    color: '#ff2d2d',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    marginBottom: '3rem'
  },
  section: {
    marginBottom: '2rem'
  },
  heading: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.5rem',
    letterSpacing: '2px',
    color: '#fff',
    marginBottom: '1rem'
  },
  text: {
    color: '#888',
    lineHeight: 1.8,
    fontSize: '0.95rem'
  }
};

export default PrivacyPolicy;
