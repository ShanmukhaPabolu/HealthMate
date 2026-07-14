import React, { useState, useEffect, useContext } from 'react';
import { api, AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';
import io from 'socket.io-client';

const DoctorDashboard = () => {
  const { triggerToast } = useContext(NotificationContext);

  const [sirenEvents, setSirenEvents] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Prescription modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [meds, setMeds] = useState('');
  const [instructions, setInstructions] = useState('');

  // Slots availability state
  const [activeSlots, setActiveSlots] = useState([]);
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  // Chat window state
  const { user } = useContext(AuthContext);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [socket, setSocket] = useState(null);

  // Leave scheduler state
  const [leavesList, setLeavesList] = useState([]);
  const [leaveDate, setLeaveDate] = useState('');

  // Video call states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  // Real-time socket message sync
  useEffect(() => {
    if (!activeChatUser || !user) return;

    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    const roomId = [user._id, activeChatUser._id].sort().join('-');
    newSocket.emit('join-room', roomId);

    newSocket.on('receive-message', (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [activeChatUser, user]);

  const fetchDashboard = async () => {
    try {
      const dbResponse = await api.get('/doctors/dashboard');
      if (dbResponse.data.success) {
        setDashboardData(dbResponse.data.analytics);
        setActiveSlots(dbResponse.data.doctor.slots || dbResponse.data.doctor.availableSlots || []);
        setLeavesList(dbResponse.data.doctor.leaves || []);
      }

      const appResponse = await api.get('/appointments');
      if (appResponse.data.success) {
        setAppointments(appResponse.data.data);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.profile-btn') || el.closest('.chat-box') || el.closest('.modal-overlay'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  // Accept Appointment
  const handleAcceptAppointment = async (id) => {
    try {
      const response = await api.patch(`/appointments/${id}`, { status: 'accepted' });
      if (response.data.success) {
        triggerToast('Appointment accepted!', 'success');
        fetchDashboard();
      }
    } catch (err) {
      triggerToast('Failed to update appointment.', 'error');
    }
  };

  // Cancel/Reject Appointment
  const handleCancelAppointment = async (id) => {
    try {
      const response = await api.patch(`/appointments/${id}`, { status: 'cancelled' });
      if (response.data.success) {
        triggerToast('Appointment cancelled.', 'info');
        fetchDashboard();
      }
    } catch (err) {
      triggerToast('Failed to update appointment.', 'error');
    }
  };

  // Prescription Modal Trigger
  const handleWritePrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setMeds('');
    setInstructions('');
    setShowPrescriptionModal(true);
  };

  // Submit Prescription details -> updates appointment status to completed
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!meds || !instructions) return;
    try {
      const response = await api.patch(`/appointments/${selectedAppointment._id}`, {
        status: 'completed',
        prescription: {
          medicines: meds.split(','),
          dosageInstructions: instructions
        }
      });

      if (response.data.success) {
        triggerToast('Prescription written and consultation finalized!', 'success');
        setShowPrescriptionModal(false);
        fetchDashboard();
      }
    } catch (err) {
      triggerToast('Failed to finalize prescription.', 'error');
    }
  };

  // Slots manager checkbox trigger
  const handleToggleSlot = async (slot) => {
    let updatedSlots = [...activeSlots];
    if (updatedSlots.includes(slot)) {
      updatedSlots = updatedSlots.filter(s => s !== slot);
    } else {
      updatedSlots.push(slot);
    }
    setActiveSlots(updatedSlots);

    try {
      await api.patch('/doctors/profile', { slots: updatedSlots });
      triggerToast('Slot availability updated!', 'success');
    } catch (err) {
      triggerToast('Failed to save slot settings.', 'error');
    }
  };

  // Leaves calendar manager
  const handleToggleLeaveDate = async () => {
    if (!leaveDate) return;
    const selectDate = new Date(leaveDate);
    const exists = leavesList.some(d => new Date(d).toDateString() === selectDate.toDateString());
    let updatedLeaves = [...leavesList];
    if (exists) {
      updatedLeaves = updatedLeaves.filter(d => new Date(d).toDateString() !== selectDate.toDateString());
    } else {
      updatedLeaves.push(selectDate);
    }
    setLeavesList(updatedLeaves);

    try {
      await api.patch('/doctors/profile', { leaves: updatedLeaves });
      triggerToast('Doctor leave settings updated!', 'success');
      fetchDashboard();
    } catch (err) {
      triggerToast('Failed to save leave settings.', 'error');
    }
  };

  // Video call controls
  const handleStartVideoCall = async () => {
    setShowVideoModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setTimeout(() => {
        const localVid = document.getElementById('doctorLocalVideo');
        if (localVid) localVid.srcObject = stream;
      }, 500);
    } catch (err) {
      console.warn("Camera media blocked:", err);
      triggerToast("Camera not available. Initiating virtual call feed...", "info");
    }
  };

  const handleStopVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setShowVideoModal(false);
  };

  // Load chat messages when active user is clicked
  const handleOpenChat = async (userObj) => {
    setActiveChatUser(userObj);
    try {
      const response = await api.get(`/chat/${userObj._id}`);
      setChatMessages(response.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Send message in chat window
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const response = await api.post('/chat', {
        receiverId: activeChatUser._id,
        message: chatInput
      });

      if (response.data.success) {
        const msgData = response.data.data;
        if (socket) {
          const roomId = [user._id, activeChatUser._id].sort().join('-');
          socket.emit('send-message', { ...msgData, roomId });
        }
        setChatMessages(prev => [...prev, msgData]);
        setChatInput('');
      }
    } catch (err) {
      triggerToast('Failed to send message.', 'error');
    }
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1" style={{ background: 'radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)' }}></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
      <ParticlesBackground />
      <CustomCursor onSiren={handleSiren} />
      <SirenEffectContainer sirenEvents={sirenEvents} />
      <LoadingScreen text="DOCTOR HUB" subtitle="Consultation dashboard logs" />
      
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '60px' }}>
        <div className="container">
          
          {/* Dashboard Stats */}
          {dashboardData && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: 'rgba(255,255,255,0.85)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <i className="fas fa-wallet" style={{ fontSize: '2rem', color: 'var(--accent-green)', marginBottom: '10px' }}></i>
                <h4>Total Revenue</h4>
                <p style={{ fontSize: '24px', fontWeight: '900' }}>${dashboardData.totalEarnings || 0}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.85)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <i className="fas fa-calendar-check" style={{ fontSize: '2rem', color: 'var(--accent-blue)', marginBottom: '10px' }}></i>
                <h4>Consultations Done</h4>
                <p style={{ fontSize: '24px', fontWeight: '900' }}>{dashboardData.appointmentsCount || 0}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.85)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <i className="fas fa-star" style={{ fontSize: '2rem', color: '#FFC107', marginBottom: '10px' }}></i>
                <h4>Profile Ratings</h4>
                <p style={{ fontSize: '24px', fontWeight: '900' }}>{dashboardData.ratings || 0}/5</p>
              </div>
            </div>
          )}

          {/* Main Content Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', alignItems: 'start' }}>
            
            {/* Left Appointments list panel */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Patient consultations logs</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {appointments.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No appointments booked.</p>
                ) : (
                  appointments.map((app) => (
                    <div
                      key={app._id}
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)',
                        background: 'rgba(255,255,255,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '16px' }}>{app.patient?.name}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Date: {app.date} • Time Slot: {app.slot}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          padding: '4px 10px',
                          borderRadius: '50px',
                          background: app.status === 'pending' ? 'rgba(253,126,20,0.1)' : app.status === 'accepted' ? 'rgba(0,123,255,0.1)' : 'rgba(40,167,69,0.1)',
                          color: app.status === 'pending' ? 'var(--accent-orange)' : app.status === 'accepted' ? 'var(--accent-blue)' : 'var(--accent-green)',
                          textTransform: 'uppercase'
                        }}>{app.status}</span>
                      </div>

                      {app.uploadedReport && (
                        <div style={{ fontSize: '13px', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fas fa-file-pdf"></i>
                          <a href={app.uploadedReport} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>
                            View Patient Report attachment
                          </a>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                        <button
                          onClick={() => handleOpenChat(app.patient)}
                          className="btn btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                        >
                          <i className="fas fa-comments"></i> Chat
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptAppointment(app._id)}
                              className="btn btn-primary"
                              style={{ background: 'var(--accent-gradient)', padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(app._id)}
                              className="btn btn-primary"
                              style={{ background: 'var(--primary-gradient)', padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {app.status === 'accepted' && (
                          <button
                            onClick={() => handleWritePrescription(app)}
                            className="btn btn-primary"
                            style={{ background: 'var(--secondary-gradient)', padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                          >
                            <i className="fas fa-file-prescription"></i> Complete & Prescribe
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Right sidebar availability slots manager */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(25px)',
                borderRadius: '24px',
                padding: '30px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px' }}>Slots availability</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {timeSlots.map((slot) => {
                    const isChecked = activeSlots.includes(slot);
                    return (
                      <label key={slot} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSlot(slot)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span>{slot}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Leave Scheduler widget */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(25px)',
                borderRadius: '24px',
                padding: '30px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px' }}>Leave Scheduler</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input
                    type="date"
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                  />
                  <button
                    onClick={handleToggleLeaveDate}
                    className="btn btn-primary"
                    style={{ justifyContent: 'center', background: 'var(--primary-gradient)', padding: '10px' }}
                  >
                    Toggle Leave Date
                  </button>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Your Leaves List:</h4>
                    {leavesList.length === 0 ? (
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>No leaves scheduled.</p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {leavesList.map((d, i) => (
                          <span key={i} style={{ padding: '4px 10px', background: 'rgba(220,53,69,0.1)', color: 'var(--accent-color)', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold' }}>
                            {new Date(d).toLocaleDateString()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat window panel */}
              {activeChatUser && (
                <div className="chat-box" style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(25px)',
                  borderRadius: '24px',
                  padding: '25px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '350px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '800', fontSize: '14px' }}>Chat: {activeChatUser.name}</span>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <i className="fas fa-video" onClick={handleStartVideoCall} style={{ cursor: 'pointer', color: 'var(--accent-blue)', fontSize: '15px' }} title="Start Video Consultation" />
                      <i className="fas fa-times-circle" onClick={() => setActiveChatUser(null)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px', marginBottom: '10px' }}>
                    {chatMessages.map((msg, i) => {
                      const isMe = msg.senderModel === 'User';
                      return (
                        <div
                          key={i}
                          style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: isMe ? 'var(--secondary-gradient)' : 'rgba(0,0,0,0.05)',
                            color: isMe ? 'white' : 'var(--text-primary)',
                            fontSize: '13px',
                            maxWidth: '80%'
                          }}
                        >
                          {msg.message}
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                    />
                    <button type="submit" style={{ background: 'var(--secondary-gradient)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Prescription details modal */}
      {showPrescriptionModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100010
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '35px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '15px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Write Clinical Prescription</h3>
              <i className="fas fa-times-circle" onClick={() => setShowPrescriptionModal(false)} style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }} />
            </div>

            <form onSubmit={handlePrescriptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label>Medicines (comma separated)</label>
                <input
                  type="text"
                  value={meds}
                  onChange={(e) => setMeds(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg, Amoxicillin"
                  required
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}
                />
              </div>

              <div className="input-group">
                <label>Dosage & Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Paracetamol: 1 pill twice a day after meals for 5 days."
                  required
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', minHeight: '100px' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-gradient)' }}
              >
                Submit & Finalize
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WebRTC Video call modal overlay */}
      {showVideoModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100020
        }}>
          <div style={{
            backgroundColor: 'var(--bg-dark)',
            borderRadius: '24px',
            padding: '30px',
            width: '90%',
            maxWidth: '800px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            color: 'white',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '15px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Live Video Consultation</h3>
              <i className="fas fa-times-circle" onClick={handleStopVideoCall} style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#000', borderRadius: '16px', padding: '15px', minHeight: '300px' }}>
              {/* Local Feed */}
              <div style={{ position: 'relative', background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {localStream ? (
                  <video id="doctorLocalVideo" autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Local Camera Unusable</span>
                )}
                <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '3px 10px', borderRadius: '50px', fontSize: '11px' }}>Doctor (You)</span>
              </div>

              {/* Remote Feed */}
              <div style={{ position: 'relative', background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {localStream ? (
                  <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--accent-blue)' }} />
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Waiting for patient to join feed...</p>
                  </div>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No Remote Feed</span>
                )}
                <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '3px 10px', borderRadius: '50px', fontSize: '11px' }}>Patient: {activeChatUser?.name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer' }}>
                <i className="fas fa-microphone" />
              </button>
              <button style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer' }}>
                <i className="fas fa-video" />
              </button>
              <button onClick={handleStopVideoCall} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'var(--accent-gradient)', color: 'white', cursor: 'pointer' }}>
                <i className="fas fa-phone-slash" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DoctorDashboard;
