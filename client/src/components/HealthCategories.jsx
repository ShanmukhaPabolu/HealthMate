import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HealthCategories = () => {
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  const healthCategories = [
    {
      title: "Allergies",
      subtitle: "Comprehensive Allergy Tracking",
      description: "Document all your allergies, including food, medication, and environmental triggers. Track reaction history and severity levels.",
      image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80",
      features: ["Allergy Types", "Reaction Severity", "Trigger Identification", "Emergency Protocols"],
      page: "/profile"
    },
    {
      title: "Vitals",
      subtitle: "Monitor Your Health Metrics",
      description: "Track and visualize your vital signs over time. Monitor blood pressure, heart rate, temperature, and other important metrics.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
      features: ["Blood Pressure", "Heart Rate", "Temperature", "Weight Tracking"],
      page: "/stats"
    },
    {
      title: "Treatments",
      subtitle: "Medical Treatment History",
      description: "Keep a complete record of all your medical treatments, procedures, and therapies. Track outcomes and follow-up care.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      features: ["Treatment History", "Procedure Records", "Outcome Tracking", "Follow-up Care"],
      page: "/profile"
    },
    {
      title: "Vaccinations",
      subtitle: "Immunization Management",
      description: "Maintain a complete record of all your vaccinations. Track due dates for boosters and stay current with immunizations.",
      image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80",
      features: ["Vaccination History", "Due Date Tracking", "Certificate Storage", "Travel Requirements"],
      page: "/profile"
    }
  ];

  const handleMouseMoveCard = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  return (
    <section id="health-categories" className="health-categories-section" style={{ padding: '8rem 0' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-badge" style={{ display: 'inline-flex', gap: '8px', padding: '6px 12px', border: '1px solid var(--border-subtle)', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '10px' }}>
            <i className="fas fa-notes-medical"></i>
            <span>Health Categories</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Organize Your <span className="gradient-text">Health Information</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Categorize and manage all aspects of your wellness records in one dashboard.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', flexWrap: 'wrap' }}>
          {healthCategories.map((category, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="health-category-card"
              onMouseMove={(e) => handleMouseMoveCard(e, index)}
              onClick={() => navigate(category.page)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(220,53,69,0.18)';
                e.currentTarget.style.borderColor = 'rgba(220,53,69,0.35)';
                e.currentTarget.style.cursor = 'pointer';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                gap: '20px',
                padding: '20px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '120px', height: '100%', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={category.image} alt={category.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>{category.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600', marginBottom: '8px' }}>{category.subtitle}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>{category.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {category.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-check" style={{ color: 'var(--accent-color)', fontSize: '0.7rem' }}></i>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthCategories;
