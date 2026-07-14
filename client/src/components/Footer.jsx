import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="/" className="footer-logo">
                <i className="fas fa-heartbeat logo-icon"></i>
                <span>HEALTH TRACKER</span>
              </a>
              <p className="footer-description">
                Manage your personal health records, consult verified doctors, and track your daily diet and symptoms securely in one place.
              </p>
              <div className="social-links">
                <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Features</h4>
                <a href="#">Health Records</a>
                <a href="#">Diet Planner</a>
                <a href="#">Medication Alerts</a>
                <a href="#">Doctor Consultations</a>
              </div>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Security</h4>
                <a href="#">Data Encryption</a>
                <a href="#">Privacy Policy</a>
                <a href="#">HIPAA Compliance</a>
                <a href="#">Audit Logs</a>
              </div>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Support Center</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} HealthTracker Pro. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
