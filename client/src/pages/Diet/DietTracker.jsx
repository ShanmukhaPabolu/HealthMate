import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const DietTracker = () => {
  const { triggerToast } = useContext(NotificationContext);
  const [sirenEvents, setSirenEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form inputs
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Load diet logs
  const fetchDietLogs = async () => {
    try {
      const response = await api.get('/user/diet-logs');
      setLogs(response.data || []);
    } catch (err) {
      console.error('Failed to load diet logs', err);
    }
  };

  useEffect(() => {
    fetchDietLogs();
  }, []);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.profile-btn') || el.closest('.btn-primary'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  // Submit manual diet log
  const handleMealSubmit = async (e) => {
    e.preventDefault();
    if (!meal) return;
    try {
      const response = await api.post('/user/diet-logs', {
        meal,
        calories: parseInt(calories) || 0,
        proteins: parseInt(proteins) || 0,
        carbs: parseInt(carbs) || 0,
        fats: parseInt(fats) || 0
      });
      if (response.data.success) {
        triggerToast('Meal logged successfully!', 'success');
        setMeal('');
        setCalories('');
        setProteins('');
        setCarbs('');
        setFats('');
        fetchDietLogs();
      }
    } catch (err) {
      triggerToast('Failed to log meal.', 'error');
    }
  };

  // Call AI Diet plan generator
  const handleGenerateDietPlan = async () => {
    setLoading(true);
    try {
      const response = await api.post('/shared/generate-diet-plan');
      if (response.data) {
        triggerToast('AI Diet Plan generated successfully!', 'success');
        fetchDietLogs();
      }
    } catch (err) {
      triggerToast('Failed to generate diet plan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1" style={{ background: 'radial-gradient(circle, var(--accent-green) 0%, transparent 70%)' }}></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
      <ParticlesBackground />
      <CustomCursor onSiren={handleSiren} />
      <SirenEffectContainer sirenEvents={sirenEvents} />
      <LoadingScreen text="DIET LOGS TRACKER" subtitle="Monitor your nutrition profile" />
      
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 950 }}>Nutritional <span className="gradient-text">Diet Tracker</span></h1>
            <button
              onClick={handleGenerateDietPlan}
              disabled={loading}
              className="btn btn-primary"
              style={{ background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fas fa-magic"></i> {loading ? 'Generating...' : 'AI Diet Generator'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
            {/* Meal Log Form */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Log Daily Meal</h2>
              <form onSubmit={handleMealSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="input-group">
                  <label>Meal Description</label>
                  <input
                    type="text"
                    value={meal}
                    onChange={(e) => setMeal(e.target.value)}
                    placeholder="e.g. Scrambled eggs with whole toast"
                    required
                    style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="input-group">
                    <label>Calories (kcal)</label>
                    <input
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      placeholder="Calories"
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                    />
                  </div>
                  <div className="input-group">
                    <label>Protein (g)</label>
                    <input
                      type="number"
                      value={proteins}
                      onChange={(e) => setProteins(e.target.value)}
                      placeholder="Protein"
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="input-group">
                    <label>Carbohydrates (g)</label>
                    <input
                      type="number"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      placeholder="Carbs"
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                    />
                  </div>
                  <div className="input-group">
                    <label>Fats (g)</label>
                    <input
                      type="number"
                      value={fats}
                      onChange={(e) => setFats(e.target.value)}
                      placeholder="Fats"
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', justifyContent: 'center' }}>
                  Log Food
                </button>
              </form>
            </div>

            {/* Diet History list */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Diet Logging History</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '420px', overflowY: 'auto', paddingRight: '10px' }}>
                {logs.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
                    <i className="fas fa-apple-alt" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '15px' }}></i>
                    <p>No food records logged yet today.</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log._id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)',
                        background: 'rgba(255,255,255,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>{log.meal}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <span><strong>Kcal:</strong> {log.calories}</span>
                        <span><strong>Protein:</strong> {log.proteins}g</span>
                        <span><strong>Carbs:</strong> {log.carbs}g</span>
                        <span><strong>Fats:</strong> {log.fats}g</span>
                      </div>
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

export default DietTracker;
