import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: '#1a1d21',
      color: '#adb5bd',
      paddingTop: '5rem'
    }}>
      <div className="container">
        {/* Top grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          paddingBottom: '3.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '1.2rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #dc3545, #c82333)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '1.1rem'
              }}>
                <i className="fas fa-heartbeat" />
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'white', letterSpacing: '-0.5px' }}>HealthMate</span>
            </Link>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem', color: '#6c757d', maxWidth: '260px' }}>
              India's trusted platform for doctor bookings, health tracking, and AI-powered wellness guidance.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: 'fab fa-facebook-f', href: '#', label: 'Facebook' },
                { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
                { icon: 'fab fa-instagram', href: '#', label: 'Instagram' },
                { icon: 'fab fa-linkedin-in', href: '#', label: 'LinkedIn' },
              ].map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label} style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)', color: '#adb5bd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', textDecoration: 'none',
                  transition: 'background 0.2s, color 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#dc3545'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#adb5bd'; }}
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, marginBottom: '1.2rem', fontSize: '0.95rem', letterSpacing: '0.5px' }}>PLATFORM</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Find a Doctor', to: '/doctors' },
                { label: 'Book Appointment', to: '/doctors' },
                { label: 'AI Health Coach', to: '/ai-coach' },
                { label: 'Drug Checker', to: '/drug-checker' },
                { label: 'Health Trends', to: '/trends' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ color: '#6c757d', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#dc3545'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6c757d'}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Patient tools */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, marginBottom: '1.2rem', fontSize: '0.95rem', letterSpacing: '0.5px' }}>HEALTH TOOLS</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Symptom Tracker', to: '/symptoms' },
                { label: 'Diet Planner', to: '/diet' },
                { label: 'Reminders', to: '/reminders' },
                { label: 'Health Stats', to: '/stats' },
                { label: 'My Dashboard', to: '/dashboard' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ color: '#6c757d', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#dc3545'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6c757d'}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal & contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, marginBottom: '1.2rem', fontSize: '0.95rem', letterSpacing: '0.5px' }}>COMPANY</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
              {[
                { label: 'About Us', to: '/' },
                { label: 'Privacy Policy', to: '/' },
                { label: 'Terms of Service', to: '/' },
                { label: 'HIPAA Compliance', to: '/' },
                { label: 'Contact Support', to: '/' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ color: '#6c757d', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#dc3545'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6c757d'}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#6c757d' }}>
              <i className="fas fa-envelope" style={{ color: '#dc3545' }} />
              <a href="mailto:support@healthmate.in" style={{ color: '#6c757d', textDecoration: 'none' }}>
                support@healthmate.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.5rem 0', flexWrap: 'wrap', gap: '1rem'
        }}>
          <p style={{ fontSize: '0.82rem', margin: 0 }}>
            © {year} <strong style={{ color: 'white' }}>HealthMate</strong>. All rights reserved. Built with ❤️ for better healthcare.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
            <i className="fas fa-shield-alt" style={{ color: '#28a745' }} />
            <span>256-bit SSL Encrypted</span>
            <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
            <i className="fas fa-lock" style={{ color: '#28a745' }} />
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
