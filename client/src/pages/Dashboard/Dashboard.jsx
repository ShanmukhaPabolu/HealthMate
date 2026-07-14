import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Security from '../../components/Security';
import HealthCategories from '../../components/HealthCategories';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';
import io from 'socket.io-client';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { triggerToast } = useContext(NotificationContext);
  const [sirenEvents, setSirenEvents] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Appointments, Chat, and Video states
  const [appointments, setAppointments] = useState([]);
  const [activeChatDoctor, setActiveChatDoctor] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const handleSiren = useCallback((x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.btn') || el.closest('.profile-btn') || el.closest('.dropdown-item') || el.closest('.chat-box') || el.closest('.modal-overlay'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      if (response.data.success) {
        setAppointments(response.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Sync chat messages over socket
  useEffect(() => {
    if (!activeChatDoctor || !user) return;

    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    const targetId = activeChatDoctor.user?._id || activeChatDoctor._id;
    const roomId = [user._id, targetId].sort().join('-');
    newSocket.emit('join-room', roomId);

    newSocket.on('receive-message', (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [activeChatDoctor, user]);

  const handleOpenChat = async (doctorObj) => {
    setActiveChatDoctor(doctorObj);
    try {
      const response = await api.get(`/chat/${doctorObj.user?._id || doctorObj._id}`);
      setChatMessages(response.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const targetId = activeChatDoctor.user?._id || activeChatDoctor._id;
    try {
      const response = await api.post('/chat', {
        receiverId: targetId,
        message: chatInput
      });

      if (response.data.success) {
        const msgData = response.data.data;
        if (socket) {
          const roomId = [user._id, targetId].sort().join('-');
          socket.emit('send-message', { ...msgData, roomId });
        }
        setChatMessages((prev) => [...prev, msgData]);
        setChatInput('');
      }
    } catch (err) {
      triggerToast('Message delivery failed.', 'error');
    }
  };

  // Video call controls
  const handleStartVideoCall = async () => {
    setShowVideoModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setTimeout(() => {
        const localVid = document.getElementById('patientLocalVideo');
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

  const handleDownloadPDF = (apptId, type) => {
    const url = `${api.defaults.baseURL}/appointments/${apptId}/${type}`;
    const token = localStorage.getItem('token');
    
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `${type}-${apptId}.pdf`;
        a.click();
      })
      .catch(err => triggerToast('Failed to download document.', 'error'));
  };

  const coreFeatures = [
    {
      title: "Health Records Management",
      description: "Document vital signs, track medical conditions, and maintain an audit log of your patient history securely.",
      icon: "fas fa-file-medical-alt",
      floatingIcons: ["fas fa-notes-medical", "fas fa-clipboard-list", "fas fa-file-medical"],
      page: "/stats"
    },
    {
      title: "Smart Reminders",
      description: "Intelligent medication and appointment notification system. Set timing, dosage, and follow-ups.",
      icon: "fas fa-bell",
      floatingIcons: ["fas fa-clock", "fas fa-calendar-alt", "fas fa-mobile-alt"],
      page: "/reminders"
    },
    {
      title: "Diet Generator",
      description: "AI-based personalized daily diet planner. Custom food recipes tailored to your calorie metrics.",
      icon: "fas fa-apple-alt",
      floatingIcons: ["fas fa-carrot", "fas fa-lemon", "fas fa-pepper-hot"],
      page: "/diet"
    },
    {
      title: "Daily Symptom Tracker",
      description: "Log vitals, pain indicators, and daily symptoms. Analyze health timeline patterns over time.",
      icon: "fas fa-clipboard-check",
      floatingIcons: ["fas fa-thermometer-half", "fas fa-head-side-virus", "fas fa-lungs"],
      page: "/symptoms"
    },
    {
      title: "Health Trends",
      description: "Visualize vital indicators, sleep metrics, and weight timelines with chart trackers.",
      icon: "fas fa-chart-line",
      floatingIcons: ["fas fa-chart-bar", "fas fa-chart-pie", "fas fa-chart-area"],
      page: "/trends"
    },
    {
      title: "Health AI Coach",
      description: "Interact with our AI health advisor to get advice on physical therapy and fitness routines.",
      icon: "fas fa-robot",
      floatingIcons: ["fas fa-brain", "fas fa-comments-medical", "fas fa-dumbbell"],
      page: "/ai-coach"
    },
    {
      title: "Book a Doctor",
      description: "Search, filter, and schedule physical or virtual consultations with verified doctors in real-time.",
      icon: "fas fa-user-md",
      floatingIcons: ["fas fa-calendar-check", "fas fa-hospital", "fas fa-user-md"],
      page: "/doctors"
    },
    {
      title: "Drug Interaction Checker",
      description: "Double-check safety combinations of multiple drug products using our analyzer checks.",
      icon: "fas fa-prescription-bottle-alt",
      floatingIcons: ["fas fa-capsules", "fas fa-pills", "fas fa-vial"],
      page: "/drug-checker"
    }
  ];

  const handleCardClick = (page) => {
    navigate(page);
  };

  return (
    <>
      <div 
        className="dynamic-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(220, 53, 69, 0.05) 0%, transparent 50%), radial-gradient(circle at ${window.innerWidth - mousePosition.x}px ${window.innerHeight - mousePosition.y}px, rgba(0, 123, 255, 0.05) 0%, transparent 50%)`,
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      
      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
      <ParticlesBackground />
      <CustomCursor onSiren={handleSiren} />
      <SirenEffectContainer sirenEvents={sirenEvents} />
      <LoadingScreen text="PATIENT DASHBOARD" subtitle="Access your personal wellness logs" />
      
      <Header />
      
      <main>
        {/* Welcome Section */}
        <section id="home" className="hero" style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: '100px', overflow: 'hidden', background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 50%, #e6f7ff 100%)' }}>
          <div className="hero-content" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <div className="container">
              <div className="hero-text" style={{ animation: 'fadeInUp 1.2s ease-out forwards' }}>
                <div className="hero-badge" style={{ display: 'inline-flex', gap: '8px', padding: '6px 12px', background: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.2)', borderRadius: '50px', fontSize: '13px', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  <i className="fas fa-heart" style={{ fontSize: '0.8rem', marginTop: '2px' }}></i>
                  <span>Patient Dashboard</span>
                </div>
                <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '1.5rem', fontFamily: 'Montserrat, sans-serif' }}>
                  <span>Welcome Back,</span>
                  <span className="red-text" style={{ display: 'block' }}>{user ? user.name : 'Patient'}</span>
                </h1>
                <p className="hero-description" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '650px', marginBottom: '2.5rem' }}>
                  Review your recent logs, book consultations, get AI-backed diet planning, and double check drug interactions.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/doctors')} className="btn btn-primary">
                    Book Consultation <i className="fas fa-calendar-alt" style={{ marginLeft: '6px' }}></i>
                  </button>
                  <button onClick={() => navigate('/profile')} className="btn btn-secondary">
                    View Health Profile <i className="fas fa-user-circle" style={{ marginLeft: '6px' }}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Appointments Schedule Directory */}
        <section style={{ padding: '4rem 0', background: 'var(--clr-gray-50)' }}>
          <div className="container">
            <div className="card card-lg" style={{ color: 'var(--clr-gray-900)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>My Scheduled Consultations</h2>
                <span className="badge badge-primary">
                  <i className="fas fa-calendar-alt" /> {appointments.length} Booked
                </span>
              </div>
              
              {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <i className="fas fa-calendar-times" style={{ fontSize: '3rem', color: 'var(--clr-gray-300)', marginBottom: '16px', display: 'block' }} />
                  <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>No consultations booked yet.</p>
                  <button onClick={() => navigate('/doctors')} className="btn btn-primary" style={{ marginTop: '16px' }}>
                    Find a Doctor & Book
                  </button>
                </div>
              ) : (
                <div className="data-table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time Slot</th>
                        <th>Consultation</th>
                        <th>Queue Position</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((app) => (
                        <tr key={app._id}>
                          <td style={{ fontWeight: '700', color: 'var(--clr-gray-900)' }}>
                            Dr. {app.doctor?.user?.name}
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                              {app.doctor?.specialization}
                            </span>
                          </td>
                          <td>{new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td style={{ fontWeight: 600 }}>{app.slot}</td>
                          <td style={{ textTransform: 'capitalize' }}>
                            <span className={`badge ${app.consultationType === 'online' ? 'badge-blue' : 'badge-purple'}`}>
                              {app.consultationType}
                            </span>
                          </td>
                          <td style={{ fontWeight: '800', color: 'var(--clr-blue)' }}>#{app.queuePosition || 1}</td>
                          <td>
                            <span className={`badge badge-${app.status === 'accepted' ? 'confirmed' : app.status === 'completed' ? 'completed' : 'pending'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {app.status === 'accepted' && (
                                <button onClick={() => handleOpenChat(app.doctor)} className="btn btn-sm btn-blue">
                                  <i className="fas fa-comments"></i> Chat
                                </button>
                              )}
                              {app.status === 'completed' && app.prescription && (
                                <button onClick={() => handleDownloadPDF(app._id, 'prescription')} className="btn btn-sm btn-secondary">
                                  <i className="fas fa-file-prescription"></i> Rx
                                </button>
                              )}
                              {app.paymentStatus === 'paid' && (
                                <button onClick={() => handleDownloadPDF(app._id, 'receipt')} className="btn btn-sm btn-secondary">
                                  <i className="fas fa-file-invoice-dollar"></i> Receipt
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section id="core-features" className="core-features-section" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-darker) 100%)' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Your Health <span className="gradient-text">Toolbox</span></h2>
              <p style={{ color: 'var(--text-secondary)' }}>Select any tool below to inspect or log your daily parameters.</p>
            </div>
            
            <div className="core-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
              {coreFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="core-feature-card"
                  onClick={() => handleCardClick(feature.page)}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(220,53,69,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(220,53,69,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'fadeInUp 0.8s ease forwards',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(220, 53, 69, 0.1)',
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    marginBottom: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}>
                    <i className={feature.icon}></i>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.2rem' }}>{feature.description}</p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Open <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HealthCategories />
        <Security />
      </main>
      
      {/* Floating Patient Chat box */}
      {activeChatDoctor && (
        <div className="chat-box" style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '350px',
          height: '400px',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '25px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '10px' }}>
            <span style={{ fontWeight: '800', fontSize: '14px' }}>Chat: Dr. {activeChatDoctor.user?.name}</span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <i className="fas fa-video" onClick={handleStartVideoCall} style={{ cursor: 'pointer', color: 'var(--accent-color)', fontSize: '15px' }} title="Start Video Consultation" />
              <i className="fas fa-times-circle" onClick={() => setActiveChatDoctor(null)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px', marginBottom: '10px' }}>
            {chatMessages.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', textAlign: 'center', marginTop: '20px' }}>No messages yet. Send a greeting to start consulting!</p>
            ) : (
              chatMessages.map((msg, i) => {
                const isMe = msg.sender === user?._id;
                return (
                  <div
                    key={i}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: isMe ? 'var(--primary-gradient)' : 'rgba(0,0,0,0.05)',
                      color: isMe ? 'white' : 'var(--text-primary)',
                      fontSize: '13px',
                      maxWidth: '80%'
                    }}
                  >
                    {msg.message}
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
            />
            <button type="submit" style={{ background: 'var(--primary-gradient)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      {/* WebRTC Video Call overlay modal for patient */}
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
                  <video id="patientLocalVideo" autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Local Camera Unusable</span>
                )}
                <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '3px 10px', borderRadius: '50px', fontSize: '11px' }}>Patient (You)</span>
              </div>

              {/* Remote Feed */}
              <div style={{ position: 'relative', background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {localStream ? (
                  <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--accent-color)' }} />
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Waiting for Dr. {activeChatDoctor?.user?.name} to connect...</p>
                  </div>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No Remote Feed</span>
                )}
                <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '3px 10px', borderRadius: '50px', fontSize: '11px' }}>Doctor: Dr. {activeChatDoctor?.user?.name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer' }}>
                <i className="fas fa-microphone" />
              </button>
              <button style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer' }}>
                <i className="fas fa-video" />
              </button>
              <button onClick={handleStopVideoCall} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'var(--primary-gradient)', color: 'white', cursor: 'pointer' }}>
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

export default Dashboard;
