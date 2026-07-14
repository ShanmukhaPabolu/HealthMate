import React, { useEffect, useRef, useState } from 'react';

const Security = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const securityFeatures = [
    {
      icon: "fas fa-lock",
      title: "Encrypted Storage",
      subtitle: "AES-256 Protection",
      description: "All sensitive medical files and health profiles are encrypted at rest and in transit.",
      features: ["AES-256 Protocol", "TLS 1.3 Transmission", "Secure Cloud Storage", "Regular Pen Testing"]
    },
    {
      icon: "fas fa-user-shield",
      title: "Granular Controls",
      subtitle: "Role-Based Security",
      description: "Control who accesses your records with temporary token link permissions.",
      features: ["Consent Verification", "Doctor Time Limit", "Access Authorization", "Revoke Tokens"]
    },
    {
      icon: "fas fa-file-contract",
      title: "HIPAA Compliant",
      subtitle: "Regulatory Standard",
      description: "Fully compliant architecture supporting medical confidentiality standards.",
      features: ["HIPAA Certified", "GDPR Data Policies", "Audit Trails", "Compliant Logs"]
    }
  ];

  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  return (
    <section id="security" className="security-section" ref={sectionRef} style={{ padding: '8rem 0', position: 'relative' }}>
      <div className="container">
        <div className={`section-header ${isVisible ? 'animate-in' : ''}`} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-badge" style={{ display: 'inline-flex', gap: '8px', padding: '6px 12px', border: '1px solid var(--border-subtle)', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '10px' }}>
            <i className="fas fa-shield-alt"></i>
            <span>Security & Compliance</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Your Data is <span className="gradient-text">Safe & Secure</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>We employ industry-leading standards to safeguard your private health records.</p>
        </div>
        <div className="security-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="security-card"
              onMouseMove={(e) => handleMouseMove(e, index)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '2.5rem',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div className="security-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <i className={`${feature.icon} security-icon`} style={{ fontSize: '2rem', color: 'var(--accent-color)' }}></i>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{feature.title}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{feature.subtitle}</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{feature.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {feature.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <i className="fas fa-check" style={{ color: 'var(--accent-green)' }}></i>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
