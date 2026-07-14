import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Security from '../../components/Security';
import HealthCategories from '../../components/HealthCategories';
import ParticlesBackground from '../../components/ParticlesBackground';
import CustomCursor from '../../components/CustomCursor';
import SirenEffectContainer from '../../components/SirenEffectContainer';
import LoadingScreen from '../../components/LoadingScreen';

const Home = () => {
  const [sirenEvents, setSirenEvents] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleSiren = useCallback((x, y) => {
    // Avoid triggering siren on interactive elements
    const el = document.elementFromPoint(x, y);
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.closest('.nav-item') || el.closest('.btn') || el.closest('.profile-btn') || el.closest('.dropdown-item'))) return;
    setSirenEvents(prev => [...prev, { x, y, id: Date.now() }]);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const coreFeatures = [
    {
      title: "Health Records Management",
      description: "Comprehensive health information tracking system that allows you to store, organize, and access all your medical data in one secure location. Track vitals, medications, and clinical logs easily.",
      icon: "fas fa-file-medical-alt",
      floatingIcons: ["fas fa-notes-medical", "fas fa-clipboard-list", "fas fa-file-medical"],
      page: "/stats"
    },
    {
      title: "Smart Reminders",
      description: "Intelligent notification system designed to help you stay on top of your healthcare needs. Configure medication dosages, timing, and physician checkup schedules.",
      icon: "fas fa-bell",
      floatingIcons: ["fas fa-clock", "fas fa-calendar-alt", "fas fa-mobile-alt"],
      page: "/reminders"
    },
    {
      title: "Diet Generator",
      description: "Personalized meal planning system that creates custom diets based on your health conditions, age, weight, and food preferences. Track nutrients and calorie thresholds.",
      icon: "fas fa-apple-alt",
      floatingIcons: ["fas fa-carrot", "fas fa-lemon", "fas fa-pepper-hot"],
      page: "/diet"
    },
    {
      title: "Daily Symptom Tracker",
      description: "Dynamic daily symptom logging interface that allows you to record and monitor your health symptoms in real-time. Identify triggers and sync reports to doctors.",
      icon: "fas fa-clipboard-check",
      floatingIcons: ["fas fa-thermometer-half", "fas fa-head-side-virus", "fas fa-lungs"],
      page: "/symptoms"
    },
    {
      title: "Health Trends",
      description: "Visualize your health metrics over time with our comprehensive health trends analysis. Compare long-term patterns and generate reports for consultations.",
      icon: "fas fa-chart-line",
      floatingIcons: ["fas fa-chart-bar", "fas fa-chart-pie", "fas fa-chart-area"],
      page: "/trends"
    },
    {
      title: "Health AI Coach",
      description: "Personalized health guidance powered by artificial intelligence to help you achieve your wellness goals. Access evidence-based recommendations 24/7.",
      icon: "fas fa-robot",
      floatingIcons: ["fas fa-brain", "fas fa-comments-medical", "fas fa-dumbbell"],
      page: "/ai-coach"
    },
    {
      title: "Book a Doctor",
      description: "Search, filter, and schedule physical or virtual consultations with verified doctors in real-time. View availability, ratings, and fees instantly.",
      icon: "fas fa-user-md",
      floatingIcons: ["fas fa-calendar-check", "fas fa-stethoscope", "fas fa-hospital"],
      page: "/doctors"
    },
    {
      title: "Drug Interaction Checker",
      description: "Double-check safety combinations of multiple drug products using our built-in analyzer. Identify dangerous interactions before they happen.",
      icon: "fas fa-pills",
      floatingIcons: ["fas fa-capsules", "fas fa-flask", "fas fa-prescription-bottle"],
      page: "/drug-checker"
    }
  ];

  const handleCardClick = (page) => {
    navigate(page);
  };

  return (
    <>
      <div 
        className="dynamic-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(220, 53, 69, 0.05) 0%, transparent 50%), radial-gradient(circle at ${window.innerWidth - mousePosition.x}px ${window.innerHeight - mousePosition.y}px, rgba(0, 123, 255, 0.05) 0%, transparent 50%)`,
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      
      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
      <ParticlesBackground />
      <CustomCursor onSiren={handleSiren} />
      <SirenEffectContainer sirenEvents={sirenEvents} />
      <LoadingScreen />
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section id="home" className="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px', overflow: 'hidden', background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 50%, #e6f7ff 100%)' }}>
          <div className="hero-content" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <div className="container">
              <div className="hero-text" style={{ animation: 'fadeInUp 1.2s ease-out forwards', opacity: 1, transform: 'translateY(0)' }}>
                <div className="hero-badge" style={{ display: 'inline-flex', gap: '8px', padding: '6px 12px', background: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.2)', borderRadius: '50px', fontSize: '13px', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  <i className="fas fa-play" style={{ fontSize: '0.8rem', marginTop: '2px' }}></i>
                  <span>Manage Your Health</span>
                </div>
                <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '1.5rem', fontFamily: 'Montserrat, sans-serif' }}>
                  <span style={{ display: 'block' }}>PERSONAL HEALTH</span>
                  <span className="red-text" style={{ display: 'block' }}>RECORDS PORTAL</span>
                </h1>
                <p className="hero-description" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '650px', marginBottom: '2.5rem' }}>
                  Track your medical logs, diet schedules, appointments, and symptoms in our highly secure, HIPAA-compliant patient dashboard.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/login')} className="btn btn-primary">
                    Get Started <i className="fas fa-user-plus" style={{ marginLeft: '6px' }}></i>
                  </button>
                  <button onClick={() => navigate('/doctors')} className="btn btn-secondary">
                    Consult a Doctor <i className="fas fa-user-md" style={{ marginLeft: '6px' }}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="core-features" className="core-features-section" style={{ padding: '8rem 0', background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-darker) 100%)' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div className="section-badge" style={{ display: 'inline-flex', gap: '8px', padding: '6px 12px', border: '1px solid var(--border-subtle)', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '10px' }}>
                <i className="fas fa-star"></i>
                <span>Core Features</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Powerful <span className="gradient-text">Health Tools</span></h2>
              <p style={{ color: 'var(--text-secondary)' }}>All features you need to manage your personal health records effectively.</p>
            </div>
            
            <div className="core-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
              {coreFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="core-feature-card"
                  onClick={() => handleCardClick(feature.page)}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(220,53,69,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(220,53,69,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'fadeInUp 0.8s ease forwards',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(220, 53, 69, 0.1)',
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    marginBottom: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}>
                    <i className={feature.icon}></i>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.2rem' }}>{feature.description}</p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Open <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HealthCategories />
        <Security />
      </main>
      
      <Footer />
    </>
  );
};

export default Home;
