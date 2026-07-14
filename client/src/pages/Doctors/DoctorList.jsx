import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { SkeletonGrid } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const DoctorList = () => {
  const { triggerToast } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read initial specialization from URL search params
  const initialSpecialization = searchParams.get('specialization') || '';

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState(initialSpecialization);
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState('');
  const [feeMin, setFeeMin] = useState('');
  const [feeMax, setFeeMax] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('highest-rated');

  // Update URL search parameters when filters change
  useEffect(() => {
    const params = {};
    if (specialization) params.specialization = specialization;
    setSearchParams(params);
  }, [specialization, setSearchParams]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSpecialization('');
    setExperience('');
    setRating('');
    setFeeMin('');
    setFeeMax('');
    setGender('');
    setLocation('');
    setSort('highest-rated');
  };

  return (
    <>
      <Header />
      
      <main style={{ paddingTop: '100px', minHeight: '80vh', background: 'var(--clr-gray-50)' }}>
        <div className="container" style={{ paddingBottom: '4rem' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '6px' }}>
              Find a <span className="gradient-text">Doctor</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Search, filter, and schedule appointments with top verified medical specialists.
            </p>
          </div>

          {/* Search Bar & Filter layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'start' }}>
            
            {/* Left sidebar filters */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Filters</h3>
                <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: 'var(--clr-primary)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                  Clear All
                </button>
              </div>
              
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select
                  className="form-select"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Hospital</label>
                <input
                  type="text"
                  className="form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. City General"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min Experience (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Doctor Gender</label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Any Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fee Range (₹)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    className="form-input"
                    value={feeMin}
                    onChange={(e) => setFeeMin(e.target.value)}
                    placeholder="Min"
                  />
                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                  <input
                    type="number"
                    className="form-input"
                    value={feeMax}
                    onChange={(e) => setFeeMax(e.target.value)}
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sort By</label>
                <select
                  className="form-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="highest-rated">Highest Rated</option>
                  <option value="popularity">Most Popular</option>
                  <option value="lowest-fee">Fee: Low to High</option>
                  <option value="highest-fee">Fee: High to Low</option>
                  <option value="most-experienced">Most Experienced</option>
                  <option value="newest">Newly Registered</option>
                </select>
              </div>
            </div>

            {/* Right List Panel */}
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="card" style={{ display: 'flex', gap: '12px', padding: '16px', background: 'white' }}>
                <input
                  type="text"
                  className="form-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Doctor name, hospital, clinic, or keywords..."
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', borderRadius: '12px' }}>
                  <i className="fas fa-search" /> Search
                </button>
              </form>

              {loading ? (
                <SkeletonGrid cards={6} />
              ) : doctors.length === 0 ? (
                <EmptyState
                  icon="fas fa-user-md-slash"
                  title="No Doctors Found"
                  description="We couldn't find any verified specialists matching your criteria. Try adjusting your filters."
                  actionText="Clear All Filters"
                  onActionClick={handleClearFilters}
                />
              ) : (
                <div className="grid-auto">
                  {doctors.map((doc) => (
                    <div
                      key={doc._id}
                      className="card card-hover"
                      onClick={() => navigate(`/doctor/${doc._id}`)}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        background: 'white'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', background: 'var(--clr-gray-100)', flexShrink: 0 }}>
                          <img
                            src={doc.profilePhoto || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80'}
                            alt={doc.user?.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--clr-gray-900)' }}>
                            Dr. {doc.user?.name}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--clr-primary)', fontWeight: 700 }}>
                            {doc.specialization}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className="fas fa-graduation-cap" style={{ width: '18px', color: 'var(--text-muted)' }} />
                          <span>{doc.qualification}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className="fas fa-briefcase" style={{ width: '18px', color: 'var(--text-muted)' }} />
                          <span>{doc.experience} Years Experience</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className="fas fa-hospital" style={{ width: '18px', color: 'var(--text-muted)' }} />
                          <span>{doc.hospital}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className="fas fa-wallet" style={{ width: '18px', color: 'var(--text-muted)' }} />
                          <span>Consultation fee: <strong style={{ color: 'var(--clr-gray-900)' }}>₹{doc.consultationFee}</strong></span>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700 }}>
                          <i className="fas fa-star" style={{ color: 'var(--clr-yellow)' }} />
                          <span>{doc.ratings.toFixed(1)} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({doc.reviewsCount} reviews)</span></span>
                        </div>
                        {doc.isVerified && (
                          <span className="badge badge-success">
                            <i className="fas fa-check-circle" /> VERIFIED
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
