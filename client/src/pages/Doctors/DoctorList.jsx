import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const DoctorList = () => {
  const { triggerToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [sirenEvents, setSirenEvents] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState('');
  const [feeMin, setFeeMin] = useState('');
  const [feeMax, setFeeMax] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('highest-rated');

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (specialization) params.specialization = specialization;
      if (experience) params.experience = experience;
      if (rating) params.rating = rating;
      if (feeMin) params.feeMin = feeMin;
      if (feeMax) params.feeMax = feeMax;
      if (gender) params.gender = gender;
      if (location) params.location = location;
      if (sort) params.sort = sort;

      const response = await api.get('/doctors', { params });
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to load doctors list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, experience, rating, feeMin, feeMax, gender, location, sort]);

  const handleSiren = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.profile-btn') || el.closest('.doctor-card'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1" style={{ background: 'radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)' }}></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
      <ParticlesBackground />
      <CustomCursor onSiren={handleSiren} />
      <SirenEffectContainer sirenEvents={sirenEvents} />
      <LoadingScreen text="CONSULT SPECIALISTS" subtitle="Book appointments in real-time" />
      
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '40px' }}>Search Verified <span className="gradient-text">Medical Specialists</span></h1>

          {/* Search Bar & Filter layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', alignItems: 'start' }}>
            
            {/* Left sidebar filters */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '25px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>Filters</h3>
              
              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'white' }}
                >
                  <option value="">All Specialities</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Neurologist">Neurologist</option>
                </select>
              </div>

              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Location / City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Los Angeles, NY"
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'white' }}
                />
              </div>

              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Min Experience (Years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 5"
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}
                />
              </div>

              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'white' }}
                >
                  <option value="">Any Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Consultation Fee ($)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={feeMin}
                    onChange={(e) => setFeeMin(e.target.value)}
                    placeholder="Min"
                    style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '80px' }}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={feeMax}
                    onChange={(e) => setFeeMax(e.target.value)}
                    placeholder="Max"
                    style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '80px' }}
                  />
                </div>
              </div>

              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'white' }}
                >
                  <option value="highest-rated">Highest Rated</option>
                  <option value="popularity">Most Patients</option>
                  <option value="lowest-fee">Lowest Fee</option>
                  <option value="highest-fee">Highest Fee</option>
                  <option value="most-experienced">Most Experienced</option>
                </select>
              </div>
            </div>

            {/* Right doctors grid list */}
            <div>
              {/* Search Submit */}
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Doctor name, hospital, clinic, or specialization..."
                  style={{ flex: 1, padding: '14px 20px', borderRadius: '15px', border: '1px solid var(--border-subtle)', background: 'white', fontSize: '15px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '14px 30px', borderRadius: '15px' }}>
                  Search
                </button>
              </form>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <i className="fas fa-heartbeat fa-spin" style={{ fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '15px' }}></i>
                  <p>Searching verified profiles...</p>
                </div>
              ) : doctors.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 0',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '24px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <i className="fas fa-user-md-slash" style={{ fontSize: '4rem', color: 'var(--text-muted)', marginBottom: '20px' }}></i>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No Doctors Found</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Try modifying your filters or search keywords.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                  {doctors.map((doc) => (
                    <div
                      key={doc._id}
                      className="doctor-card"
                      onClick={() => navigate(`/doctor/${doc._id}`)}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '20px',
                        padding: '25px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ width: '65px', height: '65px', borderRadius: '50%', overflow: 'hidden', background: '#e9ecef', flexShrink: 0 }}>
                          <img
                            src={doc.profilePhoto || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80'}
                            alt={doc.user?.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Dr. {doc.user?.name}</h4>
                          <span style={{ fontSize: '13px', color: 'var(--accent-color)', fontWeight: 'bold' }}>{doc.specialization}</span>
                        </div>
                      </div>

                      <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span><i className="fas fa-graduation-cap" style={{ width: '20px' }}></i> {doc.qualification}</span>
                        <span><i className="fas fa-briefcase" style={{ width: '20px' }}></i> {doc.experience} Years Experience</span>
                        <span><i className="fas fa-hospital" style={{ width: '20px' }}></i> {doc.hospital}</span>
                        <span><i className="fas fa-wallet" style={{ width: '20px' }}></i> <strong>${doc.consultationFee}</strong> Consultation Fee</span>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                          <i className="fas fa-star" style={{ color: '#FFC107' }}></i>
                          <span>{doc.ratings} ({doc.reviewsCount} Reviews)</span>
                        </div>
                        {doc.isVerified && (
                          <span style={{ fontSize: '11px', background: 'rgba(40,167,69,0.1)', color: 'var(--accent-green)', padding: '3px 8px', borderRadius: '50px', fontWeight: 'bold' }}>
                            <i className="fas fa-check-circle"></i> VERIFIED
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
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

export default DoctorList;
