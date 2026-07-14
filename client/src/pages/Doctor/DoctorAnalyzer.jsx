import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DoctorAnalyzer = () => {
    const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setResults({
        diagnoses: [
          'Acute viral respiratory tract infection (92% probability)',
          'Allergic Rhinitis (45% probability)',
          'Influenza Type A (30% probability)'
        ],
        recs: [
          'Recommend symptomatic therapy with antihistamines or antipyretics.',
          'Advise complete bed rest and hydration logs.',
          'Schedule follow-up consultation if fever persists past 3 days.'
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
                              
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '40px', textAlign: 'center' }}>Clinical Diagnosis <span className="gradient-text">Assistant Analyzer</span></h1>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
          }}>
            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ fontWeight: '600' }}>Enter Clinical Indicators / Symptoms</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. Patient presents with high fever (102F), dry cough, and persistent fatigue since last 48 hours..."
                required
                style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--border-subtle)', minHeight: '120px', fontSize: '14.5px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'center', minWidth: '180px', justifyContent: 'center' }}>
                {loading ? 'Analyzing Indicators...' : 'Run Diagnostics'}
              </button>
            </form>

            {results && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ color: 'var(--accent-color)', fontSize: '1.1rem', fontWeight: '800', marginBottom: '10px' }}>
                    <i className="fas fa-stethoscope"></i> Indicated Diagnoses
                  </h3>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {results.diagnoses.map((diag, idx) => <li key={idx} style={{ marginBottom: '6px' }}>{diag}</li>)}
                  </ul>
                </div>

                <div>
                  <h3 style={{ color: 'var(--accent-blue)', fontSize: '1.1rem', fontWeight: '800', marginBottom: '10px' }}>
                    <i className="fas fa-clipboard-list"></i> Clinical Guidelines
                  </h3>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {results.recs.map((rec, idx) => <li key={idx} style={{ marginBottom: '6px' }}>{rec}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DoctorAnalyzer;
