import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { api } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
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

const CHART_OPTIONS = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' } }
  }
};

const DoctorStats = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/doctors/dashboard');
      if (response.data.success && response.data.data) {
        setStatsData(response.data.data.stats);
      }
    } catch (err) {
      console.error('Failed to load doctor statistics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  const earningsData = {
    labels,
    datasets: [
      {
        label: 'Monthly Earnings (₹)',
        data: [15000, 22000, 18000, 28000, 24000, 32000, statsData ? statsData.totalEarnings : 30000],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#28a745',
        pointRadius: 5
      }
    ]
  };

  const consultsData = {
    labels,
    datasets: [
      {
        label: 'Completed Consultations',
        data: [12, 19, 15, 24, 20, 28, statsData ? statsData.completedAppointments : 25],
        backgroundColor: 'rgba(0, 123, 255, 0.7)',
        borderColor: '#007bff',
        borderRadius: 8
      }
    ]
  };

  return (
    <>
      <Header />
      
      <main style={{ paddingTop: '100px', minHeight: '80vh', background: 'var(--clr-gray-50)' }}>
        <div className="container" style={{ paddingBottom: '4rem' }}>
          
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '6px' }}>
              Doctor <span className="gradient-text">Analytics</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Inspect your consultation counts, earnings curves, and patient booking metrics.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--clr-primary)' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
            </div>
          ) : (
            <>
              {/* Quick Metrics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                
                {[
                  { label: 'Total Bookings', value: statsData?.totalAppointments || 0, icon: 'fas fa-calendar-check', color: '#007bff' },
                  { label: 'Completed Consults', value: statsData?.completedAppointments || 0, icon: 'fas fa-check-circle', color: '#28a745' },
                  { label: 'Pending Consults', value: statsData?.pendingAppointments || 0, icon: 'fas fa-clock', color: '#ffc107' },
                  { label: 'Total Earnings (₹)', value: statsData?.totalEarnings || 0, icon: 'fas fa-wallet', color: '#fd7e14' }
                ].map((kpi, index) => (
                  <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: `${kpi.color}15`, color: kpi.color,
                        display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center'
                      }}>
                        <i className={kpi.icon} />
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.label}</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--clr-gray-900)' }}>
                      {typeof kpi.value === 'number' && kpi.label.includes('Earnings') ? `₹${kpi.value.toLocaleString()}` : kpi.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart displays */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                
                <div className="card" style={{ background: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', color: 'var(--clr-gray-900)' }}>
                    Revenue Curve (₹)
                  </h3>
                  <Line data={earningsData} options={CHART_OPTIONS} />
                </div>

                <div className="card" style={{ background: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', color: 'var(--clr-gray-900)' }}>
                    Patient Consultation Trends
                  </h3>
                  <Bar data={consultsData} options={CHART_OPTIONS} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DoctorStats;
