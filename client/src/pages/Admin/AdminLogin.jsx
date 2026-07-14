import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const AdminLogin = () => {
  const { login, verifyOtp, user } = useContext(AuthContext);
  const { triggerToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [sirenEvents, setSirenEvents] = useState([]);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.closest('.back-home'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password, 'admin');
      if (data.success) {
        triggerToast(data.message, 'success');
        setShowOtpScreen(true);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Admin login credentials invalid.', 'error');
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const data = await verifyOtp(email, otp);
      if (data.success) {
        triggerToast('Admin logged in!', 'success');
        navigate('/admin-dashboard');
      }
    } catch (err) {
      triggerToast('OTP verification failed.', 'error');
    }
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1" style={{ background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)' }}></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
      <ParticlesBackground />
      <CustomCursor onSiren={handleSiren} />
      <SirenEffectContainer sirenEvents={sirenEvents} />
      <LoadingScreen text="ADMIN PANEL" subtitle="Establish secure credentials access" />

      <Link to="/" className="back-home" style={{
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
        <i className="fas fa-arrow-left"></i> Back to Home
      </Link>

      <div className="auth-container" style={{
        display: 'flex',
        width: '90%',
        maxWidth: '500px',
        minHeight: '400px',
        margin: '120px auto',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xl)',
        padding: '40px',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>Admin Login</h2>

        {!showOtpScreen ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="input-group">
              <label>Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@healthtracker.com"
                required
                style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '12px', justifyContent: 'center' }}>
              Proceed
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>Enter the 6-digit OTP code sent to your email.</p>
            <div className="input-group">
              <label>OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '12px', justifyContent: 'center' }}>
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default AdminLogin;
