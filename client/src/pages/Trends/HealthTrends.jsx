import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { api } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CHART_OPTIONS = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' } }
  }
};

const HealthTrends = () => {
  const [timeRange, setTimeRange] = useState('7');
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/activities/weekly');
      if (response.data.success) {
        setWeeklyLogs(response.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Derive chart labels from real dates returned by the API
  const labels = weeklyLogs.length > 0
    ? weeklyLogs.map(l => {
        const d = new Date(l.date);
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      })
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const waterData = {
    labels,
    datasets: [{
      label: 'Water Intake (glasses)',
      data: weeklyLogs.length > 0 ? weeklyLogs.map(l => l.water || 0) : [0, 0, 0, 0, 0, 0, 0],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.15)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#007bff',
      pointRadius: 5
    }]
  };

  const sleepData = {
    labels,
    datasets: [{
      label: 'Sleep Duration (hrs)',
      data: weeklyLogs.length > 0 ? weeklyLogs.map(l => l.sleep || 0) : [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(111, 66, 193, 0.7)',
      borderColor: '#6f42c1',
      borderRadius: 8
    }]
  };

  const caloriesData = {
    labels,
    datasets: [{
      label: 'Calories Target (kcal)',
      data: weeklyLogs.length > 0 ? weeklyLogs.map(l => l.calories || 0) : [0, 0, 0, 0, 0, 0, 0],
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      tension: 0.2,
      pointBackgroundColor: '#dc3545',
      pointRadius: 5
    }]
  };

  const hasAnyData = weeklyLogs.some(l => l.water > 0 || l.sleep > 0 || l.calories > 0);

  const chartCard = (title, subtitle, chartNode, icon, color) => (
    <div style={{
      background: 'white',
      padding: '28px',
      borderRadius: '20px',
      border: '1px solid rgba(0,0,0,0.08)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: `${color}20`, color, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
        }}>
          <i className={icon} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{title}</h3>
          <p style={{ fontSize: '0.8rem', color: '#6c757d', margin: 0 }}>{subtitle}</p>
        </div>
      </div>
      {!hasAnyData && !loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#adb5bd', fontSize: '0.9rem' }}>
          <i className="fas fa-chart-line" style={{ fontSize: '2rem', marginBottom: '8px', display: 'block' }} />
          No data logged yet. Use the Dashboard to log your activities.
        </div>
      )}
      {(hasAnyData || loading) && chartNode}
    </div>
  );

  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px', minHeight: '80vh', background: '#f8f9fa' }}>
        <div className="container" style={{ paddingBottom: '4rem' }}>
          {/* Page Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '36px', flexWrap: 'wrap', gap: '1rem'
          }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '6px' }}>
                Health <span className="gradient-text">Trends</span>
              </h1>
              <p style={{ color: '#6c757d', fontSize: '0.95rem' }}>
                Your personal health metrics over time — powered by real logged data.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['7', '30'].map(v => (
                <button
                  key={v}
                  onClick={() => setTimeRange(v)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '50px',
                    border: '2px solid #dc3545',
                    background: timeRange === v ? '#dc3545' : 'transparent',
                    color: timeRange === v ? 'white' : '#dc3545',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {v === '7' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Summary KPI Strip */}
          {hasAnyData && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px', marginBottom: '32px'
            }}>
              {[
                { label: 'Avg Water (glasses)', value: (weeklyLogs.reduce((s, l) => s + (l.water || 0), 0) / weeklyLogs.length).toFixed(1), icon: 'fas fa-tint', color: '#007bff' },
                { label: 'Avg Sleep (hrs)', value: (weeklyLogs.reduce((s, l) => s + (l.sleep || 0), 0) / weeklyLogs.length).toFixed(1), icon: 'fas fa-moon', color: '#6f42c1' },
                { label: 'Avg Calories Target', value: Math.round(weeklyLogs.reduce((s, l) => s + (l.calories || 0), 0) / weeklyLogs.length), icon: 'fas fa-fire', color: '#dc3545' },
                { label: 'Days Logged', value: weeklyLogs.filter(l => l.water > 0 || l.sleep > 0).length, icon: 'fas fa-calendar-check', color: '#28a745' }
              ].map((kpi, i) => (
                <div key={i} style={{
                  background: 'white', padding: '20px', borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <i className={kpi.icon} style={{ color: kpi.color, fontSize: '1.1rem' }} />
                    <span style={{ fontSize: '0.8rem', color: '#6c757d', fontWeight: 600 }}>{kpi.label}</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#dc3545' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {chartCard('Hydration Tracking', 'Daily water intake (glasses)', <Line data={waterData} options={CHART_OPTIONS} />, 'fas fa-tint', '#007bff')}
                {chartCard('Sleep Quality', 'Sleep duration per night (hours)', <Bar data={sleepData} options={CHART_OPTIONS} />, 'fas fa-moon', '#6f42c1')}
              </div>
              {chartCard('Calorie Target', 'Daily calorie target over time', <Line data={caloriesData} options={CHART_OPTIONS} />, 'fas fa-fire', '#dc3545')}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HealthTrends;
