import React, { useState, useContext, useRef, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AICoach = () => {
  const { triggerToast } = useContext(NotificationContext);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Health Tracker AI Coach (Sandbox Simulation Mode). Feel free to ask me about diet planning, physical training, workout schedules, or symptom analysis!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

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
      <Header />
      
      <main style={{ paddingTop: '100px', minHeight: '85vh', background: 'var(--clr-gray-50)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: '550px', maxWidth: '800px', paddingBottom: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '6px' }}>Health AI <span className="gradient-text">Coach</span></h1>
            <span className="badge badge-primary">
              <i className="fas fa-flask" /> Sandbox Simulation Mode
            </span>
          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
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
                      background: isAi ? 'var(--clr-gray-100)' : 'var(--grad-primary)',
                      color: isAi ? 'var(--clr-gray-900)' : 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    {msg.text}
                  </div>
                );
              })}
              {loading && (
                <div style={{ alignSelf: 'flex-start', padding: '12px 18px', borderRadius: '16px', borderBottomLeftRadius: '0', background: 'var(--clr-gray-100)', color: 'var(--clr-gray-600)', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', fontWeight: 600 }}>
                  <i className="fas fa-circle-notch fa-spin" style={{ color: 'var(--clr-primary)' }}></i>
                  <span>AI Coach is compiling response...</span>
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
                placeholder="Ask about diet planning, symptom checks, weight targets..."
                style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 15px', fontSize: '14.5px', fontFamily: 'inherit' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  flexShrink: 0
                }}
              >
                <i className="fas fa-paper-plane" style={{ fontSize: '0.9rem' }}></i>
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
