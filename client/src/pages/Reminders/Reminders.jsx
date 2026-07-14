import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const Reminders = () => {
  const { triggerToast } = useContext(NotificationContext);
  const [sirenEvents, setSirenEvents] = useState([]);
  const [reminders, setReminders] = useState([]);

  // Form fields
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('medication'); // 'medication' or 'appointment'
  const [time, setTime] = useState('');

  const fetchReminders = async () => {
    try {
      const response = await api.get('/user/reminders');
      setReminders(response.data || []);
    } catch (err) {
      console.error('Failed to load reminders', err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.profile-btn'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  // Add reminder
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details || !time) return;
    try {
      const response = await api.post('/user/reminders', {
        details,
        category,
        time
      });
      if (response.data.success) {
        triggerToast('Reminder added successfully!', 'success');
        setDetails('');
        setTime('');
        fetchReminders();
      }
    } catch (err) {
      triggerToast('Failed to add reminder.', 'error');
    }
  };

  // Delete reminder
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/user/reminders?id=${id}`);
      if (response.data.success) {
        triggerToast('Reminder deleted successfully!', 'success');
        fetchReminders();
      }
    } catch (err) {
      triggerToast('Failed to delete reminder.', 'error');
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
      <LoadingScreen text="SMART ALERTS" subtitle="Medication & appointment reminders" />
      
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '40px' }}>Medication & <span className="gradient-text">Smart Reminders</span></h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
            {/* Create Reminder Form */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Add Reminder</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="input-group">
                  <label>Reminder Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%', outline: 'none' }}
                  >
                    <option value="medication">Medication Intake</option>
                    <option value="appointment">Doctor Consultation</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Description Details</label>
                  <input
                    type="text"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={category === 'medication' ? 'e.g. Vitamin D3 (1 pill)' : 'e.g. Dentist consultation'}
                    required
                    style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                  />
                </div>

                <div className="input-group">
                  <label>Trigger Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', justifyContent: 'center' }}>
                  Create Alert
                </button>
              </form>
            </div>

            {/* Reminders List */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Active Alarms</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '420px', overflowY: 'auto', paddingRight: '10px' }}>
                {reminders.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
                    <i className="fas fa-bell-slash" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '15px' }}></i>
                    <p>No active alerts scheduled.</p>
                  </div>
                ) : (
                  reminders.map((rem) => (
                    <div
                      key={rem._id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)',
                        background: 'rgba(255,255,255,0.5)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          background: rem.category === 'medication' ? 'rgba(111, 66, 193, 0.1)' : 'rgba(253, 126, 20, 0.1)',
                          color: rem.category === 'medication' ? 'var(--accent-purple)' : 'var(--accent-orange)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem'
                        }}>
                          <i className={rem.category === 'medication' ? 'fas fa-pills' : 'fas fa-calendar-alt'}></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '15px' }}>{rem.details}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Scheduled for {rem.time} • <span style={{ textTransform: 'capitalize' }}>{rem.category}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(rem._id)}
                        style={{
                          background: 'rgba(220, 53, 69, 0.1)',
                          border: 'none',
                          color: 'var(--accent-color)',
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Reminders;
