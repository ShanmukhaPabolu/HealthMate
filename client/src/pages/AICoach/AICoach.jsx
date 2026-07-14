import React, { useState, useContext, useRef, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const AICoach = () => {
  const { triggerToast } = useContext(NotificationContext);
  const [sirenEvents, setSirenEvents] = useState([]);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Health Tracker AI Coach. Ask me anything about diet plans, workouts, or chronic symptom logs!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.profile-btn'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/shared/askAI', { message: userMessage });
      if (response.data && response.data.answer) {
        setMessages(prev => [...prev, { sender: 'ai', text: response.data.answer }]);
      }
    } catch (err) {
      triggerToast('AI Coach is temporarily offline. Please try again.', 'error');
      setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble connecting right now. Please try again in a few moments." }]);
    } finally {
      setLoading(false);
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
      <LoadingScreen text="HEALTH AI COACH" subtitle="Personalized fitness guidance" />
      
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '85vh' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)', minHeight: '500px', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '20px', textAlign: 'center' }}>Health AI <span className="gradient-text">Coach</span></h1>

          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden'
          }}>
            {/* Messages Display */}
            <div style={{ flex: 1, padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {messages.map((msg, index) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div
                    key={index}
                    style={{
                      alignSelf: isAi ? 'flex-start' : 'flex-end',
                      maxWidth: '75%',
                      padding: '12px 18px',
                      borderRadius: '16px',
                      borderBottomLeftRadius: isAi ? '0' : '16px',
                      borderBottomRightRadius: isAi ? '16px' : '0',
                      background: isAi ? 'rgba(0,123,255,0.1)' : 'var(--primary-gradient)',
                      color: isAi ? 'var(--text-primary)' : 'white',
                      fontWeight: '500',
                      fontSize: '14.5px',
                      lineHeight: 1.5,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                    }}
                  >
                    {msg.text}
                  </div>
                );
              })}
              {loading && (
                <div style={{ alignSelf: 'flex-start', padding: '12px 18px', borderRadius: '16px', borderBottomLeftRadius: '0', background: 'rgba(0,123,255,0.05)', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <i className="fas fa-circle-notch fa-spin" style={{ color: 'var(--accent-blue)' }}></i>
                  <span>AI Coach is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid var(--border-subtle)', padding: '15px', background: 'white' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about calories target, symptoms checks, or hydration levels..."
                style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 15px', fontSize: '14.5px' }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--primary-gradient)',
                  border: 'none',
                  color: 'white',
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 10px rgba(220, 53, 69, 0.2)'
                }}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AICoach;
