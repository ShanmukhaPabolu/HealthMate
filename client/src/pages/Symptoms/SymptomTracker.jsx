import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const SymptomTracker = () => {
  const { triggerToast } = useContext(NotificationContext);
  const navigate = useNavigate();
  
  // Form states
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  // AI Recommendation states
  const [aiReport, setAiReport] = useState(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

  const symptomsList = [
    'Headache',
    'Fever',
    'Cough',
    'Fatigue',
    'Sore Throat',
    'Shortness of Breath',
    'Muscle Aches',
    'Nausea',
    'Dizziness',
    'Stomach Pain'
  ];


  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms(prev => [...prev, symptom]);
    }
  };

  const getRecommendation = (symptoms) => {
    const list = symptoms.map(s => s.toLowerCase());
    
    if (list.includes('shortness of breath') || list.some(s => s.includes('breath') || s.includes('chest') || s.includes('heart'))) {
      return {
        specialization: 'Cardiologist',
        advice: 'Your logged symptoms (shortness of breath) point to potential cardiovascular stressors. An immediate consult with a Cardiologist is highly advised.'
      };
    }
    
    if (list.includes('dizziness') || list.includes('headache')) {
      return {
        specialization: 'Neurologist',
        advice: 'Neurological symptoms like persistent headaches or acute dizziness warrant evaluation by a Neurologist to investigate nerve path functions.'
      };
    }

    return {
      specialization: 'General Physician',
      advice: 'Your symptoms match standard viral or low-grade respiratory flags. A General Physician check-up is recommended to coordinate initial care.'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      return triggerToast('Please select at least one symptom.', 'error');
    }

    try {
      const response = await api.post('/shared/symptoms', {
        symptoms: selectedSymptoms,
        severity,
        duration,
        notes
      });
      if (response.data.success) {
        triggerToast('Symptoms logged successfully!', 'success');
        
        // Calculate and trigger AI recommendation report
        const recommendationDetails = getRecommendation(selectedSymptoms);
        setAiReport(recommendationDetails);
        setShowRecommendationModal(true);

        setSelectedSymptoms([]);
        setSeverity(5);
        setDuration('');
        setNotes('');
      }
    } catch (err) {
      triggerToast('Failed to log symptoms.', 'error');
    }
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1" style={{ background: 'radial-gradient(circle, var(--accent-orange) 0%, transparent 70%)' }}></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
                              
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '40px' }}>Daily Symptom <span className="gradient-text">Tracker</span></h1>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '15px' }}>Select Symptoms</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {symptomsList.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => handleSymptomToggle(symptom)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '50px',
                          border: isSelected ? '1.5px solid var(--accent-color)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'var(--primary-gradient)' : 'white',
                          color: isSelected ? 'white' : 'var(--text-secondary)',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {symptom}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Severity Level ({severity}/10)</h3>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>
                  <span>Mild (1)</span>
                  <span>Moderate (5)</span>
                  <span>Severe (10)</span>
                </div>
              </div>

              <div className="input-group">
                <label>Symptom Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 3 hours, 2 days"
                  required
                  style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                />
              </div>

              <div className="input-group">
                <label>Clinical Notes / Context</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write any additional details or triggers (e.g. after dinner, while jogging)"
                  style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%', minHeight: '120px' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'center', minWidth: '200px', justifyContent: 'center' }}>
                Log Symptoms
              </button>
            </form>
          </div>
        </div>
      </main>

      {showRecommendationModal && aiReport && (
        <div className="recommendation-modal" style={{
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
            gap: '20px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '15px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>AI Symptom Analysis</h3>
              <i className="fas fa-times-circle" onClick={() => setShowRecommendationModal(false)} style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }} />
            </div>

            <div>
              <i className="fas fa-robot" style={{ fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '15px' }}></i>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {aiReport.advice}
              </p>
              <div style={{ padding: '15px', background: 'rgba(220,53,69,0.05)', borderRadius: '12px', border: '1px solid rgba(220,53,69,0.1)', fontWeight: '700', marginBottom: '25px' }}>
                Recommended Specialist: {aiReport.specialization}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowRecommendationModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowRecommendationModal(false);
                  navigate(`/doctors?specialization=${encodeURIComponent(aiReport.specialization)}`);
                }}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Find Doctors
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default SymptomTracker;
