import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { api } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';
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
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DoctorStats = () => {
  const [sirenEvents, setSirenEvents] = useState([]);
  const [statsData, setStatsData] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await api.get('/doctors/dashboard');
      if (response.data.success) {
        setStatsData(response.data.analytics);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.profile-btn'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  const earningsData = {
    labels,
    datasets: [
      {
        label: 'Monthly Earnings ($)',
        data: [1200, 1900, 1500, 2400, 2200, 3000, statsData ? (statsData.completedCount * 100) : 2800],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const consultsData = {
    labels,
    datasets: [
      {
        label: 'Completed Consultations',
        data: [15, 22, 18, 28, 25, 34, statsData ? statsData.completedCount : 30],
        backgroundColor: '#007bff',
        borderRadius: 6
      }
    ]
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
      <LoadingScreen text="ANALYTICS PORTAL" subtitle="Examine consultation metrics curves" />
      
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '40px' }}>Doctor Analytics & <span className="gradient-text">Earnings curve</span></h1>

          {/* Quick Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <i className="fas fa-calendar-check" style={{ fontSize: '1.8rem', color: '#007bff', marginBottom: '8px' }} />
              <h4>Total Bookings</h4>
              <p style={{ fontSize: '22px', fontWeight: '900' }}>{statsData ? statsData.totalAppointments : 0}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <i className="fas fa-check-circle" style={{ fontSize: '1.8rem', color: '#28a745', marginBottom: '8px' }} />
              <h4>Completed Consults</h4>
              <p style={{ fontSize: '22px', fontWeight: '900' }}>{statsData ? statsData.completedCount : 0}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <i className="fas fa-dollar-sign" style={{ fontSize: '1.8rem', color: '#fd7e14', marginBottom: '8px' }} />
              <h4>Pending Reviews</h4>
              <p style={{ fontSize: '22px', fontWeight: '900' }}>{statsData ? statsData.pendingCount : 0}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              padding: '30px',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Revenue curve</h3>
              <Line data={earningsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              padding: '30px',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Patient consults</h3>
              <Bar data={consultsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DoctorStats;
