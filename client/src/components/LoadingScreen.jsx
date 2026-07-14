import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ text = 'HEALTH TRACKER PRO', subtitle = '"Your health is your wealth"' }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5s loader
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loading-screen" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100003,
      transition: 'opacity 0.5s ease-out'
    }}>
      <div className="loading-container" style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
        <div className="loading-animation" style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          margin: '0 auto 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="loading-circle"></div>
          <div className="loading-circle-alt"></div>
          <i className="fas fa-heartbeat loading-icon" style={{
            fontSize: '3rem',
            color: 'var(--accent-color)',
            animation: 'pulse-grow 1.5s ease-in-out infinite',
            position: 'relative',
            zIndex: 1
          }}></i>
        </div>
        <div className="loading-text">
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '2px',
            fontFamily: "'Montserrat', sans-serif"
          }}>{text}</h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            marginBottom: '2rem',
            fontSize: '1.2rem',
            fontFamily: "'Montserrat', sans-serif"
          }}>{subtitle}</p>
        </div>
        <div className="loading-progress" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <div className="loading-bar"></div>
          <div className="loading-bar" style={{ animationDelay: '0.2s', background: 'var(--secondary-gradient)' }}></div>
          <div className="loading-bar" style={{ animationDelay: '0.4s', background: 'var(--accent-gradient)' }}></div>
          <div className="loading-bar" style={{ animationDelay: '0.6s' }}></div>
          <div className="loading-bar" style={{ animationDelay: '0.8s', background: 'var(--secondary-gradient)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
