import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DoctorLogin = () => {
  const { login, verifyOtp, registerDoctor, user } = useContext(AuthContext);
  const { triggerToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  // Page states
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Doctor Registration Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('General Medicine');
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

  // Reset errors on toggle
  useEffect(() => {
    setFormErrors([]);
  }, [isLoginMode, showOtpScreen]);

  // Submit Login credentials -> triggers OTP email
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    try {
      const data = await login(email, password, 'doctor');
      if (data.success) {
        triggerToast(data.message, 'success');
        setShowOtpScreen(true);
      }
    } catch (err) {
      const errors = err.response?.data?.errors || [err.response?.data?.message || 'Login failed. Invalid email/password.'];
      setFormErrors(errors);
      triggerToast('Please check the errors highlighted in the form.', 'error');
    }
  };

  // Submit Registration -> triggers welcome email & waiting list for admin approval
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
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
      const errors = err.response?.data?.errors || [err.response?.data?.message || 'Registration request failed.'];
      setFormErrors(errors);
      triggerToast('Please check the errors highlighted in the form.', 'error');
    }
  };

  // Submit OTP verification -> Logs doctor session
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    try {
      const data = await verifyOtp(email, otp);
      if (data.success) {
        triggerToast(data.message, 'success');
        navigate('/doctor-dashboard');
      }
    } catch (err) {
      const errors = err.response?.data?.errors || [err.response?.data?.message || 'Verification failed. Invalid OTP.'];
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
              background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.03) 0%, rgba(111, 66, 193, 0.03) 100%)',
              padding: '50px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRight: '1px solid var(--border-subtle)'
            }}>
              <div>
                <h1 className="gradient-text" style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '1.2rem', letterSpacing: '-0.5px' }}>
                  Doctor Portal
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>
                  Join our network of medical practitioners. Manage your schedule, review patient logs, access analyzer charts, and conduct secure virtual consultations.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    'Verify credentials for a Verified Badge',
                    'Dynamic consultation fee settings',
                    'Direct chat and WebRTC consults',
                    'Access patient history logs securely'
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', color: 'var(--clr-gray-800)', fontSize: '0.9rem' }}>
                      <i className="fas fa-check-circle" style={{ color: 'var(--clr-blue)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Forms Panel Right */}
            <div style={{ flex: '1 1 500px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' }}>
              
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
                <>
                  <div className="form-toggle" style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                    <button
                      className="btn"
                      onClick={() => setIsLoginMode(true)}
                      style={{
                        flex: 1,
                        background: isLoginMode ? 'var(--grad-blue)' : 'var(--clr-gray-100)',
                        color: isLoginMode ? 'white' : 'var(--text-secondary)',
                        borderRadius: '12px'
                      }}
                    >
                      Login
                    </button>
                    <button
                      className="btn"
                      onClick={() => setIsLoginMode(false)}
                      style={{
                        flex: 1,
                        background: !isLoginMode ? 'var(--grad-blue)' : 'var(--clr-gray-100)',
                        color: !isLoginMode ? 'white' : 'var(--text-secondary)',
                        borderRadius: '12px'
                      }}
                    >
                      Apply to Join
                    </button>
                  </div>

                  {isLoginMode ? (
                    /* LOGIN FORM */
                    <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--clr-gray-900)' }}>Medical Login</h2>
                      
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="doctor@healthmate.com"
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

                      <button type="submit" className="btn btn-blue" style={{ borderRadius: '12px', padding: '14px' }}>
                        Send Verification Code
                      </button>

                      <div style={{ textAlign: 'center', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                        <Link to="/login" style={{ color: 'var(--clr-primary)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                          Patient Login Portal <i className="fas fa-arrow-right" style={{ marginLeft: '4px', fontSize: '0.75rem' }} />
                        </Link>
                      </div>
                    </form>
                  ) : (
                    /* REGISTRATION/APPLICATION FORM */
                    <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--clr-gray-900)' }}>Join Waiting List</h2>
                      
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Dr. John Doe"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="doctor@example.com"
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
                          placeholder="Minimum 6 characters"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Specialization</label>
                        <select
                          className="form-select"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                        >
                          {['General Medicine', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Ophthalmology'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Qualifications</label>
                        <input
                          type="text"
                          className="form-input"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          placeholder="e.g. MBBS, MD Cardiology"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Experience (Years)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          placeholder="e.g. 8"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Consultation Fee (₹)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={consultationFee}
                          onChange={(e) => setConsultationFee(e.target.value)}
                          placeholder="e.g. 500"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Hospital Affiliation</label>
                        <input
                          type="text"
                          className="form-input"
                          value={hospital}
                          onChange={(e) => setHospital(e.target.value)}
                          placeholder="e.g. City General Hospital"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Bio (Brief Summary)</label>
                        <textarea
                          className="form-textarea"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Write a brief professional summary..."
                        />
                      </div>

                      <button type="submit" className="btn btn-blue" style={{ borderRadius: '12px', padding: '14px', marginTop: '8px' }}>
                        Apply to Register
                      </button>
                    </form>
                  )}
                </>
              ) : (
                /* OTP VERIFICATION SCREEN */
                <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Enter Verification Code</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    We have sent a 6-digit verification code to <strong>{email}</strong>. Please check your inbox and enter it below to proceed.
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

                  <button type="submit" className="btn btn-blue" style={{ borderRadius: '12px', padding: '14px' }}>
                    Verify & Login
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

export default DoctorLogin;
