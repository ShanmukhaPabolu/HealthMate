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
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

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

const HealthTrends = () => {
  const [sirenEvents, setSirenEvents] = useState([]);
  const [timeRange, setTimeRange] = useState('7'); // '7' or '30'
  const [weeklyLogs, setWeeklyLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/user/activities/weekly');
        if (response.data.success) {
          setWeeklyLogs(response.data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.profile-btn'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  // Mock datasets for Vitals, water and sleep logs
  const labels7Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const labels30Days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

  const labels = timeRange === '7' ? labels7Days : labels30Days;

  // Check if we have user logged data
  const hasLoggedData = weeklyLogs.some(l => l.water > 0 || l.sleep > 0);
  const waterDbData = weeklyLogs.map(l => l.water);
  const sleepDbData = weeklyLogs.map(l => l.sleep);

  // Chart data configuration
  const waterData = {
    labels,
    datasets: [
      {
        label: 'Water Intake (ml)',
        data: (timeRange === '7' && hasLoggedData) ? waterDbData : (timeRange === '7' ? [1800, 2200, 1500, 2400, 2000, 2500, 2100] : Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 1500)),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const sleepData = {
    labels,
    datasets: [
      {
        label: 'Sleep Duration (hrs)',
        data: (timeRange === '7' && hasLoggedData) ? sleepDbData : (timeRange === '7' ? [7.5, 6.8, 8.0, 7.2, 6.5, 9.0, 8.2] : Array.from({ length: 30 }, () => Math.floor(Math.random() * 3) + 6)),
        backgroundColor: '#6f42c1',
        borderRadius: 8
      }
    ]
  };

  const caloriesData = {
    labels,
    datasets: [
      {
        label: 'Weight Tracker (kg)',
        data: timeRange === '7' ? [72.3, 72.1, 72.0, 71.9, 72.1, 71.8, 71.7] : Array.from({ length: 30 }, (_, i) => 72.5 - (i * 0.05) + (Math.random() * 0.2)),
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.2
      }
    ]
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2" style={{ background: 'radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)' }}></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
      <ParticlesBackground />
      <CustomCursor onSiren={handleSiren} />
      <SirenEffectContainer sirenEvents={sirenEvents} />
      <LoadingScreen text="METRIC VISUALIZATION" subtitle="Inspect your long-term health parameter curves" />
      
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 950 }}>Health Trends <span className="gradient-text">Visualization</span></h1>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid var(--border-subtle)', background: 'white', fontWeight: '600' }}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Water and sleep chart row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                padding: '30px',
                borderRadius: '24px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Hydration Curve</h3>
                <Line data={waterData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                padding: '30px',
                borderRadius: '24px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Sleep Analytics</h3>
                <Bar data={sleepData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
            </div>

            {/* Weight tracker chart */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              padding: '30px',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Weight Dynamics</h3>
              <Line data={caloriesData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default HealthTrends;
