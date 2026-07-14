import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import EmptyState from '../../components/EmptyState';
import { SkeletonList } from '../../components/Skeleton';

const DietTracker = () => {
  const { triggerToast } = useContext(NotificationContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDietLogs();
  }, []);

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

  // Compute daily totals
  const totalCalories = logs.reduce((sum, log) => sum + (log.calories || 0), 0);
  const totalProtein = logs.reduce((sum, log) => sum + (log.proteins || 0), 0);
  const totalCarbs = logs.reduce((sum, log) => sum + (log.carbs || 0), 0);
  const totalFats = logs.reduce((sum, log) => sum + (log.fats || 0), 0);

  return (
    <>
      <Header />
      
      <main style={{ paddingTop: '100px', minHeight: '80vh', background: 'var(--clr-gray-50)' }}>
        <div className="container" style={{ paddingBottom: '4rem' }}>
          
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '32px', flexWrap: 'wrap', gap: '1rem'
          }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '6px' }}>
                Diet & <span className="gradient-text">Nutrition</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Track your daily calorie intake, log foods, and generate custom diet recommendations.
              </p>
            </div>
            <button
              onClick={handleGenerateDietPlan}
              disabled={loading}
              className="btn btn-green"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fas fa-magic"></i> {loading ? 'Generating...' : 'AI Diet Generator'}
            </button>
          </div>

          {/* Daily macro summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Calories', value: `${totalCalories} kcal`, icon: 'fas fa-fire', color: '#dc3545' },
              { label: 'Protein Target', value: `${totalProtein} g`, icon: 'fas fa-dna', color: '#007bff' },
              { label: 'Carbs Eaten', value: `${totalCarbs} g`, icon: 'fas fa-bread-slice', color: '#fd7e14' },
              { label: 'Fats Intake', value: `${totalFats} g`, icon: 'fas fa-tint', color: '#6f42c1' }
            ].map((card, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className={card.icon} style={{ color: card.color, fontSize: '1rem' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{card.label}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--clr-gray-900)' }}>{card.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
            
            {/* Meal Log Form */}
            <div className="card" style={{ background: 'white' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px', color: 'var(--clr-gray-900)' }}>
                Log Daily Meal
              </h2>
              
              <form onSubmit={handleMealSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Meal Description</label>
                  <input
                    type="text"
                    className="form-input"
                    value={meal}
                    onChange={(e) => setMeal(e.target.value)}
                    placeholder="e.g. Scrambled eggs with toast"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Calories (kcal)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      placeholder="e.g. 350"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Protein (g)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={proteins}
                      onChange={(e) => setProteins(e.target.value)}
                      placeholder="e.g. 18"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Carbs (g)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      placeholder="e.g. 30"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fats (g)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={fats}
                      onChange={(e) => setFats(e.target.value)}
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                  <i className="fas fa-plus" /> Log Food
                </button>
              </form>
            </div>

            {/* Diet History list */}
            <div className="card" style={{ gridColumn: 'span 2', background: 'white' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px', color: 'var(--clr-gray-900)' }}>
                Diet Logging History
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
                {fetching ? (
                  <SkeletonList items={3} />
                ) : logs.length === 0 ? (
                  <EmptyState
                    icon="fas fa-apple-alt"
                    title="No meals logged today"
                    description="You haven't logged any foods yet. Use the form on the left or generate a meal plan with the AI button above."
                  />
                ) : (
                  logs.map((log) => (
                    <div
                      key={log._id}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--clr-gray-50)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--clr-gray-900)' }}>{log.meal}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {new Date(log.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <span>Kcal: <strong style={{ color: 'var(--clr-gray-900)' }}>{log.calories}</strong></span>
                        <span>Protein: <strong style={{ color: 'var(--clr-gray-900)' }}>{log.proteins}g</strong></span>
                        <span>Carbs: <strong style={{ color: 'var(--clr-gray-900)' }}>{log.carbs}g</strong></span>
                        <span>Fats: <strong style={{ color: 'var(--clr-gray-900)' }}>{log.fats}g</strong></span>
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
