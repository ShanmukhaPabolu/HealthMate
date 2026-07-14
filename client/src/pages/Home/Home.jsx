import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// ─── Data ────────────────────────────────────────────────────────────────────

const TRUST_STATS = [
  { icon: 'fas fa-user-md', value: '500+', label: 'Verified Doctors' },
  { icon: 'fas fa-users', value: '50K+', label: 'Patients Served' },
  { icon: 'fas fa-star', value: '4.9★', label: 'Average Rating' },
  { icon: 'fas fa-shield-alt', value: '100%', label: 'HIPAA Compliant' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: 'fas fa-search',
    title: 'Search & Filter',
    desc: 'Browse verified doctors by specialty, location, rating, and availability. No login required to explore.',
    color: '#007bff',
  },
  {
    step: '02',
    icon: 'fas fa-calendar-check',
    title: 'Book a Slot',
    desc: 'Pick your preferred date and time slot. See real-time availability. Instant booking confirmation.',
    color: '#28a745',
  },
  {
    step: '03',
    icon: 'fas fa-video',
    title: 'Consult Securely',
    desc: 'Attend your consultation in-person or via our built-in video call. Chat directly with your doctor.',
    color: '#6f42c1',
  },
  {
    step: '04',
    icon: 'fas fa-chart-line',
    title: 'Track Your Health',
    desc: 'Log vitals, diet, symptoms, and medication reminders. Visualize trends with interactive charts.',
    color: '#dc3545',
  },
];

const FEATURES = [
  { icon: 'fas fa-user-md', title: 'Doctor Booking', desc: 'Search 500+ specialists filtered by expertise, fee, rating, and location. Real-time slot availability.', link: '/doctors', color: '#007bff' },
  { icon: 'fas fa-robot', title: 'AI Health Coach', desc: 'Get personalized guidance on diet, exercise, and symptoms from your AI-powered health advisor.', link: '/ai-coach', color: '#6f42c1' },
  { icon: 'fas fa-clipboard-check', title: 'Symptom Tracker', desc: 'Log daily symptoms with severity and duration. Share reports directly with your doctor.', link: '/symptoms', color: '#28a745' },
  { icon: 'fas fa-apple-alt', title: 'Diet Tracker', desc: 'Generate and follow personalized meal plans. Track calories, macros, and nutrition daily.', link: '/diet', color: '#fd7e14' },
  { icon: 'fas fa-pills', title: 'Drug Checker', desc: 'Check drug interactions before combining medications. Safety first, always.', link: '/drug-checker', color: '#dc3545' },
  { icon: 'fas fa-chart-line', title: 'Health Trends', desc: 'Visualize your health metrics — water intake, sleep, vitals — in interactive charts over time.', link: '/trends', color: '#17a2b8' },
];

const SPECIALTIES = [
  { name: 'Cardiology', icon: 'fas fa-heartbeat', color: '#dc3545', bg: '#fff5f5' },
  { name: 'Dermatology', icon: 'fas fa-allergies', color: '#fd7e14', bg: '#fff8f0' },
  { name: 'Neurology', icon: 'fas fa-brain', color: '#6f42c1', bg: '#f5f0ff' },
  { name: 'Orthopedics', icon: 'fas fa-bone', color: '#28a745', bg: '#f0fff4' },
  { name: 'Pediatrics', icon: 'fas fa-baby', color: '#007bff', bg: '#f0f8ff' },
  { name: 'Psychiatry', icon: 'fas fa-comments', color: '#17a2b8', bg: '#f0feff' },
  { name: 'Ophthalmology', icon: 'fas fa-eye', color: '#e83e8c', bg: '#fff0f8' },
  { name: 'General Medicine', icon: 'fas fa-stethoscope', color: '#20c997', bg: '#f0fffa' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Patient', rating: 5, text: 'Found a specialist within minutes. The video consultation was seamless and the doctor was incredibly thorough. My go-to health platform now.', avatar: 'PS' },
  { name: 'Ravi Kumar', role: 'Patient', rating: 5, text: 'The AI coach helped me understand my lab reports and recommended the right diet plan. I have lost 8kg in 3 months following its guidance.', avatar: 'RK' },
  { name: 'Ananya Reddy', role: 'Patient', rating: 5, text: 'Setting medication reminders and tracking my symptoms has made managing my chronic condition so much easier. Excellent platform.', avatar: 'AR' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const Star = ({ filled }) => (
  <i className="fas fa-star" style={{ color: filled ? '#ffc107' : '#e9ecef', fontSize: '0.85rem' }} />
);

// ─── Component ────────────────────────────────────────────────────────────────

const Home = () => {
  const navigate = useNavigate();
  const [doctorCount, setDoctorCount] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredSpecialty, setHoveredSpecialty] = useState(null);

  useEffect(() => {
    // Fetch live doctor count for the hero stat
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (data.success) setDoctorCount(data.count);
      } catch {
        // fail silently — stat will show default
      }
    };
    fetchCount();
  }, []);

  return (
    <>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #f0f8ff 100%)',
        paddingTop: '90px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,53,69,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,123,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {/* Left — copy */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)',
                borderRadius: '50px', padding: '6px 16px', marginBottom: '1.5rem',
                fontSize: '0.85rem', fontWeight: 700, color: '#dc3545'
              }}>
                <i className="fas fa-heartbeat" />
                <span>India's Trusted Health Platform</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-1px',
                marginBottom: '1.5rem',
                color: '#212529'
              }}>
                Your Health,<br />
                <span style={{
                  background: 'linear-gradient(135deg, #dc3545, #c82333)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Reimagined.</span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: '#6c757d',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '520px'
              }}>
                Book verified doctors, track your vitals, manage medications, and get AI-powered health guidance — all in one secure, HIPAA-compliant platform.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link to="/doctors" style={{
                  padding: '1rem 2.2rem',
                  background: 'linear-gradient(135deg, #dc3545, #c82333)',
                  color: 'white',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(220,53,69,0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,53,69,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(220,53,69,0.3)'; }}
                >
                  <i className="fas fa-user-md" />
                  Book a Doctor
                </Link>
                <Link to="/login" style={{
                  padding: '1rem 2.2rem',
                  background: 'transparent',
                  color: '#212529',
                  border: '2px solid rgba(0,0,0,0.15)',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'border-color 0.2s, color 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc3545'; e.currentTarget.style.color = '#dc3545'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.color = '#212529'; }}
                >
                  <i className="fas fa-sign-in-alt" />
                  Get Started Free
                </Link>
              </div>

              {/* Mini social proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex' }}>
                  {['A', 'B', 'C', 'D'].map((l, i) => (
                    <div key={i} style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: ['#dc3545', '#007bff', '#28a745', '#6f42c1'][i],
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 800,
                      marginLeft: i > 0 ? '-10px' : 0,
                      border: '2px solid white'
                    }}>
                      {['P', 'R', 'A', 'S'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} filled />)}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#6c757d', margin: 0 }}>
                    Trusted by <strong style={{ color: '#212529' }}>{doctorCount ? `${doctorCount}+` : '50,000+'}</strong> patients
                  </p>
                </div>
              </div>
            </div>

            {/* Right — visual card stack */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              {/* Main card */}
              <div style={{
                background: 'white',
                borderRadius: '28px',
                padding: '32px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.12)',
                width: '100%',
                maxWidth: '380px',
                position: 'relative',
                zIndex: 2
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #dc3545, #c82333)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.3rem' }}>
                    <i className="fas fa-user-md" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#212529' }}>Dr. Priya Nair</div>
                    <div style={{ fontSize: '0.8rem', color: '#dc3545', fontWeight: 600 }}>Cardiologist · 12 yrs exp</div>
                  </div>
                  <div style={{ marginLeft: 'auto', background: '#e8f5e9', color: '#28a745', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>
                    ✓ Available
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                  {['4.9 ★', '2,400+ pts', '₹500 fee'].map((s, i) => (
                    <div key={i} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#212529' }}>{s}</div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                  {['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'].map((slot, i) => (
                    <button key={i} style={{
                      padding: '10px', borderRadius: '12px',
                      border: i === 0 ? '2px solid #dc3545' : '1px solid #e9ecef',
                      background: i === 0 ? '#fff5f5' : 'transparent',
                      color: i === 0 ? '#dc3545' : '#6c757d',
                      fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                    }}>{slot}</button>
                  ))}
                </div>

                <button onClick={() => navigate('/doctors')} style={{
                  width: '100%', padding: '14px',
                  background: 'linear-gradient(135deg, #dc3545, #c82333)',
                  color: 'white', border: 'none', borderRadius: '14px',
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer'
                }}>
                  Book Consultation <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }} />
                </button>
              </div>

              {/* Floating badge — appointment confirmed */}
              <div style={{
                position: 'absolute', bottom: '-16px', left: '-24px',
                background: 'white', borderRadius: '16px', padding: '14px 18px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex',
                alignItems: 'center', gap: '10px', zIndex: 3
              }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#28a745', fontSize: '1rem' }}>
                  <i className="fas fa-check-circle" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#212529' }}>Appointment Confirmed!</div>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>Email confirmation sent</div>
                </div>
              </div>

              {/* Floating badge — AI Coach */}
              <div style={{
                position: 'absolute', top: '-16px', right: '-20px',
                background: 'linear-gradient(135deg, #6f42c1, #59359a)',
                borderRadius: '16px', padding: '14px 18px',
                boxShadow: '0 8px 32px rgba(111,66,193,0.3)', display: 'flex',
                alignItems: 'center', gap: '10px', zIndex: 3
              }}>
                <i className="fas fa-robot" style={{ color: 'white', fontSize: '1.2rem' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white' }}>AI Coach</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)' }}>24/7 guidance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────── */}
      <section style={{ background: '#212529', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {TRUST_STATS.map((s, i) => (
              <div key={i}>
                <div style={{ color: '#dc3545', fontSize: '1.5rem', marginBottom: '8px' }}>
                  <i className={s.icon} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: '#adb5bd', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section style={{ padding: '7rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)', borderRadius: '50px', padding: '6px 16px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 700, color: '#dc3545' }}>
              <i className="fas fa-route" />
              <span>Simple Process</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#212529', marginBottom: '1rem' }}>
              How <span style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>HealthMate</span> Works
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6c757d', maxWidth: '560px', margin: '0 auto' }}>
              From finding the right doctor to tracking your recovery — four simple steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', position: 'relative' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '24px',
                  background: `${step.color}12`, border: `2px solid ${step.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.2rem',
                  color: step.color, fontSize: '1.8rem'
                }}>
                  <i className={step.icon} />
                </div>
                <div style={{
                  position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(calc(-50% + 30px))',
                  background: step.color, color: 'white', borderRadius: '50%',
                  width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 900
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#212529', marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.92rem', color: '#6c757d', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ──────────────────────────────────────────────── */}
      <section style={{ padding: '7rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)', borderRadius: '50px', padding: '6px 16px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 700, color: '#dc3545' }}>
              <i className="fas fa-star" />
              <span>Everything You Need</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#212529', marginBottom: '1rem' }}>
              Powerful <span style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Health Tools</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6c757d', maxWidth: '520px', margin: '0 auto' }}>
              A complete health management ecosystem — not just appointments, but your whole wellness journey.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <Link
                key={i}
                to={f.link}
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '28px',
                  border: hoveredFeature === i ? `2px solid ${f.color}` : '2px solid transparent',
                  boxShadow: hoveredFeature === i ? `0 16px 48px ${f.color}20` : '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.25s ease',
                  transform: hoveredFeature === i ? 'translateY(-6px)' : 'translateY(0)',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: `${f.color}12`, color: f.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', marginBottom: '16px'
                  }}>
                    <i className={f.icon} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#212529', marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#6c757d', lineHeight: 1.6, marginBottom: '16px' }}>{f.desc}</p>
                  <span style={{ fontSize: '0.85rem', color: f.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Explore <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCTOR SPECIALTIES ─────────────────────────────────────────── */}
      <section style={{ padding: '7rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#212529', marginBottom: '1rem' }}>
              Browse by <span style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Specialty</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>Find the right specialist for every health concern.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {SPECIALTIES.map((s, i) => (
              <Link
                key={i}
                to={`/doctors?specialization=${encodeURIComponent(s.name)}`}
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredSpecialty(i)}
                onMouseLeave={() => setHoveredSpecialty(null)}
              >
                <div style={{
                  background: hoveredSpecialty === i ? s.bg : 'white',
                  border: hoveredSpecialty === i ? `2px solid ${s.color}40` : '2px solid #f0f0f0',
                  borderRadius: '16px', padding: '20px 12px',
                  textAlign: 'center', transition: 'all 0.2s ease',
                  transform: hoveredSpecialty === i ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredSpecialty === i ? `0 8px 24px ${s.color}20` : 'none',
                  cursor: 'pointer'
                }}>
                  <div style={{ color: s.color, fontSize: '1.8rem', marginBottom: '10px' }}>
                    <i className={s.icon} />
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#212529' }}>{s.name}</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/doctors" style={{
              padding: '0.85rem 2.5rem',
              background: 'transparent',
              color: '#dc3545',
              border: '2px solid #dc3545',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.95rem'
            }}>
              View All Doctors <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section style={{ padding: '7rem 0', background: 'linear-gradient(135deg, #fff5f5 0%, #f8f9fa 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)', borderRadius: '50px', padding: '6px 16px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 700, color: '#dc3545' }}>
              <i className="fas fa-quote-left" />
              <span>Patient Stories</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#212529', marginBottom: '0.5rem' }}>
              What Our <span style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Patients Say</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#adb5bd' }}>
              {/* TODO: Wire to real reviews from /api/reviews once GET endpoint is added */}
              Sample testimonials — real reviews coming soon.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '20px', padding: '28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.06)'
              }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} filled={s <= t.rating} />)}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#495057', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #dc3545, #c82333)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.9rem'
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#212529', fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 50%, #a71d2a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>
            Ready to Take Control of Your Health?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
            Join thousands of patients who have transformed their health journey with HealthMate.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{
              padding: '1rem 2.5rem', background: 'white', color: '#dc3545',
              borderRadius: '50px', textDecoration: 'none', fontWeight: 800,
              fontSize: '1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              <i className="fas fa-user-plus" style={{ marginRight: '8px' }} />
              Create Free Account
            </Link>
            <Link to="/doctors" style={{
              padding: '1rem 2.5rem', background: 'transparent', color: 'white',
              border: '2px solid rgba(255,255,255,0.6)', borderRadius: '50px',
              textDecoration: 'none', fontWeight: 700, fontSize: '1rem'
            }}>
              <i className="fas fa-user-md" style={{ marginRight: '8px' }} />
              Find a Doctor
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
