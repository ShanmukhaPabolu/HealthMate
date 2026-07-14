import React, { useState, useContext } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DrugChecker = () => {
  const { triggerToast } = useContext(NotificationContext);
  
  // Drugs fields
  const [drugInput, setDrugInput] = useState('');
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleAddDrug = (e) => {
    e.preventDefault();
    if (!drugInput.trim()) return;
    if (selectedDrugs.includes(drugInput.trim())) {
      return triggerToast('Medication is already added to the list.', 'info');
    }
    setSelectedDrugs(prev => [...prev, drugInput.trim()]);
    setDrugInput('');
  };

  const handleRemoveDrug = (name) => {
    setSelectedDrugs(prev => prev.filter(d => d !== name));
  };

  const handleAnalyze = async () => {
    if (selectedDrugs.length === 0) {
      return triggerToast('Please add at least one medication product.', 'error');
    }
    setLoading(true);
    try {
      const response = await api.post('/shared/analyze-drugs', { drugs: selectedDrugs });
      setResults(response.data);
    } catch (err) {
      triggerToast('Failed to run interaction checker.', 'error');
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
      
                              
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '40px' }}>Medication Safety <span className="gradient-text">Interaction Analyzer</span></h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
            {/* Input Medications list builder */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Medications List</h2>
              
              <form onSubmit={handleAddDrug} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={drugInput}
                  onChange={(e) => setDrugInput(e.target.value)}
                  placeholder="e.g. Aspirin, Warfarin"
                  style={{ flex: 1, padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', borderRadius: '12px' }}>
                  Add
                </button>
              </form>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px', minHeight: '80px', padding: '15px', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
                {selectedDrugs.length === 0 ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 'auto' }}>No drugs added.</span>
                ) : (
                  selectedDrugs.map((drug) => (
                    <div
                      key={drug}
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(0,123,255,0.1)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '50px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--accent-blue)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>{drug}</span>
                      <i
                        onClick={() => handleRemoveDrug(drug)}
                        className="fas fa-times-circle"
                        style={{ cursor: 'pointer', color: 'var(--accent-color)' }}
                      />
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || selectedDrugs.length === 0}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? 'Analyzing...' : 'Analyze Combinations'}
              </button>
            </div>

            {/* Results Display */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Analysis Results</h2>
              
              {!results ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '50px 0' }}>
                  <i className="fas fa-microscope" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '15px' }}></i>
                  <p>Build your medications list on the left and click analyze to review interactions.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-color)', marginBottom: '8px' }}>
                      <i className="fas fa-exclamation-triangle"></i> Identified Interactions
                    </h3>
                    <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {results.interactions.map((x, i) => <li key={i} style={{ marginBottom: '5px' }}>{x}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-orange)', marginBottom: '8px' }}>
                      <i className="fas fa-shield-alt"></i> Clinical Risk Factors
                    </h3>
                    <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {results.risks.map((x, i) => <li key={i} style={{ marginBottom: '5px' }}>{x}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-green)', marginBottom: '8px' }}>
                      <i className="fas fa-lightbulb"></i> Recommended Alternatives
                    </h3>
                    <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {results.alternatives.map((x, i) => <li key={i} style={{ marginBottom: '5px' }}>{x}</li>)}
                    </ul>
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

export default DrugChecker;
