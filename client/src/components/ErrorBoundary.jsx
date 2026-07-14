import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fa',
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '4rem', color: '#dc3545', marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#212529' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '1rem', color: '#6c757d', maxWidth: '480px', marginBottom: '2rem', lineHeight: 1.6 }}>
            An unexpected error occurred. Our team has been notified. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.85rem 2rem',
              background: 'linear-gradient(135deg, #dc3545, #c82333)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-redo" style={{ marginRight: '8px' }} />
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#212529',
              color: '#f8f9fa',
              borderRadius: '12px',
              fontSize: '0.8rem',
              textAlign: 'left',
              maxWidth: '700px',
              overflow: 'auto'
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
