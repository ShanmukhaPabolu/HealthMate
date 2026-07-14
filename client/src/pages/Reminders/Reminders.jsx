import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import EmptyState from '../../components/EmptyState';

const Reminders = () => {
  const { triggerToast } = useContext(NotificationContext);
  const [reminders, setReminders] = useState([]);

  // Form fields
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('medication'); // 'medication' or 'appointment'
  const [time, setTime] = useState('');

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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

  // Browser Alarms polling logic
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      reminders.forEach((rem) => {
        if (rem.time === currentTimeString) {
          // Trigger system push notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`HealthMate Alert: ${rem.details}`, {
              body: `Scheduled trigger at ${rem.time} (${rem.category === 'medication' ? 'Medication Intake' : 'Doctor consultation'})`,
              icon: '/vite.svg'
            });
          }
          triggerToast(`ALERT: Time for ${rem.details} (${rem.time})`, 'info');
        }
      });
    };

    const interval = setInterval(checkAlarms, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders, triggerToast]);

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
      <Header />
      
      <main style={{ paddingTop: '100px', minHeight: '80vh', background: 'var(--clr-gray-50)' }}>
        <div className="container" style={{ paddingBottom: '4rem' }}>
          
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '6px' }}>
              Medication & <span className="gradient-text">Reminders</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Set alarms for daily medication intakes and upcoming medical consultation schedules.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
            
            {/* Create Reminder Form */}
            <div className="card" style={{ background: 'white' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px', color: 'var(--clr-gray-900)' }}>
                Add New Reminder
              </h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="medication">Medication Intake</option>
                    <option value="appointment">Doctor Consultation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Alarm Details</label>
                  <input
                    type="text"
                    className="form-input"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={category === 'medication' ? 'e.g. Vitamin D3 (1 pill)' : 'e.g. Dentist consultation'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Alert Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                  <i className="fas fa-plus" /> Create Alert
                </button>
              </form>
            </div>

            {/* Reminders List */}
            <div className="card" style={{ gridColumn: 'span 2', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--clr-gray-900)' }}>
                  Active Alarms
                </h2>
                <span className="badge badge-primary">
                  <i className="fas fa-bell" /> {reminders.length} Active
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto', paddingRight: '8px' }}>
                {reminders.length === 0 ? (
                  <EmptyState
                    icon="fas fa-bell-slash"
                    title="No Alarms set"
                    description="You don't have any reminders configured yet. Add one on the left to start tracking."
                  />
                ) : (
                  reminders.map((rem) => (
                    <div
                      key={rem._id}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--clr-gray-50)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className={`icon-box icon-box-md icon-box-${rem.category === 'medication' ? 'purple' : 'orange'}`}>
                          <i className={rem.category === 'medication' ? 'fas fa-pills' : 'fas fa-user-md'}></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--clr-gray-900)' }}>{rem.details}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Trigger: <strong style={{ color: 'var(--clr-gray-800)' }}>{rem.time}</strong> • <span style={{ textTransform: 'capitalize' }}>{rem.category}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(rem._id)}
                        className="btn btn-icon btn-danger"
                        style={{ border: 'none', background: 'rgba(220, 53, 69, 0.1)', color: 'var(--clr-primary)', borderRadius: '50%' }}
                        title="Delete reminder"
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
