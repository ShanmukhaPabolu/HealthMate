import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AdminLogin = () => {
  const { login, verifyOtp, user } = useContext(AuthContext);
  const { triggerToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  // Reset errors when switching OTP screens
  useEffect(() => {
    setFormErrors([]);
  }, [showOtpScreen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    try {
      const data = await login(email, password, 'admin');
      if (data.success) {
        triggerToast(data.message, 'success');
        setShowOtpScreen(true);
      }
    } catch (err) {
      const errors = err.response?.data?.errors || [err.response?.data?.message || 'Admin login credentials invalid.'];
      setFormErrors(errors);
      triggerToast('Please check errors in your form.', 'error');
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    try {
      const data = await verifyOtp(email, otp);
      if (data.success) {
        triggerToast('Admin logged in!', 'success');
        navigate('/admin-dashboard');
      }
    } catch (err) {
      const errors = err.response?.data?.errors || [err.response?.data?.message || 'OTP verification failed.'];
      setFormErrors(errors);
      triggerToast('Invalid OTP entered.', 'error');
    }
  };

  return (
    <>
      <Header />
      
      <main style={{ paddingTop: '100px', minHeight: '85vh', background: 'var(--clr-gray-50)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ paddingBottom: '3rem' }}>
          
          <div className="card card-lg" style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            padding: 0,
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)',
            flexWrap: 'wrap'
          }}>
            {/* Branding Left Panel */}
            <div style={{
              flex: '1 1 400px',
              background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.03) 0%, rgba(33, 37, 41, 0.03) 100%)',
              padding: '50px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRight: '1px solid var(--border-subtle)'
            }}>
              <div>
                <h1 className="gradient-text" style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '1.2rem', letterSpacing: '-0.5px' }}>
                  Admin Portal
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>
                  Secured panel to verify practitioners, manage general users, review disputed claims, and review platform-wide registration metrics.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--clr-gray-700)', fontWeight: 600 }}>
                  <i className="fas fa-shield-alt" style={{ color: 'var(--clr-purple)' }} />
                  <span>Authorized Personnel Only</span>
                </div>
              </div>
            </div>

            {/* Forms Panel Right */}
            <div style={{ flex: '1 1 500px', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' }}>
              
              {/* Form Errors Banner */}
              {formErrors.length > 0 && (
                <div className="alert alert-error" style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                  {formErrors.map((err, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <i className="fas fa-exclamation-circle" style={{ fontSize: '0.85rem' }} />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              {!showOtpScreen ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--clr-gray-900)' }}>Administrator Login</h2>
                  
                  <div className="form-group">
                    <label className="form-label">Admin Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@healthmate.com"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-dark" style={{ borderRadius: '12px', padding: '14px', background: 'var(--clr-gray-900)' }}>
                    Send Verification Code
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                    <Link to="/login" style={{ color: 'var(--clr-primary)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                      Patient Portal <i className="fas fa-arrow-right" style={{ marginLeft: '4px', fontSize: '0.75rem' }} />
                    </Link>
                  </div>
                </form>
              ) : (
                /* OTP VERIFICATION SCREEN */
                <form onSubmit={handleOtpVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Enter Admin OTP</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    We have sent a security verification code to <strong>{email}</strong>. Please enter the code below to complete admin authentication.
                  </p>

                  <div className="form-group">
                    <label className="form-label">Verification Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="------"
                      maxLength={6}
                      required
                      style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '22px', fontWeight: 'bold' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-dark" style={{ borderRadius: '12px', padding: '14px', background: 'var(--clr-gray-900)' }}>
                    Verify & Access
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtpScreen(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--clr-gray-600)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    Go back to credentials
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AdminLogin;
