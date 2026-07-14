import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const DoctorLogin = () => {
  const { login, verifyOtp, registerDoctor, user } = useContext(AuthContext);
  const { triggerToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  // Page states
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [sirenEvents, setSirenEvents] = useState([]);
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Doctor Registration Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [hospital, setHospital] = useState('');
  const [bio, setBio] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'patient') navigate('/dashboard');
      else if (user.role === 'doctor') navigate('/doctor-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.toggle-btn') || el.closest('.back-home'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  // Submit Login credentials -> triggers OTP email
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password, 'doctor');
      if (data.success) {
        triggerToast(data.message, 'success');
        setShowOtpScreen(true);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Login failed. Invalid email/password.', 'error');
    }
  };

  // Submit Registration -> triggers welcome email & waiting list for admin approval
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const doctorData = {
        name,
        email,
        password,
        phone,
        role: 'doctor',
        specialization,
        qualification,
        experience: parseInt(experience),
        consultationFee: parseInt(consultationFee),
        hospital,
        bio,
        languages: ['English']
      };

      const data = await registerDoctor(doctorData);
      if (data.success) {
        triggerToast(data.message, 'success');
        setIsLoginMode(true); // Toggle to login after registration success
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Registration request failed.', 'error');
    }
  };

  // Submit OTP verification -> Logs doctor session
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await verifyOtp(email, otp);
      if (data.success) {
        triggerToast(data.message, 'success');
        navigate('/doctor-dashboard');
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Verification failed. Invalid OTP.', 'error');
    }
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1" style={{ background: 'radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)' }}></div>
        <div className="glow-orb glow-orb-2" style={{ background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)' }}></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
      <ParticlesBackground />
      <CustomCursor onSiren={handleSiren} />
      <SirenEffectContainer sirenEvents={sirenEvents} />
      <LoadingScreen text="DOCTOR PORTAL" subtitle="Medical dashboard login" />

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
        maxWidth: '1200px',
        minHeight: '650px',
        margin: '80px auto',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Branding Left Panel (Blue theme for doctors) */}
        <div className="auth-branding" style={{
          flex: 1,
          background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.05) 0%, rgba(40, 167, 69, 0.05) 100%)',
          padding: '50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRight: '1px solid var(--border-subtle)'
        }}>
          <div className="branding-content">
            <h1 className="branding-title gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', background: 'var(--secondary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Doctor Portal</h1>
            <p className="branding-subtitle" style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
              Access patient medical records, manage your slot availability, upload clinical prescriptions, and chat with your patients securely.
            </p>
            <ul className="branding-features" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>
                <i className="fas fa-check-circle" style={{ color: 'var(--accent-blue)' }}></i> Manage Availability Calendar
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>
                <i className="fas fa-check-circle" style={{ color: 'var(--accent-blue)' }}></i> Write Digital Prescriptions
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>
                <i className="fas fa-check-circle" style={{ color: 'var(--accent-blue)' }}></i> Real-time Patient Chat
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: '600' }}>
                <i className="fas fa-check-circle" style={{ color: 'var(--accent-blue)' }}></i> Review Earnings Analytics
              </li>
            </ul>
          </div>
        </div>

        {/* Forms Panel Right */}
        <div className="auth-forms" style={{ flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {!showOtpScreen ? (
            <>
              <div className="form-toggle" style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <button
                  className={`toggle-btn ${isLoginMode ? 'active' : ''}`}
                  onClick={() => setIsLoginMode(true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: isLoginMode ? 'var(--secondary-gradient)' : 'rgba(0,0,0,0.05)',
                    color: isLoginMode ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  Doctor Login
                </button>
                <button
                  className={`toggle-btn ${!isLoginMode ? 'active' : ''}`}
                  onClick={() => setIsLoginMode(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: !isLoginMode ? 'var(--secondary-gradient)' : 'rgba(0,0,0,0.05)',
                    color: !isLoginMode ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  Register (Request Approval)
                </button>
              </div>

              {isLoginMode ? (
                /* DOCTOR LOGIN */
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back, Doctor!</h2>
                  
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
                  
                  <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{ padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'white' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '12px', textTransform: 'uppercase', justifyContent: 'center', background: 'var(--secondary-gradient)' }}>
                    Send Verification Code
                  </button>

                  <div style={{ textAlign: 'center' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--accent-blue)', fontSize: '14px', textDecoration: 'none' }}>
                      Forgot password?
                    </Link>
                  </div>
                </form>
              ) : (
                /* DOCTOR REGISTRATION FORM */
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Join Our Network</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. John Doe"
                        required
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@hospital.com"
                        required
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                        required
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-group">
                      <label>Specialization</label>
                      <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="e.g. Cardiologist"
                        required
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Qualifications</label>
                      <input
                        type="text"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        placeholder="MD, MBBS"
                        required
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-group">
                      <label>Experience (Years)</label>
                      <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Experience"
                        required
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Consultation Fee ($)</label>
                      <input
                        type="number"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        placeholder="Fee"
                        required
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Hospital Clinic Address</label>
                    <input
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="Hospital clinic name & address"
                      required
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                    />
                  </div>

                  <div className="input-group">
                    <label>Brief Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Short professional details about yourself"
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%', minHeight: '80px' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '12px', textTransform: 'uppercase', justifyContent: 'center', background: 'var(--secondary-gradient)', marginTop: '10px' }}>
                    Submit Application
                  </button>
                </form>
              )}
            </>
          ) : (
            /* OTP VERIFICATION SCREEN */
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Enter OTP Code</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                We have sent a 6-digit verification code to <strong>{email}</strong>. Please enter the code below to log in.
              </p>

              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  style={{ padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center', letterSpacing: '4px', fontSize: '20px', fontWeight: 'bold' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '12px', textTransform: 'uppercase', justifyContent: 'center', background: 'var(--secondary-gradient)' }}>
                Verify & Login
              </button>

              <button
                type="button"
                onClick={() => setShowOtpScreen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}
              >
                Go back to credentials
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorLogin;
