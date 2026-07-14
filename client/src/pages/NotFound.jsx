import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-dark)',
    textAlign: 'center',
    padding: '2rem',
    fontFamily: 'Montserrat, sans-serif'
  }}>
    <div style={{
      fontSize: '8rem',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #dc3545, #c82333)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: 1,
      marginBottom: '1rem'
    }}>404</div>
    <i className="fas fa-heartbeat" style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '1.5rem', animation: 'pulse 1.5s infinite' }} />
    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
      Page Not Found
    </h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" style={{
        padding: '0.85rem 2rem',
        background: 'linear-gradient(135deg, #dc3545, #c82333)',
        color: 'white',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: '0.95rem',
        transition: 'opacity 0.2s'
      }}>
        <i className="fas fa-home" style={{ marginRight: '8px' }} />
        Go Home
      </Link>
      <Link to="/doctors" style={{
        padding: '0.85rem 2rem',
        background: 'transparent',
        color: '#dc3545',
        border: '2px solid #dc3545',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: '0.95rem'
      }}>
        <i className="fas fa-user-md" style={{ marginRight: '8px' }} />
        Find a Doctor
      </Link>
    </div>
  </div>
);

export default NotFound;
