import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const DoctorRecords = () => {
  const { triggerToast } = useContext(NotificationContext);
  const [sirenEvents, setSirenEvents] = useState([]);
  
  // Patients & logs list state
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientLogs, setPatientLogs] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/doctor/patients');
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to load patient records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.profile-btn') || el.closest('.patient-row'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  // Fetch patient logs
  const handleSelectPatient = async (pat) => {
    setSelectedPatient(pat);
    setPatientLogs(null);
    setNoteInput('');
    setNotesList([]);
    try {
      const logResponse = await api.get(`/doctor/patient/${pat.email}/data`);
      setPatientLogs(logResponse.data || {});

      const notesResponse = await api.get(`/doctor/patient/${pat.email}/notes`);
      setNotesList(notesResponse.data.data || []);
    } catch (err) {
      console.error(err);
      triggerToast('Failed to load patient history logs.', 'error');
    }
  };

  // Submit clinical note
  const handleSubmitNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    try {
      const response = await api.post(`/doctor/patient/${selectedPatient.email}/notes`, {
        note: noteInput
      });

      if (response.data.success) {
        triggerToast('Clinical note added.', 'success');
        setNoteInput('');
        // Reload notes list
        const notesResponse = await api.get(`/doctor/patient/${selectedPatient.email}/notes`);
        setNotesList(notesResponse.data.data || []);
      }
    } catch (err) {
      triggerToast('Failed to submit clinical note.', 'error');
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
      <LoadingScreen text="PATIENT HISTORY" subtitle="Access physical tracking logs & write medical notes" />
      
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '60px' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '40px' }}>Patient Clinical <span className="gradient-text">History Records</span></h1>

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px', alignItems: 'start' }}>
            
            {/* Left Patients Directory List */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '25px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '15px' }}>Consulted Patients</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loading ? (
                  <p>Loading patient directory...</p>
                ) : patients.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No consulted patients on file.</p>
                ) : (
                  patients.map((pat) => (
                    <div
                      key={pat._id}
                      onClick={() => handleSelectPatient(pat)}
                      className="patient-row"
                      style={{
                        padding: '12px 15px',
                        borderRadius: '10px',
                        border: selectedPatient?._id === pat._id ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                        background: selectedPatient?._id === pat._id ? 'rgba(0,123,255,0.05)' : 'white',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      <div>{pat.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pat.email}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right logs checker */}
            <div>
              {!selectedPatient ? (
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '24px',
                  padding: '80px 0',
                  textAlign: 'center',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <i className="fas fa-folder-open" style={{ fontSize: '4rem', color: 'var(--text-muted)', marginBottom: '20px' }}></i>
                  <h3>Select a Patient</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Click on any patient in the directory to inspect their wellness logs.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* Health Logs Overview */}
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '30px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px' }}>Recent Wellness Logs for {selectedPatient.name}</h3>

                    {patientLogs ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ padding: '15px', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                          <h4 style={{ color: 'var(--accent-color)', marginBottom: '10px' }}><i className="fas fa-apple-alt"></i> Food Logs</h4>
                          {patientLogs.dietLogs?.slice(0, 3).map((x, i) => (
                            <div key={i} style={{ fontSize: '13px', marginBottom: '5px' }}>{x.meal} ({x.calories} kcal)</div>
                          )) || <p>No meals logged today.</p>}
                        </div>
                        <div style={{ padding: '15px', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                          <h4 style={{ color: 'var(--accent-blue)', marginBottom: '10px' }}><i className="fas fa-bell"></i> Scheduled Reminders</h4>
                          {patientLogs.reminders?.slice(0, 3).map((x, i) => (
                            <div key={i} style={{ fontSize: '13px', marginBottom: '5px' }}>{x.details} at {x.time}</div>
                          )) || <p>No reminders configured.</p>}
                        </div>
                      </div>
                    ) : (
                      <p>Loading patient wellness details...</p>
                    )}
                  </div>

                  {/* Doctor Notes Section */}
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '30px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px' }}>Clinical Consultation Notes</h3>

                    <form onSubmit={handleSubmitNote} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Write clinical diagnoses or medication recommendations..."
                        required
                        style={{ flex: 1, padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>
                        Save Note
                      </button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {notesList.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No clinical notes saved for this patient.</p>
                      ) : (
                        notesList.map((note, index) => (
                          <div key={index} style={{ padding: '15px', border: '1px solid var(--border-subtle)', borderRadius: '12px', background: 'rgba(0,123,255,0.02)' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600' }}>{note.note}</p>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Logged on: {new Date(note.created_at || note.date).toLocaleString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

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

export default DoctorRecords;
