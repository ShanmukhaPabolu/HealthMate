import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
    const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };


  // Step 1: Send Reset OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      if (response.data.success) {
        setMessage(response.data.message);
        showToast('Verification code sent successfully to ' + email, 'success');
        setShowResetForm(true);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'User with this email not found.';
      setError(errMsg);
      showToast(errMsg, 'error');
    }
  };

  // Step 2: Verify OTP and save new password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('/api/auth/reset-password', { email, otp, password });
      if (response.data.success) {
        setMessage(response.data.message);
        showToast('Password updated successfully! Redirecting...', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid or expired OTP.';
      setError(errMsg);
      showToast(errMsg, 'error');
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translate(20px, -20px);
            opacity: 0;
          }
          to {
            transform: translate(0, 0);
            opacity: 1;
          }
        }
      `}</style>

      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: '600',
          fontSize: '15px',
          animation: 'slideIn 0.3s ease-out forwards',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ fontSize: '18px' }}></i>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
                        
      <Link to="/login" className="back-home" style={{
        position: 'fixed',
        top: '30px',
        left: '30px',
        zIndex: 1001,
        color: 'var(--text-primary)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        fontSize: '15px'
      }}>
        <i className="fas fa-arrow-left"></i> Back to Login
      </Link>

      <div className="auth-container" style={{
        display: 'flex',
        width: '90%',
        maxWidth: '600px',
        minHeight: '450px',
        margin: '120px auto',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        padding: '50px',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>Reset Password</h2>

        {message && (
          <div style={{ padding: '12px 18px', backgroundColor: 'var(--accent-gradient)', color: 'white', borderRadius: '10px', fontWeight: '600', marginBottom: '20px', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <i className="fas fa-check-circle"></i>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div style={{ padding: '12px 18px', backgroundColor: 'var(--primary-gradient)', color: 'white', borderRadius: '10px', fontWeight: '600', marginBottom: '20px', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {!showResetForm ? (
          /* STEP 1: INPUT EMAIL */
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
              Please enter your registered email address. We will email you a 6-digit OTP code to verify your identity.
            </p>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'white' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '12px', textTransform: 'uppercase', justifyContent: 'center' }}>
              Send Verification Code
            </button>
          </form>
        ) : (
          /* STEP 2: INPUT OTP & NEW PASSWORD */
          <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
              We sent verification code to <strong>{email}</strong>. Enter code and type your new password.
            </p>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit OTP"
                maxLength={6}
                required
                style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }}
              />
            </div>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '12px', textTransform: 'uppercase', justifyContent: 'center' }}>
              Update Password
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
