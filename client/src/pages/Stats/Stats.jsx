import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const Stats = () => {
  const { triggerToast } = useContext(NotificationContext);
  const [sirenEvents, setSirenEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('vitals');
  const [profile, setProfile] = useState(null);

  // vital states
  const [bp, setBp] = useState('120/80');
  const [heartRate, setHeartRate] = useState('72');
  const [temp, setTemp] = useState('98.6');
  const [weight, setWeight] = useState('70');

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load profile for stats', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.profile-btn'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  const handleVitalsSubmit = async (e) => {
    e.preventDefault();
    try {
      // Log vitals as symptoms logs or profile settings
      const response = await api.post('/shared/symptoms', {
        symptoms: ['Vitals check'],
        severity: 1,
        duration: 'Routine check',
        vitals: {
          bloodPressure: bp,
          heartRate: parseInt(heartRate),
          temperature: parseFloat(temp),
          weight: parseFloat(weight)
        }
      });
      if (response.data.success) {
        triggerToast('Vitals logged successfully!', 'success');
      }
    } catch (err) {
      triggerToast('Failed to log vitals.', 'error');
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
      <LoadingScreen text="HEALTH LOGGER" subtitle="Document critical vitals parameters" />
      
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '40px' }}>Personal Health <span className="gradient-text">Logger</span></h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            gap: '40px',
            backgroundColor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            {/* Vitals & Health records sub tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button
                className={`tab-btn ${activeTab === 'vitals' ? 'active' : ''}`}
                onClick={() => setActiveTab('vitals')}
                style={{
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: activeTab === 'vitals' ? 'var(--primary-gradient)' : 'transparent',
                  color: activeTab === 'vitals' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <i className="fas fa-heartbeat" style={{ marginRight: '10px' }}></i> Log Vitals
              </button>
              <button
                className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
                style={{
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: activeTab === 'summary' ? 'var(--primary-gradient)' : 'transparent',
                  color: activeTab === 'summary' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <i className="fas fa-notes-medical" style={{ marginRight: '10px' }}></i> Health Summary
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'vitals' && (
                <form onSubmit={handleVitalsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Log Vitals</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                      <label>Blood Pressure (sys/dia)</label>
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                        required
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                        required
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                      <label>Body Temperature (°F)</label>
                      <input
                        type="text"
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                        required
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Log Vitals Check
                  </button>
                </form>
              )}

              {activeTab === 'summary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Health Summary</h2>
                  
                  {profile ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px', color: 'var(--accent-color)' }}>Clinical Profile</h3>
                        <p style={{ margin: '5px 0' }}><strong>Blood Group:</strong> {profile.healthProfile?.bloodGroup || 'Not Specified'}</p>
                        <p style={{ margin: '5px 0' }}><strong>Allergies:</strong> {profile.healthProfile?.allergies || 'None Logged'}</p>
                        <p style={{ margin: '5px 0' }}><strong>Chronic Conditions:</strong> {profile.healthProfile?.chronicConditions || 'None Logged'}</p>
                      </div>
                      <div style={{ padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px', color: 'var(--accent-blue)' }}>Emergency Contact</h3>
                        <p style={{ margin: '5px 0' }}><strong>Name:</strong> {profile.healthProfile?.emergencyContact?.name || 'N/A'}</p>
                        <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {profile.healthProfile?.emergencyContact?.phone || 'N/A'}</p>
                        <p style={{ margin: '5px 0' }}><strong>Relationship:</strong> {profile.healthProfile?.emergencyContact?.relationship || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <p>Loading Health profile summary details...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Stats;
