import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingScreen from '../../components/LoadingScreen';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { triggerToast } = useContext(NotificationContext);
    
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const statsResponse = await api.get('/admin/dashboard');
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data.stats);
        setDoctors(statsResponse.data.data.doctors || []);
      }

      const patientsResponse = await api.get('/admin/patients');
      if (patientsResponse.data.success) {
        setPatients(patientsResponse.data.data || []);
      }

      const disputesResponse = await api.get('/disputes');
      if (disputesResponse.data.success) {
        setDisputes(disputesResponse.data.data || []);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to load administration data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);


  const handleApproveDoctor = async (id) => {
    try {
      const response = await api.patch(`/admin/doctors/${id}/approve`);
      if (response.data.success) {
        triggerToast('Doctor approved and verified!', 'success');
        fetchAdminData();
      }
    } catch (err) {
      triggerToast('Failed to approve doctor.', 'error');
    }
  };

  const handleRejectDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to reject this doctor profile?')) return;
    try {
      const response = await api.delete(`/admin/doctors/${id}/reject`);
      if (response.data.success) {
        triggerToast('Doctor profile rejected & deleted.', 'info');
        fetchAdminData();
      }
    } catch (err) {
      triggerToast('Failed to reject doctor.', 'error');
    }
  };

  const handleResolveDisputeClick = (dispute) => {
    setSelectedDispute(dispute);
    setResolutionNotes('');
    setShowResolveModal(true);
  };

  const handleResolveDisputeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/disputes/${selectedDispute._id}/resolve`, {
        resolutionNotes
      });
      if (response.data.success) {
        triggerToast('Dispute resolved successfully!', 'success');
        setShowResolveModal(false);
        fetchAdminData();
      }
    } catch (err) {
      triggerToast('Failed to resolve dispute ticket.', 'error');
    }
  };

  const handleToggleSuspend = async (id) => {
    try {
      const response = await api.patch(`/admin/doctors/${id}/suspend`);
      if (response.data.success) {
        triggerToast(response.data.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      triggerToast('Failed to suspend/unsuspend doctor.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const response = await api.delete(`/admin/users/${id}`);
      if (response.data.success) {
        triggerToast('User profile deleted successfully.', 'success');
        fetchAdminData();
      }
    } catch (err) {
      triggerToast('Failed to delete user.', 'error');
    }
  };

  const growthData = {
    labels: ['Doctors', 'Patients', 'Appointments'],
    datasets: [
      {
        label: 'Platform Growth Metrics',
        data: [
          doctors.length || (stats ? stats.doctorsCount : 0),
          patients.length || (stats ? stats.patientsCount : 0),
          stats ? stats.appointmentsCount : 0
        ],
        backgroundColor: ['rgba(0, 123, 255, 0.6)', 'rgba(40, 167, 69, 0.6)', 'rgba(253, 126, 20, 0.6)'],
        borderRadius: 8
      }
    ]
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1" style={{ background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)' }}></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
                              
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '60px' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '40px' }}>System Admin <span className="gradient-text">Dashboard</span></h1>

          {/* Stats widget panel */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <i className="fas fa-users" style={{ fontSize: '1.8rem', color: 'var(--accent-blue)', marginBottom: '8px' }}></i>
                <h4>Total Patients</h4>
                <p style={{ fontSize: '22px', fontWeight: '900' }}>{stats.patientsCount}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <i className="fas fa-user-md" style={{ fontSize: '1.8rem', color: 'var(--accent-color)', marginBottom: '8px' }}></i>
                <h4>Total Doctors</h4>
                <p style={{ fontSize: '22px', fontWeight: '900' }}>{stats.doctorsCount}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <i className="fas fa-calendar-check" style={{ fontSize: '1.8rem', color: 'var(--accent-purple)', marginBottom: '8px' }}></i>
                <h4>Appointments</h4>
                <p style={{ fontSize: '22px', fontWeight: '900' }}>{stats.appointmentsCount}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <i className="fas fa-donate" style={{ fontSize: '1.8rem', color: 'var(--accent-green)', marginBottom: '8px' }}></i>
                <h4>Gross Revenue</h4>
                <p style={{ fontSize: '22px', fontWeight: '900' }}>${stats.grossRevenue}</p>
              </div>
            </div>
          )}

          {/* Platform Growth Charts */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '40px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>System Metrics Analytics</h3>
            <Bar data={growthData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
            
            {/* Doctors Manager */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px' }}>Manage Doctors Directory</h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Specialization</th>
                      <th style={{ padding: '12px' }}>Consultation Fee</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc) => (
                      <tr key={doc._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>Dr. {doc.user?.name}</td>
                        <td style={{ padding: '12px' }}>{doc.specialization}</td>
                        <td style={{ padding: '12px' }}>${doc.consultationFee}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '50px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            background: doc.isVerified ? 'rgba(40,167,69,0.1)' : 'rgba(253,126,20,0.1)',
                            color: doc.isVerified ? 'var(--accent-green)' : 'var(--accent-orange)'
                          }}>{doc.isVerified ? 'VERIFIED' : 'PENDING'}</span>
                          {doc.isSuspended && <span style={{ marginLeft: '5px', padding: '3px 8px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold', background: 'rgba(220,53,69,0.1)', color: 'var(--accent-color)' }}>SUSPENDED</span>}
                        </td>
                        <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                          {!doc.isVerified && (
                            <>
                              <button onClick={() => handleApproveDoctor(doc._id)} className="action-btn" style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--accent-gradient)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                                Approve
                              </button>
                              <button onClick={() => handleRejectDoctor(doc._id)} className="action-btn" style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--primary-gradient)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                                Reject
                              </button>
                            </>
                          )}
                          {doc.isVerified && (
                            <button onClick={() => handleToggleSuspend(doc._id)} className="action-btn" style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: doc.isSuspended ? 'var(--accent-gradient)' : 'var(--primary-gradient)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                              {doc.isSuspended ? 'Unsuspend' : 'Suspend'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Patients Manager */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px' }}>Manage Patients Directory</h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Email</th>
                      <th style={{ padding: '12px' }}>Phone</th>
                      <th style={{ padding: '12px' }}>Registered At</th>
                      <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((pat) => (
                      <tr key={pat._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{pat.name}</td>
                        <td style={{ padding: '12px' }}>{pat.email}</td>
                        <td style={{ padding: '12px' }}>{pat.phone || 'N/A'}</td>
                        <td style={{ padding: '12px' }}>{new Date(pat.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => handleDeleteUser(pat._id)} className="action-btn" style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--primary-gradient)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                            Delete Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Support Disputes Manager */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px' }}>Manage Dispute Tickets</h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px' }}>Raised By</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Description</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disputes.map((dis) => (
                      <tr key={dis._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{dis.raisedBy?.name} ({dis.raisedBy?.role})</td>
                        <td style={{ padding: '12px' }}>{dis.category}</td>
                        <td style={{ padding: '12px' }}>{dis.description}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '50px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            background: dis.status === 'resolved' ? 'rgba(40,167,69,0.1)' : 'rgba(253,126,20,0.1)',
                            color: dis.status === 'resolved' ? 'var(--accent-green)' : 'var(--accent-orange)'
                          }}>{dis.status}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {dis.status === 'pending' ? (
                            <button onClick={() => handleResolveDisputeClick(dis)} className="action-btn" style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--accent-gradient)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                              Resolve Ticket
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No Action</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Resolve Ticket Dialog Modal */}
      {showResolveModal && (
        <div className="modal-overlay" style={{
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
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '15px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Resolve Support Ticket</h3>
              <i className="fas fa-times-circle" onClick={() => setShowResolveModal(false)} style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }} />
            </div>

            <form onSubmit={handleResolveDisputeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                <strong>Issue description:</strong> "{selectedDispute?.description}"
              </div>
              <div className="input-group">
                <label>Resolution Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Provide resolution details or settlement notes..."
                  required
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', minHeight: '100px' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-gradient)' }}
              >
                Mark Resolved
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AdminDashboard;
