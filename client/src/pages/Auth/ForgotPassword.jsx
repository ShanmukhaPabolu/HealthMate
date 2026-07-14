import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [sirenEvents, setSirenEvents] = useState([]);
  const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.back-home'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
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
        setShowResetForm(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'User with this email not found.');
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
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    }
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
      <ParticlesBackground />
      <CustomCursor onSiren={handleSiren} />
      <SirenEffectContainer sirenEvents={sirenEvents} />
      <LoadingScreen text="PASSWORD RESET" subtitle="Recover your account credentials" />

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
