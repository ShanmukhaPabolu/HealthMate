import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileDropdownOpen && !e.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isDoctor = user && user.role === 'doctor';
  const isAdmin = user && user.role === 'admin';
  const isPatient = user && user.role === 'patient';

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <i className="fas fa-heartbeat logo-icon"></i>
            <span>{isDoctor ? 'DOCTOR PORTAL' : isAdmin ? 'ADMIN PORTAL' : 'HEALTH TRACKER'}</span>
          </Link>

          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-item">
              <i className="fas fa-home"></i> Home
            </Link>

            {isPatient && (
              <>
                <Link to="/dashboard" className="nav-item">
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
                <Link to="/doctors" className="nav-item">
                  <i className="fas fa-user-md"></i> Book Doctor
                </Link>
                <Link to="/reminders" className="nav-item">
                  <i className="fas fa-bell"></i> Reminders
                </Link>
              </>
            )}

            {isDoctor && (
              <>
                <Link to="/doctor-dashboard" className="nav-item">
                  <i className="fas fa-clipboard-list"></i> Appointments
                </Link>
                <Link to="/doctor-stats" className="nav-item">
                  <i className="fas fa-chart-bar"></i> Analytics
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin-dashboard" className="nav-item">
                  <i className="fas fa-user-shield"></i> Administration
                </Link>
              </>
            )}

            {user ? (
              <div className="profile-dropdown">
                <button className="profile-btn" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                  <div className="profile-avatar" style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'white',
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '6px'
                  }}>
                    <i className="fas fa-user" style={{ fontSize: '0.8rem' }}></i>
                  </div>
                  <span>{user.name}</span>
                  {unreadCount > 0 && (
                    <span style={{
                      marginLeft: '6px',
                      backgroundColor: 'white',
                      color: 'var(--accent-color)',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>{unreadCount}</span>
                  )}
                  <i className="fas fa-chevron-down" style={{ marginLeft: '6px', fontSize: '0.7rem' }}></i>
                </button>
                <div className={`dropdown-menu ${isProfileDropdownOpen ? 'active' : ''}`}>
                  {isPatient && (
                    <Link to="/profile" className="dropdown-item">
                      <i className="fas fa-user-cog"></i> Profile Settings
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="nav-item login-btn">
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
            )}
          </nav>

          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
